// Import the Express framework, to simplifies building 
// web servers and APIs in Node.js
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
/* import restaurantsJson from "./assets/restaurants.json" */ // KAN VARA EN BÄTTRE LÖSNING?

// Import CORS (Cross-Origin Resource Sharing) middleware to 
// allow web apps on different domains/ports 
// to make requests to this API
import cors from 'cors';

// Initialize the Express application instance
const app = express()

// Define the port number where the server 
// will listen for incoming requests
const PORT = process.env.PORT || 5001

const serverDir = dirname(fileURLToPath(import.meta.url));

const restaurantsPath = join(
    serverDir,
    'assets/restaurants.json',
);

const picturesPath = join(serverDir, 'assets/Pictures');
const bookingsDir = join(serverDir, 'assets/bookings');
const ownersPath = join(serverDir, 'assets/owners.json');

const bookingWrites = new Map();
const ownerSessions = new Map();

async function readRestaurants() {
    const raw = await readFile(restaurantsPath, 'utf8');
    const restaurants = JSON.parse(raw);

    if (!Array.isArray(restaurants)) {
        throw new Error('Kunde inte läsa restauranger');
    }

    return restaurants;
}

function bookingFilePath(id) {
    return join(bookingsDir, `${id}.json`);
}

function localDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function isBookableDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return false;
    }

    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const end = new Date(start);
    end.setDate(start.getDate() + 13);

    return date >= start && date <= end && value === localDateKey(date);
}

function isPartySize(value) {
    return Number.isInteger(value) && value >= 1 && value <= 8;
}

function isContact(value) {
    if (typeof value !== 'string') return false;

    const contact = value.trim();
    if (!contact || contact.length > 80) return false;

    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phone = /^\+?\d{7,15}$/.test(contact.replace(/[\s-]/g, ''));
    return email.test(contact) || phone;
}

function getAvailableTimes(openTime, sessionInterval) {
    if (!Array.isArray(openTime) || openTime.length < 2) return [];
    if (!Number.isInteger(openTime[0]) || !Number.isInteger(openTime[1])) return [];
    if (!Number.isInteger(sessionInterval) || sessionInterval < 1) return [];

    const openMinutes = openTime[0] * 60;
    const closeMinutes = openTime[1] * 60;
    if (openMinutes < 0 || closeMinutes > 24 * 60 || openMinutes >= closeMinutes) return [];

    const times = [];
    for (let start = openMinutes; start + sessionInterval <= closeMinutes; start += sessionInterval) {
        const hours = Math.floor(start / 60);
        const minutes = start % 60;
        times.push(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
    }

    return times;
}

async function readBookings(id) {
    try {
        const raw = await readFile(bookingFilePath(id), 'utf8');
        const bookings = JSON.parse(raw);

        if (!Array.isArray(bookings)) {
            throw new Error('Kunde inte läsa bokningar');
        }

        return bookings;
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        throw error;
    }
}

async function writeBookings(id, bookings) {
    await mkdir(bookingsDir, { recursive: true });
    await writeFile(bookingFilePath(id), `${JSON.stringify(bookings, null, 2)}\n`, 'utf8');
}

function queueBookingWrite(id, task) {
    const previous = bookingWrites.get(id) ?? Promise.resolve();
    const current = previous.catch(() => {}).then(task);
    bookingWrites.set(
        id,
        current.then(
            () => {},
            () => {},
        ),
    );
    return current;
}

async function readOwners() {
    const raw = await readFile(ownersPath, 'utf8');
    const owners = JSON.parse(raw);

    if (!Array.isArray(owners)) {
        throw new Error('Kunde inte läsa innehavare');
    }

    return owners;
}

function passwordsMatch(stored, given) {
    const left = Buffer.from(String(stored));
    const right = Buffer.from(String(given));

    if (left.length !== right.length) return false;
    return timingSafeEqual(left, right);
}

function bearerToken(req) {
    const header = req.get('authorization') ?? '';
    if (!header.startsWith('Bearer ')) return '';
    return header.slice('Bearer '.length).trim();
}

// Enable CORS for all incoming requests. This prevents browser 
// security blocks when a frontend app 
// (e.g., React on port 3000) tries to talk to this backend.
app.use(cors());

// Bilder döpta efter restaurangens id, till exempel /api/pictures/1.jpg
app.use('/api/pictures', express.static(picturesPath));

// Use Express's built-in middleware to automatically parse 
// incoming HTTP requests that contain JSON data 
// (this makes req.body available in our routes)
app.use(express.json({ limit: '8mb' }));


// Initialize a temporary in-memory "database" 
// (an array) to store our tasks.
// Note: Because it's stored in memory, 
// this data will reset to these 3 items 
// every time you restart the server.
let tasks = [
    { id: 1, title: 'Learn Express', completed: true},
    { id: 2, title: 'Understand CORS', completed: false},
    { id: 3, title: 'Build a BFF', completed: false},
];

// Define a GET route for the root URL ('/').
// When a user visits http://localhost:5001/, the server responds 
// with a simple text message.
app.get('/', (req, res) => {
    res.send('Welcome to TaskMaster API!');
});

// Endpoint: GET /api/restaurants
// Reads backend/assets/restaurants.json and returns the list.
app.get('/api/restaurants', async (req, res) => {
    try {
        const restaurants = await readRestaurants();
        res.status(200).json(restaurants);
    } catch {
        res.status(500).json({ error: 'Kunde inte läsa restauranger' });
    }
});

app.get('/api/restaurants/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'Ogiltigt id' });
    }

    try {
        const restaurants = await readRestaurants();
        const restaurant = restaurants.find((item) => item.id === id);

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurangen finns inte' });
        }

        res.status(200).json(restaurant);
    } catch {
        res.status(500).json({ error: 'Kunde inte läsa restauranger' });
    }
});

app.post('/api/restaurants/:id/bookings', async (req, res) => {
    const id = Number(req.params.id);
    const { date, time, partySize, contact } = req.body ?? {};

    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'Ogiltigt id' });
    }

    if (
        !isBookableDate(date) ||
        !isPartySize(partySize) ||
        !isContact(contact)
    ) {
        return res.status(400).json({ error: 'Ogiltig bokning' });
    }

    try {
        const restaurants = await readRestaurants();
        const restaurant = restaurants.find((item) => item.id === id);

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurangen finns inte' });
        }

        if (!Number.isInteger(restaurant.sessionInterval)) {
            return res.status(500).json({ error: 'Kunde inte spara bokningen' });
        }

        const availableTimes = getAvailableTimes(restaurant.openTime, restaurant.sessionInterval);
        if (!availableTimes.includes(time)) {
            return res.status(400).json({ error: 'Ogiltig bokning' });
        }

        const booking = {
            date,
            time,
            partySize,
            contact: contact.trim(),
            sessionInterval: restaurant.sessionInterval,
        };
        await queueBookingWrite(id, async () => {
            const bookings = await readBookings(id);
            await writeBookings(id, [...bookings, booking]);
        });

        res.status(201).json(booking);
    } catch {
        res.status(500).json({ error: 'Kunde inte spara bokningen' });
    }
});

app.post('/api/sessions', async (req, res) => {
    const username = req.body?.username;
    const password = req.body?.password;

    if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
        return res.status(400).json({ error: 'Ange användarnamn och lösenord' });
    }

    try {
        const owners = await readOwners();
        const owner = owners.find((item) => item.username === username);

        if (!owner || !passwordsMatch(owner.password, password)) {
            return res.status(401).json({ error: 'Fel användarnamn eller lösenord' });
        }

        const token = randomBytes(32).toString('hex');
        ownerSessions.set(token, { username: owner.username });

        res.status(201).json({ token, username: owner.username });
    } catch {
        res.status(500).json({ error: 'Kunde inte logga in' });
    }
});

app.get('/api/bookings', async (req, res) => {
    if (!ownerSessions.has(bearerToken(req))) {
        return res.status(401).json({ error: 'Logga in för att se bokningar' });
    }

    try {
        const restaurants = await readRestaurants();
        const all = await Promise.all(
            restaurants.map(async (restaurant) => {
                const bookings = await readBookings(restaurant.id);
                return bookings.map((booking) => ({
                    ...booking,
                    restaurantId: restaurant.id,
                    restaurantName: restaurant.name,
                }));
            }),
        );
        res.status(200).json(all.flat());
    } catch {
        res.status(500).json({ error: 'Kunde inte läsa bokningar' });
    }
});

app.delete('/api/sessions', (req, res) => {
    const token = bearerToken(req);
    if (token) ownerSessions.delete(token);
    res.status(204).end();
});

// Define a GET route to retrieve the entire list of tasks.
// Endpoint: GET /api/tasks
app.get('/api/tasks', (req, res) => {
    // Respond with an HTTP 200 (OK) status code and send the 'tasks' 
    // array formatted as JSON
    res.status(200).json(tasks);
});

// Define a POST route to create a new task and add it to our list.
// Endpoint: POST /api/tasks
app.post('/api/tasks', (req, res) => {
    // Extract the 'title' property from the parsed incoming JSON
    // request body
    const { title } = req.body;

    // Validation check: Ensure a title 
    // was provided and isn't just empty spaces
    if (!title || !title.trim()) {
        // If validation fails we return early with an HTTP 400
        // (Bad Request) status  and an error message
        return res.status(400).json({error:'Task title is required'});
    }

    // Create new task object
    const newTask = {
        // Generate a new ID: If tasks exist, 
        // take the ID of the last task 
        // and add 1. If the array is empty, start at ID 1.
        id: tasks.length ? tasks[tasks.length - 1].id + 1:1,

        // Remove any accidental 
        // leading/trailing spaces from the title
        title: title.trim(),

        // New tasks are always marked as incomplete by default
        completed: false
    };

    // Add the newly created task to our in-memory array
    tasks.push(newTask);

    // Respond with an HTTP 201 (Created) status code 
    // and return the new task object so the frontend 
    // can immediately use it
    res.status(201).json(newTask);
});

// Start the server and tell it to listen for 
// incoming connections on the specified PORT
app.listen(PORT, () => {
    // Log a message to the terminal so the developer 
    // knows the server is running successfully
    console.log(`Server running on http://localhost:${PORT}`)
});