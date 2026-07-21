"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpretQuestionSemantic = interpretQuestionSemantic;
const question_interpreter_1 = require("./question-interpreter");
const business_rules_1 = require("./business-rules");
const operational_actions_1 = require("./operational-actions");
const screen_consultation_1 = require("./screen-consultation");
const intents = ["CURRENT_DATA", "PROCEDURE", "SCREEN_LOOKUP", "BUSINESS_RULE", "UNKNOWN"];
const entities = ["USER", "PROCESS", "PUBLICATION", "DEADLINE", "HEARING", "BATCH_HEARING", "ATTESTATION", "DASHBOARD", "SCREEN", "UNKNOWN"];
const actions = ["CREATE", "CONSULT", "CHECK_EXISTENCE", "CHECK_STATUS", "CHECK_PERMISSIONS", "EXPLAIN_RULE", "LOOKUP_FIELD", "UNKNOWN"];
const requestedFields = ["PROCESS_NUMBER", "CLIENT_CODE", "STATUS", "RESPONSIBLE", "PERMISSIONS", "VALUE", "ALL"];
const filterFields = ["PROCESS_NUMBER", "CLIENT_CODE", "USER_NAME", "UNKNOWN"];
const allowedReferences = [
    ...operational_actions_1.operationalActionGuides.map((guide) => guide.id),
    ...screen_consultation_1.screenConsultationGuides.map((guide) => guide.screen),
    ...business_rules_1.businessRules.map((rule) => rule.id)
];
const procedureReferences = new Set(operational_actions_1.operationalActionGuides.map((guide) => guide.id));
const screenReferences = new Set(screen_consultation_1.screenConsultationGuides.map((guide) => guide.screen));
const ruleReferences = new Set(business_rules_1.businessRules.map((rule) => rule.id));
const capabilityCatalog = JSON.stringify({
    procedures: operational_actions_1.operationalActionGuides.map((guide) => ({ id: guide.id, action: guide.action })),
    screens: screen_consultation_1.screenConsultationGuides.map((guide) => ({ reference: guide.screen, aliases: guide.aliases })),
    rules: business_rules_1.businessRules.map((rule) => ({ id: rule.id, topic: rule.topic, example: rule.example }))
});
const interpretationSchema = {
    type: "object",
    additionalProperties: false,
    required: ["intent", "entity", "action", "reference", "sourceContext", "identifiers", "filters", "requestedFields", "requiresLiveData", "needsKnowledgeSearch", "confidence", "ambiguity"],
    properties: {
        intent: { type: "string", enum: intents },
        entity: { type: "string", enum: entities },
        action: { type: "string", enum: actions },
        reference: { type: ["string", "null"], enum: [...allowedReferences, null] },
        sourceContext: { type: ["string", "null"], enum: ["PROCESS", "PUBLICATION", "DEADLINE", "HEARING", "BATCH_HEARING", null] },
        identifiers: {
            type: "object",
            additionalProperties: false,
            required: ["processNumber", "userName", "numericReference", "clientCode"],
            properties: {
                processNumber: { type: ["string", "null"] },
                userName: { type: ["string", "null"] },
                numericReference: { type: ["string", "null"] },
                clientCode: { type: ["string", "null"] }
            }
        },
        filters: {
            type: "array",
            items: {
                type: "object",
                additionalProperties: false,
                required: ["field", "operator", "value"],
                properties: {
                    field: { type: "string", enum: filterFields },
                    operator: { type: "string", enum: ["EQUALS"] },
                    value: { type: "string" }
                }
            }
        },
        requestedFields: { type: "array", items: { type: "string", enum: requestedFields } },
        requiresLiveData: { type: "boolean" },
        needsKnowledgeSearch: { type: "boolean" },
        confidence: { type: "number", minimum: 0, maximum: 1 },
        ambiguity: { type: ["string", "null"] }
    }
};
function outputText(response) {
    if (typeof response?.output_text === "string")
        return response.output_text;
    for (const item of response?.output || []) {
        for (const content of item?.content || []) {
            if (typeof content?.text === "string")
                return content.text;
        }
    }
    return "";
}
function normalizedText(value) {
    return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
function normalizeCandidate(question, candidate, local) {
    if (!candidate || typeof candidate !== "object")
        return candidate;
    const normalized = normalizedText(question);
    const clientCode = question.match(/\b\d{2}\.\d{3}\.\d{4,6}\/\d{4}\b/)?.[0];
    const processNumber = question.match(/\b\d{20}\b/)?.[0];
    candidate.identifiers || (candidate.identifiers = {});
    candidate.filters = Array.isArray(candidate.filters) ? candidate.filters : [];
    candidate.requestedFields = Array.isArray(candidate.requestedFields) ? candidate.requestedFields : [];
    if (clientCode) {
        candidate.identifiers.clientCode = clientCode;
        if (candidate.identifiers.processNumber === clientCode)
            candidate.identifiers.processNumber = null;
        candidate.filters = candidate.filters.filter((filter) => filter?.value !== clientCode);
        candidate.filters.push({ field: "CLIENT_CODE", operator: "EQUALS", value: clientCode });
    }
    else if (processNumber) {
        candidate.identifiers.processNumber = processNumber;
        candidate.filters = candidate.filters.filter((filter) => filter?.value !== processNumber);
        candidate.filters.push({ field: "PROCESS_NUMBER", operator: "EQUALS", value: processNumber });
    }
    const asksProcessNumber = ["numero processual", "numero do processo", "qual processo"].some((term) => normalized.includes(term));
    const clientReference = clientCode && ["codigo do cliente", "referencia do cliente", "referencia cliente", "codigo"].some((term) => normalized.includes(term));
    if (clientReference && asksProcessNumber) {
        candidate.intent = "CURRENT_DATA";
        candidate.entity = "PROCESS";
        candidate.action = "LOOKUP_FIELD";
        candidate.reference = null;
        candidate.sourceContext = "PROCESS";
        candidate.requestedFields = ["PROCESS_NUMBER"];
        candidate.ambiguity = null;
    }
    const screenGuide = (0, screen_consultation_1.findScreenConsultationGuide)(question);
    const screenSignal = [
        "tela", "pagina", "menu", "onde consulto", "onde vejo", "onde encontro",
        "area de", "calendario", "para que serve a pagina", "pagina inicial"
    ].some((term) => normalized.includes(term));
    if (screenGuide && screenSignal && candidate.intent !== "CURRENT_DATA" && candidate.intent !== "PROCEDURE") {
        candidate.intent = "SCREEN_LOOKUP";
        candidate.entity = screenGuide.screen === "Audiência Mutirão" ? "BATCH_HEARING" : "SCREEN";
        candidate.action = "CONSULT";
        candidate.reference = screenGuide.screen;
        candidate.filters = [];
        candidate.requestedFields = ["ALL"];
        candidate.ambiguity = null;
    }
    const explicitlyCommonHearing = normalized.includes("audiencia comum") || normalized.includes("nao e mutirao") || normalized.includes("nao eh mutirao");
    const batchHearingSignal = !explicitlyCommonHearing && normalized.includes("audien") && ["planilha", "em lote", "lote de", "mutirao"].some((term) => normalized.includes(term));
    if (explicitlyCommonHearing && candidate.intent === "PROCEDURE") {
        candidate.entity = "HEARING";
        candidate.action = "CREATE";
        candidate.reference = "ACTION-CREATE-HEARING";
        candidate.sourceContext = "HEARING";
    }
    if (batchHearingSignal && candidate.intent === "PROCEDURE") {
        candidate.entity = "BATCH_HEARING";
        candidate.action = "CREATE";
        candidate.reference = "ACTION-CREATE-BATCH-HEARING";
        candidate.sourceContext = "BATCH_HEARING";
    }
    if (batchHearingSignal && candidate.intent === "SCREEN_LOOKUP") {
        candidate.entity = "BATCH_HEARING";
        candidate.action = "CONSULT";
        candidate.reference = "Audiência Mutirão";
        candidate.sourceContext = "BATCH_HEARING";
    }
    if (candidate.intent === "SCREEN_LOOKUP") {
        candidate.action = "CONSULT";
        candidate.entity = candidate.reference === "Audiência Mutirão" ? "BATCH_HEARING" : "SCREEN";
    }
    if (candidate.intent === "PROCEDURE" && !procedureReferences.has(candidate.reference)) {
        candidate.reference = local.intent === "PROCEDURE" ? local.reference || null : null;
    }
    if (candidate.intent === "SCREEN_LOOKUP" && !screenReferences.has(candidate.reference)) {
        candidate.reference = local.intent === "SCREEN_LOOKUP" ? local.reference || null : null;
    }
    if (candidate.intent === "BUSINESS_RULE" && !ruleReferences.has(candidate.reference)) {
        candidate.reference = local.intent === "BUSINESS_RULE" ? local.reference || null : null;
    }
    if (candidate.intent === "BUSINESS_RULE" && (!candidate.reference || candidate.entity === "UNKNOWN")) {
        candidate.intent = "UNKNOWN";
    }
    if (candidate.intent === "BUSINESS_RULE")
        candidate.action = "EXPLAIN_RULE";
    if (candidate.intent === "PROCEDURE") {
        candidate.action = "CREATE";
        if (candidate.reference === "ACTION-CREATE-DEADLINE" && candidate.sourceContext === "PUBLICATION")
            candidate.entity = "PUBLICATION";
        if (candidate.reference === "ACTION-CREATE-DEADLINE" && candidate.sourceContext === "HEARING")
            candidate.entity = "HEARING";
    }
    if (candidate.intent === "CURRENT_DATA") {
        const existenceSignal = ["existe", "consta", "cadastrado", "cadastrada", "esta na base", "tem alguma", "tem algum"].some((term) => normalized.includes(term));
        if (existenceSignal && !(clientReference && asksProcessNumber)) {
            candidate.action = "CHECK_EXISTENCE";
            candidate.requestedFields = ["ALL"];
        }
        else if (candidate.requestedFields.includes("RESPONSIBLE") || candidate.requestedFields.includes("PROCESS_NUMBER") || candidate.requestedFields.includes("CLIENT_CODE"))
            candidate.action = "LOOKUP_FIELD";
        else if (candidate.requestedFields.includes("PERMISSIONS"))
            candidate.action = "CHECK_PERMISSIONS";
        else if (candidate.requestedFields.includes("STATUS"))
            candidate.action = "CHECK_STATUS";
    }
    if (candidate.intent === "UNKNOWN") {
        candidate.entity = "UNKNOWN";
        candidate.action = "UNKNOWN";
        candidate.reference = null;
    }
    return candidate;
}
function validPlan(candidate) {
    if (!candidate || !intents.includes(candidate.intent) || !entities.includes(candidate.entity) || !actions.includes(candidate.action))
        return false;
    if (candidate.reference !== null && !allowedReferences.includes(candidate.reference))
        return false;
    if (!Array.isArray(candidate.filters) || !Array.isArray(candidate.requestedFields))
        return false;
    if (!candidate.filters.every((filter) => filterFields.includes(filter?.field) && filter?.operator === "EQUALS" && typeof filter?.value === "string" && filter.value.trim()))
        return false;
    if (!candidate.requestedFields.every((field) => requestedFields.includes(field)))
        return false;
    if (candidate.intent === "CURRENT_DATA" && candidate.filters.length === 0)
        return false;
    return typeof candidate.confidence === "number" && candidate.confidence >= 0 && candidate.confidence <= 1;
}
function supportedLivePlan(candidate) {
    if (candidate.intent !== "CURRENT_DATA")
        return true;
    return candidate.filters.every((filter) => {
        if (candidate.entity === "USER")
            return filter.field === "USER_NAME";
        if (candidate.entity === "PROCESS" || candidate.entity === "PUBLICATION")
            return filter.field === "PROCESS_NUMBER" || filter.field === "CLIENT_CODE";
        return filter.field === "PROCESS_NUMBER";
    });
}
async function interpretQuestionSemantic(question, fetchImpl = fetch) {
    const local = (0, question_interpreter_1.interpretQuestion)(question);
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    const mode = (process.env.QUESTION_INTERPRETER_MODE || "hybrid").toLowerCase();
    if (!apiKey || mode === "local")
        return local;
    const model = process.env.OPENAI_INTERPRETER_MODEL || "gpt-5.6-luna";
    const timeoutMs = Number(process.env.OPENAI_INTERPRETER_TIMEOUT_MS || 12000);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetchImpl("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
                model,
                reasoning: { effort: "low" },
                input: [
                    {
                        role: "developer",
                        content: [{
                                type: "input_text",
                                text: `Interprete uma pergunta de suporte do sistema jurídico Blunana. Converta linguagem livre em um plano de leitura. Não responda à pergunta e não proponha escrita. Entidades e campos devem respeitar o schema. CURRENT_DATA exige filtro específico. Se faltar entidade ou identificador necessário, use UNKNOWN e explique ambiguity. Diferencie regra de negócio de consulta de registro atual. Preserve exatamente identificadores fornecidos. Formato NN.NNN.NNNN/AAAA ou NN.NNN.NNNNN/AAAA é CLIENT_CODE; sequência de 20 dígitos é PROCESS_NUMBER. Pergunta sobre onde acessar, em qual menu/tela, para que uma tela serve ou quais informações ela mostra é SCREEN_LOOKUP/CONSULT, não BUSINESS_RULE. BUSINESS_RULE é reservada para condições, permissões, obrigatoriedade ou comportamento normativo e usa EXPLAIN_RULE. Se a pergunta corresponder a uma capacidade catalogada, preencha reference exatamente; caso contrário use null. Catálogo: ${capabilityCatalog}`
                            }]
                    },
                    { role: "user", content: [{ type: "input_text", text: question }] }
                ],
                text: { format: { type: "json_schema", name: "question_interpretation", strict: true, schema: interpretationSchema } }
            }),
            signal: controller.signal
        });
        if (!response.ok)
            return local;
        const candidate = normalizeCandidate(question, JSON.parse(outputText(await response.json())), local);
        if (!validPlan(candidate) || !supportedLivePlan(candidate))
            return local;
        return {
            ...local,
            intent: candidate.intent,
            entity: candidate.entity,
            action: candidate.action,
            reference: candidate.reference || local.reference,
            sourceContext: candidate.sourceContext || undefined,
            identifiers: {
                processNumber: candidate.identifiers?.processNumber || local.identifiers.processNumber,
                userName: candidate.identifiers?.userName || local.identifiers.userName,
                numericReference: candidate.identifiers?.numericReference || local.identifiers.numericReference,
                clientCode: candidate.identifiers?.clientCode || local.identifiers.clientCode
            },
            filters: candidate.filters,
            requestedFields: candidate.requestedFields,
            requiresLiveData: candidate.intent === "CURRENT_DATA",
            needsKnowledgeSearch: candidate.intent !== "CURRENT_DATA" && candidate.intent !== "UNKNOWN",
            confidence: candidate.confidence,
            ambiguity: candidate.ambiguity || undefined,
            interpretationSource: "MODEL",
            model
        };
    }
    catch {
        return local;
    }
    finally {
        clearTimeout(timer);
    }
}
