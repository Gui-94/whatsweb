import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(
    './database/helpdesk.db',
    (erro) => {

        if (erro) {

            console.error(
                '❌ Erro SQLite:',
                erro.message
            );

        } else {

            console.log(
                '✅ SQLite conectado'
            );
        }
    }
);

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero TEXT UNIQUE
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS chamados (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero TEXT,
            protocolo TEXT,
            mensagem TEXT,
            status TEXT,
            data TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS sessoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero TEXT UNIQUE,
            etapa TEXT,
            atualizadoEm TEXT
        )
    `);

});

export default db;