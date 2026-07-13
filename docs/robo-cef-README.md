# Engenharia Reversa - ROBO-CEF

Documentacao tecnica gerada a partir dos arquivos existentes no repositorio.

## Politica de atualizacao

Esta documentacao deve ser atualizada sempre que houver mudanca no codigo-fonte, configuracao, dependencia, integracao, banco de dados, fluxo, validacao, permissao ou regra de negocio.

Em cada PR ou alteracao local, o agente deve comparar o diff do codigo com os arquivos Markdown desta pasta e atualizar os documentos impactados no mesmo trabalho. Mudancas de regra, validacao, filtro, calculo, status, fluxo, importacao, notificacao ou persistencia exigem revisao de `robo-cef-regras-negocio.md`. Mudancas de arquivos, modulos, integracoes, regras ou cobertura documental exigem revisao de `robo-cef-matriz-rastreabilidade.md`.

Nenhuma regra deve ser criada ou removida sem evidencia no codigo. Quando a evidencia for insuficiente, o item deve ser registrado em `robo-cef-pontos-a-validar.md`.

## Indice

- [Engenharia reversa](robo-cef-engenharia-reversa.md)
- [Telas](robo-cef-telas.md)
- [Modulos funcionais](robo-cef-modulos-funcionais.md)
- [API](robo-cef-api.md)
- [Banco](robo-cef-banco.md)
- [Regras de negocio](robo-cef-regras-negocio.md)
- [QA](robo-cef-qa.md)
- [Arquitetura](robo-cef-arquitetura.md)
- [Riscos](robo-cef-riscos.md)
- [Pontos a validar](robo-cef-pontos-a-validar.md)
- [Inventario do codigo-fonte](robo-cef-inventario-codigo-fonte.md)
- [Fluxo operacional](robo-cef-fluxo-operacional.md)
- [Matriz de rastreabilidade](robo-cef-matriz-rastreabilidade.md)

## Resumo executivo

| Item | Quantidade identificada | Observacao |
|---|---:|---|
| Projetos .NET | 1 | `Robo-CEF/Robo-CEF.csproj` |
| Modulos principais | 7 | Entrada, login, captcha, consulta/extracao, importacao, logs, notificacoes |
| Rotas/telas proprias | 0 | Aplicacao console, sem frontend proprio |
| Telas externas automatizadas | 2 | Login e ajustes/fases a classificar do portal juridico CEF |
| Endpoints/integracoes HTTP | 5 | Portal CEF, Slack webhook, CapMonster SDK, CapMonster HTTP legado, webhook Slack legado |
| Repositorios de banco | 3 | Publicacoes, logs e WhatsApp |
| Tabelas citadas diretamente | 2 | `T_PROCESSOS_TERCEIRIZACAO_CEF`, `T_EXECUCOES_ROBOTS` |
| Stored procedures citadas | 2 | `PRC_PUBLICACOES_PORTAL_CEF_MER_760`, `PRC_NOTIFICA_SUPORTE_ROCHA_ZAP` |
| Formularios externos manipulados | 2 | Login e filtro de publicacoes |
| Testes automatizados | 0 | Nao ha projeto ou arquivos de teste no repositorio |
| Arquivos de codigo C# | 19 | Inclui fluxo principal, services, repositories, workers, models, constants e utils |

## Principais riscos

- Credenciais, connection string, chave CapMonster e webhook Slack estao em arquivo de configuracao/codigo. Valores foram mascarados nesta documentacao.
- Build nao foi validado porque a maquina nao possui .NET SDK instalado.
- O `.csproj` nao lista pacotes usados por arquivos do codigo (`HtmlAgilityPack` e `Newtonsoft.Json`), indicando possivel falha de compilacao.
- Automacao depende de seletores e estrutura HTML do portal externo da CEF.
- Nao ha migrations ou schema completo do banco no repositorio.

## Escopo documentado

Esta documentacao cobre somente informacoes encontradas no repositorio:

- Codigo-fonte C# em `Robo-CEF`.
- Configuracoes em `Robo-CEF/config.json`, com valores sensiveis omitidos.
- Dependencias declaradas em `Robo-CEF/Robo-CEF.csproj`.
- Prompt de engenharia reversa em `prompts/reverse-engineering.md`.
- Instrucoes do agente em `AGENTS.md`.

Nao foram inferidas regras internas do portal CEF, schema real do banco, permissoes do usuario no portal ou comportamento das stored procedures alem do que o codigo chama explicitamente.
