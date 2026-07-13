# 12 - Fluxo Operacional Detalhado

## Inicializacao

1. `Main` cria `ConfigurationBuilder`.
2. Define base path como `Directory.GetCurrentDirectory()`.
3. Carrega `config.json` obrigatorio.
4. Le `DiasRetroativos`, `IsDevelopment`, connection string e chave CapMonster.
5. Cria ChromeDriver por `DriverBuilder`.
6. Define `ImplicitWait` de 10 segundos.
7. Calcula:
   - `dataInicioProcessamento = DateTime.Now`
   - `dataInicio = dataInicioProcessamento.AddDays(-diasRetroativos)`
   - `dataFim = dataInicioProcessamento`

Evidencia: `Robo-CEF/Program.cs`.

## Login

1. `LoginService.RunAsync` define tentativas com timeouts de 5, 15 e 30 segundos.
2. Em cada tentativa, navega para `https://www.juridico.caixa.gov.br`.
3. Se a URL nao contem `logon`, retorna sucesso.
4. Se contem `logon`, preenche usuario e senha.
5. Captura screenshot do elemento `img#imgCaptcha` em base64.
6. Envia base64 para `CaptchaService.ResolveAsync`.
7. Preenche `input#sCaptcha`.
8. Clica `button#btn-login`.
9. Aguarda loading aparecer, desaparecer e URL sair de `logon`.
10. Se nenhuma tentativa concluir, lanca excecao.

Evidencia: `Services/LoginService.cs`, `Services/CapchaService.cs`.

## Processamento de cada fase

O metodo `ProcessarFaseAsync` e executado duas vezes:

| Execucao | Parametro | Fase atribuida |
|---|---|---|
| Primeiro grau | `isSegundoGrau: false` | `1a. Fase` |
| Segundo grau | `isSegundoGrau: true` | `2a. Fase` |

Etapas:

1. Pesquisa publicacoes no portal.
2. Obtem total informado pelo portal.
3. Faz parse das tabelas HTML para `PublicacoesTable`.
4. Atribui `p_FASEPROCESSUAL`.
5. Conta registros extraidos.
6. Monta `HashSet` de expedientes nao vazios.
7. Consulta expedientes ja existentes no banco.
8. Filtra somente publicacoes novas.
9. Remove duplicidade por `p_EXPEDIENTE`.
10. Registra log `EM_PROCESSO`.
11. Importa novas publicacoes quando existem.
12. Retorna `ResumoExtracao`.

Evidencia: `Robo-CEF/Program.cs`.

## Consulta no portal

1. Acessa a tela `AjustesSIJURFaseAClassificar`.
2. Aguarda campo `iniBuscaFaseClassificar`.
3. Preenche data inicial e pressiona Enter.
4. Preenche data final e pressiona Enter.
5. Se segundo grau, seleciona `nGrauExpediente = 2`.
6. Clica em `.form-group` para cancelar sobreposicao dos campos de data.
7. Clica `btFiltrar`.
8. Aguarda fim do loading.
9. Tenta selecionar `ItemsPerPage`.
10. Coleta o HTML da tabela.
11. Clica em `button.btnProxima` enquanto existir, estiver visivel e habilitado.

Evidencia: `Services/PublicacoesService.cs`.

## Importacao

1. Abre conexao MySQL.
2. Divide publicacoes em lotes de 100.
3. Para cada item, executa `EPM_ROCHA.PRC_PUBLICACOES_PORTAL_CEF_MER_760`.
4. Incrementa sucesso quando a procedure conclui.
5. Em erro, incrementa contador de erro e grava log `ERRO`.
6. Ao final, retorna totais de sucesso e erro.

Evidencia: `Repositories/PublicacoesRepository.cs`.

## Encerramento

O bloco `finally` executa:

1. Calcula data/hora final.
2. Formata periodo pesquisado.
3. Monta mensagem com resumo de primeiro e segundo grau.
4. Inclui `ERRO CRITICO` se `erroGlobal != null`.
5. Escreve mensagem no console.
6. Envia Slack.
7. Envia WhatsApp.
8. Grava log `FINALIZADO`.
9. Fecha e descarta o driver.

Observacao: essas chamadas ocorrem em sequencia e nao possuem tratamento individual de erro no `finally`. Uma excecao em `NotificarSlackAsync`, por exemplo, pode impedir as etapas seguintes.

Evidencia: `Robo-CEF/Program.cs`.
