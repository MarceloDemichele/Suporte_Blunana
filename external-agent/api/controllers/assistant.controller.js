"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assistant = assistant;
const paths_1 = require("../../config/paths");
const search_1 = require("../../core/search");
const answer_1 = require("../../core/answer");
async function assistant(req, res) {
    const start = Date.now();
    const projectName = process.env.PROJECT_NAME || "Blunana / Suporte";
    const { question, environment = process.env.APP_ENV || "prod", user = "cliente" } = req.body;
    if (!question) {
        return res.status(400).json({
            success: false,
            project: projectName,
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
    let usedPlaywright = false;
    if (!(0, answer_1.temRespostaOperacional)(question, results) && process.env.ALLOW_PLAYWRIGHT === "true") {
        const { consultarAplicacao } = await import("../../providers/playwright.provider.js");
        runtimeEvidence = await consultarAplicacao(question);
        usedPlaywright = runtimeEvidence?.used === true;
    }
    const answer = (0, answer_1.gerarResposta)(question, results, runtimeEvidence);
    const confidence = results.length >= 3 ? 90 :
        results.length >= 1 ? 75 :
            usedPlaywright ? 60 :
                0;
    return res.json({
        success: results.length > 0 || usedPlaywright,
        project: projectName,
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
