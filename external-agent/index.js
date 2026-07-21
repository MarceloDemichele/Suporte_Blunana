"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
require("../config/loadEnv");
const paths_1 = require("./config/paths");
const search_1 = require("./core/search");
const answer_1 = require("./core/answer");
const question_router_1 = require("./core/question-router");
const pergunta = process.argv.slice(2).join(" ");
if (!pergunta) {
    console.log("Informe uma pergunta.");
    process.exit(1);
}
const fontes = [
    paths_1.paths.memory,
    paths_1.paths.knowledge,
    paths_1.paths.docs,
    paths_1.paths.index,
    paths_1.paths.tickets,
    paths_1.paths.support,
    paths_1.paths.outputs,
    ...paths_1.paths.reverseDirs,
];
async function executar() {
    const resultados = (0, search_1.buscar)(pergunta, fontes);
    let runtimeEvidence = null;
    const answerRoute = (0, question_router_1.decideAnswerRoute)(pergunta);
    if (answerRoute.route === "LIVE_PLATFORM" && !(0, answer_1.temRespostaOperacional)(pergunta, resultados) && process.env.ALLOW_PLAYWRIGHT === "true") {
        const { consultarAplicacao } = await import("./providers/playwright.provider.js");
        runtimeEvidence = await consultarAplicacao(pergunta);
    }
    const resposta = (0, answer_1.gerarResposta)(pergunta, resultados, runtimeEvidence);
    fs_1.default.mkdirSync("external-agent/logs", { recursive: true });
    const fileName = `resposta-${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}-${process.pid}-${process.hrtime.bigint().toString().slice(-8)}.md`;
    const outputPath = path_1.default.join("external-agent/logs", fileName);
    fs_1.default.writeFileSync(outputPath, resposta, "utf-8");
    console.log(resposta);
    console.log(`\nResposta salva em: ${outputPath}`);
}
executar().catch((error) => {
    console.error("Não foi possível concluir a consulta:", String(error));
    process.exit(1);
});
