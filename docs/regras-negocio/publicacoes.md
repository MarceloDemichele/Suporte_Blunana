# Regras de negócio — Publicações

## Regra de duplicidade

A verificação de duplicidade de publicação considera:

- Aplicação a **todas as publicações**, independentemente da fonte de captura.
- Janela fixa de **7 dias para trás**.
- A contagem parte da **Data de disponibilização** da publicação analisada.
- As publicações precisam possuir o **mesmo Código do cliente**.

O número do processo, isoladamente, não determina duplicidade. Um mesmo número pode aparecer em mais de um registro de processo, cada um associado a um Código do cliente diferente. Quando os códigos são diferentes, as publicações ficam fora da regra de duplicidade entre si.

Regra confirmada pela equipe de suporte em 2026-07-15. Esta validação substitui, para fins operacionais e de resposta ao cliente, a redação anterior que restringia a verificação ao Portal CEF e mencionava o número do processo como chave.

## Como avaliar

1. Acesse **Processos**.
2. Informe o número no filtro **Número do processo**.
3. Se aparecer mais de uma ocorrência, abra **Visualizar e tratar processo** em cada linha.
4. Em **Identificação Geral**, consulte o **Código do Cliente**.
5. Compare os códigos antes de avaliar a janela de 7 dias.

## Exemplo validado em PROD

Em 2026-07-15, o número apresentado pela equipe de suporte retornou duas ocorrências. Os códigos encontrados foram:

- `19.000.07152/2024`
- `19.000.07152/2024-002`

Como os códigos são diferentes, os registros não caracterizam duplicidade de publicação entre si, independentemente da proximidade entre as datas de disponibilização.

## Resposta recomendada

> A regra de duplicidade de publicação verifica uma janela fixa de 7 dias para trás, com base na data de disponibilização, para o mesmo código de cliente. No exemplo enviado, os códigos são 19.000.07152/2024 e 19.000.07152/2024-002. Como são diferentes, as publicações não entram na regra de duplicidade entre si.
