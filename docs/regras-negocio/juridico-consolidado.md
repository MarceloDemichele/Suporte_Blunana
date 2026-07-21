# Regras de negócio consolidadas — Módulo Jurídico

Fonte complementar: `Regras_de_Negocio_Juridico.docx`, fornecido pela equipe de suporte em 2026-07-15.
Escopo da fonte: Blunana.ai, Módulo Jurídico, julho de 2026.

## Dashboard

- `RN-001`: exibe KPIs consolidados no carregamento.
- `RN-002`: KPIs de Prazos mostram total, vencidos e a vencer no período configurado.
- `RN-003`: KPI de Audiências mostra o total do dia corrente.
- `RN-005`: cada KPI é carregado por chamada independente de API.
- `RN-006`: acesso restrito a usuários autenticados.

## Agenda de Prazos

- `RN-010`: exibe prazos do período selecionado; padrão informado pela fonte: mês corrente.
- `RN-011`: prazos vencidos recebem destaque de urgência.
- `RN-012`: prazos próximos do vencimento recebem alerta visual.
- `RN-013`: permite navegar entre períodos anterior e próximo.
- `RN-014`: filtros por responsável são aplicados conforme o perfil do usuário.
- `RN-015`: lápis abre detalhes do prazo; visualizar abre os detalhes do processo.

## Processos

- `RN-020`: número do processo não é único; Código do cliente é o identificador único.
- `RN-021`: número segue formato CNJ ou formato interno.
- `RN-022`: status controla visibilidade e ações disponíveis.
- `RN-023`: todos os processos aparecem na listagem padrão.
- `RN-024`: todo processo deve ter ao menos um responsável.
- `RN-025`: processo nunca é excluído; somente pode ter a situação alterada para encerrado.
- `RN-026`: todo prazo deve ser vinculado a um processo.
- `RN-027`: diariamente são importados do Portal CEF os processos do dia anterior.
- `RN-028`: após a importação, o sistema confere a completude entre Portal CEF e base local.
- `RN-029`: o sistema permite inclusão manual em Processos > Adicionar Processo; os perfis autorizados ainda precisam ser validados.

## Publicações

- `RN-030`: fontes de captura: WEBJUR e Portal CEF.
- `RN-031`: WEBJUR consulta diariamente os processos da base pelo número CNJ e retorna as publicações existentes.
- `RN-032`: Portal CEF fornece diariamente publicações dos últimos 30 dias.
- `RN-033` (regra operacional validada): a deduplicação se aplica a todas as publicações. Antes da inserção, o sistema verifica uma janela fixa de 7 dias para trás, contada pela Data de disponibilização, usando o Código do cliente como chave de comparação.
- `RN-034`: nova publicação entra como Pendente.
- `RN-035`: status previstos: Pendente e Tratado.

### Divergência resolvida — duplicidade

A redação original da `RN-033` no documento complementar mencionava deduplicação exclusiva do Portal CEF, mesma data e mesmo processo. Em 2026-07-15, a equipe de suporte esclareceu e validou a regra operacional vigente:

- aplica-se a **todas as publicações**, independentemente da fonte;
- a chave de comparação é o **Código do cliente**;
- a data considerada é a **Data de disponibilização**;
- a janela é fixa: **7 dias para trás**.

As respostas de suporte devem seguir esta regra validada. A redação anterior permanece registrada somente como histórico da divergência já resolvida.

## Prazos

- `RN-040`: prazo exige Data do prazo, Data fatal, Tipo, Processo vinculado e Responsável.
- `RN-041`: prazo criado pelo processo vincula-se somente ao processo e não ativa link de publicação.
- `RN-042`: prazo criado pela publicação vincula-se ao processo e à publicação e ativa o link de publicação.
- `RN-043`: qualquer usuário pode incluir prazo, sem permissão especial.
- `RN-044`: qualquer usuário pode alterar Tipo de prazo, Advogado responsável e Data do prazo.
- `RN-045`: Data fatal só pode ser alterada por usuário com permissão específica na Configuração de Usuário, campo Alteração.
- `RN-046`: Descrição do prazo possui a mesma restrição de permissão específica.
- `RN-047`: novo Tipo de prazo deve ser criado somente na tela Tipo de Prazo.
- `RN-048`: prazo cancelado permanece no histórico e sai da listagem de pendentes.

## Audiências

- `RN-050`: audiência é subtipo de prazo, com fluxo próprio; pode nascer de publicação ou evento manual.
- `RN-051`: exige Data/hora, Endereço/link, UF, Tipo, Processo vinculado e Responsável.
- `RN-052`: responsável atribui advogado interno ou externo.
- `RN-053`: sistema controla realização da audiência.
- `RN-054`: Concluir só habilita após o preenchimento dos itens obrigatórios.
- `RN-055`: audiências do dia alimentam o KPI do dashboard.
- `RN-056`: resultado deve ser registrado como tratado ou cancelado.
- `RN-057`: acesso ao módulo é restrito aos usuários definidos nas configurações de Prazo.
- `RN-058`: não pode existir audiência na mesma data para o mesmo Código do cliente.

## Ateste

- `RN-060`: o ateste é gerado manualmente pelos usuários para registrar atividades já executadas que devem ser cobradas da CEF.
- `RN-061`: não há regra automática definida para geração de atestes neste momento. Um projeto futuro prevê a geração automática de atestes quando determinados prazos forem cumpridos.
- `RN-062`: a validação de pagamento é efetuada pelo Código de protocolo inserido no momento da solicitação do ateste à CEF.
- `RN-063`: o usuário pode efetuar upload de arquivo de pagamento para confirmar os pagamentos recebidos da CEF.
- `RN-064`: novos Tipos de Ateste devem ser criados exclusivamente na tela Tipo de Ateste.
- `RN-065`: o histórico de atestes é mantido para auditoria.

## Audiência Mutirão

- `RN-090`: processamento por upload de planilha de audiências realizadas.
- `RN-091`: processo já vinculado não é recadastrado; executam-se somente automações de ateste e prazo.
- `RN-092`: se não houver processo vinculado, o sistema cria e vincula um processo.
- `RN-093`: atestes e prazos automáticos exigem Audiência foi realizada? = Sim.
- `RN-094`: audiência realizada gera ateste Audiência de Conciliação.
- `RN-095`: acordo antes da contestação gera ateste Antes; após contestação gera Após; momento indefinido gera somente o ateste padrão.
- `RN-096`: atestes do mutirão são direcionados ao responsável definido na fonte complementar.
- `RN-097`: prazos exigem audiência realizada, data informada e Teve acordo? = Sim.
- `RN-098`: Data do prazo = 3 dias úteis após audiência; Data fatal = 15 dias úteis. Considera segunda a sexta e ignora feriados.
- `RN-099`: gera Pagamento acordo mutirão e Protocolar pagamento mutirão para o responsável definido na fonte.
- `RN-090M`: Obrigação de Fazer em Providências/Observações gera prazo adicional para o responsável definido na fonte.
- `RN-091M`: sem data da audiência, podem ser gerados atestes, mas não prazos.

## Parâmetros gerais

- `RN-080`: detalhe do processo sempre abre em nova aba.
- `RN-081`: URL do detalhe deve ser parametrizada na tela Parâmetros do sistema.

## Uso pelo suporte

- Regras desta memória podem fundamentar respostas ao cliente.
- Divergências com comportamento observado ou orientação posterior da equipe devem ser registradas e reconciliadas.
- Nomes de responsáveis citados na fonte foram intencionalmente generalizados nesta memória; devem ser consultados na fonte quando necessários para uma demanda autorizada.
