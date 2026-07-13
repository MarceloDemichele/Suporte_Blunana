# Regras de Negocio - Publicacoes CEF

## Regras comprovadas

| Regra | Comportamento | Origem |
|---|---|---|
| Periodo pesquisado | Inicio = data/hora de processamento menos `DiasRetroativos`; fim = data/hora de inicio do processamento | `Robo-CEF/Program.cs` |
| Ordem de processamento | Processa 1a. fase antes de 2a. fase | `Robo-CEF/Program.cs` |
| Filtro de segundo grau | Para 2a. fase, seleciona valor `2` em `nGrauExpediente` | `Robo-CEF/Services/PublicacoesService.cs` |
| Total do portal | Extraido do caption da tabela | `Robo-CEF/Services/PublicacoesService.cs` |
| Fase processual | Cada publicacao recebe `1a. Fase` ou `2a. Fase` conforme etapa | `Robo-CEF/Program.cs`, `Robo-CEF/Constants/FasesProcessuais.cs` |
| Deduplicacao | Usa expediente como chave | `Robo-CEF/Program.cs` |
| Consulta de existentes | Busca expedientes ja cadastrados antes de importar | `Robo-CEF/Repositories/PublicacoesRepository.cs` |
| Importacao | Apenas publicacoes novas sao importadas | `Robo-CEF/Program.cs` |
| Lote | Importacao processada em lotes de 100 | `Robo-CEF/Repositories/PublicacoesRepository.cs` |
| Erro individual | Erro em uma publicacao e registrado e o processamento continua | `Robo-CEF/Repositories/PublicacoesRepository.cs` |
| Resumo final | Consolida totais de portal, extraidas, sem duplicidade, existentes, novas, sucesso e erro por fase | `Robo-CEF/Program.cs` |

## Validacoes comprovadas

- Banco e chave CapMonster sao obrigatorios.
- Usuario e senha sao obrigatorios para login.
- Falha ao obter total do portal retorna `0`.
- Falha ao selecionar quantidade por pagina gera aviso e continua.

## Pontos a validar

- Regras do portal CEF nao estao documentadas no codigo.
- Perfis/permissoes do usuario no portal nao estao comprovados.
- Contratos das stored procedures nao estao no repositorio.

## Origem da informacao

- `outputs/relatorios/inventario-projeto.md`
- `docs/funcional/regras-negocio.md`
- `Robo-CEF/Program.cs`
- `Robo-CEF/Services/LoginService.cs`
- `Robo-CEF/Services/PublicacoesService.cs`
- `Robo-CEF/Repositories/PublicacoesRepository.cs`
