import db from '../db.js';

export function salvarMensagemSQLite(
    numero,
    autor,
    mensagem
) {
    db.run(
        `
        INSERT INTO mensagens
        (
            numero,
            autor,
            mensagem,
            data
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            numero,
            autor,
            mensagem,
            new Date().toISOString()
        ]
    );
}