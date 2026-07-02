import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (req, res) => {

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

export default router;