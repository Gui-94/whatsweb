fetch('/chamados')
    .then(res => res.json())
    .then(chamados => {

        const tbody =
            document.querySelector('tbody');

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

    });