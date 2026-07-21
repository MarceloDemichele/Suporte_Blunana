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
    id: "ACTION-CREATE-PROCESS",
    action: "Incluir processo manualmente",
    subjects: ["processo"],
    actionTerms: ["criar", "criacao", "incluir", "inclusao", "adicionar", "cadastrar", "cadastro", "registrar"],
    intentTerms: ["como faco", "como criar", "como incluir", "passo a passo", "onde incluir", "qual o caminho", "em qual menu", "procedimento para"],
    excludedTerms: ["prazo", "audiencia", "publicacao"],
    answer: "Acesse **Menu > Processos** e clique em **Adicionar Processo**. O formulário de inclusão manual possui **Código do Cliente**, **Código Terceirização**, **Número do Processo**, **Comarca**, **Foro**, **Vara**, **Área**, **Tipo de Ação**, **Nome da Parte** e **CPF/CNPJ**. Os campos comprovadamente obrigatórios são **Código do Cliente**, **Número do Processo**, **Área** e **Tipo de Ação**. Depois de conferir os dados, utilize **Salvar**. A autorização por perfil ainda é um ponto a validar."
  },
  {
    id: "ACTION-CREATE-BATCH-HEARING",
    action: "Incluir audiência mutirão",
    subjects: ["audiencia mutirao", "mutirao", "audiencia em lote", "audiencias em lote"],
    actionTerms: ["criar", "criacao", "incluir", "inclusao", "adicionar", "cadastrar", "cadastro", "registrar", "lancar", "importar", "upload"],
    intentTerms: [
      "como faco", "como criar", "como incluir", "passo a passo", "onde incluir",
      "qual o caminho", "em qual menu", "procedimento para", "como importar"
    ],
    answer: "Acesse **Menu > Audiência Mutirão** e clique em **Upload audiência**. Selecione uma planilha nos formatos **CSV, TXT, XLS ou XLSX**. Antes de importar, confira na prévia os campos **Data da audiência**, **Hora**, **Sijur** e **Processo**, além do retorno do processamento. O botão **Importar** é habilitado depois que o arquivo é selecionado. A Audiência Mutirão é incluída por esse fluxo em lote; não utilize **Processos > Eventos Relevantes > Adicionar prazo**, que corresponde à audiência comum."
  },
  {
    id: "ACTION-CREATE-HEARING",
    action: "Incluir audiência",
    subjects: ["audiencia"],
    actionTerms: ["criar", "criacao", "incluir", "inclusao", "adicionar", "adicao", "cadastrar", "cadastro", "registrar", "registro", "lancar", "lancamento", "colocar"],
    intentTerms: [
      "como faco", "como criar", "como incluir", "passo a passo", "onde crio", "onde incluir",
      "qual o caminho", "em qual menu", "preciso criar", "quero incluir", "procedimento para"
    ],
    excludedTerms: ["mutirao", "prazo"],
    answer: "A **Audiência comum é um tipo de prazo**. Acesse **Menu > Processos**, localize o processo e clique em **Visualizar e tratar processo**. Em **Eventos Relevantes**, selecione **Adicionar prazo** e escolha o tipo de audiência. Preencha os dados obrigatórios da audiência, como **Data/hora**, **Endereço ou link**, **UF**, **Tipo**, **Processo vinculado** e **Responsável**; depois clique em **Salvar**. Esse procedimento não se aplica à **Audiência Mutirão**, que possui fluxo próprio."
  },
  {
    id: "ACTION-CREATE-DEADLINE",
    action: "Criar prazo",
    subjects: ["prazo"],
    actionTerms: ["criar", "criacao", "crio", "incluir", "inclusao", "adicionar", "adicao", "cadastrar", "cadastro", "lancar", "lancamento", "registrar", "registro", "abrir", "colocar", "inserir", "insercao"],
    intentTerms: [
      "como faco", "como criar", "como incluir", "passo a passo", "onde crio", "onde incluir",
      "qual o caminho", "qual caminho", "em qual menu", "onde posso", "me ensine", "preciso criar",
      "preciso incluir", "quero criar", "quero incluir", "procedimento para"
    ],
    excludedTerms: ["tipo de prazo"],
    answer: "Há **sete caminhos para incluir um prazo**:\n\n1. **Processos > Visualizar e tratar processo > Eventos Relevantes > Adicionar prazo** — vincula somente ao processo.\n2. **Processos > Visualizar e tratar processo > Publicação > Adicionar prazo** — vincula ao processo e à publicação.\n3. **Publicação > Editar publicação > Há prazo para publicação? > Incluir prazo** — vincula ao processo e à publicação.\n4. **Prazo > Editar prazo > Incluir prazo** — vincula somente ao processo.\n5. **Prazo > Incluir prazo** — vincula somente ao processo.\n6. **Audiência > Editar audiência > Incluir prazo** — vincula somente ao processo.\n7. **Audiência > Incluir prazo** — vincula somente ao processo.\n\nDepois, preencha **Tipo de prazo**, **Advogado responsável**, **Data do prazo**, **Data fatal** e os demais dados necessários e clique em **Salvar**."
  }
];

export function findOperationalActionGuide(question: string): OperationalActionGuide | null {
  const text = normalize(question);
  const proceduralForm = /\b(como|onde|maneira|forma|caminho|procedimento|passos?|qual menu|em qual menu)\b/.test(text) ||
    /\b(quero|preciso|gostaria)\b/.test(text);
  const normativeIntent = [
    "qualquer usuario", "quem pode", "tem permissao", "precisa de permissao", "exige permissao",
    "e permitido", "esta autorizado", "esta autorizada"
  ].some((term) => text.includes(term)) ||
    (!proceduralForm && (text.includes("posso") || text.includes("consigo")));
  if (normativeIntent) return null;

  const hasOperationalAction = (guide: OperationalActionGuide) =>
    guide.actionTerms.some((term) => text.includes(normalize(term))) ||
    /\b(?:inclu(?:o|imos|em|a|am|iria|iriam)|adicion(?:o|amos|a|am|aria|ariam)|cadastr(?:o|amos|a|am|aria|ariam)|registr(?:o|amos|a|am|aria|ariam)|cri(?:o|amos|a|am|aria|ariam))\b/.test(text);

  return operationalActionGuides.find((guide) =>
    guide.subjects.some((term) => text.includes(normalize(term))) &&
    hasOperationalAction(guide) &&
    (guide.intentTerms.some((term) => text.includes(normalize(term))) || proceduralForm) &&
    !(guide.excludedTerms || []).some((term) => text.includes(normalize(term)))
  ) || null;
}

export function answerOperationalAction(question: string, reference?: string): string | null {
  const guide = reference ? operationalActionGuides.find((item) => item.id === reference) || null : findOperationalActionGuide(question);
  if (!guide) return null;
  if (guide.id !== "ACTION-CREATE-DEADLINE") return guide.answer;

  const text = normalize(question);
  if (text.includes("publicacao")) {
    return "Para incluir um prazo a partir de uma publicação, use **Processos > Visualizar e tratar processo > Publicação > Adicionar prazo** ou **Publicação > Editar publicação > Há prazo para publicação? > Incluir prazo**. Nos dois caminhos, o prazo fica automaticamente vinculado ao **processo e à publicação**.";
  }
  if (text.includes("audiencia")) {
    return "A partir de Audiência, use **Audiência > Editar audiência > Incluir prazo** ou **Audiência > Incluir prazo**. Nos dois caminhos, o prazo fica automaticamente vinculado **somente ao processo**.";
  }
  if (["tela de prazo", "menu prazo", "editar prazo", "pelo prazo", "na tela prazo"].some((term) => text.includes(term))) {
    return "Na tela de Prazo, use **Prazo > Editar prazo > Incluir prazo** ou **Prazo > Incluir prazo**. Nos dois caminhos, o novo prazo fica automaticamente vinculado **somente ao processo**.";
  }
  if (text.includes("processo")) {
    return "No detalhe do processo, use **Processos > Visualizar e tratar processo > Eventos Relevantes > Adicionar prazo**, que vincula o prazo somente ao processo, ou **Processos > Visualizar e tratar processo > Publicação > Adicionar prazo**, que o vincula ao processo e à publicação.";
  }
  return guide.answer;
}
