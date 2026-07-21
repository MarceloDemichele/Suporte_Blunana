"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const learning_store_1 = require("../core/learning-store");
const question_interpreter_1 = require("../core/question-interpreter");
const question_router_1 = require("../core/question-router");
const testDir = node_path_1.default.resolve("outputs/runtime-evidence", `learning-store-test-${process.pid}`);
process.env.AGENT_LEARNING_DIR = testDir;
async function main() {
    const question = "Como faço para incluir audiência mutirão?";
    const interpretation = (0, question_interpreter_1.interpretQuestion)(question);
    const decision = (0, question_router_1.decideAnswerRoute)(question, interpretation);
    const interaction = await (0, learning_store_1.recordInteraction)({
        idTask: "LEARNING_TEST",
        question,
        answer: "Resposta original",
        classification: "DUVIDA",
        interpretation,
        route: decision.route,
        reference: decision.reference,
        sources: ["docs/telas/hml/audiencia-mutirao.md"],
        usedApprovedAnswer: false
    });
    strict_1.default.ok(interaction.interactionId);
    strict_1.default.equal((0, learning_store_1.findApprovedAnswer)(question, interpretation, decision.route), null);
    const approval = await (0, learning_store_1.recordFeedback)({ interactionId: interaction.interactionId, status: "CORRECTED", correctedAnswer: "Resposta aprovada", approvedBy: "teste" });
    strict_1.default.equal(approval.feedback.reusable, true);
    strict_1.default.equal((0, learning_store_1.findApprovedAnswer)("Qual o caminho para cadastrar audiência de mutirão?", interpretation, decision.route)?.answer, "Resposta aprovada");
    await (0, learning_store_1.recordFeedback)({ interactionId: interaction.interactionId, status: "REJECTED", approvedBy: "teste" });
    strict_1.default.equal((0, learning_store_1.findApprovedAnswer)(question, interpretation, decision.route), null);
    const liveQuestion = "O processo 10104920320258260020 existe?";
    const liveInterpretation = (0, question_interpreter_1.interpretQuestion)(liveQuestion);
    const liveDecision = (0, question_router_1.decideAnswerRoute)(liveQuestion, liveInterpretation);
    const liveInteraction = await (0, learning_store_1.recordInteraction)({
        idTask: "LEARNING_LIVE_TEST",
        question: liveQuestion,
        answer: "Dado momentâneo",
        classification: "DUVIDA",
        interpretation: liveInterpretation,
        route: liveDecision.route,
        reference: liveDecision.reference,
        sources: [],
        usedApprovedAnswer: false
    });
    const liveApproval = await (0, learning_store_1.recordFeedback)({ interactionId: liveInteraction.interactionId, status: "APPROVED" });
    strict_1.default.equal(liveApproval.feedback.reusable, false);
    strict_1.default.equal((0, learning_store_1.findApprovedAnswer)(liveQuestion, liveInterpretation, liveDecision.route), null);
    node_fs_1.default.rmSync(testDir, { recursive: true, force: true });
    console.log("Histórico, feedback, resposta aprovada e bloqueio de dados atuais validados com sucesso.");
}
main().catch((error) => {
    if (node_fs_1.default.existsSync(testDir))
        node_fs_1.default.rmSync(testDir, { recursive: true, force: true });
    console.error(error);
    process.exitCode = 1;
});
