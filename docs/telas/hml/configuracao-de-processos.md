# Memoria funcional aprofundada - Configuração de Processos

Ambiente: HML

Rota: `/@rocha_juridico_hml/app/configuracao_de_processos`

## Tela principal

### Filtros e campos

- Cliente
- Responsável
- Área do Cliente
- Tipo de Ação
- Status

### Botoes funcionais

- Adicionar configuração

### Colunas

- Responsavel
- Area do Cliente
- Tipo de Acao
- Status
- Acoes

## Modal - Adicionar configuração

### Campos

- Cliente
- Área do Cliente *
- Tipo de ação
- Responsável *

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

## Regra confirmada

- A Area do Cliente pode aparecer inicialmente preenchida, mas precisa ser selecionada para validar o formulario.
- Area do Cliente e Responsavel sao obrigatorios para habilitar Salvar.
- Tipo de Acao e opcional.
- Regra validada no navegador: somente Area do Cliente e Responsavel habilitaram Salvar, mantendo Tipo de Acao vazio.
- Nenhuma gravacao foi realizada.

## Validacao controlada de criacao e alteracao - 2026-07-15

- Uma configuracao ficticia foi criada com Area do Cliente, Tipo de Acao e Responsavel.
- O registro criado foi localizado, editado e inativado ao final do ciclo.
- Nenhum registro preexistente foi alterado.
