"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationalActionGuides = void 0;
exports.findOperationalActionGuide = findOperationalActionGuide;
exports.answerOperationalAction = answerOperationalAction;
function normalize(value) {
    return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
exports.operationalActionGuides = [
    {
        id: "ACTION-CREATE-DEADLINE",
        action: "Criar prazo",
        subjects: ["prazo"],
        actionTerms: ["criar", "crio", "incluir", "adicionar", "cadastrar", "cadastro"],
        intentTerms: ["como faco", "como criar", "como incluir", "passo a passo", "onde crio", "onde incluir"],
        excludedTerms: ["tipo de prazo"],
        answer: "Acesse **Menu > Processos**, localize o processo pelos filtros e clique em **Visualizar e tratar processo**. Em **Eventos Relevantes**, selecione **Adicionar prazo**. Preencha **Tipo de prazo**, **Advogado responsável**, **Data do prazo**, **Data fatal** e os demais dados necessários; depois clique em **Salvar**. Qualquer usuário pode incluir um prazo, mas Data fatal e Descrição possuem restrições específicas para alteração posterior. Se o prazo nascer de uma publicação, utilize **Criar prazo** na própria publicação para manter o vínculo com ela."
    }
];
function findOperationalActionGuide(question) {
    const text = normalize(question);
    return exports.operationalActionGuides.find((guide) => guide.subjects.some((term) => text.includes(normalize(term))) &&
        guide.actionTerms.some((term) => text.includes(normalize(term))) &&
        guide.intentTerms.some((term) => text.includes(normalize(term))) &&
        !(guide.excludedTerms || []).some((term) => text.includes(normalize(term)))) || null;
}
function answerOperationalAction(question) {
    return findOperationalActionGuide(question)?.answer || null;
}
