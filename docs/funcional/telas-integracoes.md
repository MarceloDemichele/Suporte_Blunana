# Telas e Integracoes

## Telas externas automatizadas

| Tela/URL | Uso funcional | Evidencia |
|---|---|---|
| `https://www.juridico.caixa.gov.br` | Entrada de login no fluxo ativo | `Robo-CEF/Services/LoginService.cs` |
| `https://www.juridico.caixa.gov.br/logon.asp` | Login no fluxo legado | `Robo-CEF/Workers/LoginAutomator.cs` |
| `https://www.juridico.caixa.gov.br/modulos/CtrlSistemico/_Ajustes/?pg=AjustesSIJURFaseAClassificar` | Consulta de fases/publicacoes | `Robo-CEF/Services/PublicacoesService.cs` |

## Elementos funcionais automatizados

| Elemento | Uso | Evidencia |
|---|---|---|
| `input#sMatricula` | Preencher usuario/matricula | `Robo-CEF/Services/LoginService.cs` |
| `input#sSenha` | Preencher senha | `Robo-CEF/Services/LoginService.cs` |
| `img#imgCaptcha` | Capturar imagem do captcha | `Robo-CEF/Services/LoginService.cs` |
| `input#sCaptcha` | Preencher texto do captcha | `Robo-CEF/Services/LoginService.cs` |
| `button#btn-login` | Enviar login | `Robo-CEF/Services/LoginService.cs` |
| `iniBuscaFaseClassificar` | Data inicial da pesquisa | `Robo-CEF/Services/PublicacoesService.cs` |
| `fimBuscaFaseClassificar` | Data final da pesquisa | `Robo-CEF/Services/PublicacoesService.cs` |
| `nGrauExpediente` | Filtro de grau/processamento de segunda fase | `Robo-CEF/Services/PublicacoesService.cs` |
| `btFiltrar` | Acionar pesquisa | `Robo-CEF/Services/PublicacoesService.cs` |
| `table#tabListaFasesAClassificar` | Tabela de publicacoes extraida | `Robo-CEF/Services/PublicacoesService.cs` |
| `button.btnProxima` | Paginacao | `Robo-CEF/Services/PublicacoesService.cs` |

## Integracoes funcionais

| Integracao | Finalidade | Evidencia |
|---|---|---|
| CapMonster Cloud | Resolver captcha do login | `Robo-CEF/Services/CapchaService.cs` |
| MySQL | Consultar existentes, importar publicacoes, registrar logs e adicionar mensagem WhatsApp | `Robo-CEF/Repositories/*.cs` |
| Slack | Enviar resumo final | `Robo-CEF/Services/NotityService.cs` |
| WhatsApp via banco | Enviar resumo por procedure | `Robo-CEF/Repositories/WhatsAppRepository.cs` |

## Objetos de banco envolvidos

| Objeto | Uso funcional | Evidencia |
|---|---|---|
| `T_PROCESSOS_TERCEIRIZACAO_CEF` | Verificar expedientes existentes | `Robo-CEF/Repositories/PublicacoesRepository.cs` |
| `EPM_ROCHA.T_EXECUCOES_ROBOTS` | Registrar logs de execucao | `Robo-CEF/Repositories/LogsRepository.cs` |
| `EPM_ROCHA.PRC_PUBLICACOES_PORTAL_CEF_MER_760` | Importar publicacoes | `Robo-CEF/Repositories/PublicacoesRepository.cs` |
| `EPM_ROCHA.PRC_NOTIFICA_SUPORTE_ROCHA_ZAP` | Inserir mensagem WhatsApp | `Robo-CEF/Repositories/WhatsAppRepository.cs` |

## Observacoes

Nao ha telas proprias da aplicacao, controllers ou API HTTP interna comprovados no inventario. As telas documentadas sao telas externas automatizadas pelo robo.

Evidencia: `outputs/relatorios/inventario-projeto.md`.
