# Funcionalidade - Monitoramento de Publicacoes CEF

## Nome

Monitoramento de publicacoes CEF.

## Objetivo

Automatizar a consulta de publicacoes no portal juridico da Caixa, identificar publicacoes novas e importar os dados para o banco MySQL.

## Descricao

O robo acessa o portal juridico CEF, realiza login com captcha, pesquisa publicacoes por periodo, processa 1a. e 2a. fase, extrai dados das tabelas do portal, remove duplicidades por expediente, consulta expedientes existentes no banco e importa somente publicacoes novas. Ao final, envia resumo por Slack e WhatsApp.

## Perfis envolvidos

- Operacao: acompanha execucao e resultado do robo.
- Suporte: investiga falhas de login, portal, banco e notificacoes.
- Desenvolvimento: mantem automacao, integracoes e regras.
- QA: valida fluxos e cenarios de erro.
- Atendimento ao cliente: comunica status e comportamento esperado.

Ponto a validar: o codigo nao informa perfis/permissoes exigidos pelo portal CEF.

## Permissoes

Nao ha permissao interna implementada no projeto. A execucao depende de:

- credenciais validas do portal CEF;
- permissao de acesso ao portal;
- acesso ao banco MySQL;
- permissao para executar procedures e consultar/inserir dados.

## Fluxo

1. Ler configuracoes.
2. Abrir navegador Chrome via Selenium.
3. Fazer login no portal CEF.
4. Calcular periodo com base em `DiasRetroativos`.
5. Pesquisar publicacoes de 1a. fase.
6. Extrair e importar publicacoes novas de 1a. fase.
7. Pesquisar publicacoes de 2a. fase.
8. Extrair e importar publicacoes novas de 2a. fase.
9. Gerar resumo.
10. Enviar notificacoes.
11. Registrar finalizacao e fechar navegador.

## Entradas

| Entrada | Uso |
|---|---|
| `ConnectionStrings:DefaultConnection` | Conexao MySQL |
| `LoginUser:UserName` | Usuario do portal CEF |
| `LoginUser:PassWord` | Senha do portal CEF |
| `Capmonster:Key` | Resolucao de captcha |
| `DiasRetroativos` | Periodo retroativo de pesquisa |
| `ItemsPerPage` | Quantidade de registros por pagina no portal |

## Saidas

- Publicacoes novas importadas no banco.
- Logs de execucao.
- Resumo de processamento no console.
- Notificacao Slack.
- Mensagem WhatsApp via banco.

## Dependencias

- Portal juridico CEF.
- Chrome/ChromeDriver/Selenium.
- CapMonster Cloud.
- MySQL.
- Slack webhook.
- Procedure de WhatsApp.

## Integracoes

- Portal CEF para login e consulta.
- CapMonster para captcha.
- MySQL para consulta, importacao, logs e WhatsApp.
- Slack para notificacao.

## Possiveis erros

- Falha de configuracao obrigatoria.
- Credenciais invalidas ou sem permissao.
- Captcha nao resolvido.
- Mudanca de seletores no portal.
- Falha de conexao com banco.
- Procedure indisponivel ou contrato divergente.
- Webhook Slack invalido.

## Observacoes

O projeto nao possui API propria nem tela propria comprovada. E uma aplicacao console que automatiza telas externas.

## Ultima atualizacao

2026-07-06

## Origem da informacao

- `outputs/relatorios/inventario-projeto.md`
- `docs/funcional/modulos.md`
- `docs/funcional/fluxos.md`
- `Robo-CEF/Program.cs`
- `Robo-CEF/Services/LoginService.cs`
- `Robo-CEF/Services/PublicacoesService.cs`
- `Robo-CEF/Repositories/PublicacoesRepository.cs`
- `Robo-CEF/Services/NotityService.cs`
