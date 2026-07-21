"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decideAnswerRoute = decideAnswerRoute;
const question_interpreter_1 = require("./question-interpreter");
function decideAnswerRoute(question, provided) {
    const interpretation = provided || (0, question_interpreter_1.interpretQuestion)(question);
    if (interpretation.intent === "CURRENT_DATA")
        return { route: "LIVE_PLATFORM", reason: "A interpretação identificou dado atual e referência específica.", reference: interpretation.reference };
    if (interpretation.intent === "PROCEDURE")
        return { route: "OPERATIONAL_PROCEDURE", reason: "A interpretação identificou pedido de execução operacional.", reference: interpretation.reference };
    if (interpretation.intent === "BUSINESS_RULE")
        return { route: "BUSINESS_RULE", reason: "A interpretação identificou dúvida normativa.", reference: interpretation.reference };
    if (interpretation.intent === "SCREEN_LOOKUP")
        return { route: "SCREEN_CONSULTATION", reason: "A interpretação identificou consulta de tela.", reference: interpretation.reference };
    return { route: "UNKNOWN", reason: interpretation.ambiguity || "A interpretação não encontrou intenção comprovável." };
}
