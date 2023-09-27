/* eslint-disable import/no-anonymous-default-export */
import mysql from 'mysql2/promise'; // Import the promise-based MySQL library
require('dotenv').config()

export default async (req, res) => {
  if (req.method === 'GET') {
    const { date, room } = req.query; // Get the date from the query
    const query = 'SELECT * FROM events WHERE date = ? AND room = ?';

    try {
      // Create a MySQL connection pool (you can use your DATABASE_URL here)
      const connection = await mysql.createConnection(process.env.DATABASE_URL);
      // Verificar se a tabela 'events' já existe
      const [tables] = await connection.execute('SHOW TABLES LIKE "events"');

      if (tables.length === 0) {
        // Se a tabela não existir, crie-a com os parâmetros necessários
        await connection.execute(`
          CREATE TABLE events (
            id INT AUTO_INCREMENT PRIMARY KEY,
            description TEXT,
            date VARCHAR(255),
            startDate VARCHAR(255),
            endDate VARCHAR(255),
            title VARCHAR(255),
            responsible VARCHAR(255),
            room VARCHAR(255)
          )
        `);
      }
        // Execute the MySQL query
      const [rows] = await connection.execute(query, [date, room]);

      connection.end(); // Close the connection
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
};