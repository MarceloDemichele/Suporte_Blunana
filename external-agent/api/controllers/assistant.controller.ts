import { Request, Response } from "express";
import { paths } from "../../config/paths";
import { buscar } from "../../core/search";
import { gerarResposta } from "../../core/answer";

export async function assistant(req: Request, res: Response) {
  const start = Date.now();

  const { question, environment = "prod", user = "cliente" } = req.body;

  if (!question) {
    return res.status(400).json({
      success: false,
      project: "Blunana / Robo CEF",
      environment,
      user,
      mustUse: true,
      answer: "Campo obrigatório: question",
      confidence: 0,
      action: "CONTACT_SUPPORT",
      sources: [],
      runtimeEvidence: null,
      metadata: {
        matchedFiles: 0,
        usedPlaywright: false,
        executionTimeMs: Date.now() - start
      }
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
  let usedPlaywright = false;

  if (results.length < 2 && process.env.ALLOW_PLAYWRIGHT === "true") {
    const { consultarAplicacao } = await import("../../providers/playwright.provider.js");

    runtimeEvidence = await consultarAplicacao(question);
    usedPlaywright = runtimeEvidence?.used === true;
  }

  const answer = gerarResposta(question, results);

  const confidence =
    results.length >= 3 ? 90 :
    results.length >= 1 ? 75 :
    usedPlaywright ? 60 :
    0;

  return res.json({
    success: results.length > 0 || usedPlaywright,
    project: "Blunana / Robo CEF",
    environment,
    user,
    mustUse: true,
    answer,
    confidence,
    action: results.length > 0 ? "NONE" : "CONTACT_SUPPORT",
    sources: results.map((r) => r.file),
    runtimeEvidence,
    metadata: {
      matchedFiles: results.length,
      usedPlaywright,
      executionTimeMs: Date.now() - start
    }
  });
}
