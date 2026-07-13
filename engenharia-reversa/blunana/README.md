# Engenharia Reversa Blunana

Documentação gerada a partir do repositório e dos artefatos existentes do crawler Blunana.

## Índice

- [01 - Visão Geral](01-visao-geral.md)
- [02 - Mapa de Rotas](02-mapa-de-rotas.md)
- [03 - Módulos Funcionais](03-modulos-funcionais.md)
- [04 - APIs, Serviços e Integrações](04-apis-servicos-integracoes.md)
- [05 - Catálogo de Dados e Formulários](05-catalogo-de-dados-formularios.md)
- [06 - Regras de Negócio](06-regras-de-negocio.md)
- [07 - Cenários de Teste QA](07-cenarios-de-teste-qa.md)
- [08 - Arquitetura Técnica](08-arquitetura-tecnica.md)
- [09 - Riscos e Dívidas Técnicas](09-riscos-dividas-tecnicas.md)
- [10 - Pontos a Validar](10-pontos-a-validar.md)

## Escopo

O escopo documentado é o crawler TypeScript/Playwright e os artefatos Blunana existentes no workspace. A aplicação Blunana alvo não está versionada neste repositório; portanto, regras internas, payloads de API e campos de formulários só foram registrados quando havia evidência direta.

## Evidências principais

- `package.json`
- `tsconfig.json`
- `config/*.ts`
- `crawler-interface/**/*.ts`
- `crawler-interface/reverse-prod.ts`
- `outputs/json/blunana/dev/blunana-menu.json`
- `outputs/json/blunana/dev/blunana-telas.json`
- `outputs/relatorios/blunana/dev/blunana-inventario.md`
- `outputs/screenshots/blunana/prod/login-teste.png`
- `docs/funcional/mapa-navegacao-blunana.md`
- `knowledge/frontend/rotas-blunana.md`

## Resumo executivo

| Item | Resultado |
|---|---|
| Módulos encontrados | 7 |
| Rotas/telas inventariadas | 43 |
| Serviços/APIs internos do crawler | 5 serviços internos; APIs HTTP reais da aplicação alvo são ponto a validar |
| Formulários comprovados | 1 fluxo de login/MFA |
| Executor PROD | `npm run reverse:prod` |
| Principais riscos | Coleta PROD ainda não executada nesta tarefa, screenshots sensíveis, ausência de parser de formulários, APIs não interceptadas |
| Principais pontos a validar | Execução do executor em PROD autorizado, permissões por perfil, regras internas de telas customizadas, payloads, campos e validações |

## Nota de segurança

Nenhum valor real de `.env.prod`, credencial, token, cookie ou segredo MFA deve ser registrado nesta documentação.
