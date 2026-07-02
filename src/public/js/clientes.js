console.log("🔥 script iniciou");

function ultimaAtividade(lastSeen) {
    if (!lastSeen) return '⚠️ sem atividade';

    const agora = Date.now();
    const diffMin = Math.floor((agora - lastSeen) / 60000);

    if (diffMin < 1) return '🟢 Online';
    if (diffMin < 60) return `Visto há ${diffMin} min`;

    const horas = Math.floor(diffMin / 60);
    return `Visto há ${horas} h`;
}

async function carregarClientes() {
    try {
        console.log("📡 carregando clientes");

        const res = await fetch('/clientes');

        if (!res.ok) {
            throw new Error(`HTTP error: ${res.status}`);
        }

        const clientes = await res.json();

        console.log("📦 clientes:", clientes);

        const tbody = document.querySelector('tbody');

        if (!tbody) {
            console.error("❌ tbody não encontrado no HTML");
            return;
        }

        let html = '';

        clientes.forEach((cliente, index) => {
            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <a href="/conversa.html?numero=${cliente.numero}">
                            ${cliente.numero}
                        </a>
                        <br>
                        <small>
                            ${ultimaAtividade(cliente.ultimaAtividade)}
                        </small>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;

    } catch (error) {
        console.error("❌ erro ao carregar clientes:", error);
    }
}

carregarClientes();
setInterval(carregarClientes, 5000);