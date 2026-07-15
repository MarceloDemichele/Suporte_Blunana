# Validacao do menu Blunana PROD

Data: 2026-07-15

## Resultado

- Login PROD: aprovado.
- Coleta somente leitura: aprovada.
- Elementos coletados: 25.
- Elementos com link: 19.
- Links unicos: 19.
- E-mails encontrados no artefato: 0.
- CPFs encontrados no artefato: 0.
- Query strings preservadas: 0.
- Screenshots: nao capturados.

## Menus com rota

- Home
- Agenda de prazos
- Ateste
- Audiencia
- Audiencia Mutirao
- Cobranca
- Configuracao do Ateste
- Configuracao de palavras
- Configuracao do Prazo
- Configuracao de Processos
- Configuracao de Publicacao
- Configuracao parametros de cobranca
- Configuracao Usuario
- Prazos
- Processos
- Publicacoes
- Robo Custas
- Custas Monitoramento

Ha tambem um link sem texto para a raiz do tenant.

## Teste do agente

Pergunta: `Como consulto um processo?`

Resposta obtida com base no inventario PROD:

`Acesse o menu Processos para realizar a consulta desejada.`

## Limite da evidencia

Esta coleta comprova os menus e rotas acessiveis ao usuario configurado. Ela nao comprova ainda os campos, filtros, botoes ou regras internas de cada tela.

## Fonte

- `outputs/json/blunana/prod/blunana-menu.json`
