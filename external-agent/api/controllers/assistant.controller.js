"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assistant = assistant;
const paths_1 = require("../../config/paths");
const search_1 = require("../../core/search");
const answer_1 = require("../../core/answer");
const classification_1 = require("../../core/classification");
const question_router_1 = require("../../core/question-router");
const TASK_FIXA = "Suporte ao cliente";
async function assistant(req, res) {
    const { ID_TASK: idTask, question } = req.body;
    const idTaskAusente = idTask === undefined || idTask === null || String(idTask).trim() === "";
    if (idTaskAusente || !question || typeof question !== "string") {
        const campos = [idTaskAusente ? "ID_TASK" : "", !question ? "question" : ""].filter(Boolean);
        return res.status(400).json({
            ID_TASK: idTask ?? null,
            TASK: TASK_FIXA,
            CLASSIFICACAO: "DUVIDA",
            QUESTION: typeof question === "string" ? question : "",
            ANSWER: `Campo(s) obrigatório(s): ${campos.join(", ")}`
        });
    }
    const fontes = [
        paths_1.paths.memory,
        paths_1.paths.knowledge,
        paths_1.paths.docs,
        paths_1.paths.index,
        paths_1.paths.tickets,
        paths_1.paths.support,
        paths_1.paths.outputs,
        ...paths_1.paths.reverseDirs
    ];
    const results = (0, search_1.buscar)(question, fontes);
    let runtimeEvidence = null;
    const answerRoute = (0, question_router_1.decideAnswerRoute)(question);
    if (answerRoute.route === "LIVE_PLATFORM" && !(0, answer_1.temRespostaOperacional)(question, results) && process.env.ALLOW_PLAYWRIGHT === "true") {
        const { consultarAplicacao } = await import("../../providers/playwright.provider.js");
        runtimeEvidence = await consultarAplicacao(question);
    }
    const classificacao = (0, classification_1.classificarPergunta)(question);
    const answer = classificacao === "BUG"
        ? "Não foi localizada uma resposta comprovada para esta ocorrência. Será necessária uma análise manual da equipe responsável."
        : (0, answer_1.gerarResposta)(question, results, runtimeEvidence);
    return res.json({
        ID_TASK: idTask,
        TASK: TASK_FIXA,
        CLASSIFICACAO: classificacao,
        QUESTION: question,
        ANSWER: answer
    });
}
