# Bugs Conhecidos, Riscos e Pontos a Validar

## Registros

| Descricao | Versoes afetadas | Contorno temporario | Status | Origem |
|---|---|---|---|---|
| Dependencia de seletores do portal CEF | Ponto a validar: versao nao informada | Validar seletores quando login/consulta falhar | Aberto | `Robo-CEF/Services/LoginService.cs`, `Robo-CEF/Services/PublicacoesService.cs` |
| Segredos em configuracao local ou hardcoded | Ponto a validar: versao nao informada | Nao reproduzir valores; mover para mecanismo seguro | Aberto | `outputs/relatorios/inventario-projeto.md` |
| Schema/DDL do banco ausente no repositorio | Ponto a validar: versao nao informada | Validar contratos diretamente no banco | Aberto | `outputs/relatorios/inventario-projeto.md` |
| Contratos de stored procedures nao documentados no repo | Ponto a validar: versao nao informada | Confirmar parametros com DBA/banco real | Aberto | `Robo-CEF/Repositories/PublicacoesRepository.cs`, `Robo-CEF/Repositories/WhatsAppRepository.cs` |
| `Workers` alternativos/legados sem chamada pelo `Main` atual | Ponto a validar: versao nao informada | Confirmar se devem ser removidos, mantidos ou reativados | Aberto | `Robo-CEF/Workers/*.cs`, `Robo-CEF/Program.cs` |
| Testes automatizados nao encontrados | Ponto a validar: versao nao informada | Usar cenarios de QA documentados ate haver testes | Aberto | `outputs/relatorios/inventario-projeto.md`, `docs/qa/cenarios-teste.md` |
| Possiveis dependencias ausentes no `.csproj` | Ponto a validar: versao nao informada | Validar build em ambiente limpo | Aberto | `outputs/relatorios/inventario-projeto.md` |

## Observacao

Os itens acima sao riscos e pontos a validar registrados a partir do inventario e da documentacao. Nao foram inventados bugs de producao sem evidencia.
