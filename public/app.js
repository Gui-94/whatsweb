fetch('/dashboard')
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
                <h2>Fechados</h2>
                <p>${data.fechados}</p>
            </div>

            <div class="card">
                <h2>Sessões Ativas</h2>
                <p>${data.sessoesAtivas}</p>
            </div>
        `;
    })
    .catch(err => {
        console.error('Erro ao carregar dashboard:', err);
    });