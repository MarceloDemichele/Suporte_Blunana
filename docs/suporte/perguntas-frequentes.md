# Perguntas Frequentes - Suporte

Fonte principal: `outputs/relatorios/inventario-projeto.md`.

## O que o Robo CEF faz?

Automatiza consulta de publicacoes no portal juridico CEF, extrai publicacoes de 1a. e 2a. fase, remove duplicidades por expediente, importa novas publicacoes para MySQL e envia resumo por Slack e WhatsApp.

Evidencia: `outputs/relatorios/inventario-projeto.md`.

## Qual periodo o robo pesquisa?

O periodo vai da data/hora atual menos `DiasRetroativos` ate a data/hora de inicio do processamento.

Evidencia: `Robo-CEF/Program.cs`.

## Como o robo evita duplicidade?

O robo usa o campo `p_EXPEDIENTE`, consulta expedientes existentes no banco e importa apenas publicacoes novas.

Evidencias: `Robo-CEF/Program.cs`, `Robo-CEF/Repositories/PublicacoesRepository.cs`.

## O que acontece se nao houver publicacoes novas?

O fluxo registra no console que nao encontrou publicacao nova para importar e segue para o resumo final.

Evidencia: `Robo-CEF/Program.cs`.

## O que acontece se uma publicacao falhar na importacao?

O erro do item e registrado, o contador de erros e incrementado e o processamento continua para os demais itens.

Evidencia: `Robo-CEF/Repositories/PublicacoesRepository.cs`.

## Quais notificacoes sao enviadas?

Ao final, o robo envia resumo para Slack e WhatsApp.

Evidencias: `Robo-CEF/Program.cs`, `Robo-CEF/Services/NotityService.cs`, `Robo-CEF/Repositories/WhatsAppRepository.cs`.

## Quais dados aparecem no resumo?

O resumo inclui periodo pesquisado, totais do portal, totais extraidos, totais sem duplicidade, existentes, novas publicacoes, sucessos, erros e eventual erro critico.

Evidencia: `Robo-CEF/Program.cs`.

## O robo possui tela propria?

Nao ha tela propria comprovada no codigo. O robo e uma aplicacao console que automatiza telas externas do portal juridico CEF.

Evidencia: `outputs/relatorios/inventario-projeto.md`.

## Existe API interna?

Nao foi encontrada API HTTP interna, controller ou rota propria. As integracoes identificadas sao portal CEF, CapMonster, MySQL, Slack e WhatsApp via procedure.

Evidencia: `outputs/relatorios/inventario-projeto.md`.

## Quais permissoes sao necessarias?

Ponto a validar: o codigo comprova uso de credenciais do portal CEF e acesso ao banco, mas nao documenta perfis ou permissoes externas exigidas.

Evidencias: `Robo-CEF/Services/LoginService.cs`, `outputs/relatorios/inventario-projeto.md`.

## O que validar quando o robo falhar no login?

Validar credenciais, disponibilidade do portal, resolucao de captcha e se a pagina de login continua usando os seletores esperados.

Evidencia: `Robo-CEF/Services/LoginService.cs`.

## O que validar quando a importacao falhar?

Validar conexao MySQL, permissao do usuario de banco, contrato da procedure `EPM_ROCHA.PRC_PUBLICACOES_PORTAL_CEF_MER_760` e dados da publicacao.

Evidencia: `Robo-CEF/Repositories/PublicacoesRepository.cs`.

## O que validar quando a notificacao falhar?

Validar webhook Slack, conectividade HTTP, conexao MySQL e procedure `EPM_ROCHA.PRC_NOTIFICA_SUPORTE_ROCHA_ZAP`.

Evidencias: `Robo-CEF/Services/NotityService.cs`, `Robo-CEF/Repositories/WhatsAppRepository.cs`.

