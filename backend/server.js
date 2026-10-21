// Import the Express framework, to simplifies building 
// web servers and APIs in Node.js
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
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
const PORT = 5001; // 5001

const serverDir = dirname(fileURLToPath(import.meta.url));

const restaurantsPath = join( // dubbelkolla att vi följer industristandarder
    serverDir,
    'assets/restaurants.json',
);

const picturesPath = join(serverDir, 'assets/Pictures');
const bookingsDir = join(serverDir, 'assets/bookings');
const ownersPath = join(serverDir, 'assets/owners.json');

const bookingWrites = new Map();
const ownerSessions = new Map();
let restaurantWrite = Promise.resolve();

async function readRestaurants() {
    const raw = await readFile(restaurantsPath, 'utf8');
    const restaurants = JSON.parse(raw);
    /* const restaurants = JSON.parse(restaurantsJson); */ // KAN VARA EN BÄTTRE LÖSNING?

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

async function readAdmin() {
    const raw = await readFile(ownersPath, 'utf8');
    const admin = JSON.parse(raw);

    if (!admin || typeof admin.username !== 'string' || typeof admin.password !== 'string') {
        throw new Error('Kunde inte läsa admin');
    }

    return admin;
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

function adminSession(req) {
    const session = ownerSessions.get(bearerToken(req));
    if (!session?.admin) return null;
    return session;
}

function queueRestaurantWrite(task) {
    const current = restaurantWrite.catch(() => {}).then(task);
    restaurantWrite = current.then(
        () => {},
        () => {},
    );
    return current;
}

function cleanText(value, max) {
    if (typeof value !== 'string') return null;
    const text = value.trim();
    if (!text || text.length > max) return null;
    return text;
}

function decodeImage(value) {
    if (typeof value !== 'string') return null;

    const match = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=\r\n]+)$/.exec(value);
    if (!match) return null;

    const buffer = Buffer.from(match[2], 'base64');
    if (buffer.length < 32 || buffer.length > 5_000_000) return null;

    if (match[1] === 'jpeg' && buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) {
        return { ext: 'jpg', buffer };
    }

    if (
        match[1] === 'png' &&
        buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    ) {
        return { ext: 'png', buffer };
    }

    if (
        match[1] === 'webp' &&
        buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
        buffer.subarray(8, 12).toString('ascii') === 'WEBP'
    ) {
        return { ext: 'webp', buffer };
    }

    return null;
}

function pictureFileName(imagePath, id) {
    const name = String(imagePath).split('?')[0].split('/').pop() ?? '';
    if (name === `${id}.jpg` || name === `${id}.png` || name === `${id}.webp`) return name;
    return '';
}

function parseRestaurantUpdate(body) {
    const name = cleanText(body?.name, 80);
    const address = cleanText(body?.address, 160);
    const menu = cleanText(body?.menu, 500);

    if (!name || !address || !menu) {
        return { error: 'Fyll i namn, adress och meny' };
    }

    if (!Array.isArray(body?.descriptions) || body.descriptions.length < 1 || body.descriptions.length > 8) {
        return { error: 'Ange minst en beskrivning' };
    }

    const descriptions = [];
    for (const item of body.descriptions) {
        const text = cleanText(item, 40);
        if (!text) return { error: 'Ange minst en beskrivning' };
        descriptions.push(text);
    }

    const openTime = body?.openTime;
    if (
        !Array.isArray(openTime) ||
        openTime.length !== 2 ||
        !Number.isInteger(openTime[0]) ||
        !Number.isInteger(openTime[1]) ||
        openTime[0] < 0 ||
        openTime[0] > 23 ||
        openTime[1] < 1 ||
        openTime[1] > 24 ||
        openTime[0] >= openTime[1]
    ) {
        return { error: 'Ange öppettider med två klockslag' };
    }

    const totalTables = body?.totalTables;
    if (!Number.isInteger(totalTables) || totalTables < 1 || totalTables > 200) {
        return { error: 'Ange antal bord' };
    }

    const sessionInterval = body?.sessionInterval;
    if (!Number.isInteger(sessionInterval) || sessionInterval < 15 || sessionInterval > 240) {
        return { error: 'Ange hur många minuter en bokning gäller' };
    }

    let image = null;
    if (body?.image != null && body.image !== '') {
        image = decodeImage(body.image);
        if (!image) return { error: 'Bilden måste vara jpg, png eller webp' };
    }

    return {
        value: { name, address, menu, descriptions, openTime, totalTables, sessionInterval, image },
    };
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

app.put('/api/restaurants/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'Ogiltigt id' });
    }

    if (!adminSession(req)) {
        return res.status(401).json({ error: 'Logga in för att ändra restaurangen' });
    }

    const parsed = parseRestaurantUpdate(req.body);
    if (parsed.error) {
        return res.status(400).json({ error: parsed.error });
    }

    try {
        const updated = await queueRestaurantWrite(async () => {
            const restaurants = await readRestaurants();
            const index = restaurants.findIndex((item) => item.id === id);
            if (index === -1) return null;

            const current = restaurants[index];
            let image = current.image;

            if (parsed.value.image) {
                const filename = `${id}.${parsed.value.image.ext}`;
                await writeFile(join(picturesPath, filename), parsed.value.image.buffer);
                image = `/api/pictures/${filename}?v=${Date.now()}`;
                const previous = pictureFileName(current.image, id);
                if (previous && previous !== filename) {
                    await unlink(join(picturesPath, previous)).catch((error) => {
                        if (error.code !== 'ENOENT') throw error;
                    });
                }
            }

            const next = {
                id: current.id,
                name: parsed.value.name,
                address: parsed.value.address,
                menu: parsed.value.menu,
                image,
                descriptions: parsed.value.descriptions,
                openTime: parsed.value.openTime,
                totalTables: parsed.value.totalTables,
                sessionInterval: parsed.value.sessionInterval,
            };
            restaurants[index] = next;
            await writeFile(restaurantsPath, `${JSON.stringify(restaurants, null, 2)}\n`, 'utf8');
            return next;
        });

        if (!updated) {
            return res.status(404).json({ error: 'Restaurangen finns inte' });
        }

        res.status(200).json(updated);
    } catch {
        res.status(500).json({ error: 'Kunde inte spara restaurangen' });
    }
});

app.post('/api/sessions', async (req, res) => {
    const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
    const password = req.body?.password;

    if (!username || typeof password !== 'string' || !password) {
        return res.status(400).json({ error: 'Ange användarnamn och lösenord' });
    }

    try {
        const admin = await readAdmin();

        if (admin.username !== username || !passwordsMatch(admin.password, password)) {
            return res.status(401).json({ error: 'Fel användarnamn eller lösenord' });
        }

        const token = randomBytes(32).toString('hex');
        ownerSessions.set(token, { admin: true, username: admin.username });

        res.status(201).json({ token, username: admin.username });
    } catch {
        res.status(500).json({ error: 'Kunde inte logga in' });
    }
});

app.delete('/api/sessions', (req, res) => {
    const token = bearerToken(req);
    if (token) ownerSessions.delete(token);
    res.status(204).end();
});

app.get('/api/bookings', async (req, res) => {
    if (!adminSession(req)) {
        return res.status(401).json({ error: 'Logga in för att se bokningar' });
    }

    try {
        const restaurants = await readRestaurants();
        const bookings = [];

        for (const restaurant of restaurants) {
            const restaurantBookings = await readBookings(restaurant.id);
            for (const booking of restaurantBookings) {
                bookings.push({
                    restaurantId: restaurant.id,
                    restaurantName: restaurant.name,
                    ...booking,
                });
            }
        }

        res.status(200).json(bookings);
    } catch {
        res.status(500).json({ error: 'Kunde inte läsa bokningar' });
    }
});

app.get('/api/restaurants/:id/bookings', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'Ogiltigt id' });
    }

    if (!adminSession(req)) {
        return res.status(401).json({ error: 'Logga in för att se bokningar' });
    }

    try {
        const restaurants = await readRestaurants();

        if (!restaurants.some((item) => item.id === id)) {
            return res.status(404).json({ error: 'Restaurangen finns inte' });
        }

        const bookings = await readBookings(id);
        res.status(200).json(bookings);
    } catch {
        res.status(500).json({ error: 'Kunde inte läsa bokningar' });
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