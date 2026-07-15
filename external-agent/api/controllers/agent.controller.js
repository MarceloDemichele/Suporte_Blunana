"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askAgent = askAgent;
const paths_1 = require("../../config/paths");
const search_1 = require("../../core/search");
const answer_1 = require("../../core/answer");
function askAgent(req, res) {
    const { question } = req.body;
    if (!question) {
        return res.status(400).json({
            error: "Campo obrigatório: question"
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
    const answer = (0, answer_1.gerarResposta)(question, results);
    return res.json({
        question,
        answer,
        sources: results.map((r) => r.file),
        totalSources: results.length
    });
}
