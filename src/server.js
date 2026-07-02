import express from 'express';
import http from 'http';
import fs from 'fs';
import 'dotenv/config';
import pkg from 'whatsapp-web.js';
import { Server as SocketServer } from 'socket.io';

import {
    CAMINHO_CLIENTES,
    CAMINHO_SESSOES,
    CAMINHO_CHAMADOS
} from './config/paths.js';

import {
    setClient
} from './whatsapp/whatsappClient.js';

import {
    iniciarMessageHandler
} from './whatsapp/messageHandler.js';

import chamadosRoutes from './routes/chamadosRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import clientesRoutes from './routes/clientesRoutes.js';
import sessoesRoutes from './routes/sessoesRoutes.js';
import mensagensRoutes from './routes/mensagensRoutes.js';
import responderRoutes from './routes/responderRoutes.js';

process.stdout.write('\x1b[?25h');

const { Client, LocalAuth } = pkg;

export const app = express();

const server = http.createServer(app);
const io = new SocketServer(server);

export { io };

io.on('connection', (socket) => {

    console.log('🟢 Socket conectado:', socket.id);

    socket.on('disconnect', () => {

        console.log('🔴 Socket desconectado:', socket.id);

    });

});

app.use(express.static('public'));

const PORT = 3000;

// ======================================
// ROTAS
// ======================================

app.use('/chamados', chamadosRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/clientes', clientesRoutes);
app.use('/sessoes', sessoesRoutes);
app.use('/mensagens', mensagensRoutes);
app.use('/responder', responderRoutes);

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

if (!fs.existsSync(CAMINHO_CLIENTES)) {
    fs.writeFileSync(CAMINHO_CLIENTES, '[]');
}

if (!fs.existsSync(CAMINHO_SESSOES)) {
    fs.writeFileSync(CAMINHO_SESSOES, '{}');
}

if (!fs.existsSync(CAMINHO_CHAMADOS)) {
    fs.writeFileSync(CAMINHO_CHAMADOS, '[]');
}

// ======================================
// BOT START
// ======================================

console.log('🚀 Iniciando bot...');
console.log('⏳ Inicializando WhatsApp...');

// ======================================
// CLIENT
// ======================================

export const client = new Client({

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

iniciarMessageHandler(client, io);

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
// API
// ======================================

app.get('/', (req, res) => {

    res.send('🚀 API ONLINE');

});

// ======================================
// START
// ======================================

server.listen(PORT, () => {

    console.log(`🚀 API rodando em http://localhost:${PORT}`);

});

client.initialize();