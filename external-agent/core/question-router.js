"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decideAnswerRoute = decideAnswerRoute;
const business_rules_1 = require("./business-rules");
const operational_actions_1 = require("./operational-actions");
const screen_consultation_1 = require("./screen-consultation");
function normalize(value) {
    return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}
function requiresLivePlatform(question) {
    const text = normalize(question);
    const userSpecific = ["perfil de acesso", "permissoes da usuaria", "permissoes do usuario", "acessos da usuaria", "acessos do usuario"]
        .some((term) => text.includes(term));
    const currentRecord = ["status atual", "responsavel atual", "neste momento", "esta cadastrado", "esta cadastrada", "valor atual"]
        .some((term) => text.includes(term));
    const hasSpecificReference = /\s-\s+[a-z]/.test(text) || /\b\d{8,}\b/.test(text) ||
        ((text.includes("usuario") || text.includes("usuaria")) && text.split(" ").length >= 6);
    return (userSpecific && hasSpecificReference) || currentRecord;
}
function looksLikeBusinessQuestion(question) {
    const text = normalize(question);
    return [
        "precisa", "deve", "pode", "obrigatorio", "regra", "automatico", "automaticamente",
        "qualquer usuario", "quem pode", "nao pode", "permitido", "restrito", "exige"
    ].some((term) => text.includes(term));
}
function decideAnswerRoute(question) {
    if (requiresLivePlatform(question)) {
        return { route: "LIVE_PLATFORM", reason: "A resposta depende de dados atuais de um registro ou usuário específico." };
    }
    const action = (0, operational_actions_1.findOperationalActionGuide)(question);
    if (action) {
        return { route: "OPERATIONAL_PROCEDURE", reason: "A pergunta solicita um passo a passo operacional comprovado.", reference: action.id };
    }
    const rule = (0, business_rules_1.interpretBusinessRule)(question);
    if (rule && (looksLikeBusinessQuestion(question) || rule.confidence >= 0.94)) {
        return { route: "BUSINESS_RULE", reason: "A pergunta contém intenção normativa e corresponde a uma regra consolidada.", reference: rule.rule.id };
    }
    const screen = (0, screen_consultation_1.findScreenConsultationGuide)(question);
    if (screen && /consult|pesquis|localiz|busc|acess|onde vejo|como vejo|visualiz/i.test(normalize(question))) {
        return { route: "SCREEN_CONSULTATION", reason: "A pergunta solicita consulta de uma tela conhecida.", reference: screen.screen };
    }
    if (rule) {
        return { route: "BUSINESS_RULE", reason: "Assunto, intenção e condições correspondem a uma regra consolidada.", reference: rule.rule.id };
    }
    return { route: "UNKNOWN", reason: "Não houve correspondência comprovada com regra, procedimento ou consulta dinâmica identificável." };
}
