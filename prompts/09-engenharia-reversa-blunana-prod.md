# Engenharia Reversa Blunana PROD

## Objetivo

Executar coleta controlada do Blunana em ambiente de produção, usando somente usuário autorizado, sem alterar dados reais, e gerar documentação técnica e funcional baseada em evidências coletadas em `outputs/{tipo}/blunana/prod/`.

## Contexto obrigatório

Antes de executar, consultar nesta ordem:

1. `.memory/`
2. `knowledge/`
3. `docs/`
4. `tickets/`
5. `outputs/`
6. `support/`

Usar também:

- `docs/changelog.md`
- `knowledge/frontend/rotas-blunana.md`
- `docs/funcional/mapa-navegacao-blunana.md`
- `outputs/relatorios/aprendizado.md`

## Ambiente

O ambiente alvo deve ser produção:

- `APP_ENV=prod`
- Arquivo de configuração esperado: `.env.prod`
- Diretório padrão de evidências: `outputs/{tipo}/blunana/prod/`
- Sobrescrita opcional: `OUTPUT_DIR`

Não exibir, copiar ou documentar valores reais de variáveis sensíveis.

## Regras de segurança

- Não exibir credenciais, tokens, cookies, segredos MFA ou dados reais de cliente.
- Não criar, editar, excluir, aprovar, reprovar, importar ou disparar registros reais.
- Não executar ações destrutivas ou transacionais.
- Não baixar bases completas nem exportar dados sensíveis.
- Mascarar nomes, e-mails, documentos, telefones, IDs externos e qualquer dado pessoal.
- Se uma tela contiver dados sensíveis, registrar apenas estrutura, campos, filtros, botões e comportamento observável.
- Se `CAPTURE_SCREENSHOTS=false`, não forçar captura de screenshots.
- Se houver dúvida sobre impacto de uma ação, parar e registrar "Ponto a validar".

## Fluxo de execução

1. Confirmar que a documentação atual reconhece `outputs/{tipo}/blunana/prod/` como base de artefatos.
2. Validar a presença das variáveis de ambiente obrigatórias sem imprimir valores.
3. Executar login em produção somente com usuário autorizado.
4. Registrar a URL final autenticada sem expor parâmetros sensíveis.
5. Coletar menu principal e salvar em `outputs/json/blunana/prod/blunana-menu.json`.
6. Coletar telas acessíveis e salvar em `outputs/json/blunana/prod/blunana-telas.json`.
7. Quando permitido, salvar screenshots em `outputs/screenshots/blunana/prod/`.
8. Identificar telas, rotas, menus, filtros, formulários, campos, validações aparentes e permissões observáveis.
9. Separar o que foi comprovado por evidência do que é "Ponto a validar".
10. Atualizar a documentação consolidada em `engenharia-reversa/blunana/` e `docs/`.
11. Executar `prompts/07-aprendizado-continuo.md` ao final.

## Saídas obrigatórias

Criar ou atualizar:

- `outputs/json/blunana/prod/blunana-menu.json`
- `outputs/json/blunana/prod/blunana-telas.json`
- `outputs/screenshots/blunana/prod/`, quando permitido
- `outputs/logs/blunana/prod/engenharia-reversa-blunana-prod-log.md`
- `knowledge/frontend/rotas-blunana.md`
- `docs/funcional/mapa-navegacao-blunana.md`
- `docs/changelog.md`
- `outputs/relatorios/aprendizado.md`

Atualizar os materiais de regras de negócio somente quando houver regra, validação, filtro, cálculo, status, fluxo, importação, notificação ou persistência comprovada.

## Critérios de conclusão

A tarefa só pode ser considerada concluída quando:

- As evidências estiverem em `outputs/{tipo}/blunana/prod/`.
- A documentação impactada estiver atualizada.
- Toda informação sem evidência estiver marcada como "Ponto a validar".
- Nenhum valor sensível tiver sido exposto.
- `outputs/relatorios/aprendizado.md` tiver sido atualizado.
