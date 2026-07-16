"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const business_rules_1 = require("../core/business-rules");
const question_router_1 = require("../core/question-router");
const screen_consultation_1 = require("../core/screen-consultation");
const answer_1 = require("../core/answer");
const cases = [];
for (const rule of business_rules_1.businessRules) {
    cases.push({ category: "regra-canônica", question: rule.example, expectedRoute: "BUSINESS_RULE", expectedReference: rule.id });
    cases.push({ category: "regra-contextualizada", question: `Tenho uma dúvida de negócio: ${rule.example}`, expectedRoute: "BUSINESS_RULE", expectedReference: rule.id });
}
for (const guide of screen_consultation_1.screenConsultationGuides) {
    cases.push({ category: "consulta-como", question: `Como faço para consultar ${guide.screen}?`, expectedRoute: "SCREEN_CONSULTATION", expectedReference: guide.screen });
    cases.push({ category: "consulta-onde", question: `Onde vejo ${guide.screen}?`, expectedRoute: "SCREEN_CONSULTATION", expectedReference: guide.screen });
    cases.push({ category: "consulta-pesquisa", question: `Quero pesquisar dados em ${guide.screen}.`, expectedRoute: "SCREEN_CONSULTATION", expectedReference: guide.screen });
}
cases.push({ category: "procedimento", question: "Como faço para criar um prazo?", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-DEADLINE", answerPattern: /Processos.*Eventos Relevantes.*Adicionar prazo.*Salvar/i }, { category: "procedimento", question: "Como criar um prazo para um processo?", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-DEADLINE" }, { category: "procedimento", question: "Onde crio um prazo?", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-DEADLINE" }, { category: "procedimento", question: "Preciso do passo a passo para adicionar prazo", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-DEADLINE" });
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
    const decision = (0, question_router_1.decideAnswerRoute)(testCase.question);
    strict_1.default.equal(decision.route, testCase.expectedRoute, `[${testCase.category}] rota incorreta: ${testCase.question}`);
    if (testCase.expectedReference) {
        strict_1.default.equal(decision.reference, testCase.expectedReference, `[${testCase.category}] referência incorreta: ${testCase.question}`);
    }
    if (testCase.answerPattern) {
        strict_1.default.match((0, answer_1.gerarResposta)(testCase.question, []), testCase.answerPattern, `[${testCase.category}] resposta incorreta: ${testCase.question}`);
    }
}
const totals = cases.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
}, {});
console.log(`${cases.length} perguntas validadas.`);
console.log(JSON.stringify(totals, null, 2));
