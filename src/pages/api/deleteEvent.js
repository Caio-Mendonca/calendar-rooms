/* eslint-disable import/no-anonymous-default-export */
import mysql from 'mysql2/promise'; // Import the promise-based MySQL library
require('dotenv').config()
export default async (req, res) => {
  if (req.method === 'DELETE') {
    const eventId = req.query.id; // Extract the event ID from the request URL

    try {
      // Create a MySQL connection pool (you can use your DATABASE_URL here)
      const connection = await mysql.createConnection(process.env.DATABASE_URL);

      // Check if the event exists
      const [existingEvent] = await connection.execute('SELECT * FROM events WHERE id = ?', [eventId]);

      if (!existingEvent || existingEvent.length === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }

      // Delete the event
      await connection.execute('DELETE FROM events WHERE id = ?', [eventId]);
      connection.end(); // Close the connection

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
