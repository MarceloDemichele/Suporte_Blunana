import { interpretQuestion, QuestionInterpretation } from "./question-interpreter";

export type AnswerRoute =
  | "LIVE_PLATFORM"
  | "SCREEN_CONSULTATION"
  | "OPERATIONAL_PROCEDURE"
  | "BUSINESS_RULE"
  | "UNKNOWN";

export type RouteDecision = {
  route: AnswerRoute;
  reason: string;
  reference?: string;
};

export function decideAnswerRoute(question: string, provided?: QuestionInterpretation): RouteDecision {
  const interpretation = provided || interpretQuestion(question);
  if (interpretation.intent === "CURRENT_DATA") return { route: "LIVE_PLATFORM", reason: "A interpretação identificou dado atual e referência específica.", reference: interpretation.reference };
  if (interpretation.intent === "PROCEDURE") return { route: "OPERATIONAL_PROCEDURE", reason: "A interpretação identificou pedido de execução operacional.", reference: interpretation.reference };
  if (interpretation.intent === "BUSINESS_RULE") return { route: "BUSINESS_RULE", reason: "A interpretação identificou dúvida normativa.", reference: interpretation.reference };
  if (interpretation.intent === "SCREEN_LOOKUP") return { route: "SCREEN_CONSULTATION", reason: "A interpretação identificou consulta de tela.", reference: interpretation.reference };
  return { route: "UNKNOWN", reason: interpretation.ambiguity || "A interpretação não encontrou intenção comprovável." };
}
