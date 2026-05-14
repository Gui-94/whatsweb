import 'dotenv/config';
import axios from 'axios';
import QRCode from 'qrcode';
import { Client } from 'whatsapp-web.js';

console.log("🚀 Iniciando bot...");

const client = new Client();

// 📲 QR Code (imagem)
client.on('qr', async (qr) => {
    console.log("📲 QR gerado! Salvando imagem...");

    try {
        await QRCode.toFile('qr.png', qr);
        console.log("📸 Abra o arquivo qr.png e escaneie no WhatsApp");
    } catch (err) {
        console.log("Erro ao gerar QR:", err.message);
    }
});

// 🤖 Bot pronto
client.on('ready', () => {
    console.log("🤖 Bot conectado com sucesso!");
});

// ⏳ Loading status
client.on('loading_screen', (percent, message) => {
    console.log(`⏳ Carregando ${percent}% - ${message}`);
});

// 🧠 GEMINI (CORRIGIDO)
async function askGemini(text) {
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [{ text }]
                    }
                ]
            }
        );

        return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta";
    } catch (err) {
        console.log("Erro Gemini:", err.response?.data || err.message);
        return "Erro na IA 😅";
    }
}

// 📩 Mensagens recebidas
client.on('message', async (msg) => {
    if (!msg.body) return;

    // evita grupos (opcional)
    if (msg.from.includes('@g.us')) return;

    console.log("📩 Mensagem:", msg.body);

    try {
        const reply = await askGemini(msg.body);
        await msg.reply(reply);
    } catch (err) {
        console.log("Erro ao responder:", err.message);
    }
});

// 🚀 inicia bot
client.initialize();