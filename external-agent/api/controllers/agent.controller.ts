import { Request, Response } from "express";
import { paths } from "../../config/paths";
import { buscar } from "../../core/search";
import { gerarResposta } from "../../core/answer";

export function askAgent(req: Request, res: Response) {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({
      error: "Campo obrigatório: question"
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
  const answer = gerarResposta(question, results);

  return res.json({
    question,
    answer,
    sources: results.map((r) => r.file),
    totalSources: results.length
  });
}