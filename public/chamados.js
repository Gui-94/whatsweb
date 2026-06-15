async function responderCliente(
    numero,
    id
) {

    const mensagem =
        document.getElementById(
            `msg-${id}`
        ).value;

    if (!mensagem) {

        alert('Digite uma mensagem');

        return;
    }

    const res = await fetch(
        `/responder/${numero}/${encodeURIComponent(mensagem)}`
    );

    const resultado =
        await res.json();

    if (resultado.sucesso) {

        alert('✅ Mensagem enviada!');

        document.getElementById(
            `msg-${id}`
        ).value = '';

    } else {

        alert('❌ Erro ao enviar.');
    }
}

async function carregarChamados() {

    const res = await fetch('/chamados');

    const chamados = await res.json();

    const tbody =
        document.querySelector('tbody');

    tbody.innerHTML = '';

    chamados.forEach(chamado => {

        tbody.innerHTML += `
            <tr>
                <td>${chamado.protocolo}</td>
                <td>${chamado.numero}</td>
                <td>${chamado.mensagem}</td>

                <td>
                    <span class="${chamado.status}">
                        ${chamado.status}
                    </span>
                </td>

                <td>
                    <input
                        type="text"
                        id="msg-${chamado.id}"
                        placeholder="Resposta"
                    >

                    <button
                        onclick="responderCliente('${chamado.numero}', ${chamado.id})"
                    >
                        Enviar
                    </button>
                </td>
            </tr>
        `;
    });
}

carregarChamados();
