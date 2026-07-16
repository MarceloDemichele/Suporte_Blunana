# Memoria funcional aprofundada - Agenda de prazos

Ambiente: HML

Rota: `/@rocha_juridico_hml/app/agenda_nova`

## Objetivo

A Agenda apresenta, em calendario mensal, os Prazos, Audiencias e Tarefas vinculados a cada dia.

## Navegacao do calendario

- Botao Hoje retorna para a data atual.
- Setas anterior e proxima navegam entre os meses.
- Cada dia informa a quantidade de Prazos, Audiencias e Tarefas, ou `Sem itens`.
- Selecionar um dia atualiza a data e as listas exibidas abaixo do calendario.

## Abas de resultados

- Prazos.
- Audiencias.
- Tarefas.

Cada aba informa a quantidade de itens para a data selecionada.

## Filtros comuns

- Data selecionada.
- Status.
- Area.
- Tipo de acao.
- Responsavel.
- Codigo do cliente.
- Numero do processo.
- Limpar filtros.

## Estrutura dos resultados

- Os itens sao agrupados por Classificacao.
- Prazos exibem numero do processo, Data Prazo, Data Fatal e Status.
- Audiencias exibem numero do processo, Responsavel, Data de audiencia e Status.
- Tarefas exibem numero do processo, Responsavel, Data Prazo, Data Fatal e Status.
- Ha controle de itens por pagina e navegacao entre paginas.

## Acoes dos itens

- Cada item apresenta tres botoes por icone.
- Os icones nao possuem rotulo textual acessivel suficiente para comprovar sua finalidade.
- As acoes nao foram acionadas nesta etapa porque podem alterar dados; permanecem como ponto de validacao controlada.

## Regras confirmadas

- A selecao de uma data alimenta simultaneamente as contagens das tres abas.
- A troca de aba mantem a data selecionada e aplica o mesmo conjunto de filtros ao tipo de item escolhido.
- Dias sem registros exibem mensagem de ausencia de itens.

## Seguranca da coleta

- A navegacao foi somente leitura.
- Nenhum prazo, audiencia ou tarefa foi alterado.
- Numeros de processos, nomes de responsaveis e valores momentaneos nao foram persistidos nesta memoria.
