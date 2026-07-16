# Audiência Mutirão — memória funcional

Ambiente validado: HML
Rota: `/@rocha_juridico_hml/app/audiencia_multirao`

## Objetivo

Consultar audiências de mutirão e importar uma relação de audiências em lote.

## Filtros

- Data da audiência: de/até
- Hora
- Sijur
- Processo
- CPF
- Audiência efetuada?
- Acordo?

## Resultado e ações

A grade apresenta Data da audiência, Hora, Sijur, Parte autora, CPF, Audiência efetuada?, Acordo e Ação. As ações de cada linha são **Detalhe** e **Visualizar processo**.

### Upload de audiência

O modal aceita arquivos CSV, TXT, XLS e XLSX. Antes da importação, orienta conferir Data da audiência, Hora, Sijur e Processo. A prévia exibe esses campos e o retorno do processamento. O botão **Importar** permanece desabilitado até a seleção de um arquivo.

## Limites da validação

- O modal foi aberto e cancelado sem selecionar arquivo.
- Nenhuma audiência foi importada ou alterada.
- CPFs e demais dados reais exibidos na grade não foram registrados.
