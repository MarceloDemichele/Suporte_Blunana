"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const answer_1 = require("../core/answer");
const playwright_provider_1 = require("../providers/playwright.provider");
const plans = [
    { question: "Me detalhe o perfil de acesso da usuária - Anna Carolina Araújo Corrêa?", target: "user", value: "Anna Carolina Araújo Corrêa" },
    { question: "Qual o status atual do processo 50003819420254036120?", target: "process", value: "50003819420254036120" },
    { question: "Qual o status atual da publicação do processo 50003819420254036120?", target: "publication", value: "50003819420254036120" },
    { question: "Qual o responsável atual do prazo do processo 50003819420254036120?", target: "deadline", value: "50003819420254036120" },
    { question: "Qual o status atual da audiência do processo 50003819420254036120?", target: "hearing", value: "50003819420254036120" },
    { question: "Qual o valor atual do ateste do processo 50003819420254036120?", target: "attestation", value: "50003819420254036120" }
];
for (const expected of plans) {
    const plan = (0, playwright_provider_1.planDirectedQuery)(expected.question);
    strict_1.default.ok(plan, `Plano não criado: ${expected.question}`);
    strict_1.default.equal(plan.target, expected.target);
    strict_1.default.equal(plan.value, expected.value);
}
const evidence = {
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
const answer = (0, answer_1.gerarResposta)("Me detalhe o perfil de acesso da usuária - Usuária de Teste?", [], { evidence });
strict_1.default.match(answer, /Papel.*Estagiário.*Status.*Ativo.*Cliente.*CEF/);
strict_1.default.match(answer, /Concluir prazo.*não.*Alteração.*sim.*Nenhuma alteração foi realizada/);
strict_1.default.doesNotMatch(answer, /teste@example\.invalid/, "A resposta não deve expor e-mail do perfil consultado");
console.log("6 planos direcionados e 1 resposta sanitizada validados com sucesso.");
