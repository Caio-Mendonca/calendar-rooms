/* eslint-disable import/no-anonymous-default-export */
import db from '../../../database.js';

export default async (req, res) => {
  if (req.method === 'PUT') {
    const eventId = req.query.id; // Extract the event ID from the request URL
    const { description, date, startDate, endDate, title, responsible, room } = req.body;
    console.log('req.body', req.body)
    try {
      const existingEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
      if (!existingEvent) {
        return res.status(404).json({ error: 'Event not found' });
      }

      const stmt = db.prepare('UPDATE events SET description = ?, date = ?, startDate = ?, endDate = ?, title = ?, responsible = ?, room = ? WHERE id = ?');
      stmt.run(description, date, startDate, endDate, title, responsible, room, eventId, function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        const selectStmt = db.prepare('SELECT * FROM events WHERE id = ?');
        selectStmt.get(eventId, function(err, row) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          console.log( 'row', row)
          res.status(200).json(row);
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};