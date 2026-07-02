import db from '../db.js';

import { CAMINHO_CLIENTES } from '../config/paths.js';

import {
    lerJSON,
    salvarJSON
} from '../utils/json.js';

export function salvarCliente(numero) {

    const clientes = lerJSON(
        CAMINHO_CLIENTES,
        []
    );

    const cliente = clientes.find(
        c => c.numero === numero
    );

    if (cliente) {

        cliente.ultimaAtividade =
            new Date().toISOString();

    } else {

        clientes.push({
            numero,
            ultimaAtividade:
                new Date().toISOString()
        });

    }

    salvarJSON(
        CAMINHO_CLIENTES,
        clientes
    );
}

export function salvarClienteSQLite(numero) {

    db.run(
        `
        INSERT OR IGNORE INTO clientes
        (
            numero
        )
        VALUES (?)
        `,
        [numero]
    );
}