/* eslint-disable import/no-anonymous-default-export */
import db from '../../../database.js';

export default async (req, res) => {
  if (req.method === 'DELETE') {
    const eventId = req.query.id; // Extract the event ID from the request URL
    try {
      const existingEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
      if (!existingEvent) {
        return res.status(404).json({ error: 'Event not found' });
      }

      db.prepare('DELETE FROM events WHERE id = ?').run(eventId, function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(204).send();
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};