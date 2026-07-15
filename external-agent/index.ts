import fs from "fs";
import path from "path";
import "../config/loadEnv";
import { paths } from "./config/paths";
import { buscar } from "./core/search";
import { gerarResposta, temRespostaOperacional } from "./core/answer";

const pergunta = process.argv.slice(2).join(" ");

if (!pergunta) {
  console.log("Informe uma pergunta.");
  process.exit(1);
}

const fontes = [
  paths.memory,
  paths.knowledge,
  paths.docs,
  paths.index,
  paths.tickets,
  paths.support,
  paths.outputs,
  ...paths.reverseDirs,
];

async function executar() {
const resultados = buscar(pergunta, fontes);
let runtimeEvidence = null;

if (!temRespostaOperacional(pergunta, resultados) && process.env.ALLOW_PLAYWRIGHT === "true") {
  const { consultarAplicacao } = await import("./providers/playwright.provider.js");
  runtimeEvidence = await consultarAplicacao(pergunta);
}

const resposta = gerarResposta(pergunta, resultados, runtimeEvidence);

fs.mkdirSync("external-agent/logs", { recursive: true });

const fileName = `resposta-${new Date()
  .toISOString()
  .replace(/[:.]/g, "-")}.md`;

const outputPath = path.join("external-agent/logs", fileName);

fs.writeFileSync(outputPath, resposta, "utf-8");

console.log(resposta);
console.log(`\nResposta salva em: ${outputPath}`);
}

executar().catch((error) => {
  console.error("Não foi possível concluir a consulta:", String(error));
  process.exit(1);
});
