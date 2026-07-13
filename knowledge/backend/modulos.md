# Backend - Modulos e Responsabilidades

## Orquestracao

`Program.cs` controla o ciclo completo: configuracao, abertura do navegador, login, processamento das fases, importacao, notificacoes, logs e encerramento.

Origem: `Robo-CEF/Program.cs`.

## Login

O login acessa o portal CEF, preenche usuario, senha e captcha, e valida sucesso quando a URL deixa de conter `logon`. O fluxo tenta tres tempos de carregamento: 5, 15 e 30 segundos.

Origem: `Robo-CEF/Services/LoginService.cs`.

## Captcha

O captcha ativo usa CapMonster Cloud via SDK. A imagem e enviada em base64 e a resposta e usada no formulario de login.

Origem: `Robo-CEF/Services/CapchaService.cs`.

## Consulta de publicacoes

O servico de publicacoes acessa a tela de fases a classificar, preenche datas, aplica filtro de segundo grau quando necessario, ajusta quantidade por pagina, coleta a tabela HTML e pagina resultados.

Origem: `Robo-CEF/Services/PublicacoesService.cs`.

## Parser HTML

O parser transforma tabela HTML em dicionarios e depois em objetos tipados. Ele limpa quebras de linha, tabs e entidades HTML.

Origem: `Robo-CEF/Utils/HtmlTableParser.cs`.

## Persistencia

`PublicacoesRepository` consulta expedientes existentes e importa novas publicacoes por procedure. `LogsRepository` registra estados da execucao. `WhatsAppRepository` adiciona mensagem por procedure.

Origem: `Robo-CEF/Repositories/*.cs`.

## Notificacoes

`NotifyService` envia resumo para Slack por HTTP e para WhatsApp via repository.

Origem: `Robo-CEF/Services/NotityService.cs`.

## Pontos a validar

- Nao ha testes automatizados encontrados.
- Nao ha API HTTP interna.
- `Workers` nao aparecem no fluxo ativo, apesar de conterem implementacoes similares.
