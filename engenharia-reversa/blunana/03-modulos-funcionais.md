# 03 - Modulos Funcionais

Fonte principal: `outputs/json/blunana/dev/blunana-telas.json`.

## Modulos identificados

| Modulo | Rotas/telas | Objetivo funcional aparente | Evidências |
|---|---:|---|---|
| Studio/Dashboard | 1 | Monitorar indicadores e acessar atalhos principais | `outputs/relatorios/blunana/dev/blunana-inventario.md`, `outputs/json/blunana/dev/blunana-telas.json` |
| Governança Studio | 6 | Gerenciar branches, projetos, tarefas, usuários, grupos e políticas | `outputs/json/blunana/dev/blunana-telas.json` |
| Construção e dados | 3 | Acessar Database, UDF e Builder | `outputs/json/blunana/dev/blunana-telas.json`, `outputs/json/blunana/dev/blunana-menu.json` |
| Relatórios e logs | 5 | Consultar atividade, erros, API log, manual e logs do sistema | `outputs/json/blunana/dev/blunana-telas.json` |
| Configurações | 7 | Configurar menu, prazos, publicações, processos, usuários, ateste, negociador, palavras e cobrança | `outputs/json/blunana/dev/blunana-telas.json` |
| Operação jurídica/custom | 18 | Acessar fluxos customizados de prazos, audiência, processos, publicações, cobrança, custas e RD Station | `outputs/json/blunana/dev/blunana-telas.json` |
| Autenticação | 1 | Login com usuário/senha e MFA | `crawler-interface/auth/login.ts`, `crawler-interface/auth/mfa.ts` |

## Detalhamento funcional

| Modulo | Funcionalidades disponíveis comprovadas | Permissões | Pontos de atenção |
|---|---|---|---|
| Studio/Dashboard | Exibe `Monitoring Dashboard`, `Quick access`, cards/atalhos para Database, Builder, UDF, Settings e Logs | Requer usuário autenticado | Dados dos cards não foram extraídos em JSON |
| Governança Studio | Rotas `branches`, `projects`, `tasks`, `users`, `groups`, `policy` | Acesso observado com usuário autenticado DEV | Permissões por perfil não estão comprovadas |
| Construção e dados | Rotas `database`, `udf`, `builder` | Acesso observado com usuário autenticado DEV | Ações de criação/edição/publicação não foram executadas |
| Relatórios e logs | Rotas `report/*`, `log` | Acesso observado com usuário autenticado DEV | Exportações/filtros internos são ponto a validar |
| Configurações | Rotas customizadas de configuração e `settings/menuConfig` | Acesso observado com usuário autenticado DEV | Alterações de configuração não foram testadas por segurança |
| Operação jurídica/custom | Rotas customizadas de prazos, audiência, processos, publicações, cobrança, custas e RD Station | Acesso observado com usuário autenticado DEV | Regras de negócio internas dependem de inspeção de telas/código da aplicação alvo |
| Autenticação | Seletores flexíveis para login, senha, submit e MFA | Exige credenciais e `MFA_SECRET` | Não documentar valores sensíveis |

## Estados e mensagens observadas

| Tela | Estado/mensagem | Evidência |
|---|---|---|
| Tasks | `Nenhuma tarefa encontrada` | `outputs/json/blunana/dev/blunana-telas.json` |
| Logs | `Studio request monitoring`, `System logs` | `outputs/json/blunana/dev/blunana-telas.json` |
| Login | Mensagem de erro visível é buscada em `role=alert`, `.alert`, `.error`, `.invalid-feedback`, `.text-danger`, `.toast`, classes `error/danger` | `crawler-interface/auth/login.ts` |

## Pontos a validar

- Campos e validações internas das telas customizadas.
- Perfis e permissões reais por módulo.
- Quais ações são transacionais e quais são apenas consultas.
- Diferenças entre DEV e PROD.
