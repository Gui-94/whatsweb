const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export function iniciarMessageHandler(client, io) {

    client.on('message', async (msg) => {

        try {

            // ======================================
            // FILTROS BASE
            // ======================================
            if (msg.from.includes('@g.us')) return;
            if (msg.from === 'status@broadcast') return;
            if (msg.fromMe) return;
            if (!msg.body) return;

            // ======================================
            // NORMALIZAÇÃO
            // ======================================
            const texto = msg.body.toLowerCase().trim();
            const usuario = msg.from;

            salvarCliente(usuario);
            salvarClienteSQLite(usuario);

            const sessao = obterSessao(usuario);

            console.log('\n========================');
            console.log('📩 NOVA MENSAGEM');
            console.log('👤 De:', usuario);
            console.log('💬 Texto:', texto);
            console.log('🧠 Sessão:', sessao);
            console.log('========================\n');

            // ======================================
            // SAIR
            // ======================================
            if (texto === 'sair') {
                salvarSessao(usuario, null);

                await client.sendMessage(usuario, '✅ Atendimento encerrado.');
                return;
            }

            // ======================================
            // ENCERRAR CHAMADO
            // ======================================
            if (sessao === 'aguardando_atendente' && texto === 'encerrar') {

                const fechado = fecharChamado(usuario);

                if (fechado) {
                    salvarSessao(usuario, null);

                    io.emit('atualizarChamados');
                    io.emit('atualizarDashboard');

                    await client.sendMessage(usuario,
`✅ Chamado encerrado.

Obrigado pelo contato!`);
                } else {
                    await client.sendMessage(usuario,
`❌ Nenhum chamado aberto encontrado.`);
                }

                return;
            }

            // ======================================
            // BLOQUEIO ATENDIMENTO HUMANO
            // ======================================
            if (sessao === 'aguardando_atendente' && texto !== 'menu') {

                await client.sendMessage(usuario,
`⏳ Seu chamado já foi registrado.

Digite *encerrar* para finalizar
ou *menu* para voltar.`);

                return;
            }

            // ======================================
            // INTELIGÊNCIA SIMPLES
            // ======================================
            if (
                (texto.includes('internet') || texto.includes('caiu')) &&
                sessao !== 'suporte'
            ) {

                await delay(1000);

                await client.sendMessage(usuario,
`🛠️ Detectei possível problema de conexão.

Abrindo chamado no suporte...`);

                salvarSessao(usuario, 'suporte');
                return;
            }

            // ======================================
            // MENU
            // ======================================
            if (texto === 'menu') {

                await delay(1000);

                await client.sendMessage(usuario,
`🤖 ATENDIMENTO AUTOMÁTICO

1️⃣ Suporte
2️⃣ Financeiro
3️⃣ Vendas

Digite o número da opção.`);

                salvarSessao(usuario, 'menu');
                return;
            }

            // ======================================
            // OPÇÕES MENU
            // ======================================
            if (sessao === 'menu') {

                if (texto === '1') {
                    await client.sendMessage(usuario,
`🛠️ SUPORTE

Descreva seu problema.`);

                    salvarSessao(usuario, 'suporte');
                    return;
                }

                if (texto === '2') {
                    await client.sendMessage(usuario,
`💰 FINANCEIRO

Envie sua dúvida.`);

                    salvarSessao(usuario, 'financeiro');
                    return;
                }

                if (texto === '3') {
                    await client.sendMessage(usuario,
`🛒 VENDAS

Fale com nosso comercial.`);

                    salvarSessao(usuario, 'vendas');
                    return;
                }
            }

            // ======================================
            // FLUXO SUPORTE
            // ======================================
            if (sessao === 'suporte') {

                const protocolo = gerarProtocolo();

                salvarChamado(usuario, msg.body, protocolo);
                salvarChamadoSQLite(usuario, msg.body, protocolo);
                salvarMensagemSQLite(usuario, 'cliente', msg.body);

                io.emit('atualizarChamados');
                io.emit('atualizarDashboard');

                await delay(1000);

                await client.sendMessage(usuario,
`📋 Problema registrado.

🎫 Protocolo: ${protocolo}

Nossa equipe vai analisar.`);

                salvarSessao(usuario, 'aguardando_atendente');
                return;
            }

            // ======================================
            // DEFAULT
            // ======================================
            await delay(1000);

            await client.sendMessage(usuario,
`❌ Comando inválido.

Digite *menu* para começar.`);

        } catch (error) {
            console.log('❌ ERRO:', error);
        }
    });
}