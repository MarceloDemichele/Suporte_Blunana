# Ateste — memória funcional

Ambiente validado: HML
Rota: `/@rocha_juridico_hml/app/ateste`

## Objetivo

Consultar atestes, acompanhar valores por situação e importar retornos de pagamento.

## Indicadores

- Atestes recebidos
- Atestes rejeitados
- Valor a receber

## Filtros

- Status
- Número do processo
- Área de ateste
- Tipo de ateste
- Criação: de/até
- Solicitação: de/até
- Recebimento: de/até

O campo **Tipo de ateste** depende da seleção prévia da **Área de ateste**.

## Resultado e ações

A grade apresenta Status, Número do processo, Data do ateste, Área de ateste, Tipo de ateste, Solicitado, Recebido, Rejeitado, Valor e Ação.

As ações da linha são **Editar ateste**, **Visualizar processo** e **Excluir ateste**. A exclusão é destrutiva e não deve ser usada em exploração funcional sem um registro fictício previamente autorizado.

No detalhe do processo, o ateste também oferece **Histórico**. Edição, histórico e confirmação de exclusão foram validados com processo autorizado; todas as telas foram fechadas sem persistência.

### Upload de Pagamento

O modal aceita arquivos CSV, TXT, XLS e XLSX. A prévia apresenta Data, Código, Lote, Status e Mensagem. O botão **Importar** permanece desabilitado até a seleção de um arquivo.

## Limites da validação

- O modal de upload foi aberto e cancelado sem selecionar arquivo.
- Nenhum ateste foi editado, visualizado ou excluído.
- Números de processos e valores reais não foram transcritos para a documentação.
