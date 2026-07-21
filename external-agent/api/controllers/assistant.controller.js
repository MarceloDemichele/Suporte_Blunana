"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assistant = assistant;
exports.assistantFeedback = assistantFeedback;
const paths_1 = require("../../config/paths");
const search_1 = require("../../core/search");
const answer_1 = require("../../core/answer");
const classification_1 = require("../../core/classification");
const question_router_1 = require("../../core/question-router");
const semantic_interpreter_1 = require("../../core/semantic-interpreter");
const learning_store_1 = require("../../core/learning-store");
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
    const interpretation = await (0, semantic_interpreter_1.interpretQuestionSemantic)(question);
    const answerRoute = (0, question_router_1.decideAnswerRoute)(question, interpretation);
    const classificacao = (0, classification_1.classificarPergunta)(question);
    const approved = classificacao === "DUVIDA" ? (0, learning_store_1.findApprovedAnswer)(question, interpretation, answerRoute.route) : null;
    const results = !approved && interpretation.needsKnowledgeSearch ? (0, search_1.buscarComInterpretacao)(interpretation, fontes) : [];
    let runtimeEvidence = null;
    if (interpretation.requiresLiveData && !(0, answer_1.temRespostaOperacional)(question, results, interpretation) && process.env.ALLOW_PLAYWRIGHT === "true") {
        try {
            const { consultarAplicacao } = await import("../../providers/playwright.provider.js");
            runtimeEvidence = await consultarAplicacao(question, interpretation);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Falha desconhecida na consulta da plataforma.";
            runtimeEvidence = { used: false, evidence: `Consulta indisponível: ${message}` };
        }
    }
    const answer = classificacao === "BUG"
        ? "Não foi localizada uma resposta comprovada para esta ocorrência. Será necessária uma análise manual da equipe responsável."
        : approved?.answer || (0, answer_1.gerarResposta)(question, results, runtimeEvidence, interpretation);
    try {
        const interaction = await (0, learning_store_1.recordInteraction)({
            idTask: String(idTask),
            question,
            answer,
            classification: classificacao,
            interpretation,
            route: answerRoute.route,
            reference: answerRoute.reference,
            sources: results.map((result) => result.file),
            usedApprovedAnswer: Boolean(approved)
        });
        res.setHeader("X-Interaction-ID", interaction.interactionId);
    }
    catch (error) {
        console.error("Falha ao registrar histórico da interação:", error instanceof Error ? error.message : error);
    }
    return res.json({
        ID_TASK: idTask,
        TASK: TASK_FIXA,
        CLASSIFICACAO: classificacao,
        QUESTION: question,
        ANSWER: answer
    });
}
async function assistantFeedback(req, res) {
    const configuredToken = process.env.AGENT_FEEDBACK_TOKEN?.trim();
    const remoteAddress = req.ip || req.socket.remoteAddress || "";
    const isLocal = remoteAddress === "127.0.0.1" || remoteAddress === "::1" || remoteAddress.endsWith("::ffff:127.0.0.1");
    if (configuredToken && req.header("x-feedback-token") !== configuredToken)
        return res.status(401).json({ error: "Token de feedback inválido." });
    if (!configuredToken && !isLocal)
        return res.status(403).json({ error: "Configure AGENT_FEEDBACK_TOKEN para feedback remoto." });
    const status = String(req.body?.status || "").toUpperCase();
    if (!["APPROVED", "REJECTED", "CORRECTED"].includes(status)) {
        return res.status(400).json({ error: "status deve ser APPROVED, REJECTED ou CORRECTED." });
    }
    if (!req.body?.interactionId && !req.body?.ID_TASK)
        return res.status(400).json({ error: "Informe interactionId ou ID_TASK." });
    try {
        const result = await (0, learning_store_1.recordFeedback)({
            interactionId: req.body.interactionId,
            idTask: req.body.ID_TASK ? String(req.body.ID_TASK) : undefined,
            question: req.body.question,
            status,
            correctedAnswer: req.body.correctedAnswer,
            approvedBy: req.body.approvedBy
        });
        return res.json({
            interactionId: result.interaction.interactionId,
            status: result.feedback.status,
            reusable: result.feedback.reusable,
            message: result.feedback.reusable ? "Resposta adicionada à base aprovada." : "Feedback registrado apenas no histórico."
        });
    }
    catch (error) {
        return res.status(400).json({ error: error instanceof Error ? error.message : "Falha ao registrar feedback." });
    }
}
