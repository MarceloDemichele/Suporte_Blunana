# Integracoes Externas

## Portal juridico CEF

Usado para autenticar, pesquisar publicacoes, filtrar periodo/grau, paginar e extrair tabelas.

Possiveis erros:

- portal indisponivel;
- mudanca de seletores;
- usuario sem permissao;
- sessao nao autenticada.

Origem: `Robo-CEF/Services/LoginService.cs`, `Robo-CEF/Services/PublicacoesService.cs`.

## CapMonster Cloud

Usado para resolver captcha do login. O fluxo ativo usa SDK CapMonster; o fluxo legado usa chamadas HTTP diretas.

Possiveis erros:

- chave invalida;
- erro retornado pelo servico;
- imagem invalida;
- indisponibilidade externa.

Origem: `Robo-CEF/Services/CapchaService.cs`, `Robo-CEF/Workers/CaptchaBreaker.cs`.

## MySQL

Usado para:

- consultar expedientes existentes;
- importar publicacoes;
- registrar logs;
- inserir mensagem WhatsApp.

Origem: `Robo-CEF/Repositories/*.cs`.

## Slack

Usado para enviar resumo final de processamento por webhook.

Ponto de atencao: o inventario registrou webhook hardcoded; valores sensiveis nao devem ser reproduzidos.

Origem: `Robo-CEF/Services/NotityService.cs`, `outputs/relatorios/inventario-projeto.md`.

## WhatsApp via banco

O envio de mensagem WhatsApp ocorre por procedure no banco.

Ponto a validar: contrato e efeitos da procedure nao estao no repositorio.

Origem: `Robo-CEF/Repositories/WhatsAppRepository.cs`.

## Origem da informacao

- `outputs/relatorios/inventario-projeto.md`
- `docs/funcional/telas-integracoes.md`
- `docs/tecnica/arquitetura.md`
