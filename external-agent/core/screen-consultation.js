"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.screenConsultationGuides = void 0;
exports.findScreenConsultationGuide = findScreenConsultationGuide;
exports.answerScreenConsultation = answerScreenConsultation;
function normalize(value) {
    return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
exports.screenConsultationGuides = [
    {
        screen: "Configuração do Ateste",
        aliases: ["configuração do ateste", "configuração de ateste"],
        answer: "Acesse **Configurações > Configuração do Ateste**. Escolha **Tipos de ateste** para consultar por **Tipo de ateste** e **Status**, ou **Regras de ateste** para consultar por **Área de ateste**, **Tipo de ateste** e **Status**. Os resultados e as ações ficam disponíveis na listagem.",
        source: "docs/telas/hml/configuracao-do-ateste.md"
    },
    {
        screen: "Configuração Usuário",
        aliases: ["configuração usuário", "configuração de usuário", "configuração do usuário"],
        answer: "Acesse **Configurações > Configuração Usuário**. Selecione a aba desejada: **Usuários**, **Vínculo** ou **Exceção Ateste**. Informe o **Cliente** e utilize o campo **Filtro** para localizar os registros; as ações ficam disponíveis na listagem.",
        source: "docs/telas/hml/configuracao-usuario.md"
    },
    {
        screen: "Configuração de Publicação",
        aliases: ["configuração de publicação", "configuração da publicação", "configuração de publicações"],
        answer: "Acesse **Configurações > Configuração de Publicação** e utilize os filtros **Cliente**, **Responsável**, **Área do Cliente**, **Tipo de Ação** e **Status**. A listagem apresenta as configurações encontradas e suas ações.",
        source: "docs/telas/hml/configuracao-de-publicacao.md"
    },
    {
        screen: "Configuração do Prazo",
        aliases: ["configuração do prazo", "configuração de prazo", "configuração de prazos"],
        answer: "Acesse **Configurações > Configuração do Prazo** e utilize os filtros **Cliente**, **Responsável**, **Área do Cliente**, **Tipo de Ação**, **Tipo de Prazo** e **Status**. A listagem apresenta as configurações encontradas e suas ações.",
        source: "docs/telas/hml/configuracao-do-prazo.md"
    },
    {
        screen: "Configuração de Processos",
        aliases: ["configuração de processos", "configuração do processo", "configuração de processo"],
        answer: "Acesse **Configurações > Configuração de Processos** e utilize os filtros **Cliente**, **Responsável**, **Área do Cliente**, **Tipo de Ação** e **Status**. A listagem apresenta as configurações encontradas e suas ações.",
        source: "docs/telas/hml/configuracao-de-processos.md"
    },
    {
        screen: "Home",
        aliases: ["home", "painel inicial", "página inicial", "pagina inicial", "dashboard"],
        answer: "Acesse **Menu > Home** para consultar os indicadores de usuários, processos, publicações, prazos, audiências e atestes. Use **Atualizar** para renovar os indicadores e **Abrir painel** para acessar a tela operacional correspondente. Nos painéis de Prazos e Audiências, também estão disponíveis os períodos **Hoje**, **Amanhã**, **Semana** e **Próxima semana**.",
        source: "docs/telas/hml/home.md"
    },
    {
        screen: "Agenda de prazos",
        aliases: ["agenda de prazos", "agenda dos prazos", "agenda"],
        answer: "A **Agenda de prazos** demonstra, em um calendário mensal, os **Prazos**, **Audiências** e **Tarefas** vinculados a cada dia. Acesse **Menu > Agenda de prazos**, selecione uma data e escolha a aba correspondente. Para restringir os resultados, utilize **Status**, **Área**, **Tipo de ação**, **Responsável**, **Código do cliente** e **Número do processo**; a data selecionada é mantida entre as abas.",
        source: "docs/telas/hml/agenda-de-prazos.md"
    },
    {
        screen: "Processos",
        aliases: ["processos", "processo"],
        answer: "Acesse **Menu > Processos** e utilize um ou mais filtros, como **Situação**, **Status**, **Área**, **Tipo de ação**, **Responsável**, **Código do cliente**, **Número do processo** ou os períodos de recebimento e tratamento. Os filtros são cumulativos e a listagem é atualizada automaticamente. Use **Visualizar e tratar processo** para abrir o registro.",
        source: "docs/telas/hml/processos.md"
    },
    {
        screen: "Publicações",
        aliases: ["publicações", "publicação"],
        answer: "Acesse **Menu > Publicações** e utilize filtros como **Status**, **Área**, **Tipo de ação**, **Responsável**, **Código do cliente**, **Número do processo** ou os períodos de recebimento, publicação, disponibilização e tratamento. A tela inicia com o status **Pendente**. Na listagem, estão disponíveis **Tratar publicação** e **Visualizar processo**.",
        source: "docs/telas/hml/publicacoes.md"
    },
    {
        screen: "Prazos",
        aliases: ["prazos", "prazo"],
        answer: "Acesse **Menu > Prazos** e use os atalhos de período ou filtros como **Status**, **Tipo de prazo**, **Área**, **Tipo de ação**, **Responsável**, **Código do cliente**, **Número do processo**, **Data do prazo**, **Data fatal** e **Data de tratamento**. A tela inicia com o status **Pendente**. Na listagem, o botão **Visualizar** abre o **Detalhe do processo**.",
        source: "docs/telas/hml/prazos.md"
    },
    {
        screen: "Audiência Mutirão",
        aliases: ["audiência mutirão", "audiências mutirão", "audiência de mutirão", "mutirão"],
        answer: "Acesse **Menu > Audiência Mutirão** e utilize os filtros **Data da audiência**, **Hora**, **Sijur**, **Processo**, **CPF**, **Audiência efetuada?** e **Acordo?**. Na listagem, use **Detalhe** para consultar a audiência ou **Visualizar processo** para abrir o processo relacionado.",
        source: "docs/telas/hml/audiencia-mutirao.md"
    },
    {
        screen: "Audiência",
        aliases: ["audiências", "audiência"],
        answer: "Acesse **Menu > Audiência** e use os atalhos de período ou os filtros **Status**, **Área**, **Tipo de ação**, **Responsável**, **Código do cliente**, **Número do processo**, **Data da audiência** e **Data de tratamento**. Na listagem, abra a ação do registro para consultar seus detalhes.",
        source: "docs/telas/hml/audiencia.md"
    },
    {
        screen: "Ateste",
        aliases: ["atestes", "ateste"],
        answer: "Acesse **Menu > Ateste** e utilize filtros como **Status**, **Número do processo**, **Área de ateste**, **Tipo de ateste** ou os períodos de **Criação**, **Solicitação** e **Recebimento**. Na listagem, use **Editar ateste** para abrir os dados do lançamento.",
        source: "docs/telas/hml/ateste.md"
    }
];
function findScreenConsultationGuide(question) {
    const text = normalize(question);
    const matches = exports.screenConsultationGuides.flatMap((guide) => guide.aliases.map((alias) => {
        const normalizedAlias = normalize(alias);
        return { guide, alias: normalizedAlias, index: text.indexOf(normalizedAlias) };
    })).filter(({ index }) => index >= 0)
        .sort((a, b) => a.index - b.index || b.alias.length - a.alias.length);
    return matches[0]?.guide || null;
}
function answerScreenConsultation(question, reference) {
    return (reference ? exports.screenConsultationGuides.find((guide) => guide.screen === reference) : findScreenConsultationGuide(question))?.answer || null;
}
