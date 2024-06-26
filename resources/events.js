/**
 * @typedef {import("express")} express
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 */

const db = require('../db');

/**
 * Represents an Event object.
 * @constructor
 * @param {Object} data - The data for the event.
 * @property {string} name - The name of the event.
 * @property {string} description - The description of the event.
 * @property {Date} startdate - The start date of the event.
 * @property {Date} enddate - The end date of the event.
 */
const Event = function(data) {
  this.name = data.name;
  this.description = data.description;
  this.startdate = data.startdate;
  this.enddate = data.enddate;
};

Event.prototype.toPureObject = function () {
  return Object.entries(this)
    .filter(([_, value]) => value !== undefined)
    .reduce((obj, [key, value]) => (obj[key] = value, obj), {});
}

/**
 * Retrieves all events from the database.
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 */
Event.getAllEvents = function (request, response) {
  // Create a new Event object with the query parameters
  const queryEvent = new Event(request.query),
        where = [], // Array to store WHERE conditions for SQL query
        params = []; // Array to store parameters for SQL query

  // Check if ID filter is provided
  if (queryEvent.id !== undefined) {
    const i = where.length;
    where[i] = `id = ?`;
    params[i] = queryEvent.id;
  }

  // Check if name filter is provided
  if (queryEvent.name !== undefined) {
    const i = where.length;
    where[i] = `name LIKE ?`;
    params[i] = `%${queryEvent.name}%`;
  }

  // Construct SQL query
  const sql = ['SELECT * FROM events', where.length ? 'WHERE' : '', where.join(' AND ')].join(' ');

  // Execute the SQL query
  db.query(sql, params, function (err, results) {
    if (err) {
      // Handle database error
      response.status(500).send('An error occurred while getting the events.');
    }

    // Send the results back to the client
    response.send(results);
  })
}

/**
 * Retrieves a single event from the database by its ID.
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 */
Event.getEvents = function (request, response) {
  // Execute SQL query to select event with specified ID
  db.query('SELECT * FROM events WHERE id = ?', [request.params.id], function (err, results) {
    if (err) {
      // Handle database error
      response.status(500).send('An error occurred while getting the event.');
    }

    // Send the results back to the client
    response.send(results);
  })
}

/**
 * Creates a new event in the database.
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 */
Event.createEvent = function (request, response) {
  // Check if request body is empty
  if (!request.body) {
    // If request body is empty, send a 400 Bad Request response
    response.status(400).send({ message: 'Content cannot be empty'});
  }

  // Create a new Event object with the data from request body
  const newEvent = new Event(request.body);

  // Execute SQL query to insert the new event into the database
  db.query('INSERT INTO events SET ?', newEvent.toPureObject(), (error, results) => {
    if (error) {
      // If an error occurs during database insertion, send a 500 Internal Server Error response
      response.status(500).send('An error occurred while creating the event');
    }

    if (results.insertId) {
      // Send the newly created event object along with its generated ID back to the client
      response.send({ id: results.insertId, ...newEvent });
    } else {
      response.status(500).send('An error occurred while creating the event');
    }
  });
}

/**
 * Updates an existing event in the database.
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 */
Event.updateEvent = function (request, response) {
  // Check if request body is empty
  if (!request.body) {
    // If request body is empty, send a 400 Bad Request response
    response.status(400).send({ message: 'Content cannot be empty'});
  }

  // Create a new Event object with the updated data from request body
  const updateEvent = new Event(request.body);
  const eventID = parseInt(request.params.id);

  // Execute SQL query to update the event in the database
  db.query('UPDATE events SET ? WHERE id = ?', [updateEvent.toPureObject(), eventID], (error, results) => {
    if (error) {
      // If an error occurs during database update, send a 500 Internal Server Error response
      response.status(500).send('An error occurred while updating the event');
    }

    if (results.affectedRows <= 0) {
      response.status(500).send('ID provided could not be updated');
    } else {
      // Send the affectedRows along with its ID back to the client
      db.query('SELECT * FROM events WHERE id = ?', eventID, (error, events) => {
        if (error) {
          // Handle database error
          response.status(500).send('An error occurred while getting the event after updating.');
        }

        // Send the updated properties along with its ID back to the client
        response.send(events);          
      });
    }
  });
}

/**
 * Deletes an event from the database by its ID.
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 */
Event.removeEvent = function (request, response) {
  // Execute SQL query to delete the event with specified ID
  db.query('DELETE FROM events WHERE id = ?', [request.params.id], function (err, results) {
    if (err) {
      // Handle database error
      response.status(500).send('An error occurred while deleting the event.');
    }

    // Send the results back to the client
    response.send({
      affectedRows: results.affectedRows
    });
  })
}


/**
 * Deletes all events from the database.
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 */
Event.removeAllEvents = function (request, response) {
  // Execute SQL query to delete all events
  db.query('DELETE FROM events', function (err, results) {
    if (err) {
      // Handle database error
      response.status(500).send('An error occurred while deleting the events.');
    }

    if (results.affectedRows >= 1) {
      // Send the results back to the client
      response.send({
        affectedRows: results.affectedRows
      });
    }
  })
}

module.exports = Event
