"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.temRespostaOperacional = temRespostaOperacional;
exports.gerarResposta = gerarResposta;
function normalizar(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function assuntoDaPergunta(pergunta) {
    return normalizar(pergunta).replace(/[^a-z0-9\s]/g, " ").split(/\s+/)
        .filter((termo) => termo.length > 3)
        .filter((termo) => ![
        "como", "consulto", "consultar", "acesso", "acessar", "onde", "posso",
        "configuro", "configurar", "configuracao"
    ].includes(termo))
        .sort((a, b) => b.length - a.length)[0] || "";
}
function estaNoEscopoAtivo(menu) {
    const permitidos = new Set([
        "configuracao do ateste",
        "configuracao usuario",
        "configuracao de publicacao",
        "configuracao do prazo",
        "configuracao de processos",
        "home",
        "agenda de prazos",
        "processos",
        "publicacoes",
        "prazos",
        "audiencia",
        "audiencia mutirao",
        "ateste"
    ]);
    return permitidos.has(normalizar(menu));
}
function localizarMenu(pergunta, resultados, runtimeEvidence) {
    const assunto = assuntoDaPergunta(pergunta);
    if (!assunto)
        return null;
    const candidatos = [];
    for (const resultado of resultados) {
        try {
            const json = JSON.parse(resultado.content);
            if (!Array.isArray(json))
                continue;
            for (const item of json) {
                const texto = String(item.texto || item.menu || "").trim();
                const href = String(item.href || item.url || "").trim();
                if (texto)
                    candidatos.push({ texto, href });
            }
        }
        catch {
            // Fontes não JSON permanecem disponíveis para rastreabilidade.
        }
    }
    const menusRuntime = runtimeEvidence && typeof runtimeEvidence.evidence === "object"
        ? runtimeEvidence.evidence.menus || []
        : [];
    for (const item of menusRuntime) {
        if (item.text)
            candidatos.push({ texto: item.text, href: item.href });
    }
    return candidatos.filter((item) => normalizar(`${item.texto} ${item.href || ""}`).includes(assunto))
        .sort((a, b) => {
        const aTexto = normalizar(a.texto);
        const bTexto = normalizar(b.texto);
        const aExato = aTexto === assunto || aTexto === `${assunto}s` ? 1 : 0;
        const bExato = bTexto === assunto || bTexto === `${assunto}s` ? 1 : 0;
        return bExato - aExato || a.texto.length - b.texto.length;
    })[0] || null;
}
function localizarFiltros(pergunta, resultados) {
    const assunto = assuntoDaPergunta(pergunta);
    if (!assunto)
        return [];
    for (const resultado of resultados) {
        try {
            const json = JSON.parse(resultado.content);
            if (Array.isArray(json) || !Array.isArray(json.labels))
                continue;
            if (!normalizar(String(json.path || "")).includes(assunto))
                continue;
            const prioridades = ["numero do processo", "codigo do cliente", "status", "responsavel"];
            const nomes = {
                "numero do processo": "Número do processo",
                "codigo do cliente": "Código do cliente",
                "status": "Status",
                "responsavel": "Responsável"
            };
            return prioridades.filter((prioridade) => json.labels.some((label) => normalizar(label) === prioridade)).map((prioridade) => nomes[prioridade]);
        }
        catch {
            // Ignora fontes que não representam metadados estruturados de tela.
        }
    }
    return [];
}
function temRespostaOperacional(pergunta, resultados) {
    return localizarMenu(pergunta, resultados, null) !== null;
}
function gerarResposta(pergunta, resultados, runtimeEvidence = null) {
    const menu = localizarMenu(pergunta, resultados, runtimeEvidence);
    if (menu) {
        if (!estaNoEscopoAtivo(menu.texto)) {
            return `A funcionalidade **${menu.texto}** ainda está em desenvolvimento e não faz parte do escopo atual de suporte. Para evitar uma orientação incorreta, encaminhe a dúvida para validação da equipe responsável.`;
        }
        const filtros = localizarFiltros(pergunta, resultados);
        if (filtros.length > 0) {
            return `Acesse o menu **${menu.texto}** e utilize um ou mais filtros, como **${filtros.join("**, **")}**. A listagem é atualizada automaticamente, e cada filtro acrescentado restringe os resultados da pesquisa.`;
        }
        return `Acesse o menu **${menu.texto}** para realizar a consulta desejada.`;
    }
    if (resultados.length === 0) {
        return "Não encontrei evidência suficiente para orientar esse procedimento com segurança. A tela precisa ser validada no Blunana ou pelo time de suporte.";
    }
    return "Encontrei materiais relacionados, mas eles não comprovam o passo a passo solicitado. A orientação deve ser validada no Blunana antes de ser enviada ao usuário.";
}
