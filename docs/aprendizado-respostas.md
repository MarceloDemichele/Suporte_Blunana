# Histórico e respostas aprovadas

## Objetivo

O agente registra automaticamente cada pergunta e resposta para auditoria. O histórico não é tratado como conhecimento confiável. Somente respostas explicitamente aprovadas ou corrigidas entram na base reutilizável.

## Arquivos persistentes

Por padrão, os registros ficam em `data/agent-learning/`:

- `interactions.jsonl`: perguntas, respostas, interpretação, rota e fontes;
- `feedback.jsonl`: aprovação, rejeição ou correção;
- `approved-answers.jsonl`: respostas autorizadas para reutilização.

O diretório pode ser alterado por `AGENT_LEARNING_DIR`. Ele não é versionado porque pode conter dados operacionais.

## Registro de interação

`POST /assistant` mantém o contrato JSON atual e devolve o identificador no cabeçalho `X-Interaction-ID`.

## Feedback

Use `POST /assistant/feedback`:

```json
{
  "interactionId": "UUID retornado no cabeçalho",
  "status": "CORRECTED",
  "correctedAnswer": "Resposta validada pelo suporte",
  "approvedBy": "identificação do revisor"
}
```

Os status aceitos são:

- `APPROVED`: aprova a resposta original;
- `REJECTED`: registra a rejeição, sem reutilização;
- `CORRECTED`: registra e aprova `correctedAnswer`.

Também é possível localizar a interação mais recente por `ID_TASK` e, opcionalmente, `question`.

Se `AGENT_FEEDBACK_TOKEN` estiver configurado, envie-o no cabeçalho `X-Feedback-Token`. Sem token, feedback só é aceito pela interface local.

## Reutilização segura

Uma resposta aprovada pode ser reutilizada quando a nova pergunta produz a mesma rota, referência, entidade e contexto de origem. Consultas `LIVE_PLATFORM` e perguntas `UNKNOWN` nunca alimentam a base reutilizável. Assim, status de processos, permissões de usuários e outros dados momentâneos sempre são consultados novamente.

Uma rejeição posterior revoga a reutilização das aprovações anteriores com a mesma assinatura semântica até que uma nova correção ou aprovação seja registrada.
