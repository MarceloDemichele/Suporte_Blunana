import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type { QuestionInterpretation } from "./question-interpreter";
import type { AnswerRoute } from "./question-router";

export type InteractionRecord = {
  interactionId: string;
  idTask: string;
  question: string;
  answer: string;
  classification: string;
  interpretation: QuestionInterpretation;
  route: AnswerRoute;
  reference?: string;
  sources: string[];
  usedApprovedAnswer: boolean;
  createdAt: string;
  agentVersion: string;
};

export type FeedbackStatus = "APPROVED" | "REJECTED" | "CORRECTED";

export type FeedbackRecord = {
  feedbackId: string;
  interactionId: string;
  status: FeedbackStatus;
  correctedAnswer?: string;
  approvedBy?: string;
  reusable: boolean;
  signature: string;
  createdAt: string;
};

type ApprovedAnswerRecord = {
  approvalId: string;
  interactionId: string;
  normalizedQuestion: string;
  signature: string;
  question: string;
  answer: string;
  route: AnswerRoute;
  reference?: string;
  sourceContext?: string;
  entity: string;
  approvedBy?: string;
  createdAt: string;
};

let writeQueue: Promise<void> = Promise.resolve();

function storeDir(): string {
  return path.resolve(process.env.AGENT_LEARNING_DIR || "data/agent-learning");
}

function file(name: string): string {
  return path.join(storeDir(), name);
}

function normalize(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function appendJsonLine(target: string, value: unknown): Promise<void> {
  writeQueue = writeQueue.then(async () => {
    await fs.promises.mkdir(path.dirname(target), { recursive: true });
    await fs.promises.appendFile(target, `${JSON.stringify(value)}\n`, "utf8");
  });
  return writeQueue;
}

function readJsonLines<T>(target: string): T[] {
  if (!fs.existsSync(target)) return [];
  return fs.readFileSync(target, "utf8").split(/\r?\n/).filter(Boolean).flatMap((line) => {
    try { return [JSON.parse(line) as T]; } catch { return []; }
  });
}

export function answerSignature(interpretation: QuestionInterpretation, route: AnswerRoute): string {
  return [route, interpretation.reference || "", interpretation.entity, interpretation.sourceContext || ""].join(":");
}

export async function recordInteraction(input: Omit<InteractionRecord, "interactionId" | "createdAt" | "agentVersion">): Promise<InteractionRecord> {
  const record: InteractionRecord = {
    ...input,
    interactionId: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    agentVersion: process.env.AGENT_VERSION || "2.0.0"
  };
  await appendJsonLine(file("interactions.jsonl"), record);
  return record;
}

export function findInteraction(input: { interactionId?: string; idTask?: string; question?: string }): InteractionRecord | null {
  const records = readJsonLines<InteractionRecord>(file("interactions.jsonl"));
  return records.reverse().find((record) =>
    (input.interactionId ? record.interactionId === input.interactionId : true) &&
    (input.idTask ? record.idTask === input.idTask : true) &&
    (input.question ? normalize(record.question) === normalize(input.question) : true)
  ) || null;
}

export async function recordFeedback(input: {
  interactionId?: string;
  idTask?: string;
  question?: string;
  status: FeedbackStatus;
  correctedAnswer?: string;
  approvedBy?: string;
}): Promise<{ feedback: FeedbackRecord; interaction: InteractionRecord }> {
  const interaction = findInteraction(input);
  if (!interaction) throw new Error("Interação não localizada.");
  if (input.status === "CORRECTED" && !input.correctedAnswer?.trim()) throw new Error("correctedAnswer é obrigatório para status CORRECTED.");

  const reusable = (input.status === "APPROVED" || input.status === "CORRECTED") &&
    interaction.route !== "LIVE_PLATFORM" && interaction.route !== "UNKNOWN";
  const feedback: FeedbackRecord = {
    feedbackId: crypto.randomUUID(),
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
    const approved: ApprovedAnswerRecord = {
      approvalId: crypto.randomUUID(),
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

export function findApprovedAnswer(question: string, interpretation: QuestionInterpretation, route: AnswerRoute): { answer: string; approvalId: string } | null {
  if (route === "LIVE_PLATFORM" || route === "UNKNOWN") return null;
  const signature = answerSignature(interpretation, route);
  const latestFeedback = readJsonLines<FeedbackRecord>(file("feedback.jsonl")).reverse().find((feedback) => feedback.signature === signature);
  if (latestFeedback?.status === "REJECTED") return null;
  const records = readJsonLines<ApprovedAnswerRecord>(file("approved-answers.jsonl")).reverse();
  const normalizedQuestion = normalize(question);
  const match = records.find((record) => record.normalizedQuestion === normalizedQuestion) ||
    records.find((record) => record.signature === signature && Boolean(interpretation.reference));
  return match ? { answer: match.answer, approvalId: match.approvalId } : null;
}
