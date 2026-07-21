import assert from "node:assert/strict";
import { interpretQuestionSemantic } from "../core/semantic-interpreter";

const previousKey = process.env.OPENAI_API_KEY;
const previousMode = process.env.QUESTION_INTERPRETER_MODE;
process.env.OPENAI_API_KEY = "test-key-not-sent";
process.env.QUESTION_INTERPRETER_MODE = "hybrid";

function mockedFetch(payload: unknown, ok = true): typeof fetch {
  return (async () => new Response(JSON.stringify({
    output: [{ content: [{ text: JSON.stringify(payload) }] }]
  }), { status: ok ? 200 : 500, headers: { "Content-Type": "application/json" } })) as typeof fetch;
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
const semantic = await interpretQuestionSemantic(
  "Tenho a referência 23.000.17883/2025; a qual número processual ela corresponde?",
  mockedFetch(modelPlan)
);
assert.equal(semantic.interpretationSource, "MODEL");
assert.equal(semantic.action, "LOOKUP_FIELD");
assert.equal(semantic.filters[0].field, "CLIENT_CODE");
assert.deepEqual(semantic.requestedFields, ["PROCESS_NUMBER"]);

const unsupportedPlan = {
  ...modelPlan,
  entity: "USER",
  filters: [{ field: "CLIENT_CODE", operator: "EQUALS", value: "23.000.17883/2025" }]
};
const safeFallback = await interpretQuestionSemantic("Faça algo não suportado", mockedFetch(unsupportedPlan));
assert.equal(safeFallback.interpretationSource, "LOCAL");
assert.equal(safeFallback.intent, "UNKNOWN");

const apiFailure = await interpretQuestionSemantic("Quem é o responsável?", mockedFetch({}, false));
assert.equal(apiFailure.interpretationSource, "LOCAL");

const wrongIdentifierPlan = {
  ...modelPlan,
  entity: "PUBLICATION",
  action: "CHECK_EXISTENCE",
  identifiers: { processNumber: "23.000.10369/2026", userName: null, numericReference: null, clientCode: null },
  filters: [{ field: "PROCESS_NUMBER", operator: "EQUALS", value: "23.000.10369/2026" }],
  requestedFields: ["ALL"]
};
const correctedIdentifier = await interpretQuestionSemantic(
  "Existe publicação para o código 23.000.10369/2026?",
  mockedFetch(wrongIdentifierPlan)
);
assert.equal(correctedIdentifier.filters[0].field, "CLIENT_CODE");
assert.equal(correctedIdentifier.identifiers.clientCode, "23.000.10369/2026");

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
const correctedScreen = await interpretQuestionSemantic(
  "Para que serve a página inicial com os indicadores?",
  mockedFetch(wrongScreenPlan)
);
assert.equal(correctedScreen.intent, "SCREEN_LOOKUP");
assert.equal(correctedScreen.action, "CONSULT");
assert.equal(correctedScreen.reference, "Home");

const wrongExistenceAction = await interpretQuestionSemantic(
  "Tem alguma publicação ligada ao código 23.000.10369/2026?",
  mockedFetch({ ...wrongIdentifierPlan, action: "CHECK_STATUS", requestedFields: ["STATUS"] })
);
assert.equal(wrongExistenceAction.action, "CHECK_EXISTENCE");

const wrongBatchScreen = await interpretQuestionSemantic(
  "Onde consulto as audiências processadas por planilha em lote?",
  mockedFetch({ ...wrongScreenPlan, intent: "SCREEN_LOOKUP", entity: "SCREEN", action: "CONSULT", reference: "Audiência", sourceContext: "HEARING" })
);
assert.equal(wrongBatchScreen.entity, "BATCH_HEARING");
assert.equal(wrongBatchScreen.reference, "Audiência Mutirão");

const negatedBatch = await interpretQuestionSemantic(
  "Quero cadastrar uma audiência comum, não é mutirão",
  mockedFetch({ ...wrongBatchScreen, intent: "PROCEDURE", action: "CREATE", reference: "ACTION-CREATE-BATCH-HEARING", sourceContext: "BATCH_HEARING" })
);
assert.equal(negatedBatch.entity, "HEARING");
assert.equal(negatedBatch.reference, "ACTION-CREATE-HEARING");

const unsupportedRule = await interpretQuestionSemantic(
  "Isso pode ser alterado?",
  mockedFetch({ ...wrongScreenPlan, intent: "BUSINESS_RULE", entity: "UNKNOWN", reference: null, confidence: 0.08 })
);
assert.equal(unsupportedRule.intent, "UNKNOWN");
assert.equal(unsupportedRule.action, "UNKNOWN");

const crossedRuleReference = await interpretQuestionSemantic(
  "Posso incluir um processo manualmente?",
  mockedFetch({ ...wrongScreenPlan, intent: "BUSINESS_RULE", entity: "PROCESS", action: "EXPLAIN_RULE", reference: "ACTION-CREATE-PROCESS", confidence: 0.99 })
);
assert.equal(crossedRuleReference.intent, "BUSINESS_RULE");
assert.equal(crossedRuleReference.reference, "RN-029");

if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
else process.env.OPENAI_API_KEY = previousKey;
if (previousMode === undefined) delete process.env.QUESTION_INTERPRETER_MODE;
else process.env.QUESTION_INTERPRETER_MODE = previousMode;

console.log("Interpretação por modelo, bloqueio de plano não suportado e fallback local validados com sucesso.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
