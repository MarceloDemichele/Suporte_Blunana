# Validação das respostas do agente — 2026-07-15

## Objetivo

Confirmar que as memórias funcionais são transformadas em respostas curtas e utilizáveis pelo cliente, tanto pela linha de comando quanto pelo agente externo.

## Perguntas validadas

- Como consulto um processo?
- Como vejo as publicações de um processo?
- Como consulto os prazos de um processo, inclusive os concluídos?
- Como vejo ou altero uma audiência?
- Como adiciono um documento a um processo?
- Como consulto e edito um ateste?

## Correções realizadas

- Respostas procedimentais passaram a utilizar as memórias comprovadas de Publicações, Prazos, Audiência, Documentos e Atestes.
- A orientação de Prazos e Publicações informa a remoção do status padrão Pendente quando a consulta precisa incluir registros já tratados ou concluídos.
- O fluxo de upload de documento passou a informar o caminho completo e o limite de 10 MB por arquivo.
- Logs simultâneos passaram a receber nomes únicos, evitando sobrescrita.

## Resultado

As seis perguntas retornaram respostas objetivas e fundamentadas. O projeto compilou sem erros.

A API externa foi validada em `POST /assistant` na porta 3333, com:

- `success: true`
- ambiente `prod`
- confiança 90
- ação `NONE`
- fontes documentais relacionadas
- resposta correta sem necessidade de Playwright em tempo de atendimento

O endpoint `GET /health` também respondeu com status `ok`.
