# Fluxo de interpretação e pesquisa do agente

## Objetivo

Responder dúvidas de suporte com base em regras de negócio comprovadas e memórias verificadas das telas, sem escolher uma resposta apenas porque o documento contém palavras parecidas com a pergunta.

## Ordem de decisão

1. Classificar a solicitação como `BUG`, `MELHORIA` ou `DUVIDA`.
2. Interpretar a pergunta em quatro dimensões: assunto, intenção, condição e polaridade.
3. Se a intenção for consulta, resolver primeiro o nome completo da tela por meio do catálogo das 13 telas suportadas.
4. Se não for consulta de tela, comparar a interpretação com a base estruturada de regras de negócio.
5. Responder pela regra somente quando houver cobertura suficiente dos elementos essenciais.
6. Se nenhuma regra for aplicável, procurar um procedimento comprovado nas memórias de telas e evidências de PROD.
7. Quando a resposta depender do estado atual da aplicação e o Playwright estiver habilitado, consultar a aplicação.
8. Sem comprovação suficiente, indicar necessidade de análise manual.

## Rotas de resposta

O roteador classifica cada pergunta em uma das seguintes rotas:

| Rota | Quando usar | Fonte da resposta |
|---|---|---|
| `BUSINESS_RULE` | Perguntas sobre obrigação, permissão, condição, cálculo, automatização ou consequência funcional. | Regras consolidadas. |
| `SCREEN_CONSULTATION` | Perguntas para consultar, pesquisar, localizar ou acessar uma das 13 telas. | Catálogo de telas e memória funcional. |
| `OPERATIONAL_PROCEDURE` | Perguntas que solicitam como criar, incluir ou executar uma ação conhecida. | Guia operacional validado. |
| `LIVE_PLATFORM` | Perguntas sobre usuário, processo, responsável, status ou valor específico e atual. | Navegação na plataforma e evidência do registro. |
| `UNKNOWN` | Perguntas ambíguas ou sem comprovação. | Análise manual; não presumir resposta. |

Sinais normativos como `pode`, `deve`, `precisa`, `obrigatório` e `automático` priorizam regras de negócio. Expressões como `como faço para criar` priorizam procedimento. Identificadores e pessoas específicas priorizam consulta dinâmica.

### Exemplos

- `Me detalhe o perfil de acesso da usuária - Anna Carolina Araújo Corrêa?` → `LIVE_PLATFORM`.
- `Como faço para criar um prazo?` → `OPERATIONAL_PROCEDURE`.
- `Qualquer usuário pode criar um prazo?` → `BUSINESS_RULE`, RN-043.
- `Como consultar Prazos?` → `SCREEN_CONSULTATION`.

## Base estruturada

As 64 regras atuais do arquivo `docs/regras-negocio/juridico-consolidado.md` estão representadas em `external-agent/core/business-rules.ts`. Cada registro possui:

- identificador da regra;
- assunto funcional;
- elementos semânticos obrigatórios;
- resposta aprovada;
- exemplo de pergunta;
- fonte documental.

O mecanismo exige o reconhecimento do assunto principal e uma cobertura mínima dos demais elementos. Por exemplo, a palavra `responsável` isoladamente não aciona a RN-024; a pergunta também deve tratar de processo e da obrigatoriedade ou ausência de responsável.

## Polaridade

O agente considera a forma afirmativa ou negativa da pergunta para evitar respostas contraditórias. Exemplos:

- `Todo processo precisa ter um responsável?` → `Sim`.
- `Um processo pode ficar sem responsável?` → `Não`.

## Pesquisa textual

A pesquisa textual permanece como apoio para localizar telas, filtros e evidências. Ela não é mais a fonte principal para decidir qual regra de negócio responde à pergunta.

## Catálogo de telas

As 13 telas do escopo atual possuem orientação própria em `external-agent/core/screen-consultation.ts`. Quando mais de um nome coincide, prevalece o alias mais completo. Assim, `Configuração do Prazo` tem prioridade sobre `Prazo`, e `Audiência Mutirão` tem prioridade sobre `Audiência`.

## Segurança

- `BUG` recebe orientação de análise manual, sem solução presumida.
- Perguntas ambíguas não devem selecionar uma regra.
- Perguntas sobre consequência ou automação entre funcionalidades não podem cair em uma resposta genérica de consulta; sem regra comprovada, devem solicitar análise manual.
- Evidências DEV e HML não são usadas na pesquisa operacional de resposta ao cliente.
- O Playwright não é acionado quando uma regra de negócio já responde à pergunta.

## Validação

Executar `npm run test:rules` para verificar todas as regras e as variações críticas. A inclusão ou alteração de uma regra deve atualizar a base estruturada e seu teste correspondente.

Executar `npm run test:battery` para validar a decisão completa entre regras, telas, procedimentos, navegação dinâmica e perguntas ambíguas.
