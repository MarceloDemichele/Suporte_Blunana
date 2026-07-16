import assert from "node:assert/strict";
import { businessRules } from "../core/business-rules";
import { decideAnswerRoute, AnswerRoute } from "../core/question-router";
import { screenConsultationGuides } from "../core/screen-consultation";
import { gerarResposta } from "../core/answer";

type BatteryCase = {
  category: string;
  question: string;
  expectedRoute: AnswerRoute;
  expectedReference?: string;
  answerPattern?: RegExp;
};

const cases: BatteryCase[] = [];

for (const rule of businessRules) {
  cases.push({ category: "regra-canônica", question: rule.example, expectedRoute: "BUSINESS_RULE", expectedReference: rule.id });
  cases.push({ category: "regra-contextualizada", question: `Tenho uma dúvida de negócio: ${rule.example}`, expectedRoute: "BUSINESS_RULE", expectedReference: rule.id });
}

for (const guide of screenConsultationGuides) {
  cases.push({ category: "consulta-como", question: `Como faço para consultar ${guide.screen}?`, expectedRoute: "SCREEN_CONSULTATION", expectedReference: guide.screen });
  cases.push({ category: "consulta-onde", question: `Onde vejo ${guide.screen}?`, expectedRoute: "SCREEN_CONSULTATION", expectedReference: guide.screen });
  cases.push({ category: "consulta-pesquisa", question: `Quero pesquisar dados em ${guide.screen}.`, expectedRoute: "SCREEN_CONSULTATION", expectedReference: guide.screen });
}

cases.push(
  { category: "procedimento", question: "Como faço para criar um prazo?", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-DEADLINE", answerPattern: /Processos.*Eventos Relevantes.*Adicionar prazo.*Salvar/i },
  { category: "procedimento", question: "Como criar um prazo para um processo?", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-DEADLINE" },
  { category: "procedimento", question: "Onde crio um prazo?", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-DEADLINE" },
  { category: "procedimento", question: "Preciso do passo a passo para adicionar prazo", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-DEADLINE" }
);

const liveQuestions = [
  "Me detalhe o perfil de acesso da usuária - Anna Carolina Araújo Corrêa?",
  "Quais são as permissões do usuário - João da Silva?",
  "Quais acessos da usuária - Maria de Souza?",
  "Qual é o status atual do processo 50003819420254036120?",
  "Quem é o responsável atual pelo processo 30201065020258190001?",
  "O usuário Carlos Pereira está cadastrado neste momento?",
  "Qual é o valor atual do ateste 12345678?",
  "A usuária Fernanda Alves está cadastrada?"
];
for (const question of liveQuestions) {
  cases.push({ category: "plataforma-dinâmica", question, expectedRoute: "LIVE_PLATFORM", answerPattern: /consulta atual na plataforma.*consulta manual/i });
}

const unknownQuestions = [
  "Quem é o responsável?",
  "Qual é a data?",
  "Isso pode ser feito?",
  "Explique melhor.",
  "Qual registro devo usar?",
  "O sistema aceita isso?",
  "Quem aprovou?",
  "Qual é o valor?",
  "Pode me ajudar?",
  "O que aconteceu?"
];
for (const question of unknownQuestions) {
  cases.push({ category: "ambígua", question, expectedRoute: "UNKNOWN" });
}

for (const testCase of cases) {
  const decision = decideAnswerRoute(testCase.question);
  assert.equal(decision.route, testCase.expectedRoute, `[${testCase.category}] rota incorreta: ${testCase.question}`);
  if (testCase.expectedReference) {
    assert.equal(decision.reference, testCase.expectedReference, `[${testCase.category}] referência incorreta: ${testCase.question}`);
  }
  if (testCase.answerPattern) {
    assert.match(gerarResposta(testCase.question, []), testCase.answerPattern, `[${testCase.category}] resposta incorreta: ${testCase.question}`);
  }
}

const totals = cases.reduce<Record<string, number>>((acc, item) => {
  acc[item.category] = (acc[item.category] || 0) + 1;
  return acc;
}, {});

console.log(`${cases.length} perguntas validadas.`);
console.log(JSON.stringify(totals, null, 2));
