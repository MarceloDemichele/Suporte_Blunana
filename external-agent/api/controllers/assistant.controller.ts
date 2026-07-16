import { Request, Response } from "express";
import { paths } from "../../config/paths";
import { buscar } from "../../core/search";
import { gerarResposta, temRespostaOperacional } from "../../core/answer";
import { classificarPergunta } from "../../core/classification";
import { decideAnswerRoute } from "../../core/question-router";

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

  const results = buscar(question, fontes);
  let runtimeEvidence = null;
  const answerRoute = decideAnswerRoute(question);

  if (answerRoute.route === "LIVE_PLATFORM" && !temRespostaOperacional(question, results) && process.env.ALLOW_PLAYWRIGHT === "true") {
    const { consultarAplicacao } = await import("../../providers/playwright.provider.js");
    runtimeEvidence = await consultarAplicacao(question);
  }

  const classificacao = classificarPergunta(question);
  const answer = classificacao === "BUG"
    ? "Não foi localizada uma resposta comprovada para esta ocorrência. Será necessária uma análise manual da equipe responsável."
    : gerarResposta(question, results, runtimeEvidence);

  return res.json({
    ID_TASK: idTask,
    TASK: TASK_FIXA,
    CLASSIFICACAO: classificacao,
    QUESTION: question,
    ANSWER: answer
  });
}
