# Fluxo Operacional

## Fluxo principal

1. Ler configuracoes de `config.json`.
2. Criar uma instancia do Chrome via Selenium WebDriver.
3. Instanciar repositorios e servicos.
4. Registrar log de inicializacao.
5. Realizar login no portal juridico CEF.
6. Processar publicacoes de 1a. fase.
7. Processar publicacoes de 2a. fase.
8. Montar resumo final.
9. Enviar resumo para Slack.
10. Inserir mensagem para WhatsApp via banco.
11. Registrar log de finalizacao.
12. Fechar o navegador.

Evidencias:

- `outputs/relatorios/inventario-projeto.md`
- `Robo-CEF/Program.cs`

## Fluxo de login

1. Navegar para `https://www.juridico.caixa.gov.br`.
2. Verificar se a URL contem `logon`.
3. Ler usuario e senha de `LoginUser:UserName` e `LoginUser:PassWord`.
4. Preencher matricula, senha e captcha.
5. Resolver captcha usando o servico de captcha.
6. Clicar no botao de login.
7. Aguardar loading e mudanca da URL para uma pagina sem `logon`.
8. Tentar novamente em caso de falha, usando tres janelas de timeout: 5, 15 e 30 segundos.

Evidencia: `Robo-CEF/Services/LoginService.cs`.

## Fluxo de pesquisa de publicacoes

1. Acessar a tela de fases a classificar.
2. Preencher data inicial.
3. Preencher data final.
4. Quando o processamento for de segundo grau, selecionar o valor `2` no filtro de grau.
5. Acionar o filtro de pesquisa.
6. Aguardar carregamento.
7. Selecionar quantidade de itens por pagina configurada.
8. Coletar o HTML da tabela de publicacoes.
9. Avancar paginas enquanto o botao de proxima pagina estiver disponivel.

Evidencia: `Robo-CEF/Services/PublicacoesService.cs`.

## Fluxo de importacao

1. Converter as tabelas HTML extraidas para objetos `PublicacoesTable`.
2. Definir a fase processual de cada publicacao.
3. Montar conjunto de expedientes encontrados.
4. Consultar expedientes ja existentes no banco.
5. Filtrar publicacoes novas.
6. Remover duplicidades por expediente.
7. Importar novas publicacoes pela stored procedure.
8. Registrar erro individual quando uma publicacao falhar.
9. Retornar totais de sucesso e erro.

Evidencias:

- `Robo-CEF/Program.cs`
- `Robo-CEF/Utils/HtmlTableParser.cs`
- `Robo-CEF/Repositories/PublicacoesRepository.cs`

## Fluxo de notificacao

1. Montar mensagem de resumo no encerramento do fluxo.
2. Enviar mensagem para Slack por webhook.
3. Inserir mensagem para WhatsApp via stored procedure.
4. Registrar finalizacao.

Evidencias:

- `Robo-CEF/Program.cs`
- `Robo-CEF/Services/NotityService.cs`
- `Robo-CEF/Repositories/WhatsAppRepository.cs`
- `Robo-CEF/Repositories/LogsRepository.cs`
