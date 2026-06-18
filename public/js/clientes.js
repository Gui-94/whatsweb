async function carregarClientes() {

    const res = await fetch('/clientes');
    const clientes = await res.json();

    const tbody =
        document.querySelector('tbody');

    tbody.innerHTML = '';

    console.log(
        JSON.stringify(
            clientes,
            null,
            2
        )
    );

    clientes.forEach(cliente => {

        tbody.innerHTML += `
            <tr>
                <td>
                ${cliente.id}
                </td>

                <td>
                ${cliente.numero}
                </td>

                <td>
                    <button
    onclick="location.href='/conversa.html?numero=${cliente.numero}'"
>
    Abrir conversa
</button>
                </td>
            </tr>
        `;
    });
}

carregarClientes();