# Contrato da API do agente externo

Endpoint: `POST /assistant`
Porta padrão: `3333`

## Entrada

```json
{
  "ID_TASK": "TASK-1001",
  "TASK": "Suporte ao cliente",
  "question": "Como consulto um processo?",
  "environment": "prod",
  "user": "cliente"
}
```

### Regras da entrada

- `ID_TASK` é obrigatório e identifica a tarefa na plataforma de origem.
- `TASK` possui o valor fixo `Suporte ao cliente`. O serviço normaliza esse valor mesmo que receba outro texto.
- `question` é obrigatória.
- `environment` e `user` continuam aceitos para compatibilidade, mas não fazem parte do retorno simplificado.

## Retorno

```json
{
  "ID_TASK": "TASK-1001",
  "TASK": "Suporte ao cliente",
  "CLASSIFICACAO": "DUVIDA",
  "QUESTION": "Como consulto um processo?",
  "ANSWER": "Acesse o menu Processos e utilize os filtros disponíveis."
}
```

O retorno contém somente os cinco campos definidos pelo contrato.

## Classificação

- `BUG`: erro, falha, problema, tela que não funciona ou comportamento incorreto.
- `MELHORIA`: solicitação explícita de evolução, sugestão ou nova funcionalidade.
- `DUVIDA`: pedido de orientação ou explicação; também é a classificação padrão quando não há sinal claro de bug ou melhoria.

Quando a classificação for `BUG`, o agente não apresenta um procedimento como solução. O campo `ANSWER` informa que não foi localizada uma resposta comprovada e que a ocorrência precisa de análise manual.

## Validação

Quando `ID_TASK` ou `question` estiver ausente, a API retorna HTTP 400 no mesmo formato, indicando os campos obrigatórios em `ANSWER`.
