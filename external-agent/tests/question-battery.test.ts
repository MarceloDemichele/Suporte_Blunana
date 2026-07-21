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
  cases.push({ category: "consulta-paráfrase", question: `Em qual menu encontro ${guide.screen}?`, expectedRoute: "SCREEN_CONSULTATION", expectedReference: guide.screen });
  cases.push({ category: "consulta-paráfrase", question: `Qual o caminho para listar ${guide.screen}?`, expectedRoute: "SCREEN_CONSULTATION", expectedReference: guide.screen });
  cases.push({ category: "descrição-tela", question: `O que é demonstrado na tela de ${guide.screen}?`, expectedRoute: "SCREEN_CONSULTATION", expectedReference: guide.screen });
  cases.push({ category: "descrição-tela", question: `Quais informações aparecem em ${guide.screen}?`, expectedRoute: "SCREEN_CONSULTATION", expectedReference: guide.screen });
  cases.push({ category: "descrição-tela", question: `Me explique a tela ${guide.screen}.`, expectedRoute: "SCREEN_CONSULTATION", expectedReference: guide.screen });
  cases.push({ category: "descrição-tela", question: `Para que serve ${guide.screen}?`, expectedRoute: "SCREEN_CONSULTATION", expectedReference: guide.screen });
}

cases.push(
  { category: "procedimento", question: "Como faço para criar um prazo?", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-DEADLINE", answerPattern: /sete caminhos.*Eventos Relevantes.*Publicação.*Há prazo para publicação.*Editar prazo.*Editar audiência.*Salvar/is },
  { category: "procedimento", question: "Como criar um prazo para um processo?", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-DEADLINE" },
  { category: "procedimento", question: "Onde crio um prazo?", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-DEADLINE" },
  { category: "procedimento", question: "Preciso do passo a passo para adicionar prazo", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-DEADLINE" }
  ,{ category: "procedimento-paráfrase", question: "Qual o caminho para lançar um prazo?", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-DEADLINE" }
  ,{ category: "procedimento-paráfrase", question: "Em qual menu posso registrar um prazo?", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-DEADLINE" }
  ,{ category: "procedimento-paráfrase", question: "Quero abrir um prazo; me ensine o procedimento", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-DEADLINE" }
  ,{ category: "procedimento-paráfrase", question: "Como faço uma inclusão de um prazo?", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-DEADLINE" }
  ,{ category: "procedimento-paráfrase", question: "Qual é o procedimento para o cadastro de prazo?", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-DEADLINE" }
  ,{ category: "procedimento-paráfrase", question: "De que forma registro um novo prazo?", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-DEADLINE" }
  ,{ category: "procedimento-paráfrase", question: "Preciso inserir um prazo no sistema", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-DEADLINE" }
  ,{ category: "procedimento-paráfrase", question: "Onde faço o lançamento de prazo?", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-DEADLINE" }
  ,{ category: "procedimento-paráfrase", question: "Gostaria de colocar um prazo no processo", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-DEADLINE" }
  ,{ category: "procedimento-audiência", question: "Como faço uma inclusão de audiencia?", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-HEARING", answerPattern: /Audiência comum é um tipo de prazo.*Processos.*Eventos Relevantes.*Adicionar prazo.*não se aplica.*Audiência Mutirão/is }
  ,{ category: "procedimento-audiência", question: "Qual o caminho para criar uma audiência?", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-HEARING" }
  ,{ category: "procedimento-audiência", question: "Como incluo uma audiencia?", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-HEARING", answerPattern: /Audiência comum é um tipo de prazo.*Eventos Relevantes.*Adicionar prazo/is }
  ,{ category: "procedimento-audiência", question: "Onde cadastramos uma audiência?", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-HEARING" }
  ,{ category: "procedimento-audiência-mutirão", question: "Como faço para incluir audiencia mutirão?", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-BATCH-HEARING", answerPattern: /Audiência Mutirão.*Upload audiência.*CSV.*TXT.*XLS.*XLSX.*Data da audiência.*Hora.*Sijur.*Processo.*Importar.*audiência comum/is }
  ,{ category: "procedimento-audiência-mutirão", question: "Onde cadastro uma audiência de mutirão?", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-BATCH-HEARING" }
  ,{ category: "procedimento-audiência-mutirão", question: "Qual o caminho para importar audiências do mutirão?", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-BATCH-HEARING" }
  ,{ category: "procedimento-audiência-mutirão", question: "Como lançar audiências em lote por planilha?", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-BATCH-HEARING" }
  ,{ category: "procedimento-paráfrase", question: "Como adiciono um prazo?", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-DEADLINE" }
  ,{ category: "procedimento-processo", question: "Como incluo um processo manualmente?", expectedRoute: "OPERATIONAL_PROCEDURE", expectedReference: "ACTION-CREATE-PROCESS", answerPattern: /Processos.*Adicionar Processo.*Código do Cliente.*Número do Processo.*Área.*Tipo de Ação.*perfil.*validar/is }
);

cases.push({ category: "regra-processo", question: "Posso incluir um processo manualmente?", expectedRoute: "BUSINESS_RULE", expectedReference: "RN-029", answerPattern: /Sim.*Processos.*Adicionar Processo.*perfis autorizados.*validados/is });

const semanticRuleVariations = [
  ["Processo algum pode permanecer sem responsável?", "RN-024"],
  ["Apagar um processo remove o registro da plataforma?", "RN-025"],
  ["A checagem de publicação duplicada olha quantos dias?", "RN-033"],
  ["É necessário ter autorização para trocar a data fatal do prazo?", "RN-045"],
  ["Ao finalizar um prazo, o sistema cria ateste automaticamente?", "RN-061"],
  ["Duas audiências do mesmo cliente podem cair na mesma data?", "RN-058"]
] as const;
for (const [question, expectedReference] of semanticRuleVariations) {
  cases.push({ category: "regra-paráfrase", question, expectedRoute: "BUSINESS_RULE", expectedReference });
}

const liveQuestions = [
  "Me detalhe o perfil de acesso da usuária - Anna Carolina Araújo Corrêa?",
  "Quais são as permissões do usuário - João da Silva?",
  "Quais acessos da usuária - Maria de Souza?",
  "Qual é o status atual do processo 50003819420254036120?",
  "Quem é o responsável atual pelo processo 30201065020258190001?",
  "O usuário Carlos Pereira está cadastrado neste momento?",
  "Qual é o valor atual do ateste 12345678?",
  "A usuária Fernanda Alves está cadastrada?"
  ,"Como está o processo 50003819420254036120?"
  ,"Quem responde agora pelo processo 30201065020258190001?"
  ,"Quais permissões de Anna Carolina Araújo Corrêa?"
  ,"O que a usuária Maria de Souza pode acessar agora?"
  ,"Qual o perfil do usuária - Marcelo Demichele?"
  ,"O processo 10104920320258260020 esta na base?"
  ,"O processo 10104920320258260020 consta no sistema?"
  ,"Qual o numero do processo que possui o codigo do cliente = 23.000.17883/2025?"
  ,"Existe publicação para o codigo de cliente = 23.000.10369/2026?"
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

assert.match(
  gerarResposta("Como acesso a tela de prazos", []),
  /botão \*\*Visualizar\*\* abre o \*\*Detalhe do processo\*\*\.$/,
  "A orientação da tela de Prazos deve indicar o destino correto do botão Visualizar"
);

assert.match(
  gerarResposta("O que é demonstrado na tela de Agenda de Prazo?", []),
  /calendário mensal.*Prazos.*Audiências.*Tarefas/is,
  "Descrição da Agenda deve informar o conteúdo exibido, não pedir esclarecimento"
);

assert.equal(
  decideAnswerRoute("Como consultar a Audiência Mutirão?").reference,
  "Audiência Mutirão",
  "O procedimento de audiência comum não pode capturar a intenção de Audiência Mutirão"
);

assert.equal(
  decideAnswerRoute("Como faço para incluir audiência mutirão?").reference,
  "ACTION-CREATE-BATCH-HEARING",
  "A inclusão de Audiência Mutirão não pode usar o procedimento de audiência comum"
);

assert.match(gerarResposta("Como incluir prazo por uma publicação?", []), /dois caminhos.*processo e à publicação/is);
assert.match(gerarResposta("Como incluir prazo pela audiência?", []), /Audiência > Editar audiência.*somente ao processo/is);
assert.match(gerarResposta("Como incluir prazo na tela de prazo?", []), /Prazo > Editar prazo.*somente ao processo/is);
assert.match(gerarResposta("Como incluir prazo pelo processo?", []), /Eventos Relevantes.*somente ao processo.*Publicação.*processo e à publicação/is);

assert.equal(
  decideAnswerRoute("Qualquer usuário pode criar um prazo?").route,
  "BUSINESS_RULE",
  "Pergunta normativa sobre permissão não pode ser confundida com pedido de procedimento"
);

const totals = cases.reduce<Record<string, number>>((acc, item) => {
  acc[item.category] = (acc[item.category] || 0) + 1;
  return acc;
}, {});

console.log(`${cases.length} perguntas validadas.`);
console.log(JSON.stringify(totals, null, 2));
