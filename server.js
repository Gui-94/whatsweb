import express from 'express';
import db from './db.js';
import 'dotenv/config';
import fs from 'fs';
import pkg from 'whatsapp-web.js';
import {
    setClient
} from './whatsappClient.js';

process.stdout.write('\x1b[?25h');

const { Client, LocalAuth } = pkg;

const app = express();

app.use(
    express.static('public')
);
const PORT = 3000;

// ======================================
// CAMINHOS
// ======================================

const caminhoClientes = './database/clientes.json';
const caminhoSessoes = './database/sessoes.json';
const caminhoChamados = './database/chamados.json';

// ======================================
// GARANTIR PASTA
// ======================================

if (!fs.existsSync('./database')) {

    fs.mkdirSync('./database', {
        recursive: true
    });
}

// ======================================
// GARANTIR ARQUIVOS
// ======================================

if (!fs.existsSync(caminhoClientes)) {
    fs.writeFileSync(caminhoClientes, '[]');
}

if (!fs.existsSync(caminhoSessoes)) {
    fs.writeFileSync(caminhoSessoes, '{}');
}

if (!fs.existsSync(caminhoChamados)) {
    fs.writeFileSync(caminhoChamados, '[]');
}

// ======================================
// JSON SEGURO
// ======================================

function lerJSON(caminho, fallback) {

    try {

        const dados = fs.readFileSync(
            caminho,
            'utf-8'
        );

        if (!dados || !dados.trim()) {

            salvarJSON(caminho, fallback);

            return fallback;
        }

        return JSON.parse(dados);

    } catch (err) {

        console.log(
            `⚠️ JSON corrompido → resetando: ${caminho}`
        );

        salvarJSON(caminho, fallback);

        return fallback;
    }
}

function salvarJSON(caminho, data) {

    fs.writeFileSync(
        caminho,
        JSON.stringify(data, null, 2),
        'utf-8'
    );

    console.log(`💾 JSON salvo: ${caminho}`);
}

// ======================================
// CLIENTES
// ======================================

function salvarClienteSQLite(numero) {

    db.run(
        `
        INSERT OR IGNORE INTO clientes
        (
            numero
        )
        VALUES (?)
        `,
        [numero],
        (erro) => {

            if (erro) {

                console.log(
                    '❌ Erro cliente:',
                    erro.message
                );

            } else {

                console.log(
                    `👤 Cliente salvo: ${numero}`
                );
            }
        }
    );
}

function salvarCliente(numero) {

    const clientes = lerJSON(
        caminhoClientes,
        []
    );

    if (!clientes.includes(numero)) {

        clientes.push(numero);

        salvarJSON(
            caminhoClientes,
            clientes
        );

        console.log(
            `💾 Cliente salvo: ${numero}`
        );
    }
}

// ======================================
// SESSÕES
// ======================================

function lerSessoes() {

    return lerJSON(
        caminhoSessoes,
        {}
    );
}

function salvarSessao(numero, etapa) {

     console.log('====================');
    console.log('DEBUG salvarSessao');
    console.log('numero:', numero);
    console.log('etapa:', etapa);
     console.trace();

    const sessoes = lerSessoes();

    if (etapa === null) {

        delete sessoes[numero];

    } else {

        sessoes[numero] = {
            etapa,
            atualizadoEm: new Date().toISOString()
        };
    }

    salvarJSON(
        caminhoSessoes,
        sessoes
    );

    console.log(
        `💾 SESSÃO → ${numero} = ${etapa}`
    );
}

function obterSessao(numero) {

    const sessoes = lerSessoes();

    return sessoes[numero]?.etapa || null;
}

// PROTOCOLO
// ======================================

function gerarProtocolo() {

    const agora = new Date();

    const data =
        agora.getFullYear() +
        String(agora.getMonth() + 1).padStart(2, '0') +
        String(agora.getDate()).padStart(2, '0');

    const numero = Math.floor(
        1000 + Math.random() * 9000
    );

    return `SUP-${data}-${numero}`;
}

// ======================================
// CHAMADOS
// ======================================

function salvarChamado(
    numero,
    mensagem,
    protocolo
) {

    const chamados = lerJSON(
        caminhoChamados,
        []
    );

    chamados.push({
        numero,
        protocolo,
        mensagem,
        status: 'aberto',
        data: new Date().toISOString()
    });

    salvarJSON(
        caminhoChamados,
        chamados
    );

    console.log(
        `📁 Chamado salvo: ${protocolo}`
    );
}

function salvarChamadoSQLite(
    numero,
    mensagem,
    protocolo
) {


    db.run(
        `
        INSERT INTO chamados
        (
            numero,
            protocolo,
            mensagem,
            status,
            data
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            numero,
            protocolo,
            mensagem,
            'aberto',
            new Date().toISOString()
        ],
        (erro) => {

            if (erro) {

                console.log(
                    '❌ SQLite:',
                    erro.message
                );

            } else {

                console.log(
                    `💾 SQLite → ${protocolo}`
                );
            }
        }
    );
}

function salvarMensagemSQLite(
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
        ],
        (erro) => {

            if (erro) {

                console.log(
                    '❌ Erro mensagem:',
                    erro.message
                );

            } else {

                console.log(
                    `💬 Mensagem salva`
                );
            }
        }
    );
}

function listarChamadosSQLite() {

    db.all(
        'SELECT * FROM chamados',
        [],
        (erro, rows) => {

            if (erro) {

                console.log(
                    '❌ Erro SQLite:',
                    erro.message
                );

                return;
            }

            console.log(
                '\n📋 CHAMADOS SQLITE'
            );

            console.table(rows);
        }
    );
}

function contarChamadosSQLite(callback) {

    db.get(
        'SELECT COUNT(*) as total FROM chamados',
        [],
        (erro, row) => {

            if (erro) {

                console.log(
                    '❌ SQLite:',
                    erro.message
                );

                callback(0);

                return;
            }

            callback(row.total);
        }
    );
}

function fecharChamado(numero) {

    const chamados = lerJSON(
        caminhoChamados,
        []
    );

    const chamado = chamados.find(
        c =>
            c.numero === numero &&
            c.status === 'aberto'
    );

    if (!chamado) {
        return false;
    }

    chamado.status = 'fechado';

    chamado.dataFechamento =
        new Date().toISOString();

    salvarJSON(
        caminhoChamados,
        chamados
    );

    return true;
}

// ======================================
// DELAY
// ======================================

const delay = ms =>
    new Promise(resolve =>
        setTimeout(resolve, ms)
    );

// ======================================
// BOT START
// ======================================

console.log('🚀 Iniciando bot...');
console.log(
    '⏳ Inicializando WhatsApp...'
);

// ======================================
// CLIENT
// ======================================

const client = new Client({

    authStrategy: new LocalAuth(),

    webVersionCache: {
        type: 'none'
    },

    puppeteer: {

        headless: false,

        executablePath:
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',

        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-extensions'
        ]
    }
});
setClient(client);

// ======================================
// EVENTS
// ======================================

client.on('qr', () => {

    console.log(
        '📱 Escaneie o QR Code'
    );
});

client.on('ready', () => {

    console.log(
        '✅ BOT CONECTADO!'
    );

});

// ======================================
// MENSAGENS
// ======================================

client.on('message', async (msg) => {

    try {

        // ======================================
        // FILTROS
        // ======================================

        if (
            msg.from.includes('@g.us')
        ) return;

        if (
            msg.from ===
            'status@broadcast'
        ) return;

        if (msg.fromMe) return;

        if (!msg.body) return;

        // ======================================
        // DADOS
        // ======================================

        const texto =
            msg.body
                .toLowerCase()
                .trim();

        salvarCliente(msg.from);
        salvarClienteSQLite(msg.from);

        const sessaoAtual =
            obterSessao(msg.from);

           

// ENCERRAR CHAMADO

if (
    sessaoAtual === 'aguardando_atendente' &&
    texto === 'encerrar'
) {

    const fechado =
        fecharChamado(msg.from);

    if (fechado) {

        salvarSessao(
            msg.from,
            null
        );

        await client.sendMessage(
            msg.from,
`✅ Chamado encerrado.

Obrigado pelo contato!`
        );

    } else {

        await client.sendMessage(
            msg.from,
`❌ Nenhum chamado aberto encontrado.`
        );
    }

    return;
}

// AGUARDANDO ATENDENTE

if (
    sessaoAtual === 'aguardando_atendente' &&
    texto !== 'menu'
) {

    await client.sendMessage(
        msg.from,
`⏳ Seu chamado já foi registrado.

Digite *encerrar* para finalizar o chamado.

Ou digite *menu* para voltar ao menu principal.`
    );

    return;
}

        // ======================================
        // SAIR
        // ======================================

        if (texto === 'sair') {

            salvarSessao(
                msg.from,
                null
            );

            await client.sendMessage(
                msg.from,
                '✅ Atendimento encerrado.'
            );

            return;
        }

        // ======================================
        // LOG
        // ======================================

        console.log(
            '\n========================'
        );

        console.log(
            '📩 NOVA MENSAGEM'
        );

        console.log(
            '👤 De:',
            msg.from
        );

        console.log(
            '💬 Texto:',
            msg.body
        );

        console.log(
            '🧠 Sessão:',
            sessaoAtual
        );

        console.log(
            '========================\n'
        );

        // ======================================
        // INTELIGÊNCIA NATURAL
        // ======================================

        if (
    (
        texto.includes('internet') ||
        texto.includes('caiu')
    ) &&
    sessaoAtual !== 'suporte'
) {

    await delay(1000);

    await client.sendMessage(
        msg.from,
`🛠️ Detectei problema de conexão.

Abrindo chamado no suporte...`
    );

    salvarSessao(
        msg.from,
        'suporte'
    );

    return;
}

        // ======================================
        // MENU
        // ======================================

        if (texto === 'menu') {

            await delay(1000);

            await client.sendMessage(
                msg.from,
`🤖 ATENDIMENTO AUTOMÁTICO

1️⃣ Suporte
2️⃣ Financeiro
3️⃣ Vendas

Digite o número da opção.`
            );

            salvarSessao(
                msg.from,
                'menu'
            );

            return;
        }

        // ======================================
        // OPÇÃO 1
        // ======================================

        if (
            sessaoAtual === 'menu' &&
            texto === '1'
        ) {

            await delay(1000);

            await client.sendMessage(
                msg.from,
`🛠️ SUPORTE

Descreva seu problema.`
            );

            salvarSessao(
                msg.from,
                'suporte'
            );

            return;
        }

        // ======================================
        // OPÇÃO 2
        // ======================================

        if (
            sessaoAtual === 'menu' &&
            texto === '2'
        ) {

            await delay(1000);

            await client.sendMessage(
                msg.from,
`💰 FINANCEIRO

Envie sua dúvida.`
            );

            salvarSessao(
                msg.from,
                'financeiro'
            );

            return;
        }

        // ======================================
        // OPÇÃO 3
        // ======================================

        if (
            sessaoAtual === 'menu' &&
            texto === '3'
        ) {

            await delay(1000);

            await client.sendMessage(
                msg.from,
`🛒 VENDAS

Fale com nosso comercial.`
            );

            salvarSessao(
                msg.from,
                'vendas'
            );

            return;
        }

        // ======================================
        // FLUXO SUPORTE
        // ======================================

        if (
            sessaoAtual === 'suporte'
        ) {

            const protocolo =
                gerarProtocolo();

            salvarChamado(
    msg.from,
    msg.body,
    protocolo
);

salvarChamadoSQLite(
    msg.from,
    msg.body,
    protocolo
);

salvarMensagemSQLite(
    msg.from,
    'cliente',
    msg.body
);
            await delay(1000);

            await client.sendMessage(
                msg.from,
`📋 Problema registrado.

🎫 Protocolo: ${protocolo}

Equipe vai analisar e responder.`
            );

            // ENCERRA SESSÃO
            salvarSessao(
    msg.from,
    'aguardando_atendente'
);

            return;
        }

        // ======================================
        // DEFAULT
        // ======================================

        await delay(1000);

        await client.sendMessage(
            msg.from,
`❌ Comando inválido.

Digite: menu`
        );

    } catch (error) {

        console.log(
            '❌ ERRO:',
            error
        );
    }
});

// ======================================
// START
// ======================================

// ======================================
// API
// ======================================

app.get('/', (req, res) => {

    res.send(
        '🚀 API ONLINE'
    );
});

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

app.get('/dashboard', (req, res) => {

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
                sessoesAtivas:
                    Object.keys(sessoes).length
            });
        }
    );
});

app.get('/clientes', (req, res) => {

    db.all(
        `
        SELECT *
        FROM clientes
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

app.get('/sessoes', (req, res) => {

    const sessoes = JSON.parse(
        fs.readFileSync(
            './database/sessoes.json',
            'utf-8'
        )
    );

    res.json(sessoes);
});

app.get(
    '/responder/:numero/:mensagem',
    async (req, res) => {

        try {

            const numero =
                req.params.numero;

            const mensagem =
                req.params.mensagem;

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
    }
);

app.get(
    '/mensagens/:numero',
    (req, res) => {

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

                    return res
                        .status(500)
                        .json({
                            erro:
                                erro.message
                        });
                }

                res.json(rows);
            }
        );
    }
);

app.listen(PORT, () => {

    console.log(
        `🚀 API rodando em http://localhost:${PORT}`
    );
});

client.initialize();