const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite');
    db.run(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT,
        date TEXT,
        startDate TEXT,
        endDate TEXT,
        title TEXT,
        responsible TEXT,
        room TEXT
      )
    `);
  }
});

module.exports = db;