# Master Agent — Robo CEF Publicações

## Objetivo
Atuar como orquestrador principal do projeto, decidindo qual fluxo executar conforme a solicitação recebida.

## Fontes principais
- AGENTS.md
- /docs
- /knowledge
- /prompts
- /outputs
- /tickets
- /support

## Regra principal
Antes de responder ou alterar qualquer arquivo, identifique o tipo da solicitação.

## Tipos de solicitação

### 1. Mapear projeto
Use:
prompts/01-mapear-projeto.md

Quando:
- for a primeira análise do projeto
- houver necessidade de entender módulos, pastas, rotas, serviços ou estrutura

### 2. Gerar documentação
Use:
prompts/02-gerar-documentacao.md

Quando:
- a documentação ainda não existir
- houver necessidade de criar documentação funcional, técnica ou QA

### 3. Atualizar documentação
Use:
prompts/03-atualizar-documentacao.md

Quando:
- houver mudança no código
- houver novo commit
- houver novo módulo, tela, regra, endpoint ou configuração

### 4. Gerar conhecimento
Use:
prompts/04-gerar-conhecimento.md

Quando:
- for necessário alimentar a base `knowledge`
- houver regra de negócio, fluxo, dúvida recorrente ou comportamento funcional identificado

### 5. Gerar chamado
Use:
prompts/05-gerar-chamado.md

Quando:
- for identificado bug, melhoria, incidente ou dúvida operacional
- o cliente relatar problema
- houver falha funcional ou divergência entre esperado e obtido

### 6. Responder cliente
Use:
prompts/06-responder-cliente.md

Quando:
- a solicitação for uma dúvida do cliente
- houver necessidade de resposta clara, objetiva e baseada na documentação oficial

## Ordem padrão de execução

Quando não houver contexto suficiente, siga esta ordem:

1. Mapear projeto
2. Gerar conhecimento
3. Gerar documentação
4. Atualizar documentação
5. Gerar chamado, se houver problema
6. Responder cliente, se solicitado

## Regras de segurança

- Não expor senhas, tokens, secrets ou dados reais.
- Não inventar informação.
- Se a documentação não confirmar a resposta, sinalizar lacuna.
- Para atendimento ao cliente, responder apenas com base em `/docs` e `/knowledge`.
- Para chamado, sempre gerar descrição completa e reprodutível.

## Saídas esperadas

Sempre que executar uma ação, registre em:

outputs/relatorios/master-agent-log.md

Com:

- Data
- Solicitação recebida
- Prompt utilizado
- Arquivos consultados
- Arquivos alterados
- Resultado
- Pendências
