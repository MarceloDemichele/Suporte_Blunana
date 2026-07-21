# Detalhes do Processo — memória funcional

Ambiente validado: HML

## Como acessar

1. Acesse **Menu > Processos**.
2. Informe o número no filtro **Número do processo**.
3. Na linha encontrada, acione o ícone **Visualizar e tratar processo**.
4. O detalhe é aberto em uma nova aba.

## Estrutura geral

A tela apresenta:

- Workflow do processo, com progresso e situação das etapas.
- Número e estado aberto/encerrado.
- Navegação por Identificação Geral, Partes Envolvidas, Publicações, Eventos Relevantes, CNJ, Observações, Documentos e Atestes.

Em processos com fluxo mais avançado, o workflow observado possui seis etapas: Entrada do processo, Distribuição para advogado, Análise de publicação, Prazos, Audiências e Atestes. Cada etapa pode aparecer como concluída ou aguardando.

## Identificação Geral

Exibe Código do Cliente, Número do Processo, Área, Tipo de Ação, Tratado, Tratado por, Vara, Comarca, Foro, Extinto, Status, Coordenador e datas de recebimento, tratamento e encerramento.

### Editar Identificação Geral

O formulário permite editar Número do Processo, Área, Tipo de Ação, Vara, Comarca, Foro, Status, Coordenador e Data de encerramento, além das marcações **Extinto** e **Tratado**. Código do Cliente e Data de recebimento aparecem desabilitados.

## Partes Envolvidas

Lista tipo da parte, nome e CPF/CNPJ. A edição permite selecionar uma parte existente ou cadastrar outra, informando:

- CPF/CNPJ (obrigatório)
- Tipo de parte
- Nome da parte (obrigatório)
- Advogado da parte (opcional)

## Publicações

Apresenta duas listas paginadas: **Publicações** e **Publicações sem filtro**. Quando não há ocorrências, a tela informa que não existem publicações para o processo.

Em registros existentes foram confirmadas as ações **Tratar publicação** e **Criar prazo**. O detalhe da publicação mostra leitura, status, datas, situação, fornecedor e texto. Criar prazo abre o mesmo formulário de prazo, mantendo a publicação como origem.

## Eventos Relevantes

Lista eventos do processo e oferece **Adicionar prazo**. O formulário contém Tipo de prazo, Advogado responsável, Prazo, Data fatal, Descrição e Documentos. Salvar fica desabilitado até o preenchimento exigido.

Para incluir uma **audiência comum**, use **Adicionar prazo** e selecione o tipo de audiência, pois a audiência é um subtipo de prazo. Esse procedimento não se aplica à **Audiência Mutirão**, que possui fluxo próprio.

## Caminhos para incluir prazo

O sistema oferece sete entradas, com vínculos diferentes conforme a origem:

1. **Processos > Visualizar e tratar processo > Eventos Relevantes > Adicionar prazo**: vincula somente ao processo.
2. **Processos > Visualizar e tratar processo > Publicação > Adicionar prazo**: vincula ao processo e à publicação.
3. **Publicação > Editar publicação > Há prazo para publicação? > Incluir prazo**: vincula ao processo e à publicação.
4. **Prazo > Editar prazo > Incluir prazo**: vincula somente ao processo.
5. **Prazo > Incluir prazo**: vincula somente ao processo.
6. **Audiência > Editar audiência > Incluir prazo**: vincula somente ao processo.
7. **Audiência > Incluir prazo**: vincula somente ao processo.

Prazos e audiências existentes apresentam **Editar**, **Histórico** e **Excluir**. Histórico mostra autor, data e alterações. Excluir sempre abre confirmação e exige uma segunda ação explícita.

A edição de prazo apresenta status, datas, tipo, responsável, descrição, observações do processo, diário de bordo, prazos relacionados e documentos. A edição de audiência inclui data, hora, tipo, endereço, UF, responsável, advogado interno/externo, descrição, diário de bordo, documentos e marcações de acordo, subs, ateste, carta de preposição, substabelecimento, contestação, cancelamento e conclusão.

## CNJ

Lista CNJ, Data da inclusão, Data da manutenção e Ação. **Adicionar CNJ** abre um formulário com campo de número CNJ; Salvar inicia desabilitado.

## Observações

Exibe a observação vigente. **Editar** abre um campo de texto para atualizar as observações; Salvar fica desabilitado enquanto não houver alteração válida.

## Documentos

Apresenta documentos paginados e a ação **Upload**. O modal permite selecionar arquivos, informa limite de 10 MB por arquivo, preenche a Data de inclusão e só habilita **Enviar** depois da seleção.

Documentos existentes podem ser visualizados e excluídos. A exclusão informa que a ação não pode ser desfeita e exige confirmação.

## Atestes

Lista lançamentos e oferece **Novo Ateste**. O formulário apresenta Área de ateste, Tipo de ateste, Valor, Ateste solicitado, Protocolo solicitado, Data da solicitação, Descrição e Documentos. Tipo depende da Área; protocolo e data dependem da marcação de solicitação.

Atestes existentes apresentam **Editar**, **Histórico** e **Excluir**. A edição também permite controlar recebimento e rejeição, com suas datas. O campo Protocolo Origem foi observado fechado para manutenção. A exclusão exige confirmação explícita.

## Validação com processo autorizado

Em 2026-07-15, um processo indicado pela equipe de suporte foi usado para abrir todas as seções e formulários acima. A consulta cruzada não encontrou publicações, prazos pendentes, audiências ou atestes associados.

Todos os formulários foram cancelados. Nenhum dado jurídico foi inventado e nenhum registro foi criado, alterado, tratado, enviado ou excluído.

Uma segunda validação, também autorizada em 2026-07-15, confirmou um processo tratado com publicações, prazos concluídos, audiência em triagem, documento e ateste pendente. Edição, histórico e confirmações de exclusão foram abertos e cancelados sem modificar os registros.
