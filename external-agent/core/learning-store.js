"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.answerSignature = answerSignature;
exports.recordInteraction = recordInteraction;
exports.findInteraction = findInteraction;
exports.recordFeedback = recordFeedback;
exports.findApprovedAnswer = findApprovedAnswer;
const node_crypto_1 = __importDefault(require("node:crypto"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
let writeQueue = Promise.resolve();
function storeDir() {
    return node_path_1.default.resolve(process.env.AGENT_LEARNING_DIR || "data/agent-learning");
}
function file(name) {
    return node_path_1.default.join(storeDir(), name);
}
function normalize(value) {
    return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
function appendJsonLine(target, value) {
    writeQueue = writeQueue.then(async () => {
        await node_fs_1.default.promises.mkdir(node_path_1.default.dirname(target), { recursive: true });
        await node_fs_1.default.promises.appendFile(target, `${JSON.stringify(value)}\n`, "utf8");
    });
    return writeQueue;
}
function readJsonLines(target) {
    if (!node_fs_1.default.existsSync(target))
        return [];
    return node_fs_1.default.readFileSync(target, "utf8").split(/\r?\n/).filter(Boolean).flatMap((line) => {
        try {
            return [JSON.parse(line)];
        }
        catch {
            return [];
        }
    });
}
function answerSignature(interpretation, route) {
    return [route, interpretation.reference || "", interpretation.entity, interpretation.sourceContext || ""].join(":");
}
async function recordInteraction(input) {
    const record = {
        ...input,
        interactionId: node_crypto_1.default.randomUUID(),
        createdAt: new Date().toISOString(),
        agentVersion: process.env.AGENT_VERSION || "2.0.0"
    };
    await appendJsonLine(file("interactions.jsonl"), record);
    return record;
}
function findInteraction(input) {
    const records = readJsonLines(file("interactions.jsonl"));
    return records.reverse().find((record) => (input.interactionId ? record.interactionId === input.interactionId : true) &&
        (input.idTask ? record.idTask === input.idTask : true) &&
        (input.question ? normalize(record.question) === normalize(input.question) : true)) || null;
}
async function recordFeedback(input) {
    const interaction = findInteraction(input);
    if (!interaction)
        throw new Error("Interação não localizada.");
    if (input.status === "CORRECTED" && !input.correctedAnswer?.trim())
        throw new Error("correctedAnswer é obrigatório para status CORRECTED.");
    const reusable = (input.status === "APPROVED" || input.status === "CORRECTED") &&
        interaction.route !== "LIVE_PLATFORM" && interaction.route !== "UNKNOWN";
    const feedback = {
        feedbackId: node_crypto_1.default.randomUUID(),
        interactionId: interaction.interactionId,
        status: input.status,
        correctedAnswer: input.correctedAnswer?.trim() || undefined,
        approvedBy: input.approvedBy?.trim() || undefined,
        reusable,
        signature: answerSignature(interaction.interpretation, interaction.route),
        createdAt: new Date().toISOString()
    };
    await appendJsonLine(file("feedback.jsonl"), feedback);
    if (reusable) {
        const approved = {
            approvalId: node_crypto_1.default.randomUUID(),
            interactionId: interaction.interactionId,
            normalizedQuestion: normalize(interaction.question),
            signature: answerSignature(interaction.interpretation, interaction.route),
            question: interaction.question,
            answer: feedback.correctedAnswer || interaction.answer,
            route: interaction.route,
            reference: interaction.reference,
            sourceContext: interaction.interpretation.sourceContext,
            entity: interaction.interpretation.entity,
            approvedBy: feedback.approvedBy,
            createdAt: feedback.createdAt
        };
        await appendJsonLine(file("approved-answers.jsonl"), approved);
    }
    return { feedback, interaction };
}
function findApprovedAnswer(question, interpretation, route) {
    if (route === "LIVE_PLATFORM" || route === "UNKNOWN")
        return null;
    const signature = answerSignature(interpretation, route);
    const latestFeedback = readJsonLines(file("feedback.jsonl")).reverse().find((feedback) => feedback.signature === signature);
    if (latestFeedback?.status === "REJECTED")
        return null;
    const records = readJsonLines(file("approved-answers.jsonl")).reverse();
    const normalizedQuestion = normalize(question);
    const match = records.find((record) => record.normalizedQuestion === normalizedQuestion) ||
        records.find((record) => record.signature === signature && Boolean(interpretation.reference));
    return match ? { answer: match.answer, approvalId: match.approvalId } : null;
}
