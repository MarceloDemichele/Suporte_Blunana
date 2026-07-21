import { Request, Response } from "express";
import { paths } from "../../config/paths";
import { buscarComInterpretacao } from "../../core/search";
import { gerarResposta, temRespostaOperacional } from "../../core/answer";
import { classificarPergunta } from "../../core/classification";
import { decideAnswerRoute } from "../../core/question-router";
import { interpretQuestionSemantic } from "../../core/semantic-interpreter";
import { findApprovedAnswer, recordFeedback, recordInteraction, FeedbackStatus } from "../../core/learning-store";

const TASK_FIXA = "Suporte ao cliente";

export async function assistant(req: Request, res: Response) {
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
    paths.memory,
    paths.knowledge,
    paths.docs,
    paths.index,
    paths.tickets,
    paths.support,
    paths.outputs,
    ...paths.reverseDirs
  ];

  const interpretation = await interpretQuestionSemantic(question);
  const answerRoute = decideAnswerRoute(question, interpretation);
  const classificacao = classificarPergunta(question);
  const approved = classificacao === "DUVIDA" ? findApprovedAnswer(question, interpretation, answerRoute.route) : null;
  const results = !approved && interpretation.needsKnowledgeSearch ? buscarComInterpretacao(interpretation, fontes) : [];
  let runtimeEvidence = null;

  if (interpretation.requiresLiveData && !temRespostaOperacional(question, results, interpretation) && process.env.ALLOW_PLAYWRIGHT === "true") {
    try {
      const { consultarAplicacao } = await import("../../providers/playwright.provider.js");
      runtimeEvidence = await consultarAplicacao(question, interpretation);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha desconhecida na consulta da plataforma.";
      runtimeEvidence = { used: false, evidence: `Consulta indisponível: ${message}` };
    }
  }

  const answer = classificacao === "BUG"
    ? "Não foi localizada uma resposta comprovada para esta ocorrência. Será necessária uma análise manual da equipe responsável."
    : approved?.answer || gerarResposta(question, results, runtimeEvidence, interpretation);

  try {
    const interaction = await recordInteraction({
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
  } catch (error) {
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

export async function assistantFeedback(req: Request, res: Response) {
  const configuredToken = process.env.AGENT_FEEDBACK_TOKEN?.trim();
  const remoteAddress = req.ip || req.socket.remoteAddress || "";
  const isLocal = remoteAddress === "127.0.0.1" || remoteAddress === "::1" || remoteAddress.endsWith("::ffff:127.0.0.1");
  if (configuredToken && req.header("x-feedback-token") !== configuredToken) return res.status(401).json({ error: "Token de feedback inválido." });
  if (!configuredToken && !isLocal) return res.status(403).json({ error: "Configure AGENT_FEEDBACK_TOKEN para feedback remoto." });

  const status = String(req.body?.status || "").toUpperCase() as FeedbackStatus;
  if (!["APPROVED", "REJECTED", "CORRECTED"].includes(status)) {
    return res.status(400).json({ error: "status deve ser APPROVED, REJECTED ou CORRECTED." });
  }
  if (!req.body?.interactionId && !req.body?.ID_TASK) return res.status(400).json({ error: "Informe interactionId ou ID_TASK." });
  try {
    const result = await recordFeedback({
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
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : "Falha ao registrar feedback." });
  }
}
