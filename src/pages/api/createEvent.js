/* eslint-disable import/no-anonymous-default-export */
import mysql from 'mysql2/promise'; // Importe a biblioteca MySQL baseada em promises
require('dotenv').config()

export default async (req, res) => {
  if (req.method === 'POST') {
    console.log('chamou aqui');
    const { description, date, startDate, endDate, title, responsible, room } = req.body;
    function isConflict(event1, event2) {
      // Verifica se há um conflito entre dois eventos
      return (
        (event1.start < event2.end && event1.end > event2.start) ||
        (event2.start < event1.end && event2.end > event1.start)
      );
    }
    async function validateConflict() {
      return new Promise(async (resolve, reject) => {
        try {
          // Crie um pool de conexão MySQL (você pode usar sua DATABASE_URL aqui)
          const connection = await mysql.createConnection(process.env.DATABASE_URL);
          const [tables] = await connection.execute('SHOW TABLES LIKE "events"');
          console.log('tables', tables);
          // Verifique erros ao criar o pool de conexão MySQL
          if (connection.error) {
            reject(connection.error);
          }

          // Consulta para verificar conflitos de eventos
          const conflictQuery = `
            SELECT * FROM events
            WHERE date = ? AND room = ? AND date ?
          `;
          // Execute a consulta de conflito e verifique erros
          const [rows] = await connection.execute(conflictQuery, [date, room, date]);

          if (connection.error) {
            console.log('erro de conexao:', connection.error)
            reject(connection.error);
          }
          connection.end();
          if(rows.length <= 0) {
            resolve(false);
          }
          const startDate = new Date(startDate);
          const endDate = new Date(endDate);
          const newEventRange = { start: startDate, end: endDate };

          // Itere sobre os eventos existentes
          for (const existingEvent of rows) {
            const existingStartDate = new Date(existingEvent.startDate);
            const existingEndDate = new Date(existingEvent.endDate);
            const existingEventRange = { start: existingStartDate, end: existingEndDate };
        
            // Verifique se há um conflito com o novo evento
            if (isConflict(newEventRange, existingEventRange)) {
              resolve(true); // Há um conflito
              return;
            }
            else {
              resolve(false);
              return
            }
          }


        } catch (error) {
          reject(error);
        }
      });
    }

    try {
      const conflictExists = await validateConflict();
      console.log('conflictExists', conflictExists)
      if (conflictExists) {
        // Já existe um evento em conflito
        return res.status(400).json({ error: 'Conflito de evento detectado' });
      } else {
        // Se nenhum conflito for detectado, prossiga para inserir o novo evento
        const connection = await mysql.createConnection(process.env.DATABASE_URL);

        // Execute a consulta de inserção e verifique erros
        const insertQuery = `
          INSERT INTO events (description, date, startDate, endDate, title, responsible, room)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        await connection.execute(insertQuery, [description, date, startDate, endDate, title, responsible, room]);
        if (connection.error) {
          reject(connection.error);
        }

        // Consulta para obter o ID do evento recém-inserido
        const [result] = await connection.execute('SELECT LAST_INSERT_ID() as id');
        const lastID = result[0].id;

        // Recupere o elemento recém-criado do banco de dados
        const [newEvent] = await connection.execute('SELECT * FROM events WHERE id = ?', [lastID]);

        connection.end(); // Feche a conexão

        // Retorne o elemento recém-criado como parte da resposta
        res.status(201).json(newEvent[0]);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
};