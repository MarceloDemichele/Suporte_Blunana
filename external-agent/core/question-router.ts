import { interpretBusinessRule } from "./business-rules";
import { findOperationalActionGuide } from "./operational-actions";
import { findScreenConsultationGuide } from "./screen-consultation";

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

function normalize(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function requiresLivePlatform(question: string): boolean {
  const text = normalize(question);
  const userSpecific = ["perfil de acesso", "permissoes da usuaria", "permissoes do usuario", "acessos da usuaria", "acessos do usuario"]
    .some((term) => text.includes(term));
  const currentRecord = ["status atual", "responsavel atual", "neste momento", "esta cadastrado", "esta cadastrada", "valor atual"]
    .some((term) => text.includes(term));
  const hasSpecificReference = /\s-\s+[a-z]/.test(text) || /\b\d{8,}\b/.test(text) ||
    ((text.includes("usuario") || text.includes("usuaria")) && text.split(" ").length >= 6);
  return (userSpecific && hasSpecificReference) || currentRecord;
}

function looksLikeBusinessQuestion(question: string): boolean {
  const text = normalize(question);
  return [
    "precisa", "deve", "pode", "obrigatorio", "regra", "automatico", "automaticamente",
    "qualquer usuario", "quem pode", "nao pode", "permitido", "restrito", "exige"
  ].some((term) => text.includes(term));
}

export function decideAnswerRoute(question: string): RouteDecision {
  if (requiresLivePlatform(question)) {
    return { route: "LIVE_PLATFORM", reason: "A resposta depende de dados atuais de um registro ou usuário específico." };
  }

  const action = findOperationalActionGuide(question);
  if (action) {
    return { route: "OPERATIONAL_PROCEDURE", reason: "A pergunta solicita um passo a passo operacional comprovado.", reference: action.id };
  }

  const rule = interpretBusinessRule(question);
  if (rule && (looksLikeBusinessQuestion(question) || rule.confidence >= 0.94)) {
    return { route: "BUSINESS_RULE", reason: "A pergunta contém intenção normativa e corresponde a uma regra consolidada.", reference: rule.rule.id };
  }

  const screen = findScreenConsultationGuide(question);
  if (screen && /consult|pesquis|localiz|busc|acess|onde vejo|como vejo|visualiz/i.test(normalize(question))) {
    return { route: "SCREEN_CONSULTATION", reason: "A pergunta solicita consulta de uma tela conhecida.", reference: screen.screen };
  }

  if (rule) {
    return { route: "BUSINESS_RULE", reason: "Assunto, intenção e condições correspondem a uma regra consolidada.", reference: rule.rule.id };
  }

  return { route: "UNKNOWN", reason: "Não houve correspondência comprovada com regra, procedimento ou consulta dinâmica identificável." };
}
