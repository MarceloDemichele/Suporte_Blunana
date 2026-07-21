# Fluxo de interpretação e pesquisa do agente

## Objetivo

Responder dúvidas de suporte com base em regras de negócio comprovadas e memórias verificadas das telas, sem escolher uma resposta apenas porque o documento contém palavras parecidas com a pergunta.

## Ordem de decisão

1. Interpretar a pergunta antes de executar qualquer busca ou navegação.
2. Produzir uma estrutura com intenção, entidade, ação, contexto de origem, identificadores, confiança e ambiguidade.
3. Decidir a rota e a fonte necessária a partir dessa interpretação.
4. Para dados atuais com identificador específico, ignorar a busca documental e consultar a plataforma em modo somente leitura.
5. Para regras, procedimentos e telas, pesquisar somente as fontes coerentes com os conceitos interpretados.
6. Validar a resposta contra a regra, o guia operacional ou a evidência coletada.
7. Classificar a solicitação como `BUG`, `MELHORIA` ou `DUVIDA` para formar o contrato de saída.
8. Sem intenção ou referência suficiente, não pesquisar nem navegar; indicar necessidade de esclarecimento ou análise manual.

## Interpretação estruturada

`external-agent/core/question-interpreter.ts` é executado antes da pesquisa e produz:

- intenção: dado atual, procedimento, consulta de tela, regra de negócio ou desconhecida;
- entidade: usuário, processo, publicação, prazo, audiência, audiência mutirão, ateste ou tela;
- ação: criar, consultar, verificar existência, verificar status, verificar permissões ou explicar regra;
- contexto de origem: Processo, Publicação, Prazo, Audiência ou Mutirão;
- identificadores extraídos, como número do processo e nome do usuário;
- decisão explícita sobre consultar conhecimento local ou a plataforma;
- confiança e motivo de ambiguidade.

O roteador, a pesquisa, a navegação e a resposta reutilizam a mesma interpretação. Eles não devem reconstruir intenções independentes durante o fluxo.

### Modo semântico por modelo

Quando `OPENAI_API_KEY` está configurada e `QUESTION_INTERPRETER_MODE=hybrid`, o agente usa a Responses API com saída JSON estrita para interpretar linguagem livre. O modelo padrão da função de interpretação é configurável por `OPENAI_INTERPRETER_MODEL`; o exemplo usa `gpt-5.6-luna`, adequado ao papel de classificação e extração em alto volume.

O modelo escolhe apenas capacidades cadastradas: regras, telas, procedimentos e filtros de leitura. O código rejeita combinações não suportadas, timeouts, erros HTTP e JSON inválido, retornando automaticamente ao interpretador local. A resposta nunca é aceita como evidência; o modelo produz apenas o plano, que ainda precisa ser executado e validado.

Variáveis:

- `QUESTION_INTERPRETER_MODE=hybrid`: usa modelo quando disponível e fallback local.
- `QUESTION_INTERPRETER_MODE=local`: desabilita chamadas ao modelo.
- `OPENAI_API_KEY`: credencial mantida somente no arquivo de ambiente não versionado.
- `OPENAI_INTERPRETER_MODEL`: modelo usado para interpretação.
- `OPENAI_INTERPRETER_TIMEOUT_MS`: limite da chamada antes do fallback.

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

Para pedidos operacionais, o roteador normaliza variações verbais e nominais da ação, como `incluir/inclusão`, `criar/criação`, `cadastrar/cadastro`, `registrar/registro` e `lançar/lançamento`. Sinais como `como`, `onde`, `forma`, `caminho`, `procedimento`, `quero` e `preciso` indicam busca por passo a passo. Perguntas normativas de permissão (`quem pode`, `qualquer usuário`, `precisa de permissão`) permanecem no fluxo de regras de negócio.

O fallback local reconhece radicais das ações operacionais, cobrindo conjugações como `incluo`, `incluímos`, `adiciono`, `cadastramos` e `registraria`, sem depender de uma lista de frases completas.

Quando uma tela do catálogo é reconhecida e a pergunta não representa dado atual, procedimento ou regra de negócio, o fallback seleciona `SCREEN_LOOKUP` por exclusão de rotas incompatíveis. Assim, pedidos como `o que é demonstrado`, `quais informações aparecem`, `me explique` e `para que serve` não dependem de verbos cadastrados individualmente.

Perguntas de existência atual, como `está na base`, `consta no sistema` e `foi localizado`, seguem para consulta direcionada somente quando contêm um identificador específico, como número de processo ou nome completo de usuário.

## Segurança

- `BUG` recebe orientação de análise manual, sem solução presumida.
- Perguntas ambíguas não devem selecionar uma regra.
- Perguntas sobre consequência ou automação entre funcionalidades não podem cair em uma resposta genérica de consulta; sem regra comprovada, devem solicitar análise manual.
- Evidências DEV e HML não são usadas na pesquisa operacional de resposta ao cliente.
- O Playwright não é acionado quando uma regra de negócio já responde à pergunta.

## Validação

Executar `npm run test:rules` para verificar todas as regras e as variações críticas. A inclusão ou alteração de uma regra deve atualizar a base estruturada e seu teste correspondente.

Executar `npm run test:battery` para validar a decisão completa entre regras, telas, procedimentos, navegação dinâmica e perguntas ambíguas.

Executar `npm run test:interpretation` para validar a estrutura produzida antes da busca, incluindo intenção, entidade, ação, contexto, identificadores e escolha da fonte.
