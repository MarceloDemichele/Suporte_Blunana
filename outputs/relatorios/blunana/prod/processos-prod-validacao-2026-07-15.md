# Validacao da tela Processos em PROD

Data: 2026-07-15

## Escopo

Leitura estrutural da tela `Processos`, sem preencher filtros, clicar em acoes, abrir registros ou capturar screenshot.

## Resultado

- Rota validada: `/@rocha_juridico/app/processos1`.
- Campos encontrados: 20.
- Dados pessoais encontrados no artefato: 0.
- Operacoes de escrita executadas: 0.

## Filtros identificados

- Situacao
- Status
- Area
- Tipo de acao
- Responsavel
- Codigo do cliente
- Extinto
- Numero do processo
- Data de recebimento: de/ate
- Data de tratamento: de/ate

## Estrutura de resultados

Foram identificadas colunas para situacao, status, numero do processo, area, tipo de acao, responsavel, data de recebimento, data de tratamento e acao.

## Controles identificados

- Adicionar Processo
- Limpar filtros

Nao existe necessidade de botao de pesquisa. A equipe de suporte confirmou em 2026-07-15 que cada filtro e aplicado automaticamente e acrescenta um criterio cumulativo a consulta.

## Resposta de suporte comprovada

`Acesse o menu Processos e utilize um ou mais filtros, como Numero do processo, Codigo do cliente, Status ou Responsavel. A listagem e atualizada automaticamente, e cada filtro acrescentado restringe os resultados da pesquisa.`

## Fontes

- `outputs/json/blunana/prod/blunana-menu.json`
- `outputs/json/blunana/prod/processos-tela.json`
