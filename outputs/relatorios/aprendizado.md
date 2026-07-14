# Aprendizado Continuo

## 2026-07-08

## Atualizacao - revisao e abertura de PRs pendentes

## Conhecimento novo

- Os PRs pendentes revisados foram #16, #17 e #18.
- O PR #16 (`codex-agent` -> `main`) segue aberto como draft e requer review.
- O PR #17 (`codex-agent-doc-structure` -> `codex-agent`) segue aberto como draft e esta aprovado.
- O PR #18 (`agent/assistente-cef-blunana` -> `codex-agent-doc-structure`) foi aberto como draft para manter a pilha de mudancas.

## Conhecimento atualizado

- `.env` e `.env.*` passam a ser ignorados pelo Git.
- Screenshots PNG devem permanecer como evidencias locais nao versionadas, enquanto a estrutura de diretorios entra com `.gitkeep`.
- `external-agent/api/controllers/assistant.controller.ts` usa import dinamico com `.js` para compatibilidade com `moduleResolution: Node16`.

## Documentos alterados

- `.memory/contexto.md`
- `.memory/historico.md`
- `.memory/decisoes.md`
- `outputs/relatorios/aprendizado.md`
- `.gitignore`
- `external-agent/api/controllers/assistant.controller.ts`

## Pendencias encontradas

- #16 ainda precisa de review.
- Os tres PRs seguem como draft.
- Screenshots reais em `outputs/screenshots/**/*.png` continuam fora do Git por seguranca.

## Recomendacoes

- Mesclar a pilha na ordem #16, #17 e #18.
- Revisar evidencias visuais localmente antes de decidir se alguma imagem pode ser publicada com mascaramento.

## 2026-07-07

## Atualizacao - executor inicial do assistente

## Conhecimento novo

- `external-agent/index.ts` agora e o executor inicial do Assistente IA CEF.
- O executor recebe a pergunta por argumento, monta fontes a partir de `paths` e imprime os resultados da busca.

## Conhecimento atualizado

- O comando esperado passa a ser `npm run agent:cef -- "pergunta"`.
- O caso sem pergunta retorna `Informe uma pergunta.` e encerra com exit code 1.

## Documentos alterados

- `external-agent/index.ts`
- `external-agent/README.md`
- `docs/tecnica/configuracoes.md`
- `docs/tecnica/arquitetura.md`
- `docs/changelog.md`
- `engenharia-reversa/blunana/README.md`
- `docs/reverse-engineering-blunana-prompt.md`
- `.memory/contexto.md`
- `.memory/historico.md`
- `.memory/decisoes.md`

## Pendencias encontradas

- Definir formato estruturado de saida para consumo por outra camada.

## Recomendacoes

- Manter o executor simples ate existir provider de IA e camada de contexto.

## Atualizacao - busca local MD/JSON

## Conhecimento novo

- O Assistente IA CEF possui busca local em `external-agent/core/search.ts`.
- A busca percorre diretorios, considera arquivos `.md` e `.json`, pontua por termos encontrados e retorna ate 8 resultados.

## Conhecimento atualizado

- `external-agent/core/search.ts` exporta `buscar`; `external-agent/index.ts` usa a busca no executor inicial.
- `index/master-index.json` referencia o arquivo de busca.
- Documentacao tecnica e rastreabilidade registram a nova capacidade.

## Documentos alterados

- `external-agent/core/search.ts`
- `external-agent/index.ts`
- `external-agent/README.md`
- `index/master-index.json`
- `docs/tecnica/arquitetura.md`
- `docs/tecnica/configuracoes.md`
- `docs/changelog.md`
- `engenharia-reversa/blunana/README.md`
- `docs/reverse-engineering-blunana-prompt.md`
- `.memory/contexto.md`
- `.memory/historico.md`
- `.memory/decisoes.md`

## Pendencias encontradas

- Definir se a busca deve retornar trechos resumidos em vez do conteudo completo.
- Definir filtros para evitar leitura de arquivos grandes ou sensiveis.

## Recomendacoes

- Usar a busca como primeira recuperacao local de contexto do Assistente IA CEF.
- Evoluir posteriormente para ranking por metadados do `index/master-index.json`.

## Atualizacao - configuracao de fontes do assistente

## Conhecimento novo

- As fontes locais do Assistente IA CEF ficam centralizadas em `external-agent/config/paths.ts`.
- O assistente passa a centralizar `paths` em `external-agent/config/paths.ts`.

## Conhecimento atualizado

- `index/master-index.json` referencia `external-agent/config/paths.ts`.
- Documentacao tecnica e rastreabilidade registram a configuracao de fontes.

## Documentos alterados

- `external-agent/config/paths.ts`
- `external-agent/index.ts`
- `external-agent/README.md`
- `index/master-index.json`
- `docs/tecnica/configuracoes.md`
- `docs/tecnica/arquitetura.md`
- `docs/changelog.md`
- `engenharia-reversa/blunana/README.md`
- `docs/reverse-engineering-blunana-prompt.md`
- `.memory/contexto.md`
- `.memory/historico.md`
- `.memory/decisoes.md`

## Pendencias encontradas

- Definir se `external-agent/config/paths.ts` deve incluir tambem `index/master-index.json`, `prompts` e `templates`.

## Recomendacoes

- Usar `external-agent/config/paths.ts` como fonte programatica e `index/master-index.json` como mapa mestre de roteamento.

## Atualizacao - indice mestre

## Conhecimento novo

- O Assistente IA CEF deve consultar `index/master-index.json` antes de procurar arquivos diretamente.
- O indice define ordem de consulta, fontes principais, dominios, rotas de artefatos e comandos relevantes.

## Conhecimento atualizado

- `index/master-index.json` permanece como mapa mestre de roteamento; o executor inicial usa `paths` para montar fontes locais.
- `external-agent/README.md` documenta o uso do indice mestre.
- Documentacao tecnica e rastreabilidade passaram a citar o indice.

## Documentos alterados

- `index/master-index.json`
- `external-agent/index.ts`
- `external-agent/README.md`
- `docs/tecnica/arquitetura.md`
- `docs/tecnica/configuracoes.md`
- `docs/changelog.md`
- `engenharia-reversa/blunana/README.md`
- `docs/reverse-engineering-blunana-prompt.md`
- `.memory/contexto.md`
- `.memory/historico.md`
- `.memory/decisoes.md`

## Pendencias encontradas

- Automatizar a atualizacao do indice quando novas pastas/fontes forem criadas.

## Recomendacoes

- Tratar `index/master-index.json` como primeira fonte de roteamento do Assistente IA CEF.
- Atualizar o indice sempre que houver novo dominio, nova fonte ou nova pasta estrutural.

## Atualizacao - Assistente IA CEF

## Conhecimento novo

- O objetivo final do projeto passa a ser o Assistente IA CEF.
- O crawler continua como fonte auxiliar de evidencias e engenharia reversa, mas nao como centro da arquitetura final.
- A pasta `external-agent/` concentra a evolucao do assistente.

## Conhecimento atualizado

- `external-agent/` possui estrutura inicial com `config`, `core`, `context`, `providers`, `services`, `prompts`, `tools`, `cache`, `logs`, `index.ts` e `README.md`.
- `package.json` inclui `npm run agent:cef`.
- `tsconfig.json` passa a compilar `external-agent/**/*.ts`.

## Documentos alterados

- `external-agent/README.md`
- `external-agent/index.ts`
- `package.json`
- `tsconfig.json`
- `docs/tecnica/arquitetura.md`
- `docs/tecnica/configuracoes.md`
- `docs/changelog.md`
- `engenharia-reversa/blunana/README.md`
- `docs/reverse-engineering-blunana-prompt.md`
- `.memory/contexto.md`
- `.memory/historico.md`
- `.memory/decisoes.md`

## Pendencias encontradas

- Definir provider de IA, politica de cache, ferramentas permitidas e formato de contexto do Assistente IA CEF.

## Recomendacoes

- Manter `external-agent/` independente do crawler.
- Consumir `knowledge/`, `docs/`, `engenharia-reversa/`, `tickets/` e `outputs/` como fontes de contexto.

## Atualizacao - estrutura raiz solicitada

## Conhecimento novo

- A documentacao de engenharia reversa consolidada fica em `engenharia-reversa/`.
- `outputs/` fica reservado para artefatos de execucao separados por tipo: `logs`, `json`, `screenshots`, `relatorios` e `temp`.
- Artefatos continuam separados por dominio e ambiente dentro de cada tipo.

## Conhecimento atualizado

- A engenharia reversa de Blunana passou a ser consolidada em `engenharia-reversa/blunana/`.
- Engenharia reversa Blunana foi movida para `engenharia-reversa/blunana/`.
- Artefatos historicos Blunana foram migrados para `outputs/json/blunana/dev/`, `outputs/screenshots/blunana/dev/`, `outputs/screenshots/blunana/prod/` e `outputs/relatorios/blunana/dev/`.
- `config/paths.ts` agora separa JSON, screenshots, logs, relatorios e temporarios.

## Documentos alterados

- `config/paths.ts`
- `crawler-interface/reverse-prod.ts`
- `crawler-interface/test-login.ts`
- `crawler-interface/test-menu.ts`
- `engenharia-reversa/README.md`
- `docs/tecnica/organizacao-artefatos.md`
- `docs/tecnica/configuracoes.md`
- `prompts/07-aprendizado-continuo.md`
- `engenharia-reversa/blunana/README.md`
- `docs/reverse-engineering-blunana-prompt.md`

## Pendencias encontradas

- Avaliar se relatorios historicos gerais em `outputs/relatorios/` devem ganhar subpasta propria por dominio.

## Recomendacoes

- Nao criar novos arquivos diretamente na raiz de `outputs/`.
- Usar `engenharia-reversa/` para documentacao consolidada e `outputs/` apenas para artefatos gerados.

## Atualizacao - organizacao por dominio e ambiente

## Conhecimento novo

- Os artefatos passaram a ser separados por dominio e ambiente.
- Blunana deve usar `outputs/{tipo}/blunana/{dev,hml,prod}` para artefatos e `engenharia-reversa/blunana/` para documentacao consolidada.
- Os artefatos de suporte devem ficar em `outputs/{tipo}/` e a documentação consolidada em `engenharia-reversa/blunana/`.
- `config/paths.ts` usa `OUTPUT_DOMAIN` com padrao `blunana` e `APP_ENV` para compor `outputs/{tipo}/{OUTPUT_DOMAIN}/{APP_ENV}`.

## Conhecimento atualizado

- `crawler-interface/reverse-prod.ts` cria estrutura propria em `outputs/relatorios/blunana/prod/`, JSON em `outputs/json/blunana/prod/` e logs em `outputs/logs/blunana/prod/`.
- As matrizes de rastreabilidade documentam as pastas novas e a regra de separacao.
- A documentacao tecnica registra que todo arquivo novo deve ser classificado por dominio, ambiente e tipo de artefato.

## Documentos alterados

- `config/paths.ts`
- `crawler-interface/reverse-prod.ts`
- `docs/tecnica/organizacao-artefatos.md`
- `docs/blunana/README.md`
- `docs/robos/README.md`
- `docs/changelog.md`
- `docs/reverse-engineering-blunana-prompt.md`
- `engenharia-reversa/blunana/06-regras-de-negocio.md`
- `engenharia-reversa/blunana/README.md`
- `engenharia-reversa/blunana/*.md`
- `.memory/contexto.md`
- `.memory/historico.md`
- `.memory/decisoes.md`

## Pendencias encontradas

- Executar `npm run reverse:prod` somente em janela autorizada para gerar evidencias reais em `outputs/{tipo}/blunana/prod/`.
- Definir se algum robo especifico precisara de subpasta propria dentro de `outputs/{tipo}/robos/{ambiente}`.

## Recomendacoes

- Nunca criar novos artefatos direto em `outputs/` quando houver dominio e ambiente identificaveis.
- Preservar inventarios historicos na raiz apenas como legado, movendo novos resultados para a estrutura padronizada.

## Atualizacao - links Blunana

## Conhecimento novo

- A URL oficial de login/navegacao inicial do Blunana para este trabalho e `https://epm.blueprojects.com.br/@rocha_juridico/studio/auth/login`.
- As rotas mapeadas devem usar o tenant `@rocha_juridico`.

## Conhecimento atualizado

- `.env.dev`, `.env.hml` e `.env.prod` apontam `APP_URL` para a URL oficial de login.
- Inventarios e documentacao de engenharia reversa foram atualizados para remover referencias aos hosts e tenants antigos.

## Documentos alterados

- `.env.dev`
- `.env.hml`
- `.env.prod`
- `outputs/json/blunana/dev/blunana-menu.json`
- `outputs/json/blunana/dev/blunana-telas.json`
- `outputs/relatorios/blunana/dev/blunana-inventario.md`
- `knowledge/frontend/rotas-blunana.md`
- `docs/funcional/mapa-navegacao-blunana.md`
- `engenharia-reversa/blunana/*.md`

## Pendencias encontradas

- Executar `npm run reverse:prod` para regenerar evidencias reais ja com o tenant corrigido.

## Recomendacoes

- Evitar reintroduzir hosts ou tenants antigos nos artefatos Blunana.

## Atualizacao - executor Blunana PROD

## Conhecimento novo

- Foi criado `crawler-interface/reverse-prod.ts` como executor de engenharia reversa Blunana PROD.
- Foi adicionado `npm run reverse:prod`, que define `APP_ENV=prod`, executa login, coleta menu/telas e gera logs em `outputs/logs/blunana/prod/`.

## Conhecimento atualizado

- `docs/tecnica/configuracoes.md` documenta o novo executor.
- `engenharia-reversa/blunana/*` registra o executor, regras operacionais, cenarios QA, riscos e pontos a validar.
- `docs/reverse-engineering-blunana-prompt.md` e `engenharia-reversa/blunana/README.md` cobrem `crawler-interface/reverse-prod.ts`.

## Documentos alterados

- `crawler-interface/reverse-prod.ts`
- `package.json`
- `docs/tecnica/configuracoes.md`
- `engenharia-reversa/blunana/*.md`
- `engenharia-reversa/blunana/06-regras-de-negocio.md`
- `docs/reverse-engineering-blunana-prompt.md`
- `engenharia-reversa/blunana/README.md`

## Pendencias encontradas

- Executar `npm run reverse:prod` em ambiente autorizado.
- Avaliar se o screenshot inicial do executor deve respeitar `CAPTURE_SCREENSHOTS`.

## Recomendacoes

- Revisar evidencias em `outputs/{tipo}/blunana/prod/` antes de compartilhar.
- Manter `CAPTURE_SCREENSHOTS=false` em PROD ate existir mascaramento automatico.

## Atualizacao - engenharia reversa Blunana

## Conhecimento novo

- Foi gerada a pasta `engenharia-reversa/blunana/` com 11 arquivos Markdown de engenharia reversa.
- A documentacao consolidou 43 rotas/telas de `outputs/json/blunana/dev/blunana-telas.json` e registrou que apenas o login visual em PROD esta evidenciado por `outputs/screenshots/blunana/prod/login-teste.png`.
- O crawler Blunana foi documentado como ferramenta TypeScript/Playwright com configuracao por ambiente, login/MFA, coleta de menu e coleta de telas.

## Conhecimento atualizado

- `docs/changelog.md` registra a geracao dos entregaveis.
- `docs/reverse-engineering-blunana-prompt.md` e `engenharia-reversa/blunana/README.md` passam a apontar para `engenharia-reversa/blunana/*`.
- `.memory/contexto.md` e `.memory/historico.md` registram a documentacao gerada e a pendencia de coleta completa em PROD.

## Documentos alterados

- `engenharia-reversa/blunana/01-visao-geral.md`
- `engenharia-reversa/blunana/02-mapa-de-rotas.md`
- `engenharia-reversa/blunana/03-modulos-funcionais.md`
- `engenharia-reversa/blunana/04-apis-servicos-integracoes.md`
- `engenharia-reversa/blunana/05-catalogo-de-dados-formularios.md`
- `engenharia-reversa/blunana/06-regras-de-negocio.md`
- `engenharia-reversa/blunana/07-cenarios-de-teste-qa.md`
- `engenharia-reversa/blunana/08-arquitetura-tecnica.md`
- `engenharia-reversa/blunana/09-riscos-dividas-tecnicas.md`
- `engenharia-reversa/blunana/10-pontos-a-validar.md`
- `engenharia-reversa/blunana/README.md`

## Pendencias encontradas

- Gerar `outputs/json/blunana/prod/blunana-menu.json` e `outputs/json/blunana/prod/blunana-telas.json` por execucao autorizada em PROD.
- Evoluir o coletor para extrair campos, formularios e chamadas de rede sem expor dados sensiveis.

## Recomendacoes

- Manter a documentação Blunana separada do contexto antigo de automação.
- Usar `CAPTURE_SCREENSHOTS=false` em PROD ate haver mascaramento automatizado de evidencias.

## Atualizacao - prompt Blunana PROD

## Conhecimento novo

- Foi criado `prompts/09-engenharia-reversa-blunana-prod.md` para padronizar a engenharia reversa controlada do Blunana em producao.
- O prompt reforca uso de `APP_ENV=prod`, artefatos em `outputs/{tipo}/blunana/prod/`, protecao de dados sensiveis e atualizacao documental obrigatoria.

## Conhecimento atualizado

- `docs/changelog.md` registra a criacao do novo prompt.
- `docs/reverse-engineering-blunana-prompt.md` e `engenharia-reversa/blunana/README.md` passam a cobrir o novo prompt.

## Documentos alterados

- `prompts/09-engenharia-reversa-blunana-prod.md`
- `docs/changelog.md`
- `docs/reverse-engineering-blunana-prompt.md`
- `engenharia-reversa/blunana/README.md`
- `.memory/contexto.md`
- `.memory/historico.md`
- `outputs/relatorios/aprendizado.md`

## Pendencias encontradas

- Executar o prompt em ambiente PROD autorizado para gerar artefatos em `outputs/{tipo}/blunana/prod/`.

## Recomendacoes

- Manter o prompt como guia antes de qualquer navegacao em producao.
- Registrar como "Ponto a validar" qualquer comportamento nao comprovado por evidencia.

## Conhecimento novo

- O crawler TypeScript passou a centralizar caminhos de artefatos em `config/paths.ts`.
- Quando `APP_ENV=prod` e `OUTPUT_DOMAIN=blunana`, testes e documentacao operacional geram/consomem artefatos em `outputs/{tipo}/blunana/prod/` por padrao.
- `OUTPUT_DIR` pode sobrescrever o diretorio base dos artefatos quando necessario.
- `npm test` executa o fluxo `screens:prod`; `npm run docs:prod` foi adicionado como alias explicito para documentacao/coleta em producao.

## Conhecimento atualizado

- `docs/tecnica/configuracoes.md` documenta os caminhos por ambiente, scripts de producao e variaveis esperadas.
- `docs/funcional/mapa-navegacao-blunana.md` diferencia evidencia historica DEV de artefatos esperados em PROD.
- `knowledge/frontend/rotas-blunana.md` registra PROD como ponto a validar ate execucao real.
- `docs/reverse-engineering-blunana-prompt.md` e `engenharia-reversa/blunana/README.md` cobrem `config/paths.ts`, `outputs/{tipo}/blunana/*` e `outputs/{tipo}/robos/*`.

## Documentos alterados

- `.memory/contexto.md`
- `.memory/historico.md`
- `.memory/decisoes.md`
- `docs/changelog.md`
- `docs/tecnica/configuracoes.md`
- `docs/funcional/mapa-navegacao-blunana.md`
- `docs/reverse-engineering-blunana-prompt.md`
- `docs/reverse-engineering-blunana-prompt.md`
- `knowledge/frontend/rotas-blunana.md`
- `engenharia-reversa/blunana/06-regras-de-negocio.md`
- `engenharia-reversa/blunana/README.md`

## Pendencias encontradas

- Executar `npm test` ou `npm run docs:prod` com acesso autorizado ao ambiente de producao para gerar os artefatos reais em `outputs/{tipo}/blunana/prod/`.
- Confirmar se `CAPTURE_SCREENSHOTS=false` em producao e suficiente para mascaramento operacional esperado.

## Recomendacoes

- Manter artefatos de DEV/HML/PROD separados para evitar sobrescrita de evidencias.
- Nao documentar valores reais de `.env.prod`, apenas nomes de variaveis e comportamento comprovado no codigo.
