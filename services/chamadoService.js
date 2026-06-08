import fs from 'fs';

const caminho = './database/chamados.json';

export function listarChamados() {

    return JSON.parse(
        fs.readFileSync(
            caminho,
            'utf-8'
        )
    );
}