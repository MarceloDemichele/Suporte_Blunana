"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeQuestion = normalizeQuestion;
exports.interpretQuestion = interpretQuestion;
const business_rules_1 = require("./business-rules");
const operational_actions_1 = require("./operational-actions");
const screen_consultation_1 = require("./screen-consultation");
function normalizeQuestion(value) {
    return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}
function extractUserName(question) {
    const afterDash = question.match(/\s[-–—]\s*([^?]+)\??\s*$/)?.[1]?.trim();
    if (afterDash && /[A-Za-zÀ-ÿ]/.test(afterDash))
        return afterDash;
    const afterLabel = question.match(/(?:usuário|usuária|permissões?|acessos?|perfil(?:\s+de\s+acesso)?)\s+(?:de|da|do)?\s*([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][^?]+)\??$/u)?.[1]?.trim();
    return afterLabel || undefined;
}
function detectEntity(text) {
    if (text.includes("audiencia mutirao") || text.includes("mutirao"))
        return "BATCH_HEARING";
    if (text.includes("publicacao"))
        return "PUBLICATION";
    if (text.includes("audiencia"))
        return "HEARING";
    if (text.includes("ateste"))
        return "ATTESTATION";
    if (text.includes("prazo"))
        return "DEADLINE";
    if (text.includes("processo"))
        return "PROCESS";
    if (text.includes("usuario") || text.includes("usuaria") || text.includes("perfil") || text.includes("permiss"))
        return "USER";
    if (text.includes("dashboard") || text.includes("home"))
        return "DASHBOARD";
    return "UNKNOWN";
}
function detectSourceContext(text) {
    if (text.includes("mutirao"))
        return "BATCH_HEARING";
    if (text.includes("publicacao"))
        return "PUBLICATION";
    if (text.includes("audiencia"))
        return "HEARING";
    if (["tela de prazo", "menu prazo", "editar prazo", "pelo prazo", "na tela prazo"].some((term) => text.includes(term)))
        return "DEADLINE";
    if (text.includes("processo"))
        return "PROCESS";
    return undefined;
}
function includesAny(text, terms) {
    return terms.some((term) => text.includes(term));
}
function interpretQuestion(question) {
    const normalized = normalizeQuestion(question);
    const processNumber = question.match(/\b\d{20}\b/)?.[0];
    const numericReference = question.match(/\b\d{8,}\b/)?.[0];
    const clientCode = question.match(/\b\d{2}\.\d{3}\.\d{4,6}\/\d{4}\b/)?.[0];
    const userName = extractUserName(question);
    const entity = detectEntity(normalized);
    const sourceContext = detectSourceContext(normalized);
    const actionGuide = (0, operational_actions_1.findOperationalActionGuide)(question);
    const rule = (0, business_rules_1.interpretBusinessRule)(question);
    const screen = (0, screen_consultation_1.findScreenConsultationGuide)(question);
    const permissionSignal = includesAny(normalized, ["perfil de acesso", "permissoes", "acessos", "nivel de acesso", "pode acessar", "tem acesso"]) ||
        (normalized.includes("perfil") && (normalized.includes("usuario") || normalized.includes("usuaria")));
    const existenceSignal = includesAny(normalized, [
        "esta na base", "existe na base", "consta na base", "consta no sistema", "existe no sistema",
        "esta cadastrado", "esta cadastrada", "foi localizado", "foi localizada", "existe"
    ]);
    const statusSignal = includesAny(normalized, ["status atual", "situacao atual", "como esta", "responsavel atual", "quem responde", "valor atual", "quanto vale", "agora", "neste momento"]);
    const reverseClientLookup = Boolean(clientCode && normalized.includes("codigo do cliente") && normalized.includes("numero do processo"));
    const hasSpecificIdentifier = Boolean(processNumber || numericReference || userName || clientCode);
    const currentData = hasSpecificIdentifier && (permissionSignal || existenceSignal || statusSignal || reverseClientLookup);
    const businessSignal = includesAny(normalized, [
        "precisa", "necessario", "necessaria", "deve", "pode", "posso", "consigo", "obrigatorio", "regra", "automatico", "automaticamente",
        "autorizacao", "autorizado", "autorizada", "permissao",
        "qualquer usuario", "quem pode", "nao pode", "permitido", "restrito", "exige", "duvida de negocio"
    ]);
    let intent = "UNKNOWN";
    let action = "UNKNOWN";
    let reference;
    let confidence = 0.35;
    if (currentData) {
        intent = "CURRENT_DATA";
        action = reverseClientLookup ? "LOOKUP_FIELD" : permissionSignal ? "CHECK_PERMISSIONS" : existenceSignal ? "CHECK_EXISTENCE" : "CHECK_STATUS";
        confidence = 0.98;
    }
    else if (actionGuide) {
        intent = "PROCEDURE";
        action = "CREATE";
        reference = actionGuide.id;
        confidence = 0.96;
    }
    else if (rule && (businessSignal || rule.confidence >= 0.94)) {
        intent = "BUSINESS_RULE";
        action = "EXPLAIN_RULE";
        reference = rule.rule.id;
        confidence = rule.confidence;
    }
    else if (businessSignal) {
        intent = "UNKNOWN";
        action = "EXPLAIN_RULE";
        confidence = 0.55;
    }
    else if (screen) {
        intent = "SCREEN_LOOKUP";
        action = "CONSULT";
        reference = screen.screen;
        confidence = 0.94;
    }
    else if (rule) {
        intent = "BUSINESS_RULE";
        action = "EXPLAIN_RULE";
        reference = rule.rule.id;
        confidence = rule.confidence;
    }
    const concepts = Array.from(new Set([
        entity !== "UNKNOWN" ? entity.toLowerCase() : "",
        sourceContext?.toLowerCase() || "",
        action !== "UNKNOWN" ? action.toLowerCase() : "",
        reference || "",
        processNumber || "",
        clientCode || ""
    ].filter(Boolean)));
    const filters = [];
    if (clientCode)
        filters.push({ field: "CLIENT_CODE", operator: "EQUALS", value: clientCode });
    else if (processNumber)
        filters.push({ field: "PROCESS_NUMBER", operator: "EQUALS", value: processNumber });
    else if (userName)
        filters.push({ field: "USER_NAME", operator: "EQUALS", value: userName });
    const requestedFields = reverseClientLookup ? ["PROCESS_NUMBER"] :
        permissionSignal ? ["PERMISSIONS"] : statusSignal ? ["STATUS"] : ["ALL"];
    return {
        original: question,
        normalized,
        intent,
        entity,
        action,
        sourceContext,
        identifiers: { processNumber, userName, numericReference, clientCode },
        filters,
        requestedFields,
        concepts,
        requiresLiveData: intent === "CURRENT_DATA",
        needsKnowledgeSearch: intent !== "CURRENT_DATA" && intent !== "UNKNOWN",
        confidence,
        ambiguity: intent === "UNKNOWN" ?
            (businessSignal ? "A pergunta é normativa, mas não existe regra comprovada para respondê-la." : "Intenção, entidade ou referência insuficiente para escolher uma fonte com segurança.") : undefined,
        reference,
        interpretationSource: "LOCAL"
    };
}
