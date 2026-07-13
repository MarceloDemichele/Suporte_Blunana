export type AgentTask =
  | "SUPORTE"
  | "BUG"
  | "DOCUMENTACAO"
  | "ENGENHARIA_REVERSA"
  | "QA"
  | "GERAL";

export function planner(question: string): AgentTask {

  const q = question.toLowerCase();

  if (q.includes("erro") || q.includes("bug"))
    return "BUG";

  if (
    q.includes("como") ||
    q.includes("onde") ||
    q.includes("quem")
  )
    return "SUPORTE";

  if (
    q.includes("document")
  )
    return "DOCUMENTACAO";

  if (
    q.includes("engenharia")
  )
    return "ENGENHARIA_REVERSA";

  if (
    q.includes("teste") ||
    q.includes("cenário")
  )
    return "QA";

  return "GERAL";
}