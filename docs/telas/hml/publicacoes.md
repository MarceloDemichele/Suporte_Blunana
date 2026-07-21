# Publicações — memória funcional

Ambiente validado: HML
Rota: `/@rocha_juridico_hml/app/publicacoes`

## Objetivo

Consultar, filtrar e tratar publicações recebidas, incluindo a análise de possíveis duplicidades.

## Indicadores

- Base de publicações
- Resultado filtrado
- Recebidas hoje
- Tratadas hoje
- Em aberto

## Filtros

- Status (a tela inicia com **Pendente**)
- Área
- Tipo de ação
- Responsável
- Tratado
- Código do cliente
- Número do processo
- Recebimento: de/até
- Publicação: de/até
- Disponibilização: de/até
- Tratamento: de/até

## Resultado e ações

A grade apresenta Status, Número do processo, Área, Tipo de ação, Responsável, Data da publicação, Data de disponibilização, texto da Publicação, Lido, Tratado e Ação. A tela permite limpar filtros e exportar os resultados.

Cada linha apresenta duas ações visuais. Como podem iniciar tratamento ou alteração, elas não foram acionadas nesta coleta.

Com processo autorizado, as ações foram identificadas como **Tratar publicação** e **Visualizar processo** na tela geral. No detalhe do processo também existe **Criar prazo** a partir da publicação. Uma consulta sem o status padrão confirmou publicações já tratadas.

### Possíveis duplicidades

Abre uma janela para revisar publicações relacionadas ao mesmo processo. A janela apresenta o resultado paginado e pode ser fechada sem alterar registros. Na sessão validada não havia item disponível para revisão.

A regra funcional considera uma janela fixa de **7 dias para trás**, calculada pela **Data de disponibilização**, e exige o **mesmo Código do cliente**. O número do processo igual, sem código do cliente igual, não caracteriza duplicidade.

## Limites da validação

- Nenhuma publicação foi marcada, lida ou tratada.
- Dados reais da grade não foram registrados na memória.
