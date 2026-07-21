# Memoria funcional aprofundada - Configuração Usuário

Ambiente: HML

Rota: `/@rocha_juridico_hml/app/configuracao_usuario`

## Usuarios

### Filtros e campos

- Cliente
- Filtro

### Botoes funcionais

- Usuarios
- Vinculo
- Excecao Ateste
- Adicionar Usuário

### Colunas

- Papel
- Status
- Nome
- Email
- Celular
- Substituto
- Ações

## Vinculo

### Filtros e campos

- Cliente
- Filtro

### Botoes funcionais

- Usuarios
- Vinculo
- Excecao Ateste
- Adicionar Usuário
- Adicionar Vinculo

### Colunas

- Papel
- Status
- Nome
- Email
- Celular
- Substituto
- Ações
- Superior
- Subordinado
- Criado em
- Acao

## Excecao Ateste

### Filtros e campos

- Cliente
- Filtro

### Botoes funcionais

- Usuarios
- Vinculo
- Excecao Ateste
- Adicionar Usuário
- Adicionar Vinculo
- Adicionar Excecao

### Colunas

- Papel
- Status
- Nome
- Email
- Celular
- Substituto
- Ações
- Superior
- Subordinado
- Criado em
- Acao
- Advogado
- Area Juridica
- Atualizado em
- Atualizado por

## Modal - Adicionar Usuário

### Campos

- Cliente
- Nome
- Email
- Celular
- Papel
- Concluir prazo
- Excluir registro
- Alteracao
- Visualiza Estrutura

### Botoes

- Cancelar
- Salvar

## Regras de seguranca da coleta

- Nenhum valor de tabela foi coletado.
- Nenhum formulario foi submetido.
- Nenhuma alteracao foi confirmada.
- Nenhuma screenshot foi capturada.

## Validacao de obrigatoriedade

- No formulario vazio, o botao Salvar permanece desabilitado.
- Nenhuma gravacao foi realizada no teste.

## Validacao com massa ficticia

- Cliente, Nome, Email e Papel aceitaram a massa ficticia/existente.
- Apos o preenchimento, o botao Salvar ficou habilitado.
- O teste foi cancelado sem salvar.

## Ciclo de gravacao validado - 2026-07-15

- A inclusao de usuario nao envia e-mail nem SMS, conforme confirmacao funcional da equipe.
- Um usuario ficticio foi criado com papel Coordenador e sem permissoes adicionais.
- O registro foi localizado pelo e-mail ficticio, aberto para edicao e inativado.
- O status Inativo foi confirmado na tabela.
- Nenhum usuario preexistente foi alterado.

## Ciclo de Vinculo - 2026-07-15

- O formulario exige a selecao de um Superior e de um Subordinado.
- O Vinculo nasce ativo quando a opcao `Vinculo ativo` permanece marcada.
- Usuarios inativos continuam disponiveis nos campos de selecao.
- Foi criado um vinculo somente entre dois usuarios ficticios.
- A manutencao permite trocar o status; o vinculo ficou inativo ao final.

## Ciclo de Excecao de Ateste - 2026-07-15

- O formulario possui Advogado, Area Juridica e status Ativo.
- As Areas Juridicas observadas foram FEITOS DIVERSOS, HABITACIONAL, MULTIRAO, RECUPERACAO DE CREDITOS e TRABALHISTA.
- O campo Advogado permite selecionar qualquer advogado disponivel, sem regra adicional de restricao para a selecao.
- A excecao ficticia foi criada para um usuario ficticio com papel Advogado e uma Area Juridica existente.
- A manutencao permite alterar o status; a excecao ficou inativa ao final.
- Os usuarios auxiliares, o vinculo e a excecao foram confirmados como inativos.
- Nenhum registro preexistente foi alterado.

### Regra funcional confirmada

- Todos os advogados disponiveis podem ser selecionados para Excecao de Ateste.
- Nao existe regra adicional de selecao nesse campo.
