# Validação do interpretador semântico híbrido — 2026-07-20

## Implementação

- Responses API com saída estruturada por JSON Schema estrito.
- Catálogo fechado de regras, telas e procedimentos permitidos.
- Plano limitado a operações de leitura e filtros suportados.
- Validação determinística antes de executar navegação.
- Timeout configurável e fallback local para ausência de credencial, erro HTTP, JSON inválido ou combinação não suportada.
- Modelo configurável; exemplo de produção usa `gpt-5.6-luna` para classificação e extração em alto volume.

## Consulta reversa adicionada

A pergunta `Qual o numero do processo que possui o codigo do cliente = 23.000.17883/2025?` agora produz uma consulta de Processo com filtro `CLIENT_CODE` e campo solicitado `PROCESS_NUMBER`.

Validação PROD somente leitura:

- Código do cliente: `23.000.17883/2025`.
- Registro encontrado: 1.
- Número do processo retornado: `00126329020255150082`.
- Nenhuma alteração realizada.

## Testes

- `npm run test:semantic`: modelo simulado, schema, bloqueio de plano incompatível e fallback aprovados.
- `npm run test:interpretation`: 8 interpretações, 2 extrações e 1 consulta reversa aprovadas.
- `npm run test:battery`: 240 perguntas aprovadas.
- `npm run test:navigation`: 12 planos e 1 resposta sanitizada aprovados.
- `npm run test:rules`: 64 regras e 6 variações aprovadas.
- `git diff --check`: sem erros.

## Estado de ativação

O ambiente atual não contém `OPENAI_API_KEY`; por isso, o servidor utiliza o fallback local. A integração semântica por modelo será ativada automaticamente quando a credencial for configurada no arquivo de ambiente não versionado e o servidor for reiniciado.
