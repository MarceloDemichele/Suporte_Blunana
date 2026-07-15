# Validacao de obrigatoriedade dos formularios HML

Data: 2026-07-15

## Objetivo

Confirmar o comportamento dos formularios vazios, sem cadastrar, alterar ou excluir dados.

## Resultado

Foram validados sete formularios. Todos permaneceram abertos e nenhuma gravacao foi realizada.

| Formulario | Comportamento vazio |
|---|---|
| Tipo de Ateste | Salvar habilitado; validacao impede o fechamento |
| Regra de Ateste | Salvar habilitado; exige Area de Ateste |
| Usuario | Salvar desabilitado |
| Configuracao de Publicacao | Salvar desabilitado |
| Configuracao do Prazo | Salvar desabilitado |
| Configuracao de Processos | Salvar desabilitado |
| Processo | Salvar habilitado; exige Codigo do Cliente, Numero do Processo, Area e Tipo de Acao |

## Seguranca e evidencias

- Nenhum formulario foi preenchido ou gravado.
- Nenhum modal fechou como resultado do teste.
- Requisicoes paralelas observadas eram consultas para carregar opcoes dos formularios.
- Nao foram capturados valores de tabelas, dados pessoais ou screenshots.
- Evidencia estruturada: `outputs/json/blunana/hml/validacoes-obrigatoriedade.json`.
- Comando reproduzivel: `npm run validar:obrigatoriedade:hml`.

## Ponto a validar

O formulario Tipo de Ateste bloqueou o envio vazio, mas nao apresentou mensagem textual no componente inspecionado. A indicacao visual do campo deve ser confirmada em uma futura verificacao assistida, se necessario.
