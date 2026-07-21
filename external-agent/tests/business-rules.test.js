"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const business_rules_1 = require("../core/business-rules");
const answer_1 = require("../core/answer");
const screen_consultation_1 = require("../core/screen-consultation");
for (const rule of business_rules_1.businessRules) {
    const interpreted = (0, business_rules_1.interpretBusinessRule)(rule.example);
    strict_1.default.ok(interpreted, `${rule.id} não foi encontrada para: ${rule.example}`);
    strict_1.default.equal(interpreted.rule.id, rule.id, `${rule.id} foi confundida com ${interpreted.rule.id}: ${rule.example}`);
    strict_1.default.ok((0, business_rules_1.answerBusinessRule)(rule.example), `${rule.id} não produziu resposta`);
}
const variations = [
    { question: "Todo processo precisa ter um responsável?", rule: "RN-024", answerStartsWith: "Sim." },
    { question: "Um processo pode ficar sem responsável?", rule: "RN-024", answerStartsWith: "Não." },
    { question: "Se eu deletar um processo ele some da plataforma?", rule: "RN-025", answerStartsWith: "Não." },
    { question: "A publicação duplicada considera quantos dias?", rule: "RN-033" },
    { question: "Qualquer usuário consegue mudar a data fatal do prazo?", rule: "RN-045" },
    { question: "Sem data da audiência o mutirão cria prazos?", rule: "RN-091M" }
];
for (const variation of variations) {
    const interpreted = (0, business_rules_1.interpretBusinessRule)(variation.question);
    strict_1.default.ok(interpreted, `Variação não interpretada: ${variation.question}`);
    strict_1.default.equal(interpreted.rule.id, variation.rule, `Regra incorreta para: ${variation.question}`);
    if (variation.answerStartsWith) {
        strict_1.default.ok((0, business_rules_1.answerBusinessRule)(variation.question)?.startsWith(variation.answerStartsWith));
    }
}
const ambiguous = [
    "Quem é o responsável?",
    "Como funciona o processo?",
    "Qual é a data?",
    "Quero consultar uma publicação"
];
for (const question of ambiguous) {
    strict_1.default.equal((0, business_rules_1.interpretBusinessRule)(question), null, `Pergunta ambígua não deveria selecionar regra: ${question}`);
}
const automaticAttestationQuestion = "Quando cumpro um prazo, o ateste sai automático?";
strict_1.default.match((0, answer_1.gerarResposta)(automaticAttestationQuestion, []), /Não.*manualmente.*Não existe uma regra automática ativa.*projeto futuro/i, "A RN-061 deve explicar o estado atual e separar a previsão futura");
const attestationEvidence = [{
        file: "docs/telas/hml/ateste.md",
        content: "Ateste. Filtros: Status, Número do processo, Área de ateste, Tipo de ateste, Criação, Solicitação e Recebimento.",
        score: 100
    }];
strict_1.default.match((0, answer_1.gerarResposta)("Como consultar um ateste?", attestationEvidence), /Status.*Número do processo.*Área de ateste.*Tipo de ateste.*Criação.*Solicitação.*Recebimento/, "Consulta genérica de ateste deve apresentar os filtros, sem presumir Número do processo");
strict_1.default.match((0, answer_1.gerarResposta)("Como consultar um ateste pelo número do processo?", attestationEvidence), /Acesse \*\*Menu > Ateste\*\*.*Número do processo.*Editar ateste/, "Intenção de consulta deve ter prioridade sobre uma regra conceitual com termos semelhantes");
strict_1.default.match((0, answer_1.gerarResposta)("O ateste pode ser aprovado sem protocolo?", attestationEvidence), /materiais relacionados.*não comprovam/i, "Pergunta de negócio sem regra não pode cair em procedimento genérico");
for (const guide of screen_consultation_1.screenConsultationGuides) {
    const question = `Como faço para consultar ${guide.screen}?`;
    const answer = (0, answer_1.gerarResposta)(question, []);
    strict_1.default.equal(answer, guide.answer, `Consulta não resolveu a tela exata: ${guide.screen}`);
}
console.log(`${business_rules_1.businessRules.length} regras, ${variations.length} variações e a RN-061 validadas com sucesso.`);
