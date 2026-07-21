# Validação da regra de duplicidade de publicação — PROD

Data: 2026-07-15

## Regra informada pela equipe de suporte

- Janela fixa de 7 dias para trás.
- Data de disponibilização como referência.
- Mesmo Código do cliente como condição obrigatória.

## Verificação

O número de processo apresentado foi pesquisado na tela **Processos** de PROD, em modo somente leitura.

- Ocorrências encontradas: 2.
- Código da primeira ocorrência: `19.000.07152/2024`.
- Código da segunda ocorrência: `19.000.07152/2024-002`.

## Conclusão

As ocorrências possuem códigos de cliente diferentes. Portanto, não caracterizam duplicidade de publicação entre si, mesmo que as datas de disponibilização estejam dentro da janela de 7 dias.

Nenhum processo ou publicação foi alterado durante a consulta.
