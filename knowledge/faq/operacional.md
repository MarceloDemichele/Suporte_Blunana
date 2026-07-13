# FAQ Operacional

## O que o Robo CEF faz?

Automatiza a consulta de publicacoes no portal juridico CEF, importa publicacoes novas para MySQL e envia resumo por Slack e WhatsApp.

Origem: `outputs/relatorios/inventario-projeto.md`.

## Qual periodo e pesquisado?

O periodo vai da data/hora de inicio do processamento menos `DiasRetroativos` ate a propria data/hora de inicio do processamento.

Origem: `Robo-CEF/Program.cs`.

## Como o robo evita duplicidades?

Ele usa o expediente como chave, consulta expedientes existentes no banco e importa apenas publicacoes cujo expediente ainda nao existe.

Origem: `Robo-CEF/Program.cs`, `Robo-CEF/Repositories/PublicacoesRepository.cs`.

## O que acontece quando nao ha novas publicacoes?

O robo informa que nao encontrou publicacao nova para importar e segue para o resumo final.

Origem: `Robo-CEF/Program.cs`.

## O que acontece quando uma publicacao falha?

O erro do item e registrado, o contador de erros aumenta e o processamento continua para os demais itens.

Origem: `Robo-CEF/Repositories/PublicacoesRepository.cs`.

## O robo tem tela propria?

Nao ha tela propria comprovada. O projeto e console e automatiza telas externas do portal CEF.

Origem: `outputs/relatorios/inventario-projeto.md`.

## Existe API interna?

Nao foi encontrada API HTTP interna, controller ou rota propria.

Origem: `outputs/relatorios/inventario-projeto.md`.

## Quais pontos devem ser verificados em falha de login?

Verificar credenciais, portal, captcha, permissao externa do usuario e seletores da tela de login.

Origem: `Robo-CEF/Services/LoginService.cs`.

## Quais pontos devem ser verificados em falha de importacao?

Verificar conexao MySQL, permissao do usuario de banco, contrato da procedure e dados da publicacao.

Origem: `Robo-CEF/Repositories/PublicacoesRepository.cs`.

## Quais pontos devem ser verificados em falha de notificacao?

Verificar webhook Slack, conectividade HTTP, banco MySQL e procedure de WhatsApp.

Origem: `Robo-CEF/Services/NotityService.cs`, `Robo-CEF/Repositories/WhatsAppRepository.cs`.
