# Fluxo funcional do Suporte Blunana

## Objetivo e escopo

O Suporte Blunana recebe uma solicitação de um agente externo ou operador, pesquisa a base local, responde com as fontes encontradas e, quando a base é insuficiente e a navegação está autorizada, consulta o Blunana via Playwright. Mudanças relevantes de procedimento, evidência ou conteúdo devem ser refletidas na documentação.

Este documento distingue:

- **fluxo implementado**: comportamento comprovado no código atual;
- **fluxo operacional obrigatório**: processo definido em `AGENTS.md` e nos prompts;
- **fluxo planejado ou incompleto**: componentes existentes que ainda não participam do caminho principal.

## Politica de ambiente para atendimento

Toda consulta usada para responder clientes deve ocorrer exclusivamente em PROD (`APP_ENV=prod`). DEV e HML nao sao fontes validas para orientacao operacional. Inventarios antigos desses ambientes podem ser mantidos como historico tecnico, mas nao devem fundamentar respostas.

HML pode ser usado separadamente para exploracao funcional controlada, inclusive abertura de modais e testes de preenchimento, quando `ALLOW_HML_MAPPING=true`. Evidencias de HML servem para descobrir fluxos, mas uma orientacao ao cliente so deve ser publicada depois de confirmar que a versao e o comportamento correspondem a PROD.

## Atores

| Ator | Responsabilidade |
|---|---|
| Agente externo/cliente | Enviar a pergunta ou demanda de suporte |
| Agente interno | Consultar fontes, avaliar evidências, navegar quando necessário e formular a resposta |
| Blunana Studio | Fornecer evidência em tempo real quando a consulta local não é suficiente |
| Time técnico | Validar lacunas, bugs e informações que não puderam ser comprovadas |
| Responsável pela documentação | Manter documentação, respostas, tickets e evidências sincronizados |

## Entradas disponíveis

### Linha de comando

```bash
npm run agent:ask -- "pergunta"
```

O texto após `--` é reunido em uma única pergunta. Se não houver pergunta, o processo informa `Informe uma pergunta.` e termina com código 1.

### API HTTP

O servidor é iniciado por:

```bash
npm run agent:server
```

No código atual, as rotas efetivamente montadas são:

| Método | Rota | Finalidade |
|---|---|---|
| `GET` | `/health` | Verificar se a API está ativa |
| `POST` | `/assistant` | Executar a consulta completa do assistente |

Corpo mínimo de `/assistant`:

```json
{
  "question": "Como funciona o fluxo de suporte?"
}
```

Campos opcionais: `environment` e `user`.

## Fontes consultadas

O mecanismo pesquisa recursivamente arquivos `.md`, `.json` e `.txt` nestas fontes:

1. `.memory/`
2. `knowledge/`
3. `docs/`
4. `index/`
5. `tickets/`
6. `support/`
7. `outputs/`
8. `engenharia-reversa/` e diretórios adicionais de engenharia reversa configurados

Diretórios inexistentes são ignorados. A orientação documental recomenda começar por `index/master-index.json`, mas a implementação atual pesquisa todas as fontes diretamente e não força essa precedência.

## Fluxo funcional ponta a ponta

```text
Solicitação recebida
        |
        v
Validar presença da pergunta
        |
        v
Pesquisar arquivos locais por termos da pergunta
        |
        +--> 2 ou mais resultados ----------------------+
        |                                                |
        +--> 0 ou 1 resultado + Playwright autorizado   |
        |             |                                  |
        |             v                                  |
        |       Login + coleta de título, URL e menu     |
        |                                                |
        v                                                v
Gerar resposta com trechos e fontes encontradas
        |
        v
Calcular confiança e ação recomendada (API)
        |
        v
Entregar resposta e registrar saída/evidência aplicável
        |
        v
Atualizar documentação ou registrar pendência quando necessário
```

### 1. Recepção e validação

- A CLI recebe a pergunta pelos argumentos do processo.
- A API recebe `question` no JSON da requisição.
- Na API, pergunta ausente retorna HTTP 400, confiança `0`, ação `CONTACT_SUPPORT` e `success: false`.

### 2. Identificação da demanda

O processo operacional determina se a solicitação é suporte, bug, documentação, engenharia reversa, QA ou geral. Existe uma função `planner` com classificação por palavras-chave, porém ela não é chamada pela CLI nem pelo endpoint `/assistant`. Portanto, essa classificação é atualmente uma regra operacional/manual, não uma decisão ativa do sistema.

### 3. Busca local

Para cada arquivo elegível:

1. pergunta, caminho e conteúdo são normalizados para minúsculas e sem acentos;
2. a pergunta é dividida por espaços;
3. palavras genéricas são descartadas e o score considera os termos relevantes encontrados;
4. inventários de menu e telas têm prioridade para perguntas operacionais de navegação;
5. resultados com score zero são descartados;
6. os resultados são ordenados por score decrescente;
7. no máximo 10 arquivos são usados.

Não há busca semântica, tratamento de stopwords, ponderação por fonte ou validação de atualidade.

### 4. Decisão de navegar

O endpoint `/assistant` e a CLI possuem fallback de navegação. A navegação ocorre quando:

- a base local não produz uma orientação operacional comprovada; e
- `ALLOW_PLAYWRIGHT=true`.

O provedor autentica no Blunana e coleta o título, a URL e até 50 links, botões ou itens de menu. O navegador é fechado ao final. A CLI não executa esse fallback.

Há outro coletor, `runNavigation`, capaz de extrair campos, botões e links, sanitizar alguns dados pessoais e salvar JSON em `outputs/runtime-evidence/`; ele não é usado pelo endpoint atual.

### 5. Geração da resposta

Para perguntas operacionais, o agente procura uma tela ou item de menu comprovado nos inventários locais ou na evidência de navegação e devolve uma instrução curta destinada ao usuário. Os documentos e JSON usados permanecem como evidência interna e não são despejados na resposta.

Se não houver passo a passo comprovado, o agente informa que a orientação precisa ser validada no Blunana ou pelo suporte. A evidência coletada pelo Playwright pode ser usada para localizar o menu e também é devolvida separadamente em `runtimeEvidence` pela API.

### 6. Confiança e ação na API

| Condição | Confiança | `success` | Ação |
|---|---:|---|---|
| 3 ou mais arquivos | 90 | `true` | `NONE` |
| 1 ou 2 arquivos | 75 | `true` | `NONE` |
| Nenhum arquivo, com navegação usada | 60 | `true` | `CONTACT_SUPPORT` |
| Nenhum arquivo e sem navegação | 0 | `false` | `CONTACT_SUPPORT` |

Observação: a ação permanece `CONTACT_SUPPORT` quando só existe evidência de navegação, porque a ação considera apenas a presença de resultados locais.

### 7. Saída e rastreabilidade

- A CLI imprime a resposta e salva um Markdown com timestamp em `external-agent/logs/`.
- A API retorna JSON com resposta, fontes, confiança, ação, evidência de navegação e metadados de execução, mas não grava automaticamente um arquivo de resposta.
- Respostas formais ao cliente devem seguir `templates/resposta-cliente.md` e ser salvas em `support/respostas/RESPOSTA-AAAA-MM-DD-[resumo].md`.
- Bugs, incidentes, melhorias ou lacunas devem gerar chamado/pendência conforme os templates e prompts aplicáveis.
- Mudança comprovada de fluxo ou conteúdo exige atualização da documentação impactada.

## Fluxo de navegação e engenharia reversa do Blunana

Quando é necessária evidência do sistema, o fluxo técnico disponível é:

1. carregar `.env.{APP_ENV}`;
2. abrir sessão Chromium com Playwright;
3. acessar a URL configurada;
4. localizar e preencher usuário e senha;
5. gerar e preencher o MFA TOTP quando solicitado;
6. considerar o login concluído quando a URL deixa de conter `/auth/login`;
7. coletar menu, rotas e metadados de tela conforme o executor utilizado;
8. salvar JSON, relatórios, logs e screenshots opcionais separados por ambiente;
9. registrar erro por tela sem necessariamente interromper toda a coleta;
10. evitar ações transacionais sem autorização explícita.

As evidências existentes em DEV registram 43 telas em sete agrupamentos: autenticação, dashboard, governança, construção e dados, relatórios/logs, configurações e operação jurídica customizada. Campos internos, permissões por perfil, APIs e regras de negócio das telas customizadas ainda são pontos a validar.

## Regras de segurança

- Nunca inventar uma resposta ou regra de negócio.
- Não expor senha, segredo MFA, token, cookie ou dados reais.
- Tratar screenshots de PROD como potencialmente sensíveis.
- Preferir `CAPTURE_SCREENSHOTS=false` em PROD até haver política de mascaramento.
- Se a evidência for insuficiente, declarar a lacuna e encaminhar para validação técnica.
- Não criar, editar ou excluir dados no Blunana durante coleta exploratória sem autorização explícita.

## Lacunas funcionais relevantes para os testes

1. `planner`/classificação existe, mas não participa do caminho principal.
2. O OpenAPI descreve `/sources`, `/search` e `/ask`, mas o servidor monta apenas `/health` e `/assistant`.
3. O endpoint `/search` existente no código é apenas um stub e não executa busca real.
4. A resposta usa recortes iniciais dos documentos, sem síntese baseada no conteúdo completo.
5. A confiança textual da resposta é sempre `Médio`, enquanto a API calcula confiança numérica separadamente.
6. Evidência do Playwright não alimenta o texto da resposta.
7. A CLI não tenta navegação quando a base local é insuficiente.
8. A API não persiste respostas formais em `support/respostas/` nem atualiza documentação automaticamente.
9. O coletor mais completo e sanitizado de evidência (`runNavigation`) não está ligado ao endpoint.
10. Permissões, formulários, regras e integrações das telas customizadas não estão comprovados.

## Roteiro mínimo de testes

| ID | Cenário | Resultado esperado atual |
|---|---|---|
| SUP-001 | `GET /health` | HTTP 200 com status `ok` |
| SUP-002 | `POST /assistant` sem `question` | HTTP 400, confiança 0 e `CONTACT_SUPPORT` |
| SUP-003 | Pergunta com 3+ fontes locais | Confiança 90, fontes listadas, sem Playwright |
| SUP-004 | Pergunta com 1 fonte e Playwright desabilitado | Confiança 75, sem navegação |
| SUP-005 | Pergunta sem fonte e Playwright desabilitado | `success: false`, confiança 0 e orientação de validação |
| SUP-006 | Pergunta com menos de 2 fontes e Playwright habilitado | Tentativa de login, evidência em `runtimeEvidence` e browser fechado |
| SUP-007 | CLI sem pergunta | Mensagem de obrigatoriedade e código de saída 1 |
| SUP-008 | CLI com pergunta conhecida | Resposta impressa e Markdown criado em `external-agent/logs/` |
| SUP-009 | Consulta com acentos e variação de caixa | Busca encontra versão normalizada |
| SUP-010 | Mais de 10 documentos compatíveis | Apenas 10 resultados retornados |
| SUP-011 | Chamada a `/ask`, `/search` ou `/sources` | HTTP 404 no servidor atual |
| SUP-012 | Falha de login/navegação | Browser deve fechar; a API deve tratar a rejeição — comportamento de erro HTTP ainda precisa ser validado |
| SUP-013 | Revisão de segurança | Resposta/log não contém credenciais, tokens ou segredos |
| SUP-014 | Demanda classificada como bug | Classificação e abertura de chamado são manuais no fluxo atual |
| SUP-015 | Nova evidência altera procedimento | Documento impactado e fonte devem ser atualizados |

## Evidências principais

- `AGENTS.md`
- `README.md`
- `prompts/00-master-agent.md`
- `prompts/06-responder-cliente.md`
- `external-agent/index.ts`
- `external-agent/core/search.ts`
- `external-agent/core/answer.ts`
- `external-agent/core/router.ts`
- `external-agent/api/server.ts`
- `external-agent/api/controllers/assistant.controller.ts`
- `external-agent/providers/playwright.provider.ts`
- `external-agent/engine/navigation.engine.ts`
- `crawler-interface/auth/login.ts`
- `crawler-interface/collectors/menu.collector.ts`
- `crawler-interface/collectors/screens.collector.ts`
- `engenharia-reversa/blunana/01-visao-geral.md`
- `engenharia-reversa/blunana/07-cenarios-de-teste-qa.md`
- `engenharia-reversa/blunana/10-pontos-a-validar.md`
