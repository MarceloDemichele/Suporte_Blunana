# Engenharia Reversa Blunana PROD

## Objetivo

Executar engenharia reversa controlada do Blunana em ambiente de producao, usando somente usuario autorizado, sem alterar dados reais, e gerar documentacao tecnica e funcional baseada em evidencias coletadas em `outputs/{tipo}/blunana/prod/`.

## Contexto obrigatorio

Antes de executar, consultar nesta ordem:

1. `.memory/`
2. `knowledge/`
3. `docs/`
4. `tickets/`
5. `outputs/`

Usar tambem:

- `docs/tecnica/configuracoes.md`
- `knowledge/frontend/rotas-blunana.md`
- `docs/funcional/mapa-navegacao-blunana.md`
- `outputs/relatorios/aprendizado.md`

## Ambiente

O ambiente alvo deve ser producao:

- `APP_ENV=prod`
- Arquivo de configuracao esperado: `.env.prod`
- Diretorio padrao de evidencias: `outputs/{tipo}/blunana/prod/`
- Sobrescrita opcional: `OUTPUT_DIR`

Nao exibir, copiar ou documentar valores reais de variaveis sensiveis.

## Variaveis esperadas

Validar apenas a presenca das variaveis, nunca seus valores:

- `APP_URL`
- `APP_USER`
- `APP_PASSWORD`
- `MFA_SECRET`
- `HEADLESS`
- `SAFE_MODE`
- `CAPTURE_SCREENSHOTS`
- `MASK_SENSITIVE_DATA`

Caso falte variavel obrigatoria, registrar como ponto a validar e nao inventar configuracao.

## Regras de seguranca

- Nao exibir credenciais, tokens, cookies, segredos MFA ou dados reais de cliente.
- Nao criar, editar, excluir, aprovar, reprovar, importar ou disparar registros reais.
- Nao executar acoes destrutivas ou transacionais.
- Nao baixar bases completas nem exportar dados sensiveis.
- Mascarar nomes, e-mails, documentos, telefones, IDs externos e qualquer dado pessoal.
- Se uma tela contiver dados sensiveis, registrar apenas estrutura, campos, filtros, botoes e comportamento observavel.
- Se `CAPTURE_SCREENSHOTS=false`, nao forcar captura de screenshots.
- Se houver duvida sobre impacto de uma acao, parar e registrar "Ponto a validar".

## Comandos previstos

Preferir os scripts ja existentes:

- `npm run login:prod`
- `npm run menu:prod`
- `npm run screens:prod`
- `npm run docs:prod`
- `npm test`

Observacao: `npm test` executa `screens:prod`.

## Fluxo de execucao

1. Confirmar que a documentacao atual reconhece `outputs/{tipo}/blunana/prod/` como base de artefatos.
2. Validar presenca das variaveis de ambiente obrigatorias sem imprimir valores.
3. Executar login em producao somente com usuario autorizado.
4. Registrar URL final autenticada sem expor parametros sensiveis.
5. Coletar menu principal e salvar em `outputs/json/blunana/prod/blunana-menu.json`.
6. Coletar telas acessiveis e salvar em `outputs/json/blunana/prod/blunana-telas.json`.
7. Quando permitido, salvar screenshots em `outputs/screenshots/blunana/prod/`.
8. Identificar telas, rotas, menus, filtros, formularios, campos, validacoes aparentes e permissoes observaveis.
9. Separar o que foi comprovado por evidencia do que e "Ponto a validar".
10. Atualizar documentacao consolidada.
11. Executar `prompts/07-aprendizado-continuo.md` ao final.

## O que mapear

Para cada tela ou rota acessivel:

- Nome da tela
- URL/rota
- Objetivo aparente
- Perfil/usuario impactado, quando comprovado
- Menus e submenus de acesso
- Campos visiveis
- Filtros
- Botoes e acoes disponiveis
- Validacoes aparentes
- Mensagens de erro ou sucesso observadas
- Integracoes aparentes
- Permissoes observaveis
- Riscos
- Cenarios de teste sugeridos
- Evidencias
- Pontos a validar

## Saidas obrigatorias

Criar ou atualizar:

- `outputs/json/blunana/prod/blunana-menu.json`
- `outputs/json/blunana/prod/blunana-telas.json`
- `outputs/screenshots/blunana/prod/`, quando permitido
- `outputs/logs/blunana/prod/engenharia-reversa-blunana-prod-log.md`
- `knowledge/frontend/rotas-blunana.md`
- `docs/funcional/mapa-navegacao-blunana.md`
- `docs/tecnica/configuracoes.md`, se houver alteracao de configuracao observada
- `docs/changelog.md`
- `outputs/relatorios/aprendizado.md`

Quando houver nova tela, fluxo, permissao, validacao ou regra observavel, atualizar tambem:

- `engenharia-reversa/robo-cef/13-matriz-rastreabilidade.md`
- `docs/robo-cef-matriz-rastreabilidade.md`

Atualizar `06-regras-de-negocio.md` somente se houver regra, validacao, filtro, calculo, status, fluxo, importacao, notificacao ou persistencia comprovada.

## Formato do inventario PROD

`outputs/logs/blunana/prod/engenharia-reversa-blunana-prod-log.md` deve conter:

- Data da execucao
- Ambiente: PROD
- Comando executado
- Arquivos gerados
- Resumo das telas encontradas
- Rotas mapeadas
- Evidencias com caminhos
- Dados mascarados ou omitidos por seguranca
- Pontos a validar
- Falhas encontradas
- Recomendacoes

## Criterios de conclusao

A tarefa so pode ser considerada concluida quando:

- As evidencias estiverem em `outputs/{tipo}/blunana/prod/`.
- A documentacao impactada estiver atualizada.
- Toda informacao sem evidencia estiver marcada como "Ponto a validar".
- Nenhum valor sensivel tiver sido exposto.
- `outputs/relatorios/aprendizado.md` tiver sido atualizado.
