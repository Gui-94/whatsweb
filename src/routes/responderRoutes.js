import { Router } from 'express';
import { client } from '../server.js';
import { salvarMensagemSQLite } from '../services/mensagemService.js';

const router = Router();

router.get('/:numero/:mensagem', async (req, res) => {

    try {

        const numero = req.params.numero;
        const mensagem = req.params.mensagem;

        await client.sendMessage(
            numero,
            mensagem
        );

        salvarMensagemSQLite(
            numero,
            'atendente',
            mensagem
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

export default router;