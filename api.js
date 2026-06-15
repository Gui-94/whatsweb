import db from './db.js';
import express from 'express';
import fs from 'fs';

import {
    getClient
} from './whatsappClient.js';

import {
    listarChamados
} from './services/chamadoService.js';

const app = express();

app.use(express.static('public'));

const PORT = 3000;

// ======================================
// HOME
// ======================================

app.get('/', (req, res) => {

    res.send('🚀 API ONLINE');
});

// ======================================
// LISTAR CHAMADOS
// ======================================

app.get('/chamados', (req, res) => {

    db.all(
        `
        SELECT *
        FROM chamados
        ORDER BY id DESC
        `,
        [],
        (erro, rows) => {

            if (erro) {

                return res.status(500).json({
                    erro: erro.message
                });
            }

            res.json(rows);
        }
    );
});

// ======================================
// BUSCAR CHAMADO
// ======================================

app.get('/chamado/:protocolo', (req, res) => {

    db.get(
        `
        SELECT *
        FROM chamados
        WHERE protocolo = ?
        `,
        [req.params.protocolo],
        (erro, row) => {

            if (erro) {

                return res.status(500).json({
                    erro: erro.message
                });
            }

            if (!row) {

                return res.status(404).json({
                    erro: 'Chamado não encontrado'
                });
            }

            res.json(row);
        }
    );
});
// ======================================
// LISTAR CLIENTES
// ======================================

app.get('/clientes', (req, res) => {

    const clientes = JSON.parse(
        fs.readFileSync(
            './database/clientes.json',
            'utf-8'
        )
    );

    res.json(clientes);
});

// ======================================
// LISTAR SESSÕES
// ======================================

app.get('/sessoes', (req, res) => {

    const sessoes = JSON.parse(
        fs.readFileSync(
            './database/sessoes.json',
            'utf-8'
        )
    );

    res.json(sessoes);
});

app.get('/dashboard', (req, res) => {

    const clientes = JSON.parse(
        fs.readFileSync('./database/clientes.json', 'utf-8')
    );

    const sessoes = JSON.parse(
        fs.readFileSync('./database/sessoes.json', 'utf-8')
    );

    db.get(
        `
        SELECT
            COUNT(*) as chamados,
            SUM(CASE WHEN status = 'aberto' THEN 1 ELSE 0 END) as abertos,
            SUM(CASE WHEN status = 'fechado' THEN 1 ELSE 0 END) as fechados
        FROM chamados
        `,
        [],
        (erro, row) => {

            if (erro) {

                return res.status(500).json({
                    erro: erro.message
                });
            }

            res.json({
                clientes: clientes.length,
                chamados: row.chamados || 0,
                abertos: row.abertos || 0,
                fechados: row.fechados || 0,
                sessoesAtivas: Object.keys(
                    sessoes
                ).length
            });
        }
    );
});

// ======================================
// FECHAR CHAMADO
// ======================================

app.get('/chamado/:protocolo/fechar', (req, res) => {

    db.run(
        `
        UPDATE chamados
        SET status = 'fechado'
        WHERE protocolo = ?
        `,
        [req.params.protocolo],
        function (erro) {

            if (erro) {

                return res.status(500).json({
                    erro: erro.message
                });
            }

            if (this.changes === 0) {

                return res.status(404).json({
                    erro: 'Chamado não encontrado'
                });
            }

            res.json({
                sucesso: true,
                protocolo: req.params.protocolo
            });
        }
    );
});
// ======================================
// DASHBOARD SQLITE
// ======================================

app.get('/dashboard-sqlite', (req, res) => {

    db.get(
        `
        SELECT
            COUNT(*) as total,
            SUM(CASE WHEN status = 'aberto' THEN 1 ELSE 0 END) as abertos,
            SUM(CASE WHEN status = 'fechado' THEN 1 ELSE 0 END) as fechados
        FROM chamados
        `,
        [],
        (erro, row) => {

            if (erro) {

                return res.status(500).json({
                    erro: erro.message
                });
            }

            res.json(row);
        }
    );
});

// ======================================
// START
// ======================================


app.listen(PORT, () => {

    console.log(
        `🚀 API rodando em http://localhost:${PORT}`
    );
});

// ======================================
// RESPONDER CLIENTE
// ======================================

app.get('/responder/:numero/:mensagem', async (req, res) => {

    try {

        const client = getClient();

        await client.sendMessage(
            req.params.numero,
            req.params.mensagem
        );

        res.json({
            sucesso: true
        });

    } catch (erro) {

        res.status(500).json({
            erro: erro.message
        });
    }
});