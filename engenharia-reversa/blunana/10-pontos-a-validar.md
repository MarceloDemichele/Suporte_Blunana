# 10 - Pontos a Validar

| ID | Ponto | Motivo | Evidência atual |
|---|---|---|---|
| PV-BLU-001 | Coleta completa em PROD | Workspace ainda nao possui coleta completa no novo padrao separado | `outputs/json/blunana/prod/` |
| PV-BLU-002 | Rotas de PROD equivalem às rotas DEV | Inventário de 43 telas vem de DEV | `outputs/json/blunana/dev/blunana-telas.json` |
| PV-BLU-003 | Permissões por perfil | Só há evidência de acesso com um usuário | `outputs/json/blunana/dev/blunana-menu.json` |
| PV-BLU-004 | Campos e validações de formulários customizados | Coletor não extrai campos | `crawler-interface/collectors/screens.collector.ts` |
| PV-BLU-005 | APIs e payloads reais | Não há interceptação de rede | Busca por `fetch/axios/XMLHttpRequest` no crawler não identificou chamadas diretas |
| PV-BLU-006 | Regras de prazos | Rotas existem, mas regras internas não foram extraídas | `/custom/adicionar_prazos`, `/custom/novos_prazos`, `/custom/configuracao_de_prazo` |
| PV-BLU-007 | Regras de publicações | Rota existe, sem detalhes de campos/fluxo | `/custom/publicacoes`, `/custom/configuracao_de_publicacoes` |
| PV-BLU-008 | Regras de processos | Rota existe, sem detalhes de campos/fluxo | `/custom/processos1`, `/custom/configuracao_de_processos` |
| PV-BLU-009 | Integração RD Station | Rotas existem, sem payloads/ações | `/custom/oaut_rdstation` |
| PV-BLU-010 | Upload de imagem | Tela existe, sem campos/payloads | `/custom/teste_upload_de_imagem` |
| PV-BLU-011 | Política de screenshots em PROD | `CAPTURE_SCREENSHOTS=false` documentado, mas execução completa em PROD pendente | `docs/tecnica/configuracoes.md` |
| PV-BLU-012 | Logout/expiração de sessão | `logout.ts` não tem implementação | `crawler-interface/auth/logout.ts` |
| PV-BLU-013 | Execução do novo executor PROD | `reverse-prod.ts` foi criado, mas não executado nesta tarefa para evitar acesso real a PROD | `crawler-interface/reverse-prod.ts` |
| PV-BLU-014 | Screenshot inicial no executor completo | `reverse-prod.ts` nao salva `login-teste.png`; o screenshot inicial fica no fluxo `login:prod` | `crawler-interface/reverse-prod.ts`, `crawler-interface/test-login.ts` |

## Critério para remover pontos

Remover ou reclassificar apenas quando houver evidência nova em código, JSON de execução, screenshot seguro, HAR sanitizado ou documentação comprovada.
