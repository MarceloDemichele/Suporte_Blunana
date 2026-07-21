"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const semantic_interpreter_1 = require("../core/semantic-interpreter");
const previousKey = process.env.OPENAI_API_KEY;
const previousMode = process.env.QUESTION_INTERPRETER_MODE;
process.env.OPENAI_API_KEY = "test-key-not-sent";
process.env.QUESTION_INTERPRETER_MODE = "hybrid";
function mockedFetch(payload, ok = true) {
    return (async () => new Response(JSON.stringify({
        output: [{ content: [{ text: JSON.stringify(payload) }] }]
    }), { status: ok ? 200 : 500, headers: { "Content-Type": "application/json" } }));
}
const modelPlan = {
    intent: "CURRENT_DATA",
    entity: "PROCESS",
    action: "LOOKUP_FIELD",
    reference: null,
    sourceContext: null,
    identifiers: { processNumber: null, userName: null, numericReference: null, clientCode: "23.000.17883/2025" },
    filters: [{ field: "CLIENT_CODE", operator: "EQUALS", value: "23.000.17883/2025" }],
    requestedFields: ["PROCESS_NUMBER"],
    requiresLiveData: true,
    needsKnowledgeSearch: false,
    confidence: 0.99,
    ambiguity: null
};
async function main() {
    const semantic = await (0, semantic_interpreter_1.interpretQuestionSemantic)("Tenho a referência 23.000.17883/2025; a qual número processual ela corresponde?", mockedFetch(modelPlan));
    strict_1.default.equal(semantic.interpretationSource, "MODEL");
    strict_1.default.equal(semantic.action, "LOOKUP_FIELD");
    strict_1.default.equal(semantic.filters[0].field, "CLIENT_CODE");
    strict_1.default.deepEqual(semantic.requestedFields, ["PROCESS_NUMBER"]);
    const unsupportedPlan = {
        ...modelPlan,
        entity: "USER",
        filters: [{ field: "CLIENT_CODE", operator: "EQUALS", value: "23.000.17883/2025" }]
    };
    const safeFallback = await (0, semantic_interpreter_1.interpretQuestionSemantic)("Faça algo não suportado", mockedFetch(unsupportedPlan));
    strict_1.default.equal(safeFallback.interpretationSource, "LOCAL");
    strict_1.default.equal(safeFallback.intent, "UNKNOWN");
    const apiFailure = await (0, semantic_interpreter_1.interpretQuestionSemantic)("Quem é o responsável?", mockedFetch({}, false));
    strict_1.default.equal(apiFailure.interpretationSource, "LOCAL");
    const wrongIdentifierPlan = {
        ...modelPlan,
        entity: "PUBLICATION",
        action: "CHECK_EXISTENCE",
        identifiers: { processNumber: "23.000.10369/2026", userName: null, numericReference: null, clientCode: null },
        filters: [{ field: "PROCESS_NUMBER", operator: "EQUALS", value: "23.000.10369/2026" }],
        requestedFields: ["ALL"]
    };
    const correctedIdentifier = await (0, semantic_interpreter_1.interpretQuestionSemantic)("Existe publicação para o código 23.000.10369/2026?", mockedFetch(wrongIdentifierPlan));
    strict_1.default.equal(correctedIdentifier.filters[0].field, "CLIENT_CODE");
    strict_1.default.equal(correctedIdentifier.identifiers.clientCode, "23.000.10369/2026");
    const wrongScreenPlan = {
        ...modelPlan,
        intent: "BUSINESS_RULE",
        entity: "DASHBOARD",
        action: "EXPLAIN_RULE",
        reference: "RN-001",
        identifiers: { processNumber: null, userName: null, numericReference: null, clientCode: null },
        filters: [],
        requestedFields: ["ALL"]
    };
    const correctedScreen = await (0, semantic_interpreter_1.interpretQuestionSemantic)("Para que serve a página inicial com os indicadores?", mockedFetch(wrongScreenPlan));
    strict_1.default.equal(correctedScreen.intent, "SCREEN_LOOKUP");
    strict_1.default.equal(correctedScreen.action, "CONSULT");
    strict_1.default.equal(correctedScreen.reference, "Home");
    const wrongExistenceAction = await (0, semantic_interpreter_1.interpretQuestionSemantic)("Tem alguma publicação ligada ao código 23.000.10369/2026?", mockedFetch({ ...wrongIdentifierPlan, action: "CHECK_STATUS", requestedFields: ["STATUS"] }));
    strict_1.default.equal(wrongExistenceAction.action, "CHECK_EXISTENCE");
    const wrongBatchScreen = await (0, semantic_interpreter_1.interpretQuestionSemantic)("Onde consulto as audiências processadas por planilha em lote?", mockedFetch({ ...wrongScreenPlan, intent: "SCREEN_LOOKUP", entity: "SCREEN", action: "CONSULT", reference: "Audiência", sourceContext: "HEARING" }));
    strict_1.default.equal(wrongBatchScreen.entity, "BATCH_HEARING");
    strict_1.default.equal(wrongBatchScreen.reference, "Audiência Mutirão");
    const negatedBatch = await (0, semantic_interpreter_1.interpretQuestionSemantic)("Quero cadastrar uma audiência comum, não é mutirão", mockedFetch({ ...wrongBatchScreen, intent: "PROCEDURE", action: "CREATE", reference: "ACTION-CREATE-BATCH-HEARING", sourceContext: "BATCH_HEARING" }));
    strict_1.default.equal(negatedBatch.entity, "HEARING");
    strict_1.default.equal(negatedBatch.reference, "ACTION-CREATE-HEARING");
    const unsupportedRule = await (0, semantic_interpreter_1.interpretQuestionSemantic)("Isso pode ser alterado?", mockedFetch({ ...wrongScreenPlan, intent: "BUSINESS_RULE", entity: "UNKNOWN", reference: null, confidence: 0.08 }));
    strict_1.default.equal(unsupportedRule.intent, "UNKNOWN");
    strict_1.default.equal(unsupportedRule.action, "UNKNOWN");
    const crossedRuleReference = await (0, semantic_interpreter_1.interpretQuestionSemantic)("Posso incluir um processo manualmente?", mockedFetch({ ...wrongScreenPlan, intent: "BUSINESS_RULE", entity: "PROCESS", action: "EXPLAIN_RULE", reference: "ACTION-CREATE-PROCESS", confidence: 0.99 }));
    strict_1.default.equal(crossedRuleReference.intent, "BUSINESS_RULE");
    strict_1.default.equal(crossedRuleReference.reference, "RN-029");
    if (previousKey === undefined)
        delete process.env.OPENAI_API_KEY;
    else
        process.env.OPENAI_API_KEY = previousKey;
    if (previousMode === undefined)
        delete process.env.QUESTION_INTERPRETER_MODE;
    else
        process.env.QUESTION_INTERPRETER_MODE = previousMode;
    console.log("Interpretação por modelo, bloqueio de plano não suportado e fallback local validados com sucesso.");
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
