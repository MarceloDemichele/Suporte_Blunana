export type OperationalActionGuide = {
  id: string;
  action: string;
  subjects: string[];
  actionTerms: string[];
  intentTerms: string[];
  excludedTerms?: string[];
  answer: string;
};

function normalize(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

export const operationalActionGuides: OperationalActionGuide[] = [
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

export function findOperationalActionGuide(question: string): OperationalActionGuide | null {
  const text = normalize(question);
  return operationalActionGuides.find((guide) =>
    guide.subjects.some((term) => text.includes(normalize(term))) &&
    guide.actionTerms.some((term) => text.includes(normalize(term))) &&
    guide.intentTerms.some((term) => text.includes(normalize(term))) &&
    !(guide.excludedTerms || []).some((term) => text.includes(normalize(term)))
  ) || null;
}

export function answerOperationalAction(question: string): string | null {
  return findOperationalActionGuide(question)?.answer || null;
}
