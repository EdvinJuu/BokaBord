// Import the Express framework, to simplifies building 
// web servers and APIs in Node.js
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

// Import CORS (Cross-Origin Resource Sharing) middleware to 
// allow web apps on different domains/ports 
// to make requests to this API
import cors from 'cors';

// Initialize the Express application instance
const app = express()

// Define the port number where the server 
// will listen for incoming requests
const PORT = 5001; // 5001

const restaurantsPath = join(
    dirname(fileURLToPath(import.meta.url)),
    'assets/restaurants.json',
);

async function readRestaurants() {
    const raw = await readFile(restaurantsPath, 'utf8');
    const restaurants = JSON.parse(raw);

    if (!Array.isArray(restaurants)) {
        throw new Error('Kunde inte läsa restauranger');
    }

    return restaurants;
}

// Enable CORS for all incoming requests. This prevents browser 
// security blocks when a frontend app 
// (e.g., React on port 3000) tries to talk to this backend.
app.use(cors());

// Use Express's built-in middleware to automatically parse 
// incoming HTTP requests that contain JSON data 
// (this makes req.body available in our routes)
app.use(express.json());


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