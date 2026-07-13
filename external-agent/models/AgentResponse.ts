export interface AgentResponse {
  success: boolean;

  type:
    | "SUPORTE"
    | "BUG"
    | "DOCUMENTACAO"
    | "QA"
    | "ENGENHARIA_REVERSA"
    | "GERAL";

  confidence: number;

  answer: string;

  summary: string;

  module?: string;

  screen?: string;

  action?:
    | "NONE"
    | "OPEN_TICKET"
    | "UPDATE_DOCUMENTATION"
    | "RUN_CRAWLER"
    | "CONTACT_SUPPORT";

  sources: string[];

  metadata: {
    searchedFiles: number;
    matchedFiles: number;
    executionTimeMs: number;
  };
}