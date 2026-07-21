import assert from "node:assert/strict";
import { interpretQuestion } from "../core/question-interpreter";
import { decideAnswerRoute } from "../core/question-router";

const cases = [
  { question: "O processo 10104920320258260020 esta na base?", intent: "CURRENT_DATA", entity: "PROCESS", action: "CHECK_EXISTENCE", live: true, search: false },
  { question: "Qual o perfil do usuária - Marcelo Demichele?", intent: "CURRENT_DATA", entity: "USER", action: "CHECK_PERMISSIONS", live: true, search: false },
  { question: "Como faço uma inclusão de um prazo?", intent: "PROCEDURE", entity: "DEADLINE", action: "CREATE", live: false, search: true },
  { question: "Como incluir prazo por uma publicação?", intent: "PROCEDURE", entity: "PUBLICATION", action: "CREATE", live: false, search: true, source: "PUBLICATION" },
  { question: "Como faço uma inclusão de audiencia?", intent: "PROCEDURE", entity: "HEARING", action: "CREATE", live: false, search: true, source: "HEARING" },
  { question: "Como consultar a Audiência Mutirão?", intent: "SCREEN_LOOKUP", entity: "BATCH_HEARING", action: "CONSULT", live: false, search: true, source: "BATCH_HEARING" },
  { question: "Qualquer usuário pode criar um prazo?", intent: "BUSINESS_RULE", entity: "DEADLINE", action: "EXPLAIN_RULE", live: false, search: true },
  { question: "Quem é o responsável?", intent: "UNKNOWN", entity: "UNKNOWN", action: "UNKNOWN", live: false, search: false }
] as const;

for (const expected of cases) {
  const interpretation = interpretQuestion(expected.question);
  assert.equal(interpretation.intent, expected.intent, `intenção incorreta: ${expected.question}`);
  assert.equal(interpretation.entity, expected.entity, `entidade incorreta: ${expected.question}`);
  assert.equal(interpretation.action, expected.action, `ação incorreta: ${expected.question}`);
  assert.equal(interpretation.requiresLiveData, expected.live, `decisão de dado atual incorreta: ${expected.question}`);
  assert.equal(interpretation.needsKnowledgeSearch, expected.search, `decisão de busca documental incorreta: ${expected.question}`);
  if ("source" in expected) assert.equal(interpretation.sourceContext, expected.source);
  assert.equal(decideAnswerRoute(expected.question, interpretation).route === "UNKNOWN", expected.intent === "UNKNOWN");
}

const process = interpretQuestion("O processo 10104920320258260020 consta no sistema?");
assert.equal(process.identifiers.processNumber, "10104920320258260020");

const user = interpretQuestion("Quais permissões de Anna Carolina Araújo Corrêa?");
assert.equal(user.identifiers.userName, "Anna Carolina Araújo Corrêa");

const reverseLookup = interpretQuestion("Qual o numero do processo que possui o codigo do cliente = 23.000.17883/2025?");
assert.equal(reverseLookup.intent, "CURRENT_DATA");
assert.equal(reverseLookup.action, "LOOKUP_FIELD");
assert.equal(reverseLookup.identifiers.clientCode, "23.000.17883/2025");
assert.deepEqual(reverseLookup.requestedFields, ["PROCESS_NUMBER"]);
assert.deepEqual(reverseLookup.filters, [{ field: "CLIENT_CODE", operator: "EQUALS", value: "23.000.17883/2025" }]);

const publicationByClient = interpretQuestion("Existe publicação para o codigo de cliente = 23.000.10369/2026?");
assert.equal(publicationByClient.intent, "CURRENT_DATA");
assert.equal(publicationByClient.entity, "PUBLICATION");
assert.equal(publicationByClient.action, "CHECK_EXISTENCE");
assert.equal(publicationByClient.identifiers.clientCode, "23.000.10369/2026");

console.log(`${cases.length} interpretações estruturadas, 2 extrações e 2 consultas por Código do cliente validadas com sucesso.`);
