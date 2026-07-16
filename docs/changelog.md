# Changelog

## 2026-07-14

- Em 2026-07-15, o Playwright passou a executar consultas direcionadas e somente leitura para usuário, processo, publicação, prazo, audiência e ateste; perfil e processo foram validados em PROD pela porta 3333, com sanitização de evidências e sem alterações.
- Em 2026-07-15, foi criado um roteador explícito entre regra de negócio, consulta de tela, procedimento operacional, plataforma dinâmica e pergunta desconhecida; uma bateria de 189 perguntas passou integralmente e o fluxo de criação de prazo recebeu resposta operacional completa.
- Em 2026-07-15, as 13 telas do escopo receberam guias próprios de consulta e resolução pelo nome mais específico, eliminando colisões entre Configurações e telas operacionais, Agenda e Prazos, e Audiência Mutirão e Audiência.
- Em 2026-07-15, respostas procedimentais passaram a exigir intenção explícita de consulta; a consulta genérica de Ateste agora apresenta seus filtros sem presumir Número do processo, e perguntas de negócio desconhecidas não caem mais em instruções padronizadas.
- Em 2026-07-15, foram incorporadas as regras RN-060 a RN-065 de Ateste: geração manual, ausência de automação ativa, validação por protocolo, upload de pagamento, cadastro de tipos e histórico para auditoria.
- Em 2026-07-15, antes da incorporação da RN-061, perguntas sobre geração automática de ateste ao cumprir prazo deixaram de receber instruções genéricas de consulta e passaram provisoriamente a solicitar análise manual; a resposta definitiva foi formalizada posteriormente pelas regras de Ateste.
- Em 2026-07-15, as 58 regras consolidadas foram transformadas em uma base estruturada e testável; o agente passou a interpretar assunto, intenção, condição e polaridade antes de usar a pesquisa textual como apoio.
- Em 2026-07-15, o agente passou a responder conforme a RN-024 que todo processo deve possuir pelo menos um Responsável vinculado.
- Em 2026-07-15, o agente passou a responder que processos nunca são excluídos da plataforma; eles podem ter a situação alterada para Encerrado, permanecendo registrados no sistema.
- Em 2026-07-15, foi resolvida a divergência da RN-033: a duplicidade se aplica a todas as publicações, usa o Código do cliente como chave e considera a Data de disponibilização em uma janela fixa de 7 dias para trás.
- Em 2026-07-15, o documento complementar Regras de Negócio do Módulo Jurídico foi analisado e consolidado; regras de Dashboard, Agenda, Processos, Publicações, Prazos, Audiências e Mutirão foram incorporadas, incluindo permissões de prazo e uma divergência controlada sobre deduplicação.
- Em 2026-07-15, perguntas sobre permissões deixaram de receber instruções operacionais genéricas; sem regra comprovada por usuário ou perfil, o agente informa a necessidade de análise manual.
- Em 2026-07-15, respostas classificadas como BUG deixaram de sugerir procedimentos genéricos e passaram a informar ausência de resposta comprovada e necessidade de análise manual.
- Em 2026-07-15, a resposta genérica sobre consulta de publicação deixou de presumir pesquisa por processo; o agente agora apresenta os filtros disponíveis e mantém a orientação específica apenas quando a pergunta menciona processo.
- Em 2026-07-15, o contrato de `POST /assistant` passou a exigir `ID_TASK`, fixar `TASK` como `Suporte ao cliente` e retornar somente ID_TASK, TASK, CLASSIFICACAO, QUESTION e ANSWER; BUG, MELHORIA e DUVIDA foram validados na porta 3333.
- Em 2026-07-15, a regra de duplicidade de publicação foi formalizada: 7 dias para trás pela Data de disponibilização e somente para o mesmo Código do cliente; consulta PROD confirmou dois códigos distintos no exemplo recebido.
- Em 2026-07-15, o agente foi validado com seis dúvidas operacionais; respostas de Publicações, Prazos, Audiência, Documentos e Atestes foram especializadas, logs concorrentes deixaram de sobrescrever arquivos e a API externa da porta 3333 respondeu com sucesso.
- Em 2026-07-15, um segundo processo autorizado completou o mapeamento de Detalhes do Processo com publicações tratadas, prazos concluídos, audiência em triagem, documento e ateste pendente; edição, histórico e confirmações de exclusão foram validados e cancelados.
- Em 2026-07-15, um processo autorizado pela equipe de suporte foi usado em HML para aprofundar as oito seções de Detalhes do Processo, seus formulários e a consulta cruzada em Publicações, Prazos, Audiência e Ateste, sem persistir alterações.
- Em 2026-07-15, as oito telas do grupo Menu foram percorridas em HML; Processos, Publicações, Prazos, Audiência, Audiência Mutirão e Ateste receberam memórias aprofundadas, incluindo modais seguros de consulta e upload, sem alterar registros reais.
- Em 2026-07-15, Home e Agenda de prazos foram aprofundadas em HML: indicadores, paineis, calendario, abas, filtros e estrutura dos resultados foram documentados sem alterar registros.
- Em 2026-07-15, confirmado que todos os advogados disponiveis podem ser selecionados na Excecao de Ateste, sem regra adicional de selecao; o ponto pendente foi encerrado.
- Em 2026-07-15, Vinculo e Excecao de Ateste tiveram ciclos completos de criacao, edicao e inativacao usando somente usuarios ficticios; a lista de Advogado exibiu usuarios de diferentes papeis e ficou como ponto funcional a confirmar.
- Em 2026-07-15, Usuario e Regra de Ateste tiveram ciclos completos de criacao, edicao e inativacao em HML; inclusao de Usuario foi confirmada sem envio de e-mail ou SMS.
- Em 2026-07-15, inclusao manual de Prazo confirmou o Responsavel correto e o validador passou a conferir o valor efetivamente selecionado.
- Em 2026-07-15, ciclos de criacao, edicao e inativacao foram validados em HML para Tipo de Ateste, Configuracao de Publicacao, Configuracao de Processos e Configuracao do Prazo; a selecao automatizada do Responsavel em Prazo apresentou divergencia e bloqueou novas gravacoes.
- Em 2026-07-15, ciclo de gravacao de Tipo de Ateste validado em HML: criacao, consulta por filtro, alteracao de nome e inativacao do registro ficticio.
- Em 2026-07-15, navegador confirmou em Publicacao e Configuracao de Processos que Area do Cliente + Responsavel habilitam Salvar e Tipo de Acao e opcional; validador passou a aguardar campos dependentes.
- Em 2026-07-15, regra esclarecida para Configuracao de Publicacao e de Processos: Area do Cliente e Responsavel obrigatorios; Tipo de Acao opcional.
- Em 2026-07-15, massa ficticia preencheu sem gravacao Tipo de Ateste, Usuario, Configuracao do Prazo e Processo; seletor Playwright da Area em Publicacao e Configuracao de Processos ficou pendente.
- Em 2026-07-15, sete formularios HML tiveram bloqueios de obrigatoriedade validados sem gravacao: quatro desabilitam Salvar e tres mantem o modal aberto apos validacao.
- Em 2026-07-15, pre-teste da massa HML aprovado em todos os campos, sem submissao; massa liberada para proxima fase controlada.
- Em 2026-07-15, confirmado que Cliente em Configuracao do Prazo e predefinido; validador deixou de tentar selecionar esse campo.
- Em 2026-07-15, pre-teste da massa HML confirmou descritores de prazo, papel, area de ateste, cliente de usuario, area e tipo de acao; gravacao segue bloqueada por seletores dependentes da Configuracao do Prazo.
- Em 2026-07-15, massa ficticia HML e plano de limpeza foram definidos; gravacoes permanecem bloqueadas por allowlist vazia de cliente, areas, tipos e responsavel.
- Em 2026-07-15, 13 memorias HML foram aprofundadas em 17 secoes/abas e 7 modais, sem submissao ou persistencia de dados pessoais.
- Em 2026-07-15, mapeamento autonomo HML concluiu 13/13 telas, criou 13 memorias e detectou 6 modais sem submeter alteracoes.
- Em 2026-07-15, escopo esclarecido como os grupos laterais `Configuracoes` e `Menu`, totalizando 13 submenus equivalentes em PROD e HML; Processos e demais itens listados voltaram ao escopo.
- Em 2026-07-15, menu HML coletado e comparado com PROD: 5 configuracoes comuns e 2 configuracoes de PROD ausentes em HML.
- Em 2026-07-15, escopo de PROD/HML limitado a Configuracoes e Menu; modulos restantes foram marcados como em desenvolvimento e bloqueados para resposta oficial.
- Em 2026-07-15, login HML validado com sucesso no tenant `@rocha_juridico_hml`, sem screenshot ou navegacao adicional.
- Em 2026-07-15, HML foi separado como ambiente de exploracao controlada; respostas ao cliente continuam exigindo confirmacao final em PROD.
- Em 2026-07-15, acoes `Adicionar Processo` e `Visualizar` foram documentadas; memoria de `Detalhes do Processo` foi separada em arquivo proprio.
- Em 2026-07-15, equipe de suporte confirmou que os filtros de Processos sao automaticos e cumulativos; regra e resposta do agente foram atualizadas.
- Em 2026-07-15, tela Processos PROD mapeada em modo somente leitura; filtros e estrutura de resultados passaram a fundamentar a resposta do agente.
- Em 2026-07-15, menu PROD coletado com 25 elementos e 19 rotas unicas, sem screenshots, e usado com sucesso na resposta sobre Processos.
- Em 2026-07-15, URL de login PROD corrigida de `/@rocha_juridico/studio/auth/login` para `/@rocha_juridico/auth/login` no exemplo oficial.
- Preparado acesso PROD com `.env.prod`, exemplo seguro, comando `login:prod`, validacao obrigatoria de configuracao e teste sem screenshot.
- Corrigido carregamento assincrono da biblioteca MFA para compatibilidade com a execucao atual.
- Em 2026-07-15, login PROD validado ate `StartOtpLogin` (HTTP 200); conclusao MFA retornou HTTP 403 e ficou pendente de validacao do segredo associado ao usuario.
- Definido PROD como unico ambiente permitido para consultas do suporte; DEV/HML foram bloqueados como fonte de resposta operacional.
- Ajustada a resposta do agente para apresentar orientação curta ao usuário, sem despejar documentos técnicos.
- Busca passou a ignorar palavras genéricas e priorizar inventários de menus e telas.
- CLI e API passaram a usar Playwright quando a base local não comprova uma orientação operacional e a navegação está autorizada.

## 2026-07-13

- Reorganizado o projeto para o fluxo de suporte Blunana.
- Removido o escopo ativo ligado ao contexto antigo de automação.
- Consolidado o agente externo e o agente interno para análise de documentação, navegação e atualização documental.
- Mantido o foco em docs, engineering-reversa, support e outputs como base de contexto.
