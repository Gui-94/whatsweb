const socket = io();

async function carregarDashboard() {
    try {
        const res = await fetch('/dashboard');
        const data = await res.json();

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
    } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
    }
}

// Carrega ao abrir a página
carregarDashboard();

// Escuta eventos do servidor
socket.on('atualizarDashboard', () => {
    carregarDashboard();
});

fetch('/dashboard')
    .then(res => {
        console.log('STATUS:', res.status);
        return res.json();
    })
    .then(data => {
        console.log('DADOS:', data);
    })
    .catch(err => {
        console.error('ERRO FETCH:', err);
    });