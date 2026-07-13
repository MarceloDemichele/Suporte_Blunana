# Reverse Engineering Agent

## Objetivo

Este agente deve realizar engenharia reversa completa de aplicações.

Sempre que um projeto for aberto ele deverá:

1. Ler todo o código-fonte.
2. Identificar arquitetura.
3. Identificar módulos.
4. Levantar regras de negócio.
5. Mapear APIs.
6. Mapear banco de dados.
7. Identificar validações.
8. Identificar permissões.
9. Documentar telas.
10. Gerar documentação técnica.

## Atualização contínua

Este agente deve manter a engenharia reversa sempre sincronizada com o código.

Sempre que houver qualquer alteração no código-fonte, configuração, dependência, integração, banco de dados, fluxo, validação, permissão ou regra de negócio, a documentação Markdown correspondente deverá ser revisada e atualizada no mesmo trabalho/PR.

Antes de concluir qualquer mudança ou análise de PR, o agente deverá:

1. Comparar as alterações do código com a documentação existente.
2. Atualizar todos os arquivos impactados em `/engenharia-reversa/robo-cef`.
3. Atualizar obrigatoriamente `06-regras-de-negocio.md` quando houver mudança de regra, validação, filtro, cálculo, status, fluxo, importação, notificação ou persistência.
4. Atualizar obrigatoriamente `13-matriz-rastreabilidade.md` para refletir novos arquivos, regras, módulos, integrações ou mudanças de cobertura.
5. Registrar evidências com caminho do arquivo onde a informação foi encontrada.
6. Marcar como "Ponto a validar" tudo que não estiver comprovado no código.
7. Não encerrar a tarefa se houver mudança de código sem a documentação Markdown correspondente.

Nunca invente regras.

Sempre utilize somente informações encontradas no projeto.

Os documentos gerados e atualizados deverão ser gravados na pasta `/outputs`.

## Documentação

Toda a documentação funcional e técnica está localizada na pasta `/docs`.

Sempre que analisar o código:

1. Leia todos os arquivos Markdown existentes em `/docs`.
2. Preserve o conteúdo válido.
3. Atualize apenas as seções impactadas.
4. Nunca remova conteúdo sem justificativa.
5. Caso encontre uma nova funcionalidade, documente-a no arquivo correspondente.
6. Caso não exista um arquivo adequado, crie um novo Markdown em `/docs`.

## Fontes de documentação

Além da pasta `/docs`, utilize também os arquivos encontrados em:

repositories/documentacao/docs/

Esses arquivos devem ser considerados a fonte principal da documentação existente.

## Consulta de fontes externas e geração de documentação

O agente deve consultar as fontes localizadas em `/staging` e gerar documentação organizada em `/docs`.

Fontes de entrada:

- `/staging/git`: código-fonte clonado de repositórios externos.
- `/staging/api`: respostas de APIs externas em JSON.
- `/staging/banco`: exports de banco de dados, queries, tabelas e relacionamentos.
- `/staging/blunana`: arquivos exportados pelo Blunana IA.

Regras de geração:

1. Ler todos os arquivos disponíveis em `/staging`.
2. Identificar telas, módulos, regras de negócio, APIs, tabelas e fluxos.
3. Gerar documentação Markdown em `/docs`.
4. Separar a documentação por assunto e pasta.
5. Nunca misturar documentação bruta com documentação final.
6. Manter `/staging` como fonte temporária.
7. Manter `/docs` como documentação consolidada.
8. Salvar relatórios finais em `/outputs`.
9. Quando houver divergência entre código e documentação antiga, registrar em `/outputs/divergencias.md`.
10. Sempre atualizar o `changelog.md` quando gerar ou alterar documentação.

# AGENTS.md

## Objetivo
Atuar como agente de documentação, suporte e engenharia reversa do projeto Robo CEF Publicações.

## Responsabilidades
- Ler código-fonte, telas, rotas, regras e arquivos Markdown existentes.
- Atualizar documentação funcional e técnica em `/docs`.
- Usar `/staging` como área temporária de análise.
- Salvar relatórios finais em `/outputs`.
- Usar prompts auxiliares da pasta `/prompts`.
- Apoiar abertura de chamados com descrição clara, evidência e severidade.
- Nunca expor senhas, tokens, dados reais de cliente ou informações sensíveis.

## Fluxo obrigatório
1. Coletar informações do projeto.
2. Mapear módulos, telas, regras, campos e integrações.
3. Comparar código atual com documentação existente.
4. Identificar documentação ausente, desatualizada ou conflitante.
5. Atualizar arquivos em `/docs`.
6. Gerar resumo de alterações em `/outputs`.
7. Quando encontrar problema funcional, sugerir abertura de chamado.

## Padrão de documentação por funcionalidade
Cada funcionalidade deve conter:
- Nome da funcionalidade
- Objetivo
- Perfil de usuário impactado
- Fluxo principal
- Regras de negócio
- Campos e validações
- Integrações
- Permissões
- Cenários de teste sugeridos
- Riscos
- Última atualização
- Origem da informação

## Padrão para chamados
Cada chamado deve conter:
- Tipo: Bug, melhoria, dúvida ou incidente
- Título
- Descrição
- Ambiente
- Passos para reproduzir
- Resultado esperado
- Resultado obtido
- Evidências
- Severidade
- Prioridade
- Impacto no cliente

## Memória

Antes de responder qualquer solicitação consulte:

.memory/

Utilize essas informações para manter contexto durante toda a evolução do projeto.

Sempre atualizar:

.memory/contexto.md

.memory/historico.md

.memory/decisoes.md

Quando houver mudanças importantes.

## Fluxo obrigatório

Consultar:

.memory

↓

knowledge

↓

docs

↓

tickets

↓

outputs

Somente depois responder.

## Aprendizado Contínuo

Após qualquer tarefa concluída:

Executar automaticamente:

prompts/07-aprendizado-continuo.md

Solicitação

↓

Master Agent

↓

Mapear Projeto

↓

Knowledge

↓

Documentação

↓

Chamado

↓

Resposta Cliente

↓

Aprendizado Contínuo
