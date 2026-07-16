# Validacao de criacao e alteracao de Tipo de Ateste em HML

Data: 2026-07-15

## Escopo

Validar o ciclo controlado de persistencia de um Tipo de Ateste ficticio, sem modificar registros preexistentes.

## Identificacao do teste

- Prefixo: `AUTO-SUPORTE-HML`
- Execucao: `20260715210631`
- Ambiente: HML

## Resultado

| Etapa | Resultado |
|---|---|
| Criar Tipo de Ateste | Aprovado |
| Confirmar fechamento do modal | Aprovado |
| Localizar pelo filtro | Aprovado |
| Confirmar registro ativo | Aprovado |
| Alterar o nome | Aprovado |
| Confirmar nome alterado | Aprovado |
| Inativar o registro ficticio | Aprovado |
| Confirmar status INATIVO | Aprovado |

## Regras confirmadas

- O cadastro exige Nome do ateste.
- Um novo Tipo de Ateste e criado como ATIVO.
- A acao da linha abre o modal `Manutencao de tipo de ateste`.
- A manutencao permite alterar o nome e o status Ativo.
- O filtro de Tipo de Ateste localiza o registro persistido.

## Estado final e seguranca

- O registro ficticio permanece INATIVO em HML para fins de auditoria.
- Nenhum registro preexistente foi alterado.
- Nenhum dado pessoal foi usado ou registrado.
- Nao foi executada exclusao, pois essa operacao nao fazia parte da autorizacao recebida.
