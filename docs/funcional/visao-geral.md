# Visao Geral Funcional

## Finalidade

O Robo CEF tem como finalidade automatizar o monitoramento de publicacoes de processos CEF no portal juridico da Caixa.

Funcionalmente, o robo:

1. Acessa o portal juridico CEF.
2. Realiza login com usuario, senha e captcha.
3. Pesquisa publicacoes por periodo.
4. Processa publicacoes de 1a. fase.
5. Processa publicacoes de 2a. fase.
6. Extrai dados das tabelas retornadas pelo portal.
7. Remove duplicidades por expediente.
8. Consulta quais expedientes ja existem no banco.
9. Importa somente publicacoes novas.
10. Registra logs de execucao.
11. Envia resumo final por Slack e WhatsApp.

Evidencias:

- `outputs/relatorios/inventario-projeto.md`
- `Robo-CEF/Program.cs`
- `Robo-CEF/Services/LoginService.cs`
- `Robo-CEF/Services/PublicacoesService.cs`
- `Robo-CEF/Repositories/PublicacoesRepository.cs`
- `Robo-CEF/Services/NotityService.cs`

## Atores e sistemas envolvidos

| Ator/Sistema | Papel funcional | Evidencia |
|---|---|---|
| Robo CEF | Executa o fluxo automatizado de consulta, extracao, importacao e notificacao | `Robo-CEF/Program.cs` |
| Portal juridico CEF | Fonte das publicacoes consultadas | `Robo-CEF/Services/LoginService.cs`, `Robo-CEF/Services/PublicacoesService.cs` |
| CapMonster Cloud | Resolve o captcha necessario para login | `Robo-CEF/Services/CapchaService.cs` |
| Banco MySQL | Armazena publicacoes, logs e mensagens de notificacao WhatsApp | `Robo-CEF/Repositories/*.cs` |
| Slack | Recebe resumo de processamento | `Robo-CEF/Services/NotityService.cs` |
| WhatsApp | Recebe resumo por meio de procedure no banco | `Robo-CEF/Repositories/WhatsAppRepository.cs` |

## Resultado esperado

Ao final da execucao, o robo deve produzir um resumo com:

- periodo pesquisado;
- totais do portal;
- totais extraidos;
- total sem duplicidade por expediente;
- total ja existente no banco;
- total de publicacoes novas;
- total importado com sucesso;
- total com erro;
- eventual erro critico da execucao.

Evidencia: `Robo-CEF/Program.cs`.
