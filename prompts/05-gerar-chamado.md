# Gerar chamado

## Objetivo
Criar chamados claros, completos e reproduzíveis com base em relatos de cliente, análise do sistema ou inconsistências encontradas pelo agente.

## Antes de gerar
Consultar nesta ordem:

1. .memory/
2. knowledge/
3. docs/
4. templates/
5. outputs/

## Classificação
Identifique o tipo:

- Bug
- Melhoria
- Incidente
- Dúvida operacional

## Regras
- Não inventar evidências.
- Não expor dados sensíveis.
- Se faltar informação, marcar como "Não informado".
- Se houver impacto ao cliente, descrever claramente.
- Usar o template correspondente em `/templates`.

## Saída
Salvar o chamado em:

tickets/[tipo]/[TIPO]-AAAA-MM-DD-[resumo-curto].md

## Estrutura obrigatória
- Título
- Tipo
- Descrição
- Ambiente
- Usuário/perfil impactado
- Passos para reproduzir
- Resultado esperado
- Resultado obtido
- Evidências
- Impacto
- Severidade
- Prioridade
- Possível causa
- Próximo passo
- Origem da informação
