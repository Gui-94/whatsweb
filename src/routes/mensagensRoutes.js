import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/:numero', (req, res) => {

    db.all(
        `
        SELECT *
        FROM mensagens
        WHERE numero = ?
        ORDER BY id ASC
        `,
        [req.params.numero],
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

export default router;