# 02 - Mapa de Rotas e Telas

## Rotas proprias

Nao ha rotas HTTP proprias, controllers, frontend ou API exposta pelo projeto. A aplicacao e console.

## Telas externas automatizadas

| Tela externa | URL/path | Objetivo | Arquivos |
|---|---|---|---|
| Login portal juridico CEF | `https://www.juridico.caixa.gov.br` e legado `https://www.juridico.caixa.gov.br/logon.asp` | Autenticar usuario com matricula, senha e captcha | `Services/LoginService.cs`, `Workers/LoginAutomator.cs` |
| Ajustes / fases a classificar | `https://www.juridico.caixa.gov.br/modulos/CtrlSistemico/_Ajustes/?pg=AjustesSIJURFaseAClassificar` | Filtrar publicacoes por periodo e grau, paginar e extrair tabela | `Services/PublicacoesService.cs`, `Workers/Extractor.cs`, `Workers/TableDataExtractor.cs` |

## Componentes/seletores externos

### Login

| Elemento | Seletor | Uso | Arquivo |
|---|---|---|---|
| Usuario/matricula | `input#sMatricula` | Preencher login | `Services/LoginService.cs` |
| Senha | `input#sSenha` | Preencher senha | `Services/LoginService.cs` |
| Imagem captcha | `img#imgCaptcha` | Capturar imagem em base64 | `Services/LoginService.cs` |
| Campo captcha | `input#sCaptcha` | Preencher texto resolvido | `Services/LoginService.cs` |
| Botao login | `button#btn-login` | Submeter formulario | `Services/LoginService.cs` |
| Loading | `.loading` | Aguardar login concluir | `Services/LoginService.cs` |

### Consulta de publicacoes

| Elemento | Seletor | Uso | Arquivo |
|---|---|---|---|
| Data inicial | `#iniBuscaFaseClassificar` | Preencher inicio do periodo | `Services/PublicacoesService.cs` |
| Data final | `#fimBuscaFaseClassificar` | Preencher fim do periodo | `Services/PublicacoesService.cs` |
| Grau expediente | `#nGrauExpediente` | Selecionar valor `2` para segundo grau | `Services/PublicacoesService.cs` |
| Botao filtrar | `#btFiltrar` | Executar pesquisa | `Services/PublicacoesService.cs` |
| Tabela | `table#tabListaFasesAClassificar` | Extrair HTML da tabela | `Services/PublicacoesService.cs` |
| Caption total | `caption[class^='table']` | Extrair total do portal | `Services/PublicacoesService.cs` |
| Quantidade por pagina | `select.nQtdRegistrosPagina` | Selecionar `ItemsPerPage` | `Services/PublicacoesService.cs` |
| Botao proxima | `button.btnProxima` | Avancar paginacao | `Services/PublicacoesService.cs` |

## Fluxo de navegacao

1. Abre Chrome via `DriverBuilder`.
2. Navega ao portal CEF.
3. Se a URL contem `logon`, realiza login.
4. Navega para a tela de fases a classificar.
5. Pesquisa primeiro grau.
6. Pesquisa segundo grau.
7. Fecha o driver no `finally`.

Evidencia: `Robo-CEF/Program.cs`, `Services/LoginService.cs`, `Services/PublicacoesService.cs`.

