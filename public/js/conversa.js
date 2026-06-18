const params =
    new URLSearchParams(
        window.location.search
    );

const numero =
    params.get('numero');

    document.getElementById(
    'cliente'
).innerText = numero;

document.title =
    `💬 ${numero}`;

async function carregarMensagens() {

    try {

        const res =
            await fetch(
                `/mensagens/${numero}`
            );

        if (!res.ok) {
            throw new Error(
                `Erro ${res.status}`
            );
        }

        const mensagens =
            await res.json();

        const div =
            document.getElementById(
                'mensagens'
            );

        div.innerHTML = '';

        if (!mensagens.length) {

            div.innerHTML =
                '<p>Nenhuma mensagem.</p>';

            return;
        }

        mensagens.forEach(msg => {

            const hora =
                new Date(
                    msg.data
                ).toLocaleTimeString(
                    'pt-BR',
                    {
                        hour: '2-digit',
                        minute: '2-digit'
                    }
                );

            div.innerHTML += `
                <div class="msg ${msg.autor}">
                    <div class="bolha">
                        <div class="texto">
                            ${msg.mensagem}
                        </div>

                        <div class="hora">
                            ${hora}
                        </div>
                    </div>
                </div>
            `;
        });

        div.scrollTop =
            div.scrollHeight;

    } catch (erro) {

        console.error(erro);

        document.getElementById(
            'mensagens'
        ).innerHTML =
            '<p>❌ Erro ao carregar mensagens.</p>';
    }
}

async function enviarMensagem() {

    const input =
        document.getElementById(
            'texto'
        );

    const mensagem =
        input.value.trim();

    if (!mensagem) {
        return;
    }

    try {

        const res =
            await fetch(
                `/responder/${numero}/${encodeURIComponent(mensagem)}`
            );

        const resultado =
            await res.json();

        if (!resultado.sucesso) {

            alert(
                '❌ Erro ao enviar.'
            );

            return;
        }

        input.value = '';

        carregarMensagens();

    } catch (erro) {

        console.error(erro);

        alert(
            '❌ Erro ao enviar mensagem.'
        );
    }
}

document.getElementById(
    'cliente'
).innerText =
    `👤 ${numero}`;

document
    .getElementById('texto')
    .addEventListener(
        'keydown',
        e => {

            if (
                e.key === 'Enter'
            ) {

                enviarMensagem();
            }
        }
    );

carregarMensagens();

setInterval(
    carregarMensagens,
    3000
);