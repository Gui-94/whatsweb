fetch('http://localhost:3000/dashboard')
    .then(res => res.json())
    .then(data => {

        document.getElementById('dashboard').innerHTML = `
            <div class="card">
                <h2>Clientes</h2>
                <p>${data.clientes}</p>
            </div>

            <div class="card">
                <h2>Chamados</h2>
                <p>${data.chamados}</p>
            </div>

            <div class="card">
                <h2>Abertos</h2>
                <p>${data.abertos}</p>
            </div>

            <div class="card">
                <h2>Sessões Ativas</h2>
                <p>${data.sessoesAtivas}</p>
            </div>
        `;
    });

    fetch('/chamados')
    .then(res => res.json())
    .then(chamados => {

        let html = '<h2>📋 Chamados</h2>';

        chamados.forEach(chamado => {

            html += `
                <div class="card">
                    <p><strong>Protocolo:</strong> ${chamado.protocolo}</p>
                    <p><strong>Mensagem:</strong> ${chamado.mensagem}</p>
                    <p>
                        <strong>Status:</strong>
                        <span class="${chamado.status}">
                            ${chamado.status}
                        </span>
                    </p>

                    <a href="/chamado/${chamado.protocolo}/fechar">
                        Fechar Chamado
                    </a>
                </div>
            `;
        });

        document
            .getElementById('dashboard')
            .innerHTML += html;
    });