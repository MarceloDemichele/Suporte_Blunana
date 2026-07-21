import assert from "node:assert/strict";
import { answerBusinessRule, businessRules, interpretBusinessRule } from "../core/business-rules";
import { gerarResposta } from "../core/answer";
import { screenConsultationGuides } from "../core/screen-consultation";

for (const rule of businessRules) {
  const interpreted = interpretBusinessRule(rule.example);
  assert.ok(interpreted, `${rule.id} não foi encontrada para: ${rule.example}`);
  assert.equal(interpreted.rule.id, rule.id, `${rule.id} foi confundida com ${interpreted.rule.id}: ${rule.example}`);
  assert.ok(answerBusinessRule(rule.example), `${rule.id} não produziu resposta`);
}

const variations: Array<{ question: string; rule: string; answerStartsWith?: string }> = [
  { question: "Todo processo precisa ter um responsável?", rule: "RN-024", answerStartsWith: "Sim." },
  { question: "Um processo pode ficar sem responsável?", rule: "RN-024", answerStartsWith: "Não." },
  { question: "Se eu deletar um processo ele some da plataforma?", rule: "RN-025", answerStartsWith: "Não." },
  { question: "A publicação duplicada considera quantos dias?", rule: "RN-033" },
  { question: "Qualquer usuário consegue mudar a data fatal do prazo?", rule: "RN-045" },
  { question: "Sem data da audiência o mutirão cria prazos?", rule: "RN-091M" }
];

for (const variation of variations) {
  const interpreted = interpretBusinessRule(variation.question);
  assert.ok(interpreted, `Variação não interpretada: ${variation.question}`);
  assert.equal(interpreted.rule.id, variation.rule, `Regra incorreta para: ${variation.question}`);
  if (variation.answerStartsWith) {
    assert.ok(answerBusinessRule(variation.question)?.startsWith(variation.answerStartsWith));
  }
}

const ambiguous = [
  "Quem é o responsável?",
  "Como funciona o processo?",
  "Qual é a data?",
  "Quero consultar uma publicação"
];

for (const question of ambiguous) {
  assert.equal(interpretBusinessRule(question), null, `Pergunta ambígua não deveria selecionar regra: ${question}`);
}

const automaticAttestationQuestion = "Quando cumpro um prazo, o ateste sai automático?";
assert.match(
  gerarResposta(automaticAttestationQuestion, []),
  /Não.*manualmente.*Não existe uma regra automática ativa.*projeto futuro/i,
  "A RN-061 deve explicar o estado atual e separar a previsão futura"
);

const attestationEvidence = [{
  file: "docs/telas/hml/ateste.md",
  content: "Ateste. Filtros: Status, Número do processo, Área de ateste, Tipo de ateste, Criação, Solicitação e Recebimento.",
  score: 100
}];
assert.match(
  gerarResposta("Como consultar um ateste?", attestationEvidence),
  /Status.*Número do processo.*Área de ateste.*Tipo de ateste.*Criação.*Solicitação.*Recebimento/,
  "Consulta genérica de ateste deve apresentar os filtros, sem presumir Número do processo"
);
assert.match(
  gerarResposta("Como consultar um ateste pelo número do processo?", attestationEvidence),
  /Acesse \*\*Menu > Ateste\*\*.*Número do processo.*Editar ateste/,
  "Intenção de consulta deve ter prioridade sobre uma regra conceitual com termos semelhantes"
);
assert.match(
  gerarResposta("O ateste pode ser aprovado sem protocolo?", attestationEvidence),
  /materiais relacionados.*não comprovam/i,
  "Pergunta de negócio sem regra não pode cair em procedimento genérico"
);

for (const guide of screenConsultationGuides) {
  const question = `Como faço para consultar ${guide.screen}?`;
  const answer = gerarResposta(question, []);
  assert.equal(answer, guide.answer, `Consulta não resolveu a tela exata: ${guide.screen}`);
}

console.log(`${businessRules.length} regras, ${variations.length} variações e a RN-061 validadas com sucesso.`);
