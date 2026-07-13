import { SearchResult } from "./search";

export function gerarResposta(pergunta: string, resultados: SearchResult[]): string {
  if (resultados.length === 0) {
    return `
Não encontrei base suficiente para responder com segurança.

Pergunta recebida:
${pergunta}

Próximo passo recomendado:
validar a dúvida com o time técnico ou executar nova engenharia reversa do módulo relacionado.
`;
  }

  const fontes = resultados.map((r) => `- ${r.file}`).join("\n");

  const trechos = resultados
    .map((r) => {
      return `
Arquivo: ${r.file}

${r.content.slice(0, 1500)}
`;
    })
    .join("\n---\n");

  return `
# Resposta do Agente Externo

## Pergunta
${pergunta}

## Resposta sugerida
Com base nos documentos encontrados, seguem os principais pontos relacionados à solicitação.

${trechos}

## Fontes consultadas
${fontes}

## Nível de confiança
Médio

## Observação
Esta resposta foi gerada com base nos arquivos locais do projeto. Se a documentação estiver desatualizada, execute novamente o crawler ou atualize a engenharia reversa.
`;
}