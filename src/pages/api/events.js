/* eslint-disable import/no-anonymous-default-export */
import db from '../../../database.js';

export default async (req, res) => {
  if (req.method === 'GET') {
    const { date, room } = req.query; // Obtém a data da consulta
    const query = 'SELECT * FROM events WHERE date = ? AND room = ?';

    db.all(query, [date, room], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.status(200).json(rows);
      }
    });
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
};