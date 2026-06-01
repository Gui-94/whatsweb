import express from 'express';
import fs from 'fs';

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

    const chamados = JSON.parse(
        fs.readFileSync(
            './database/chamados.json',
            'utf-8'
        )
    );

    res.json(chamados);
});

// ======================================
// BUSCAR CHAMADO
// ======================================

app.get('/chamado/:protocolo', (req, res) => {

    const chamados = JSON.parse(
        fs.readFileSync(
            './database/chamados.json',
            'utf-8'
        )
    );

    const chamado = chamados.find(
        item =>
            item.protocolo === req.params.protocolo
    );

    if (!chamado) {

        return res.status(404).json({
            erro: 'Chamado não encontrado'
        });
    }

    res.json(chamado);
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

    const chamados = JSON.parse(
        fs.readFileSync('./database/chamados.json', 'utf-8')
    );

    const sessoes = JSON.parse(
        fs.readFileSync('./database/sessoes.json', 'utf-8')
    );

    res.json({
        clientes: clientes.length,
        chamados: chamados.length,
        abertos: chamados.filter(
            c => c.status === 'aberto'
        ).length,
        sessoesAtivas: Object.keys(
            sessoes
        ).length
    });
});

// ======================================
// FECHAR CHAMADO
// ======================================

app.get('/chamado/:protocolo/fechar', (req, res) => {

    const chamados = JSON.parse(
        fs.readFileSync(
            './database/chamados.json',
            'utf-8'
        )
    );

    const chamado = chamados.find(
        item =>
            item.protocolo === req.params.protocolo
    );

    if (!chamado) {

        return res.status(404).json({
            erro: 'Chamado não encontrado'
        });
    }

    chamado.status = 'fechado';

    fs.writeFileSync(
        './database/chamados.json',
        JSON.stringify(chamados, null, 2),
        'utf-8'
    );

    res.json({
        mensagem: 'Chamado fechado com sucesso',
        protocolo: chamado.protocolo,
        status: chamado.status
    });
});

// ======================================
// START
// ======================================

app.listen(PORT, () => {

    console.log(
        `🚀 API rodando em http://localhost:${PORT}`
    );
});