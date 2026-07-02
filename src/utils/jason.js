import fs from 'fs';

export function lerJSON(caminho, fallback) {

    try {

        const dados = fs.readFileSync(
            caminho,
            'utf8'
        );

        if (!dados.trim()) {

            salvarJSON(caminho, fallback);

            return fallback;
        }

        return JSON.parse(dados);

    } catch {

        salvarJSON(caminho, fallback);

        return fallback;
    }
}

export function salvarJSON(caminho, dados) {

    fs.writeFileSync(
        caminho,
        JSON.stringify(dados, null, 2),
        'utf8'
    );
}