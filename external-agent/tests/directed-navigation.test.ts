import assert from "node:assert/strict";
import { gerarResposta } from "../core/answer";
import { DirectedEvidence, planDirectedQuery } from "../providers/playwright.provider";

const plans = [
  { question: "Me detalhe o perfil de acesso da usuária - Anna Carolina Araújo Corrêa?", target: "user", value: "Anna Carolina Araújo Corrêa" },
  { question: "Qual o status atual do processo 50003819420254036120?", target: "process", value: "50003819420254036120" },
  { question: "Qual o status atual da publicação do processo 50003819420254036120?", target: "publication", value: "50003819420254036120" },
  { question: "Qual o responsável atual do prazo do processo 50003819420254036120?", target: "deadline", value: "50003819420254036120" },
  { question: "Qual o status atual da audiência do processo 50003819420254036120?", target: "hearing", value: "50003819420254036120" },
  { question: "Qual o valor atual do ateste do processo 50003819420254036120?", target: "attestation", value: "50003819420254036120" }
] as const;

const paraphrasedPlans = [
  { question: "Quais permissões de Anna Carolina Araújo Corrêa?", target: "user", value: "Anna Carolina Araújo Corrêa" },
  { question: "Quais acessos de Maria de Souza?", target: "user", value: "Maria de Souza" },
  { question: "Como está o processo 50003819420254036120?", target: "process", value: "50003819420254036120" }
  ,{ question: "Qual o perfil do usuária - Marcelo Demichele?", target: "user", value: "Marcelo Demichele" }
  ,{ question: "O processo 10104920320258260020 esta na base?", target: "process", value: "10104920320258260020" }
  ,{ question: "Qual o numero do processo que possui o codigo do cliente = 23.000.17883/2025?", target: "process", value: "23.000.17883/2025" }
  ,{ question: "Existe publicação para o codigo de cliente = 23.000.10369/2026?", target: "publication", value: "23.000.10369/2026" }
] as const;

for (const expected of plans) {
  const plan = planDirectedQuery(expected.question);
  assert.ok(plan, `Plano não criado: ${expected.question}`);
  assert.equal(plan.target, expected.target);
  assert.equal(plan.value, expected.value);
}

for (const expected of paraphrasedPlans) {
  const plan = planDirectedQuery(expected.question);
  assert.ok(plan, `Plano não criado para paráfrase: ${expected.question}`);
  assert.equal(plan.target, expected.target);
  assert.equal(plan.value, expected.value);
}

const evidence: DirectedEvidence = {
  kind: "directed-query",
  target: "user",
  query: "Usuária de Teste",
  route: "https://example.invalid/configuracao_usuario",
  found: true,
  count: 1,
  columns: ["Papel", "Status", "Nome", "Email", "Celular", "Ações"],
  rows: [["Estagiário", "Ativo", "Usuária de Teste", "teste@example.invalid", "", ""]],
  details: { Papel: "Estagiário", Cliente: "CEF" },
  permissions: { "Concluir prazo": false, "Excluir registro": false, "Alteração": true, "Visualizar estrutura": true },
  source: "playwright-prod",
  readOnly: true,
  capturedAt: new Date().toISOString(),
  limitations: []
};

const answer = gerarResposta("Me detalhe o perfil de acesso da usuária - Usuária de Teste?", [], { evidence });
assert.match(answer, /Papel.*Estagiário.*Status.*Ativo.*Cliente.*CEF/);
assert.match(answer, /Concluir prazo.*não.*Alteração.*sim.*Nenhuma alteração foi realizada/);
assert.doesNotMatch(answer, /teste@example\.invalid/, "A resposta não deve expor e-mail do perfil consultado");

const emptyPublicationEvidence: DirectedEvidence = {
  kind: "directed-query",
  target: "publication",
  query: "23.000.10369/2026",
  route: "https://example.invalid/publicacoes",
  found: false,
  count: 0,
  columns: ["Status"],
  rows: [],
  source: "playwright-prod",
  readOnly: true,
  capturedAt: new Date().toISOString(),
  limitations: []
};
assert.match(
  gerarResposta("Existe publicação para o codigo de cliente = 23.000.10369/2026?", [], { evidence: emptyPublicationEvidence }),
  /Não foi localizado nenhum registro.*23\.000\.10369\/2026.*PROD.*Nenhuma alteração/i
);

console.log(`${plans.length + paraphrasedPlans.length} planos direcionados e 1 resposta sanitizada validados com sucesso.`);
