# Fluxos Funcionais

Fonte principal: `outputs/relatorios/inventario-projeto.md`.

## Fluxo macro

1. O robo le as configuracoes locais.
2. O robo abre o navegador Chrome por Selenium.
3. O robo autentica no portal juridico CEF.
4. O robo pesquisa publicacoes no periodo configurado.
5. O robo processa 1a. fase.
6. O robo processa 2a. fase.
7. O robo remove duplicidades por expediente.
8. O robo consulta expedientes existentes.
9. O robo importa publicacoes novas.
10. O robo registra logs de execucao.
11. O robo envia resumo por Slack e WhatsApp.
12. O robo fecha o navegador.

Evidencia: `Robo-CEF/Program.cs`.

## Fluxo de autenticacao

1. Acessar `https://www.juridico.caixa.gov.br`.
2. Verificar se a URL contem `logon`.
3. Ler `LoginUser:UserName` e `LoginUser:PassWord`.
4. Preencher usuario e senha.
5. Capturar a imagem do captcha.
6. Resolver captcha com CapMonster.
7. Preencher captcha e acionar login.
8. Aguardar loading e saida da URL de logon.
9. Em caso de falha, tentar novamente com outro timeout.

Evidencias: `Robo-CEF/Services/LoginService.cs`, `Robo-CEF/Services/CapchaService.cs`.

## Fluxo de consulta por fase

1. Calcular `dataInicio` com base em `DiasRetroativos`.
2. Definir `dataFim` como data/hora do inicio do processamento.
3. Acessar tela de fases a classificar.
4. Preencher data inicial e final no formato `dd/MM/yyyy`.
5. Para 2a. fase, selecionar grau `2`.
6. Acionar filtro.
7. Aguardar carregamento.
8. Selecionar quantidade de itens por pagina.
9. Extrair tabela HTML da pagina atual.
10. Avancar enquanto houver botao de proxima pagina habilitado.

Evidencias: `Robo-CEF/Program.cs`, `Robo-CEF/Services/PublicacoesService.cs`.

## Fluxo de deduplicacao e importacao

1. Converter tabelas HTML para `PublicacoesTable`.
2. Atribuir fase processual.
3. Criar conjunto de expedientes nao vazios.
4. Consultar expedientes existentes no banco.
5. Filtrar publicacoes cujo expediente nao existe no banco.
6. Aplicar `DistinctBy` por expediente.
7. Registrar quantidade em processamento.
8. Importar publicacoes novas por procedure.
9. Registrar erro por publicacao quando ocorrer.
10. Retornar totais de sucesso e erro.

Evidencias: `Robo-CEF/Program.cs`, `Robo-CEF/Repositories/PublicacoesRepository.cs`.

## Fluxo de encerramento e notificacao

1. Calcular data/hora final de processamento.
2. Formatar periodo pesquisado.
3. Montar resumo por fase.
4. Incluir erro critico quando existir.
5. Exibir resumo no console.
6. Enviar resumo para Slack.
7. Enviar resumo para WhatsApp via banco.
8. Registrar finalizacao.
9. Fechar e limpar driver.

Evidencias: `Robo-CEF/Program.cs`, `Robo-CEF/Services/NotityService.cs`, `Robo-CEF/Repositories/LogsRepository.cs`.

