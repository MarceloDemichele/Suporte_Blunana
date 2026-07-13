# Atualizacao da Base de Conhecimento

Data: 2026-07-06

## Solicitação

Executar `prompts/04-gerar-conhecimento.md`, analisar o projeto completo, atualizar a pasta `knowledge` e registrar todas as alteracoes neste arquivo.

## Fontes consultadas

- `AGENTS.md`
- `prompts/04-gerar-conhecimento.md`
- `outputs/relatorios/inventario-projeto.md`
- `docs/funcional/modulos.md`
- `docs/funcional/fluxos.md`
- `docs/tecnica/arquitetura.md`
- `docs/qa/cenarios-teste.md`
- `Robo-CEF/Program.cs`
- `Robo-CEF/Services/LoginService.cs`
- `Robo-CEF/Services/PublicacoesService.cs`
- `Robo-CEF/Services/CapchaService.cs`
- `Robo-CEF/Services/NotityService.cs`
- `Robo-CEF/Repositories/PublicacoesRepository.cs`
- `Robo-CEF/Repositories/LogsRepository.cs`
- `Robo-CEF/Repositories/WhatsAppRepository.cs`
- `Robo-CEF/Models/PublicacoesTable.cs`
- `Robo-CEF/Constants/FasesProcessuais.cs`
- `Robo-CEF/Constants/RobotExecutionState.cs`

## Arquivos criados ou atualizados

| Arquivo | Tipo de alteracao | Conteudo |
|---|---|---|
| `knowledge/README.md` | Criado | Indice geral e politica de manutencao da base |
| `knowledge/funcionalidades/publicacoes-cef.md` | Criado | Funcionalidade principal de monitoramento de publicacoes CEF |
| `knowledge/arquitetura/visao-geral.md` | Criado | Visao arquitetural e pontos tecnicos a validar |
| `knowledge/backend/modulos.md` | Criado | Modulos backend e responsabilidades |
| `knowledge/frontend/sem-frontend.md` | Criado | Registro de ausencia de frontend proprio comprovado |
| `knowledge/banco/objetos.md` | Criado | Objetos de banco e regras associadas |
| `knowledge/regras-negocio/publicacoes.md` | Criado | Regras de negocio comprovadas no codigo |
| `knowledge/integrações/integracoes-externas.md` | Criado | Integracoes com portal CEF, CapMonster, MySQL, Slack e WhatsApp |
| `knowledge/faq/operacional.md` | Criado | Perguntas frequentes operacionais |
| `knowledge/bugs-conhecidos/riscos-e-pontos-validar.md` | Criado | Riscos, bugs conhecidos e pontos a validar |
| `knowledge/releases/2026-07-06-base-conhecimento.md` | Criado | Registro da criacao inicial da base |
| `knowledge/cliente/resumo-atendimento.md` | Criado | Resumo para atendimento ao cliente |
| `knowledge/treinamento/guia-operacao.md` | Criado | Guia inicial de treinamento |
| `outputs/relatorios/knowledge-update.md` | Criado | Registro desta atualizacao |

## Conhecimento consolidado

- O projeto e uma aplicacao console .NET 8.
- O fluxo ativo fica em `Robo-CEF/Program.cs`.
- O robo automatiza o portal juridico CEF com Selenium.
- O login usa usuario, senha e captcha.
- O captcha ativo usa CapMonster Cloud.
- O periodo de pesquisa usa `DiasRetroativos`.
- O processamento ocorre em 1a. fase e 2a. fase.
- Para 2a. fase, o filtro de grau recebe valor `2`.
- Expediente e a chave funcional para deduplicacao.
- Publicacoes existentes sao consultadas no MySQL.
- Apenas publicacoes novas sao importadas.
- A importacao usa procedure no banco.
- Erros por item importado geram log e nao interrompem todo o lote.
- O resumo final e enviado por Slack e WhatsApp.

## Pontos a validar registrados

- `repositories/documentacao/docs/` nao foi encontrado neste checkout.
- Nao ha schema/DDL/migrations do banco no repositorio.
- Contratos das stored procedures dependem do banco externo.
- Perfil/permissao do usuario no portal CEF nao esta comprovado no codigo.
- `Workers` parecem alternativos/legados e nao aparecem no fluxo ativo.
- Testes automatizados nao foram encontrados.
- Segredos em arquivo local/hardcoded foram registrados como risco, sem reproduzir valores.

## Observacoes

Nao houve alteracao de codigo-fonte. A atualizacao foi documental e baseada somente nas evidencias encontradas no projeto.
