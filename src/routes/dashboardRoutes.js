import { Router } from 'express';
import fs from 'fs';
import db from '../db.js';

const router = Router();

router.get('/', (req, res) => {

    const clientes = JSON.parse(
        fs.readFileSync(
            './database/clientes.json',
            'utf-8'
        )
    );

    const sessoes = JSON.parse(
        fs.readFileSync(
            './database/sessoes.json',
            'utf-8'
        )
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
                sessoesAtivas: Object.keys(sessoes).length
            });
        }
    );

});

export default router;