# Validacao de Templates

Data: 2026-07-06

## Objetivo

Validar a estrutura de templates do projeto conforme solicitacao recebida, usando `AGENTS.md` e `prompts/00-master-agent.md` como referencia operacional.

## Arquivos consultados

- `AGENTS.md`
- `prompts/00-master-agent.md`
- `templates/chamado-bug.md`
- `templates/chamado-melhoria.md`
- `templates/chamado-incidente.md`
- `templates/resposta-cliente.md`
- `templates/documentacao-funcional.md`

## Resultado da validacao

| Template | Status | Observacao |
|---|---|---|
| `templates/chamado-bug.md` | OK | Existe e foi atualizado com padrao profissional de QA/suporte, evidencias, ponto a validar e criterios de aceite. |
| `templates/chamado-melhoria.md` | OK | Existe e contem contexto, objetivo, impacto, evidencias, ponto a validar e criterios de aceite. |
| `templates/chamado-incidente.md` | OK | Existe e contem data/hora, ambiente, impacto, sistemas envolvidos, evidencias, contorno e status. |
| `templates/resposta-cliente.md` | OK | Existe e foi atualizado para resposta baseada em `/docs` e `/knowledge`, com confirmacoes, limitacoes, evidencias e ponto a validar. |
| `templates/documentacao-funcional.md` | OK | Existe e contem objetivo, descricao, fluxo, regras, campos, integracoes, permissoes, erros, testes, evidencias e pontos a validar. |

## Arquivos criados ou alterados nesta validacao

- `templates/chamado-bug.md`
- `templates/resposta-cliente.md`
- `outputs/relatorios/templates-validation.md`

## Pendencias

Nenhuma pendencia identificada para a estrutura de templates solicitada.

## Proximos passos

1. Usar `templates/chamado-bug.md`, `templates/chamado-melhoria.md` e `templates/chamado-incidente.md` ao executar `prompts/05-gerar-chamado.md`.
2. Usar `templates/resposta-cliente.md` ao executar `prompts/06-responder-cliente.md`.
3. Usar `templates/documentacao-funcional.md` quando uma nova funcionalidade precisar ser documentada.
