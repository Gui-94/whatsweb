import db from '../db.js';

import { CAMINHO_CHAMADOS } from '../config/paths.js';

import {
    lerJSON,
    salvarJSON
} from '../utils/json.js';

export function listarChamados() {
    return lerJSON(CAMINHO_CHAMADOS, []);
}

export function salvarChamado(numero, mensagem, protocolo) {

    const chamados = listarChamados();

    chamados.push({
        numero,
        protocolo,
        mensagem,
        status: 'aberto',
        data: new Date().toISOString()
    });

    salvarJSON(CAMINHO_CHAMADOS, chamados);
}

export function fecharChamado(numero) {

    const chamados = listarChamados();

    const chamado = chamados.find(
        c => c.numero === numero && c.status === 'aberto'
    );

    if (!chamado) return false;

    chamado.status = 'fechado';
    chamado.dataFechamento = new Date().toISOString();

    salvarJSON(CAMINHO_CHAMADOS, chamados);

    return true;
}

export function salvarChamadoSQLite(numero, mensagem, protocolo) {

    db.run(
        `
        INSERT INTO chamados
        (
            numero,
            protocolo,
            mensagem,
            status,
            data
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            numero,
            protocolo,
            mensagem,
            'aberto',
            new Date().toISOString()
        ]
    );
}