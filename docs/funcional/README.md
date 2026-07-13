# Documentacao Funcional - Robo CEF

## Objetivo

Esta pasta consolida a documentacao funcional inicial do projeto Robo CEF, gerada a partir do inventario tecnico e funcional em `outputs/relatorios/inventario-projeto.md`.

## Fonte

As informacoes desta documentacao foram baseadas somente em evidencias registradas no inventario e nos arquivos do projeto citados por ele.

Fonte principal:

- `outputs/relatorios/inventario-projeto.md`

Evidencias recorrentes:

- `Robo-CEF/Program.cs`
- `Robo-CEF/Services/LoginService.cs`
- `Robo-CEF/Services/PublicacoesService.cs`
- `Robo-CEF/Services/CapchaService.cs`
- `Robo-CEF/Services/NotityService.cs`
- `Robo-CEF/Repositories/PublicacoesRepository.cs`
- `Robo-CEF/Repositories/LogsRepository.cs`
- `Robo-CEF/Repositories/WhatsAppRepository.cs`
- `Robo-CEF/Utils/HtmlTableParser.cs`
- `Robo-CEF/Models/PublicacoesTable.cs`
- `Robo-CEF/Constants/FasesProcessuais.cs`

## Indice

- [Visao geral funcional](visao-geral.md)
- [Fluxo operacional](fluxo-operacional.md)
- [Modulos funcionais](modulos-funcionais.md)
- [Regras de negocio](regras-negocio.md)
- [Telas e integracoes](telas-integracoes.md)
- [Pontos a validar](pontos-a-validar.md)

## Escopo funcional identificado

O Robo CEF automatiza a consulta de publicacoes no portal juridico da Caixa, extrai publicacoes de primeiro e segundo grau, evita importacao duplicada por expediente, importa novas publicacoes para MySQL e envia resumo de processamento por Slack e WhatsApp.

Evidencia: `outputs/relatorios/inventario-projeto.md`.
