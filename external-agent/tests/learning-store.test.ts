import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { findApprovedAnswer, recordFeedback, recordInteraction } from "../core/learning-store";
import { interpretQuestion } from "../core/question-interpreter";
import { decideAnswerRoute } from "../core/question-router";

const testDir = path.resolve("outputs/runtime-evidence", `learning-store-test-${process.pid}`);
process.env.AGENT_LEARNING_DIR = testDir;

async function main() {
  const question = "Como faço para incluir audiência mutirão?";
  const interpretation = interpretQuestion(question);
  const decision = decideAnswerRoute(question, interpretation);
  const interaction = await recordInteraction({
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
  assert.ok(interaction.interactionId);
  assert.equal(findApprovedAnswer(question, interpretation, decision.route), null);

  const approval = await recordFeedback({ interactionId: interaction.interactionId, status: "CORRECTED", correctedAnswer: "Resposta aprovada", approvedBy: "teste" });
  assert.equal(approval.feedback.reusable, true);
  assert.equal(findApprovedAnswer("Qual o caminho para cadastrar audiência de mutirão?", interpretation, decision.route)?.answer, "Resposta aprovada");
  await recordFeedback({ interactionId: interaction.interactionId, status: "REJECTED", approvedBy: "teste" });
  assert.equal(findApprovedAnswer(question, interpretation, decision.route), null);

  const liveQuestion = "O processo 10104920320258260020 existe?";
  const liveInterpretation = interpretQuestion(liveQuestion);
  const liveDecision = decideAnswerRoute(liveQuestion, liveInterpretation);
  const liveInteraction = await recordInteraction({
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
  const liveApproval = await recordFeedback({ interactionId: liveInteraction.interactionId, status: "APPROVED" });
  assert.equal(liveApproval.feedback.reusable, false);
  assert.equal(findApprovedAnswer(liveQuestion, liveInterpretation, liveDecision.route), null);

  fs.rmSync(testDir, { recursive: true, force: true });
  console.log("Histórico, feedback, resposta aprovada e bloqueio de dados atuais validados com sucesso.");
}

main().catch((error) => {
  if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true, force: true });
  console.error(error);
  process.exitCode = 1;
});
