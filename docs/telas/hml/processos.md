# Processos — memória funcional

Ambiente validado: HML
Rota: `/@rocha_juridico_hml/app/processos1`

## Objetivo

Consultar a base de processos, combinar critérios de pesquisa, abrir o tratamento de um processo e iniciar uma inclusão manual.

## Indicadores

- Base de processos
- Processos em andamento
- Processos encerrados
- Recebidos hoje
- Tratados hoje
- Em aberto

## Filtros

- Situação
- Status
- Área
- Tipo de ação
- Responsável
- Código do cliente
- Extinto
- Número do processo
- Data de recebimento: de/até
- Data de tratamento: de/até

Os filtros são aplicados automaticamente. A seleção de mais de um filtro acrescenta critérios à mesma pesquisa. O botão **Limpar filtros** restaura a consulta.

## Resultado e ações

A grade apresenta Situação, Status, Número do processo, Área, Tipo de ação, Responsável, Data de recebimento, Data de tratamento e Ação. Há exportação da consulta e a ação da linha é identificada como **Visualizar e tratar processo**.

### Adicionar Processo

Abre um modal com:

- Código do Cliente (obrigatório)
- Código Terceirização
- Número do Processo (obrigatório)
- Comarca
- Foro
- Vara
- Área (obrigatório)
- Tipo de Ação (obrigatório)
- Nome da Parte
- CPF/CNPJ

O modal possui **Cancelar** e **Salvar**. Nesta validação ele foi aberto e cancelado, sem gravação.

## Limites da validação

- A tela de detalhes foi aberta e suas oito seções e formulários disponíveis foram mapeados com um processo autorizado pela equipe de suporte.
- Nenhum processo real foi criado ou alterado.
- Dados exibidos na grade não foram transcritos para a documentação.
