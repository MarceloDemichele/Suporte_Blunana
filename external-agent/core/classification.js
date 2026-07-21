"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classificarPergunta = classificarPergunta;
function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}
function classificarPergunta(pergunta) {
    const texto = normalizar(pergunta);
    const sinaisBug = [
        /\bbug\b/,
        /\berro\b/,
        /\bfalha\b/,
        /\bproblema\b/,
        /nao funciona/,
        /nao consigo/,
        /comportamento incorreto/,
        /resultado incorreto/,
        /esta travando/,
        /nao carrega/
    ];
    if (sinaisBug.some((sinal) => sinal.test(texto)))
        return "BUG";
    const sinaisMelhoria = [
        /\bmelhoria\b/,
        /\bsugestao\b/,
        /\bevolucao\b/,
        /nova funcionalidade/,
        /gostaria que/,
        /seria possivel (criar|incluir|alterar|adicionar)/,
        /solicito (a |uma )?(criacao|inclusao|alteracao)/,
        /precisamos implementar/
    ];
    if (sinaisMelhoria.some((sinal) => sinal.test(texto)))
        return "MELHORIA";
    return "DUVIDA";
}
