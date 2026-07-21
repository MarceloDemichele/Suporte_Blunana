"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const question_interpreter_1 = require("../core/question-interpreter");
const question_router_1 = require("../core/question-router");
const cases = [
    { question: "O processo 10104920320258260020 esta na base?", intent: "CURRENT_DATA", entity: "PROCESS", action: "CHECK_EXISTENCE", live: true, search: false },
    { question: "Qual o perfil do usuária - Marcelo Demichele?", intent: "CURRENT_DATA", entity: "USER", action: "CHECK_PERMISSIONS", live: true, search: false },
    { question: "Como faço uma inclusão de um prazo?", intent: "PROCEDURE", entity: "DEADLINE", action: "CREATE", live: false, search: true },
    { question: "Como incluir prazo por uma publicação?", intent: "PROCEDURE", entity: "PUBLICATION", action: "CREATE", live: false, search: true, source: "PUBLICATION" },
    { question: "Como faço uma inclusão de audiencia?", intent: "PROCEDURE", entity: "HEARING", action: "CREATE", live: false, search: true, source: "HEARING" },
    { question: "Como consultar a Audiência Mutirão?", intent: "SCREEN_LOOKUP", entity: "BATCH_HEARING", action: "CONSULT", live: false, search: true, source: "BATCH_HEARING" },
    { question: "Qualquer usuário pode criar um prazo?", intent: "BUSINESS_RULE", entity: "DEADLINE", action: "EXPLAIN_RULE", live: false, search: true },
    { question: "Quem é o responsável?", intent: "UNKNOWN", entity: "UNKNOWN", action: "UNKNOWN", live: false, search: false }
];
for (const expected of cases) {
    const interpretation = (0, question_interpreter_1.interpretQuestion)(expected.question);
    strict_1.default.equal(interpretation.intent, expected.intent, `intenção incorreta: ${expected.question}`);
    strict_1.default.equal(interpretation.entity, expected.entity, `entidade incorreta: ${expected.question}`);
    strict_1.default.equal(interpretation.action, expected.action, `ação incorreta: ${expected.question}`);
    strict_1.default.equal(interpretation.requiresLiveData, expected.live, `decisão de dado atual incorreta: ${expected.question}`);
    strict_1.default.equal(interpretation.needsKnowledgeSearch, expected.search, `decisão de busca documental incorreta: ${expected.question}`);
    if ("source" in expected)
        strict_1.default.equal(interpretation.sourceContext, expected.source);
    strict_1.default.equal((0, question_router_1.decideAnswerRoute)(expected.question, interpretation).route === "UNKNOWN", expected.intent === "UNKNOWN");
}
const process = (0, question_interpreter_1.interpretQuestion)("O processo 10104920320258260020 consta no sistema?");
strict_1.default.equal(process.identifiers.processNumber, "10104920320258260020");
const user = (0, question_interpreter_1.interpretQuestion)("Quais permissões de Anna Carolina Araújo Corrêa?");
strict_1.default.equal(user.identifiers.userName, "Anna Carolina Araújo Corrêa");
const reverseLookup = (0, question_interpreter_1.interpretQuestion)("Qual o numero do processo que possui o codigo do cliente = 23.000.17883/2025?");
strict_1.default.equal(reverseLookup.intent, "CURRENT_DATA");
strict_1.default.equal(reverseLookup.action, "LOOKUP_FIELD");
strict_1.default.equal(reverseLookup.identifiers.clientCode, "23.000.17883/2025");
strict_1.default.deepEqual(reverseLookup.requestedFields, ["PROCESS_NUMBER"]);
strict_1.default.deepEqual(reverseLookup.filters, [{ field: "CLIENT_CODE", operator: "EQUALS", value: "23.000.17883/2025" }]);
const publicationByClient = (0, question_interpreter_1.interpretQuestion)("Existe publicação para o codigo de cliente = 23.000.10369/2026?");
strict_1.default.equal(publicationByClient.intent, "CURRENT_DATA");
strict_1.default.equal(publicationByClient.entity, "PUBLICATION");
strict_1.default.equal(publicationByClient.action, "CHECK_EXISTENCE");
strict_1.default.equal(publicationByClient.identifiers.clientCode, "23.000.10369/2026");
console.log(`${cases.length} interpretações estruturadas, 2 extrações e 2 consultas por Código do cliente validadas com sucesso.`);
