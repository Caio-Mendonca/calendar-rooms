/* eslint-disable import/no-anonymous-default-export */
import db from '../../../database.js';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { description, date, startDate, endDate, title, responsible, room } = req.body;
    async function validateConflict() {
      return new Promise((resolve, reject) => {
        const conflictQuery = `
          SELECT id FROM events
          WHERE date = ? AND room = ?
          AND (
            (startDate >= ? AND startDate < ?)
            OR (endDate > ? AND endDate <= ?)
            OR (startDate <= ? AND endDate >= ?)
          )
        `;
        
        db.prepare(conflictQuery).get(date, room, startDate, endDate, startDate, endDate, startDate, endDate, (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    }

    try {
      const conflictExists = await validateConflict();

      if (conflictExists) {
        // A conflicting event already exists
        return res.status(400).json({ error: 'Event conflict detected' });
      } else {
        // If no conflict is detected, proceed to insert the new event
        const stmt = db.prepare('INSERT INTO events (description, date, startDate, endDate, title, responsible, room) VALUES (?, ?, ?, ?, ?, ?, ?)');
        
        stmt.run(description, date, startDate, endDate, title, responsible, room, function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          // Retrieve the newly created element from the database using its last inserted ID
          const lastID = this.lastID;
          const selectStmt = db.prepare('SELECT * FROM events WHERE id = ?');
          selectStmt.get(lastID, function(err, row) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            
            // Return the newly created element as part of the response
            res.status(201).json(row);
          });
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
};
