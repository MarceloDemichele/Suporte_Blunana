# Pontos a Validar

Esta lista registra informacoes que nao estao completamente comprovadas no codigo ou dependem de sistemas externos.

| ID | Ponto a validar | Motivo | Evidencia |
|---|---|---|---|
| PV-FUNC-001 | Fonte documental `repositories/documentacao/docs/` | Pasta nao encontrada neste checkout | `outputs/relatorios/inventario-projeto.md` |
| PV-FUNC-002 | Contrato da procedure `EPM_ROCHA.PRC_PUBLICACOES_PORTAL_CEF_MER_760` | Procedure nao esta no repositorio | `Robo-CEF/Repositories/PublicacoesRepository.cs` |
| PV-FUNC-003 | Contrato da procedure `EPM_ROCHA.PRC_NOTIFICA_SUPORTE_ROCHA_ZAP` | Procedure nao esta no repositorio | `Robo-CEF/Repositories/WhatsAppRepository.cs` |
| PV-FUNC-004 | Schema completo do banco | Nao ha DDL, migrations ou schema completo no repositorio | `outputs/relatorios/inventario-projeto.md` |
| PV-FUNC-005 | Permissoes exigidas no portal CEF | Codigo comprova login, mas nao perfis/permissoes externas | `Robo-CEF/Services/LoginService.cs` |
| PV-FUNC-006 | Manutencao dos workers legados | Arquivos existem, mas nao aparecem no fluxo ativo do `Main` | `Robo-CEF/Workers/*.cs`, `Robo-CEF/Program.cs` |
| PV-FUNC-007 | Dependencias ausentes no `.csproj` | Inventario aponta uso de pacotes nao declarados | `outputs/relatorios/inventario-projeto.md` |
| PV-FUNC-008 | Ausencia de testes automatizados | Nao foram encontrados testes no inventario | `outputs/relatorios/inventario-projeto.md` |
| PV-FUNC-009 | Segredos em configuracao local | Inventario identificou configuracao sensivel em arquivo local; valores nao devem ser reproduzidos na documentacao | `Robo-CEF/config.json`, `Robo-CEF/Services/NotityService.cs` |
