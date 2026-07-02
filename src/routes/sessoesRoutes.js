import { Router } from 'express';
import fs from 'fs';

const router = Router();

router.get('/', (req, res) => {

    const sessoes = JSON.parse(
        fs.readFileSync(
            './database/sessoes.json',
            'utf-8'
        )
    );

    res.json(sessoes);

});

export default router;