# Atualizar Documentacao

## Objetivo

Atualizar a documentacao Markdown impactada por alteracoes no codigo-fonte, configuracoes, dependencias, integracoes, banco de dados, fluxos, validacoes, permissoes ou regras de negocio.

## Instrucoes

1. Comparar as alteracoes do codigo com a documentacao existente.
2. Atualizar os arquivos impactados em `/engenharia-reversa/robo-cef`.
3. Atualizar obrigatoriamente `06-regras-de-negocio.md` quando houver mudanca de regra, validacao, filtro, calculo, status, fluxo, importacao, notificacao ou persistencia.
4. Atualizar obrigatoriamente `13-matriz-rastreabilidade.md` para refletir novos arquivos, regras, modulos, integracoes ou mudancas de cobertura.
5. Atualizar `/docs` quando a documentacao funcional ou tecnica for impactada.
6. Registrar evidencias com caminho do arquivo onde a informacao foi encontrada.
7. Marcar como "Ponto a validar" tudo que nao estiver comprovado no codigo.

# Atualização Inteligente da Documentação

Você está atuando como arquiteto do projeto.

Analise todas as alterações realizadas desde a última documentação.

## Verifique

- Novos arquivos
- Arquivos removidos
- Arquivos modificados
- Novas telas
- Novos endpoints
- Alterações em regras de negócio
- Mudanças de permissões
- Mudanças em banco de dados
- Alterações em APIs
- Alterações em validações
- Alterações em mensagens de erro

## Para cada alteração

Informe:

- Arquivo afetado
- Tipo da alteração
- Impacto funcional
- Impacto técnico
- Documentação afetada
- Necessidade de novos testes
- Necessidade de atualização do FAQ

## Atualize automaticamente

/docs

Gerando:

- Release Notes
- Histórico de Alterações
- Documentação Funcional
- Documentação Técnica

Não remova conteúdo existente sem justificativa.