import 'dotenv/config';
import pkg from 'whatsapp-web.js';

process.stdout.setEncoding('utf8');

const { Client, LocalAuth } = pkg;

console.log('🚀 Iniciando bot...');

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

// ===============================
// QR CODE
// ===============================

client.on('qr', () => {

    console.log('\n📱 Escaneie o QR Code\n');

});

// ===============================
// BOT CONECTADO
// ===============================

client.on('ready', () => {

    console.log('\n✅ BOT CONECTADO!\n');

});

// ===============================
// ERRO LOGIN
// ===============================

client.on('auth_failure', (msg) => {

    console.log('\n❌ Falha autenticação:\n');

    console.log(msg);

});

// ===============================
// DESCONECTADO
// ===============================

client.on('disconnected', (reason) => {

    console.log('\n⚠️ Bot desconectado:\n');

    console.log(reason);

});

// ===============================
// RECEBER MENSAGENS
// ===============================

client.on('message', async (msg) => {

    console.log('🔥 Mensagem recebida');

    try {

        // ignora grupos
        if (msg.from.includes('@g.us')) return;

        // ignora status
        if (msg.from === 'status@broadcast') return;

        // ignora mensagens do próprio bot
        if (msg.fromMe) return;

        // ignora mensagens vazias
        if (!msg.body) return;

        // texto tratado
        const texto = msg.body.toLowerCase().trim();

        // log terminal
        console.log('\n========================');
        console.log('📩 NOVA MENSAGEM');
        console.log('👤 De:', msg.from);
        console.log('💬 Texto:', msg.body);
        console.log('========================\n');

        // MENU
        if (texto === 'menu') {

            await client.sendMessage(

                msg.from,

`🤖 *ATENDIMENTO AUTOMÁTICO*

Olá! Seja bem-vindo 👋

Escolha uma opção:

1️⃣ Suporte
2️⃣ Financeiro
3️⃣ Vendas

Digite apenas o número da opção.`

            );

            console.log('✅ Menu enviado');

        }

        // SUPORTE
        else if (texto === '1') {

            await client.sendMessage(

                msg.from,

`🛠️ *SUPORTE*

Descreva seu problema.

Nossa equipe responderá em breve.`

            );

            console.log('✅ Suporte enviado');

        }

        // FINANCEIRO
        else if (texto === '2') {

            await client.sendMessage(

                msg.from,

`💰 *FINANCEIRO*

Envie sua dúvida financeira.

Exemplo:
• boleto
• pagamento
• fatura`

            );

            console.log('✅ Financeiro enviado');

        }

        // VENDAS
        else if (texto === '3') {

            await client.sendMessage(

                msg.from,

`🛒 *VENDAS*

Nosso setor comercial irá te atender.

Envie sua dúvida ou interesse.`

            );

            console.log('✅ Vendas enviado');

        }

        // COMANDO INVALIDO
        else {

            await client.sendMessage(

                msg.from,

`❌ Comando inválido.

Digite:
menu`

            );

            console.log('⚠️ Comando inválido');

        }

    } catch (error) {

        console.log('\n❌ ERRO:\n');

        console.log(error);

    }

});

// ===============================
// INICIAR BOT
// ===============================

console.log('⏳ Inicializando WhatsApp...');

client.initialize();