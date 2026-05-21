import 'dotenv/config';
import fs from 'fs';
import pkg from 'whatsapp-web.js';

process.stdout.setEncoding('utf8');

const { Client, LocalAuth } = pkg;

// ======================================
// CAMINHOS
// ======================================

const caminhoClientes = './database/clientes.json';
const caminhoSessoes = './database/sessoes.json';

// ======================================
// GARANTIR PASTA
// ======================================

if (!fs.existsSync('./database')) {
    fs.mkdirSync('./database', { recursive: true });
}

// ======================================
// JSON SEGURO
// ======================================

function lerJSON(caminho, fallback) {
    try {
        if (!fs.existsSync(caminho)) {
            fs.writeFileSync(caminho, JSON.stringify(fallback, null, 2));
            return fallback;
        }

        const dados = fs.readFileSync(caminho, 'utf-8');

        if (!dados || !dados.trim()) {
            fs.writeFileSync(caminho, JSON.stringify(fallback, null, 2));
            return fallback;
        }

        return JSON.parse(dados);

    } catch (err) {
        console.log(`⚠️ JSON corrompido → resetando: ${caminho}`);
        fs.writeFileSync(caminho, JSON.stringify(fallback, null, 2));
        return fallback;
    }
}

function salvarJSON(caminho, data) {
    fs.writeFileSync(caminho, JSON.stringify(data, null, 2), 'utf-8');
}

// ======================================
// CLIENTES
// ======================================

function salvarCliente(numero) {
    const clientes = lerJSON(caminhoClientes, []);

    if (!clientes.includes(numero)) {
        clientes.push(numero);
        salvarJSON(caminhoClientes, clientes);

        console.log(`💾 Cliente salvo: ${numero}`);
    }
}

// ======================================
// SESSÕES (COM DEBUG FORTE)
// ======================================

function lerSessoes() {
    return lerJSON(caminhoSessoes, {});
}

function salvarSessao(numero, etapa) {
    const sessoes = lerSessoes();

    sessoes[numero] = {
        etapa,
        atualizadoEm: new Date().toISOString()
    };

    salvarJSON(caminhoSessoes, sessoes);

    // 🔥 DEBUG FORTE (agora você vê o que realmente salvou)
    console.log(`💾 SESSÃO SALVA → ${numero} = ${etapa}`);
}

function obterSessao(numero) {
    const sessoes = lerSessoes();
    return sessoes[numero]?.etapa || null;
}

// ======================================
// BOT START
// ======================================

console.log('🚀 Iniciando bot...');
console.log('⏳ Inicializando WhatsApp...');

// ======================================
// CLIENT
// ======================================

const client = new Client({
    authStrategy: new LocalAuth(),
    webVersionCache: { type: 'none' },

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

// ======================================
// EVENTS
// ======================================

client.on('qr', () => {
    console.log('📱 Escaneie o QR Code');
});

client.on('ready', () => {
    console.log('✅ BOT CONECTADO!');
});

// ======================================
// MENSAGENS
// ======================================

client.on('message', async (msg) => {
    try {

        if (msg.from.includes('@g.us')) return;
        if (msg.from === 'status@broadcast') return;
        if (msg.fromMe) return;
        if (!msg.body) return;

        const texto = msg.body.toLowerCase().trim();

        salvarCliente(msg.from);

        const sessaoAtual = obterSessao(msg.from);

        console.log('\n========================');
        console.log('📩 NOVA MENSAGEM');
        console.log('👤 De:', msg.from);
        console.log('💬 Texto:', msg.body);
        console.log('🧠 Sessão:', sessaoAtual);
        console.log('========================\n');

        // ======================================
        // INTELIGÊNCIA NATURAL
        // ======================================

        if (texto.includes('internet') || texto.includes('caiu')) {

            await client.sendMessage(
                msg.from,
                `🛠️ Detectei problema de conexão.

Abrindo chamado no suporte...`
            );

            salvarSessao(msg.from, 'suporte');
            return;
        }

        // ======================================
        // MENU
        // ======================================

        if (texto === 'menu') {

            await client.sendMessage(
                msg.from,
`🤖 ATENDIMENTO AUTOMÁTICO

1️⃣ Suporte
2️⃣ Financeiro
3️⃣ Vendas

Digite o número da opção.`
            );

            salvarSessao(msg.from, 'menu');
            return;
        }

        // ======================================
        // OPÇÕES
        // ======================================

        if (texto === '1') {
            await client.sendMessage(msg.from,
`🛠️ SUPORTE

Descreva seu problema.`);
            salvarSessao(msg.from, 'suporte');
            return;
        }

        if (texto === '2') {
            await client.sendMessage(msg.from,
`💰 FINANCEIRO

Envie sua dúvida.`);
            salvarSessao(msg.from, 'financeiro');
            return;
        }

        if (texto === '3') {
            await client.sendMessage(msg.from,
`🛒 VENDAS

Fale com nosso comercial.`);
            salvarSessao(msg.from, 'vendas');
            return;
        }

        // ======================================
        // FLUXO SUPORTE
        // ======================================

        if (sessaoAtual === 'suporte') {

            await client.sendMessage(
                msg.from,
`📋 Problema registrado.

Equipe vai analisar e responder.`
            );

            return;
        }

        // ======================================
        // DEFAULT
        // ======================================

        await client.sendMessage(
            msg.from,
`❌ Comando inválido.

Digite: menu`
        );

    } catch (error) {
        console.log('❌ ERRO:', error);
    }
});

// ======================================
// START
// ======================================

client.initialize();