console.log('CLIENTES.JS CARREGOU');

fetch('/clientes')
    .then(res => res.json())
    .then(clientes => {

        const tbody =
            document.querySelector('tbody');

        clientes.forEach(cliente => {

            tbody.innerHTML += `
                <tr>
                    <td>${cliente}</td>
                </tr>
            `;
        });

    });