# 09 - Riscos e Dividas Tecnicas

| ID | Risco/Dívida | Evidência | Impacto |
|---|---|---|---|
| RSK-BLU-001 | Coleta completa de PROD ausente | Ainda não há coleta completa em `outputs/json/blunana/prod/blunana-menu.json`/`blunana-telas.json` | Documentação PROD ainda parcial |
| RSK-BLU-002 | Screenshots podem conter dados sensíveis | `CAPTURE_SCREENSHOTS` controla captura, mas não há mascaramento automático | Risco de exposição em evidências |
| RSK-BLU-003 | Sem extração de formulários | Coletor lê título/H1/H2, não campos | Catálogo de dados incompleto |
| RSK-BLU-004 | Sem interceptação de rede | Não há `page.route`, listeners de request/response ou HAR | APIs/payloads internos não mapeados |
| RSK-BLU-005 | Sem testes automatizados do crawler | Ausência de specs/test runner além dos scripts manuais | Risco de regressão |
| RSK-BLU-006 | Dependência de MFA e credenciais reais | `crawler-interface/auth/mfa.ts`, `login.ts` | Execução pode falhar por segredo inválido ou expiração |
| RSK-BLU-007 | Seletores de login heurísticos | Arrays extensos de seletores em `login.ts` | Mudanças na UI podem quebrar fluxo |
| RSK-BLU-008 | `crawler.ts` incompleto | Apenas declara variáveis | Script `crawler:*` não produz evidência funcional |
| RSK-BLU-009 | Pastas planejadas vazias | `crawler-interface/navigation`, `validators`, `data`, `html` com `.gitkeep`/sem implementação | Arquitetura futura ainda não entregue |
| RSK-BLU-010 | Permissões não comprovadas | Rotas acessadas com um usuário; perfis não mapeados | Risco de documentação incorreta se perfis divergirem |
| RSK-BLU-011 | Evidencias visuais de PROD podem conter dados sensíveis | `test-login.ts` salva `login-teste.png`; `screens.collector.ts` pode salvar screenshots quando `CAPTURE_SCREENSHOTS=true` | Revisar evidencias antes de compartilhar |

## Melhorias recomendadas

- Criar coletor de formulários com `input`, `select`, `textarea`, labels, required, masks e mensagens.
- Adicionar modo seguro de mascaramento de screenshots ou manter `CAPTURE_SCREENSHOTS=false` em PROD.
- Registrar HAR ou inventário de requests sem tokens/cookies para mapear APIs.
- Criar testes unitários para `mfa.ts`, `paths.ts` e normalização de menu.
- Gerar `outputs/json/blunana/prod/blunana-menu.json` e `outputs/json/blunana/prod/blunana-telas.json` em execução autorizada.
- Avaliar se o executor `reverse-prod.ts` tambem deve capturar screenshot inicial, respeitando `CAPTURE_SCREENSHOTS`.
