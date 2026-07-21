# Memoria funcional aprofundada - Configuração do Ateste

Ambiente: HML

Rota: `/@rocha_juridico_hml/app/configuracao_de_ateste`

## Tipos de ateste

### Filtros e campos

- Tipo de ateste
- Status

### Botoes funcionais

- Tipos de ateste
- Regras de ateste
- Adicionar Ateste

### Colunas

- Tipo de ateste
- Status
- Ações

## Regras de ateste

### Filtros e campos

- Area de ateste
- Tipo de ateste
- Status

### Botoes funcionais

- Tipos de ateste
- Regras de ateste
- Adicionar Regra

### Colunas

- Tipo de ateste
- Status
- Ações
- Area de ateste
- Valor

## Modal - Adicionar Ateste

### Campos

- Nome do ateste

### Botoes

- Cancelar
- Salvar

## Modal - Adicionar Regra

### Campos

- Area de Ateste
- Tipo de ateste
- Valor

### Botoes

- Cancelar
- Salvar

## Regras de seguranca da coleta

- Nenhum valor de tabela foi coletado.
- Nenhum formulario foi submetido.
- Nenhuma alteracao foi confirmada.
- Nenhuma screenshot foi capturada.

## Validacao de obrigatoriedade

- Adicionar Ateste: o botao Salvar fica habilitado com o formulario vazio, mas o modal permanece aberto apos o clique. Nao foi identificada mensagem textual no componente inspecionado.
- Adicionar Regra: o botao Salvar fica habilitado; ao clicar vazio, o modal permanece aberto e informa que a Area de Ateste deve ser selecionada.
- A mensagem do modal informa que uma nova regra e criada como ativa por padrao.
- Nenhuma gravacao foi realizada no teste.

## Validacao com massa ficticia

- O campo Nome do ateste aceitou o valor ficticio e habilitou o formulario.
- Na regra, a Area de Ateste existente foi selecionada com sucesso.
- O teste foi cancelado sem salvar.

## Ciclo de gravacao validado

- Um Tipo de Ateste ficticio identificado pelo prefixo `AUTO-SUPORTE-HML` foi criado com sucesso.
- O registro criado foi localizado pelo filtro de Tipo de Ateste.
- A manutencao permitiu alterar o nome e controlar o campo Ativo.
- A alteracao do nome foi confirmada na listagem.
- Ao final do teste, o mesmo registro foi inativado para nao interferir na operacao de HML.
- Nenhum registro preexistente foi alterado.

## Ciclo de gravacao da Regra de Ateste - 2026-07-15

- Foi criado um Tipo de Ateste auxiliar com identificacao ficticia.
- Uma Regra de Ateste foi criada para uma Area de Ateste existente e vinculada somente ao tipo auxiliar.
- O campo Valor utiliza formato monetario.
- A regra nasce ativa por padrao, conforme informado no modal.
- A manutencao permitiu alterar o valor e inativar a regra.
- A regra e o tipo auxiliar ficaram inativos ao final do teste.
- Nenhum registro preexistente foi alterado.
