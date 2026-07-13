# Regras de Negocio

## Periodo de pesquisa

O periodo pesquisado no portal comeca em `DateTime.Now.AddDays(-DiasRetroativos)` e termina em `DateTime.Now`.

Evidencia: `Robo-CEF/Program.cs`.

## Processamento por fase

O robo processa publicacoes em duas etapas:

1. 1a. fase.
2. 2a. fase.

Para a 2a. fase, o filtro `nGrauExpediente` recebe o valor `2`.

Evidencias:

- `Robo-CEF/Program.cs`
- `Robo-CEF/Services/PublicacoesService.cs`
- `Robo-CEF/Constants/FasesProcessuais.cs`

## Deduplicacao por expediente

As publicacoes extraidas sao deduplicadas pelo campo `p_EXPEDIENTE`.

Evidencia: `Robo-CEF/Program.cs`.

## Consulta de existentes

Antes da importacao, o robo consulta expedientes ja existentes na tabela `T_PROCESSOS_TERCEIRIZACAO_CEF`.

Evidencia: `Robo-CEF/Repositories/PublicacoesRepository.cs`.

## Importacao de novas publicacoes

Somente publicacoes cujo expediente nao foi encontrado no banco sao importadas.

A importacao e feita por chamada a `EPM_ROCHA.PRC_PUBLICACOES_PORTAL_CEF_MER_760`.

Evidencias:

- `Robo-CEF/Program.cs`
- `Robo-CEF/Repositories/PublicacoesRepository.cs`

## Lotes de importacao

As publicacoes novas sao processadas em lotes de 100.

Evidencia: `Robo-CEF/Repositories/PublicacoesRepository.cs`.

## Tratamento de erro por publicacao

Quando uma publicacao falha na importacao, o erro e registrado e o processamento continua para os demais itens.

Evidencia: `Robo-CEF/Repositories/PublicacoesRepository.cs`.

## Tentativas de login

O login tenta tres tempos de carregamento: 5, 15 e 30 segundos. Se nenhuma tentativa tiver sucesso, ocorre erro.

Evidencia: `Robo-CEF/Services/LoginService.cs`.

## Resumo final

O resumo final consolida totais do portal, extraidos, nao duplicados, existentes, novos, sucessos e erros para 1a. e 2a. fase.

Quando ha erro global, a mensagem do erro e incluida no resumo final.

Evidencia: `Robo-CEF/Program.cs`.

## Pontos a validar

As regras acima sao aparentes e comprovadas no codigo. Regras externas ao portal CEF, parametros reais das procedures e politicas de permissao do usuario nao estao comprovadas no repositorio.

Evidencia: `outputs/relatorios/inventario-projeto.md`.
