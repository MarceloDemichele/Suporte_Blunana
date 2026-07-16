import "../../config/loadEnv";
import { gerarResposta } from "../core/answer";
import { consultarAplicacao } from "../providers/playwright.provider";

const question = process.env.TARGET_QUESTION?.trim() || "";
if (!question) throw new Error("TARGET_QUESTION não informado.");

async function main() {
  const runtimeEvidence = await consultarAplicacao(question);
  const answer = gerarResposta(question, [], runtimeEvidence);
  console.log(JSON.stringify({ question, answer, usedPlaywright: runtimeEvidence.used }, null, 2));
}

main().catch((error) => {
  console.error(`Consulta direcionada falhou: ${String(error)}`);
  process.exit(1);
});
