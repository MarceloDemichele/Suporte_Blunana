# Validação do contrato da API — porta 3333

Data: 2026-07-15

## Cenários executados

- Dúvida: classificada como `DUVIDA`.
- Relato de erro: classificado como `BUG`.
- Solicitação de nova funcionalidade: classificada como `MELHORIA`.
- Requisição sem `ID_TASK`: HTTP 400 e mensagem de campo obrigatório.
- `TASK` divergente na entrada: normalizado para `Suporte ao cliente`.

## Retorno confirmado

Todas as respostas válidas retornaram somente:

- `ID_TASK`
- `TASK`
- `CLASSIFICACAO`
- `QUESTION`
- `ANSWER`

O serviço foi compilado sem erros e validado por chamadas reais ao endpoint `POST /assistant` na porta 3333.
