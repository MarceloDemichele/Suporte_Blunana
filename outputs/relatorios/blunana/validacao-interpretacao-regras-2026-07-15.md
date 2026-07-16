# Validação da interpretação de regras — porta 3333

Data: 2026-07-15
Ambiente solicitado no contrato: PROD

## Resultado automatizado

- 58 regras estruturadas e validadas por exemplo canônico.
- 6 variações críticas de linguagem validadas.
- 4 perguntas ambíguas confirmadas sem seleção indevida de regra.
- Compilação TypeScript concluída sem erros.
- `git diff --check` concluído sem erros de whitespace.

## Amostra validada pela API

- Responsável obrigatório no processo: resposta afirmativa pela RN-024.
- Processo sem responsável: resposta negativa coerente pela RN-024.
- Duplicidade de publicação: Código do cliente, Data de disponibilização e 7 dias.
- Status inicial de publicação: Pendente.
- Campos obrigatórios de audiência: resposta pela RN-051.
- Datas do Mutirão: 3 e 15 dias úteis, ignorando feriados.
- Detalhe do processo: abertura em nova aba.
- Pergunta ambígua `Quem é o responsável?`: nenhuma regra foi presumida.

## Comando de regressão

`npm run test:rules`
