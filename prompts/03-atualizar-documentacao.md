# Atualizar Documentação

## Objetivo

Atualizar a documentação Markdown impactada por alterações no código-fonte, configurações, integrações, banco de dados, fluxos, validações, permissões ou regras de negócio.

## Instruções

1. Comparar as alterações do código com a documentação existente.
2. Atualizar os arquivos impactados em `engenharia-reversa/blunana/`, `docs/` e `support/`.
3. Atualizar obrigatoriamente os materiais de regras de negócio ou fluxo operacional quando houver mudança de regra, validação, filtro, cálculo, status, fluxo, importação, notificação ou persistência.
4. Atualizar a rastreabilidade documental quando houver novos arquivos, regras, módulos, integrações ou mudanças de cobertura.
5. Registrar evidências com caminho do arquivo onde a informação foi encontrada.
6. Marcar como "Ponto a validar" tudo que não estiver comprovado no código ou em evidências locais.

## Checklist de revisão

- Novos arquivos
- Arquivos removidos
- Arquivos modificados
- Novas telas ou rotas
- Novos endpoints ou integrações
- Alterações em regras de negócio
- Mudanças de permissões
- Alterações em validações e mensagens de erro

## Atualização obrigatória

Sempre revisar:

- `docs/`
- `engenharia-reversa/blunana/`
- `support/`
- `knowledge/`

Não remover conteúdo existente sem justificativa e sem preservar a história documental relevante.