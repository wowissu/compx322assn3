/**
 * @typedef {import("express")} express
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 */

const express = require('express');
const bodyParser = require('body-parser');
const Event = require('./resources/events');

const app = express();

// Serve static files from the 'public' directory
app.use(express.static('./public'));

// Parse URL-encoded bodies (for forms)
app.use(bodyParser.urlencoded({ extended: false }));

// Parse JSON bodies
app.use(bodyParser.json());

/**
 * GET endpoint to retrieve all events.
 * @name GET/events
 */
app.get('/events/', Event.getAllEvents);

/**
 * GET endpoint to retrieve a specific event by ID.
 * @name GET/events/:id
 */
app.get('/events/:id', Event.getEvents);

/**
 * POST endpoint to create a new event.
 * @name POST/events
 */
app.post('/events/', Event.createEvent);

/**
 * PUT endpoint to update an existing event.
 * @name PUT/events/:id
 */
app.put('/events/:id', Event.updateEvent);

/**
 * DELETE endpoint to remove all events.
 * @name DELETE/events
 */
app.delete('/events', Event.removeAllEvents);

/**
 * DELETE endpoint to remove a specific event by ID.
 * @name DELETE/events/:id
 */
app.delete('/events/:id', Event.removeEvent);

// Start the server on port 3000
app.listen(3000, function () {
  console.log('server started');
});
