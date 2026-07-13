# Frontend - Situacao Atual

## Conhecimento

Nao ha frontend proprio comprovado no projeto. O Robo CEF e uma aplicacao console que automatiza telas externas do portal juridico CEF.

## Telas envolvidas

As telas documentadas pertencem ao portal externo:

| Tela externa | Uso |
|---|---|
| Portal juridico CEF | Login |
| Fases a classificar | Pesquisa e extracao de publicacoes |

## Impacto para suporte e QA

Falhas visuais ou mudancas de HTML no portal externo podem quebrar a automacao, pois o robo depende de seletores como campos de login, datas, filtro de grau, botao de filtrar, tabela de resultados e botao de proxima pagina.

## Ponto a validar

Confirmar se ha alguma interface externa operacional fora deste repositorio. No codigo analisado, nao ha tela propria do sistema.

## Origem da informacao

- `outputs/relatorios/inventario-projeto.md`
- `docs/funcional/telas-integracoes.md`
- `Robo-CEF/Services/LoginService.cs`
- `Robo-CEF/Services/PublicacoesService.cs`
