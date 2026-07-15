"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planner = planner;
function planner(question) {
    const q = question.toLowerCase();
    if (q.includes("erro") || q.includes("bug"))
        return "BUG";
    if (q.includes("como") ||
        q.includes("onde") ||
        q.includes("quem"))
        return "SUPORTE";
    if (q.includes("document"))
        return "DOCUMENTACAO";
    if (q.includes("engenharia"))
        return "ENGENHARIA_REVERSA";
    if (q.includes("teste") ||
        q.includes("cenário"))
        return "QA";
    return "GERAL";
}
