"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../config/loadEnv");
const answer_1 = require("../core/answer");
const playwright_provider_1 = require("../providers/playwright.provider");
const question = process.env.TARGET_QUESTION?.trim() || "";
if (!question)
    throw new Error("TARGET_QUESTION não informado.");
async function main() {
    const runtimeEvidence = await (0, playwright_provider_1.consultarAplicacao)(question);
    const answer = (0, answer_1.gerarResposta)(question, [], runtimeEvidence);
    console.log(JSON.stringify({ question, answer, usedPlaywright: runtimeEvidence.used }, null, 2));
}
main().catch((error) => {
    console.error(`Consulta direcionada falhou: ${String(error)}`);
    process.exit(1);
});
