"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../config/loadEnv");
const semantic_interpreter_1 = require("../core/semantic-interpreter");
const cases = [
    { category: "registro", question: "Esse processo 10104920320258260020 existe por aqui?", expected: { intent: "CURRENT_DATA", entity: "PROCESS", action: "CHECK_EXISTENCE", filterField: "PROCESS_NUMBER", identifier: "10104920320258260020" } },
    { category: "registro", question: "A referência do cliente 23.000.17883/2025 corresponde a qual número processual?", expected: { intent: "CURRENT_DATA", entity: "PROCESS", action: "LOOKUP_FIELD", filterField: "CLIENT_CODE", identifier: "23.000.17883/2025", requestedField: "PROCESS_NUMBER" } },
    { category: "registro", question: "Tem alguma publicação ligada ao código 23.000.10369/2026?", expected: { intent: "CURRENT_DATA", entity: "PUBLICATION", action: "CHECK_EXISTENCE", filterField: "CLIENT_CODE", identifier: "23.000.10369/2026" } },
    { category: "registro", question: "Quero saber a situação atual do processo 50003819420254036120", expected: { intent: "CURRENT_DATA", entity: "PROCESS", action: "CHECK_STATUS", filterField: "PROCESS_NUMBER", identifier: "50003819420254036120", requestedField: "STATUS" } },
    { category: "registro", question: "Quem está cuidando agora do processo 30201065020258190001?", expected: { intent: "CURRENT_DATA", entity: "PROCESS", action: "LOOKUP_FIELD", filterField: "PROCESS_NUMBER", identifier: "30201065020258190001", requestedField: "RESPONSIBLE" } },
    { category: "registro", question: "Me diga os acessos da usuária Marcelo Demichele", expected: { intent: "CURRENT_DATA", entity: "USER", action: "CHECK_PERMISSIONS", filterField: "USER_NAME", identifier: "Marcelo Demichele", requestedField: "PERMISSIONS" } },
    { category: "procedimento", question: "Preciso lançar um novo prazo; por onde começo?", expected: { intent: "PROCEDURE", entity: "DEADLINE", action: "CREATE", reference: "ACTION-CREATE-DEADLINE" } },
    { category: "procedimento", question: "Quero cadastrar uma audiência comum, não é mutirão", expected: { intent: "PROCEDURE", entity: "HEARING", action: "CREATE", reference: "ACTION-CREATE-HEARING", sourceContext: "HEARING" } },
    { category: "procedimento", question: "Dá para adicionar um processo à mão? Como faço?", expected: { intent: "PROCEDURE", entity: "PROCESS", action: "CREATE", reference: "ACTION-CREATE-PROCESS" } },
    { category: "procedimento", question: "Onde lanço um prazo originado de uma publicação?", expected: { intent: "PROCEDURE", entity: "PUBLICATION", action: "CREATE", reference: "ACTION-CREATE-DEADLINE", sourceContext: "PUBLICATION" } },
    { category: "procedimento", question: "Qual caminho uso para inserir prazo pela própria audiência?", expected: { intent: "PROCEDURE", entity: "HEARING", action: "CREATE", reference: "ACTION-CREATE-DEADLINE", sourceContext: "HEARING" } },
    { category: "procedimento", question: "Comu eu incluo uma audiençia?", expected: { intent: "PROCEDURE", entity: "HEARING", action: "CREATE", reference: "ACTION-CREATE-HEARING" } },
    { category: "procedimento", question: "Como faço para incluir audiencia mutirão?", expected: { intent: "PROCEDURE", entity: "BATCH_HEARING", action: "CREATE", reference: "ACTION-CREATE-BATCH-HEARING", sourceContext: "BATCH_HEARING" } },
    { category: "tela", question: "O que encontro no calendário mensal dos compromissos jurídicos?", expected: { intent: "SCREEN_LOOKUP", entity: "SCREEN", action: "CONSULT", reference: "Agenda de prazos" } },
    { category: "tela", question: "Em qual tela consigo listar e filtrar os prazos pendentes?", expected: { intent: "SCREEN_LOOKUP", entity: "SCREEN", action: "CONSULT", reference: "Prazos" } },
    { category: "tela", question: "Me explica o que aparece na área de publicações", expected: { intent: "SCREEN_LOOKUP", entity: "SCREEN", action: "CONSULT", reference: "Publicações" } },
    { category: "tela", question: "Onde consulto as audiências processadas por planilha em lote?", expected: { intent: "SCREEN_LOOKUP", entity: "BATCH_HEARING", action: "CONSULT", reference: "Audiência Mutirão" } },
    { category: "tela", question: "Para que serve a página inicial com os indicadores?", expected: { intent: "SCREEN_LOOKUP", entity: "SCREEN", action: "CONSULT", reference: "Home" } },
    { category: "regra", question: "Um processo pode ficar sem ninguém responsável por ele?", expected: { intent: "BUSINESS_RULE", entity: "PROCESS", action: "EXPLAIN_RULE", reference: "RN-024" } },
    { category: "regra", question: "Se eu apagar um processo ele desaparece definitivamente?", expected: { intent: "BUSINESS_RULE", entity: "PROCESS", action: "EXPLAIN_RULE", reference: "RN-025" } },
    { category: "regra", question: "Qualquer pessoa consegue mudar a data fatal de um prazo?", expected: { intent: "BUSINESS_RULE", entity: "DEADLINE", action: "EXPLAIN_RULE", reference: "RN-045" } },
    { category: "regra", question: "Cumpri o prazo: o ateste nasce sozinho?", expected: { intent: "BUSINESS_RULE", entity: "ATTESTATION", action: "EXPLAIN_RULE", reference: "RN-061" } },
    { category: "regra", question: "Podem existir duas audiências do mesmo cliente no mesmo dia?", expected: { intent: "BUSINESS_RULE", entity: "HEARING", action: "EXPLAIN_RULE", reference: "RN-058" } },
    { category: "regra", question: "Uma audiência normal é cadastrada como prazo?", expected: { intent: "BUSINESS_RULE", entity: "HEARING", action: "EXPLAIN_RULE", reference: "RN-050" } },
    { category: "ambígua", question: "Quem é o responsável?", expected: { intent: "UNKNOWN", entity: "UNKNOWN", action: "UNKNOWN", reference: null } },
    { category: "ambígua", question: "Isso pode ser alterado?", expected: { intent: "UNKNOWN", entity: "UNKNOWN", action: "UNKNOWN", reference: null } },
    { category: "ambígua", question: "Qual é o valor?", expected: { intent: "UNKNOWN", entity: "UNKNOWN", action: "UNKNOWN", reference: null } },
    { category: "ambígua", question: "Como faço para incluir?", expected: { intent: "UNKNOWN", entity: "UNKNOWN", action: "UNKNOWN", reference: null } },
    { category: "ambígua", question: "O registro está cadastrado?", expected: { intent: "UNKNOWN", entity: "UNKNOWN", action: "UNKNOWN", reference: null } }
];
function evaluate(actual, expected) {
    const failures = [];
    const compare = (field, value, wanted) => {
        if (wanted !== undefined && value !== wanted)
            failures.push(`${field}: esperado=${String(wanted)} obtido=${String(value)}`);
    };
    compare("intent", actual.intent, expected.intent);
    compare("entity", actual.entity, expected.entity);
    compare("action", actual.action, expected.action);
    compare("reference", actual.reference ?? null, expected.reference);
    compare("sourceContext", actual.sourceContext, expected.sourceContext);
    if (expected.filterField && !actual.filters.some((filter) => filter.field === expected.filterField))
        failures.push(`filterField: ausente ${expected.filterField}`);
    if (expected.identifier) {
        const identifiers = Object.values(actual.identifiers).filter(Boolean);
        if (!identifiers.includes(expected.identifier))
            failures.push(`identifier: ausente ${expected.identifier}`);
    }
    if (expected.requestedField && !actual.requestedFields.includes(expected.requestedField))
        failures.push(`requestedField: ausente ${expected.requestedField}`);
    if (expected.intent !== "UNKNOWN" && actual.interpretationSource !== "MODEL")
        failures.push(`source: esperado=MODEL obtido=${actual.interpretationSource || "LOCAL"}`);
    return failures;
}
async function worker(queue, results) {
    while (queue.length) {
        const next = queue.shift();
        if (!next)
            return;
        const started = Date.now();
        const actual = await (0, semantic_interpreter_1.interpretQuestionSemantic)(next.item.question);
        results[next.index] = { ...next.item, actual, failures: evaluate(actual, next.item.expected), elapsedMs: Date.now() - started };
    }
}
async function main() {
    var _a;
    if (!process.env.OPENAI_API_KEY)
        throw new Error("OPENAI_API_KEY ausente");
    const queue = cases.map((item, index) => ({ item, index }));
    const results = [];
    await Promise.all([worker(queue, results), worker(queue, results), worker(queue, results)]);
    const categories = {};
    for (const result of results) {
        categories[_a = result.category] || (categories[_a] = { total: 0, passed: 0 });
        categories[result.category].total++;
        if (!result.failures.length)
            categories[result.category].passed++;
    }
    const passed = results.filter((result) => !result.failures.length).length;
    console.log(`SEMANTIC_LIVE_SCORE ${passed}/${results.length} (${Math.round((passed / results.length) * 100)}%)`);
    console.log(`SEMANTIC_LIVE_CATEGORIES ${JSON.stringify(categories)}`);
    for (const result of results.filter((item) => item.failures.length)) {
        console.log(`FAIL ${JSON.stringify({ category: result.category, question: result.question, failures: result.failures, actual: { source: result.actual.interpretationSource || "LOCAL", intent: result.actual.intent, entity: result.actual.entity, action: result.actual.action, reference: result.actual.reference || null, sourceContext: result.actual.sourceContext || null, filters: result.actual.filters, requestedFields: result.actual.requestedFields, confidence: result.actual.confidence }, elapsedMs: result.elapsedMs })}`);
    }
}
main().catch((error) => {
    console.error(`SEMANTIC_LIVE_ERROR ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
});
