import {
    CAMINHO_SESSOES
} from '../config/paths.js';

import {
    lerJSON,
    salvarJSON
} from '../utils/json.js';

export function obterSessao(numero) {

    const sessoes = lerJSON(
        CAMINHO_SESSOES,
        {}
    );

    return sessoes[numero]?.etapa || null;
}

export function salvarSessao(numero, etapa) {

    const sessoes = lerJSON(
        CAMINHO_SESSOES,
        {}
    );

    if (etapa === null) {

        delete sessoes[numero];

    } else {

        sessoes[numero] = {
            etapa,
            atualizadoEm: new Date().toISOString()
        };

    }

    salvarJSON(
        CAMINHO_SESSOES,
        sessoes
    );
}