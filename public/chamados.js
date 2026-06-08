async function carregarChamados() {

    const res = await fetch('/chamados');
    const chamados = await res.json();

    const tbody = document.querySelector('tbody');

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
                    ${
                        chamado.status === 'aberto'
                        ? `<a href="/chamado/${chamado.protocolo}/fechar">Fechar</a>`
                        : '✅ Encerrado'
                    }
                </td>
            </tr>
        `;
    });
}

carregarChamados();

setInterval(
    carregarChamados,
    5000
);