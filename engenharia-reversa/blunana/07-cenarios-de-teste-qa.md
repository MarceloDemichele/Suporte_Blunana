# 07 - Cenarios de Teste QA

| ID | Modulo | Cenario | Pre-condicao | Passos | Resultado esperado | Prioridade |
|---|---|---|---|---|---|---|
| QA-BLU-001 | Configuração | Carregar ambiente PROD | `.env.prod` existente e sem expor valores | Executar `npm run login:prod` | Log informa ambiente `prod` e screenshot vai para `outputs/screenshots/blunana/prod/` | Alta |
| QA-BLU-002 | Login | Login com credenciais e MFA válidos | Usuário autorizado e `MFA_SECRET` válido | Executar `npm run login:prod` | Navegação sai de `/auth/login` e salva `outputs/screenshots/blunana/prod/login-teste.png` | Alta |
| QA-BLU-003 | Login | Configuração obrigatória ausente | Remover variável obrigatória em ambiente controlado | Executar login | Erro `{NOME} nao configurado.` sem expor segredo | Alta |
| QA-BLU-004 | Login | MFA inválido | `MFA_SECRET` inválido em ambiente controlado | Executar login | Erro `MFA_SECRET invalido.` ou falha de autenticação registrada | Alta |
| QA-BLU-005 | Login | Tela permanece em login | Credenciais inválidas em ambiente controlado | Executar login | Salvar `login-debug.png` e `login-debug.html`; processo falha | Alta |
| QA-BLU-006 | Menu | Coleta de menu | Login válido | Executar `npm run menu:prod` | Gerar `outputs/json/blunana/prod/blunana-menu.json` com itens de menu | Alta |
| QA-BLU-007 | Telas | Coleta de telas sem screenshot | `CAPTURE_SCREENSHOTS=false` | Executar `npm run screens:prod` | Gerar JSON com `screenshot` desabilitado | Média |
| QA-BLU-008 | Telas | Coleta de telas com screenshot | `CAPTURE_SCREENSHOTS=true` e autorização para captura | Executar `npm run screens:prod` | Gerar screenshots em `outputs/screenshots/blunana/prod/` | Média |
| QA-BLU-009 | Telas | Menu ausente antes da coleta | Apagar/ausentar menu em ambiente controlado | Executar etapa de telas diretamente | Erro orienta executar `npm run menu:{ambiente}` | Média |
| QA-BLU-010 | Rotas | Deduplicação de hrefs | Menu com hrefs repetidos | Executar coleta de telas | Cada href único é visitado uma vez | Média |
| QA-BLU-011 | Segurança | Não expor segredos | Execução com falha | Inspecionar logs e docs gerados | Não aparecem senha, MFA, token, cookie ou dados reais | Alta |
| QA-BLU-012 | Regressão | Scripts multiambiente | `.env.dev`, `.env.hml`, `.env.prod` presentes | Executar comandos por ambiente quando autorizado | Artefatos separados em `outputs/{tipo}/blunana/dev`, `outputs/{tipo}/blunana/hml`, `outputs/{tipo}/blunana/prod` | Média |
| QA-BLU-013 | Acessos | Rotas administrativas | Usuário com perfil limitado | Acessar `users`, `groups`, `policy`, `settings` | Acesso permitido/negado documentado sem alterar dados | Alta |
| QA-BLU-014 | Custom | Rotas customizadas | Login válido | Visitar rotas `/custom/*` | Telas carregam ou erro é registrado no inventário | Média |
| QA-BLU-015 | Upload | Tela `teste upload de imagem` | Login válido e sem enviar arquivo real | Acessar tela | Campos/ações de upload são documentados sem upload transacional | Média |
| QA-BLU-016 | Executor PROD | Fluxo completo de engenharia reversa | Usuário autorizado e variáveis obrigatórias presentes | Executar `npm run reverse:prod` | Gerar `outputs/json/blunana/prod/blunana-menu.json`, `outputs/json/blunana/prod/blunana-telas.json`, relatorios em `outputs/relatorios/blunana/prod/` e log em `outputs/logs/blunana/prod/` | Alta |
| QA-BLU-017 | Executor PROD | Falha antes/depois do login | Simular configuração inválida em ambiente controlado | Executar `npm run reverse:prod` | Gerar inventário com status `Falha` sem expor segredo e processo terminar com erro | Alta |

## Pontos críticos para automação E2E

- MFA TOTP depende de segredo válido e relógio sincronizado.
- Telas de PROD podem conter dados sensíveis; `CAPTURE_SCREENSHOTS=false` deve ser considerado padrão seguro.
- O coletor atual não mascara conteúdo de screenshot.
- Permissões reais dependem do usuário utilizado.
- Ações de criação/edição/exclusão não devem ser executadas durante engenharia reversa sem autorização explícita.
