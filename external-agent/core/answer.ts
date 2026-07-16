import { SearchResult } from "./search";
import { answerBusinessRule, interpretBusinessRule } from "./business-rules";
import { answerScreenConsultation, findScreenConsultationGuide } from "./screen-consultation";
import { answerOperationalAction } from "./operational-actions";
import { decideAnswerRoute } from "./question-router";
import { DirectedEvidence } from "../providers/playwright.provider";

type RuntimeEvidence = {
  evidence?: string | { menus?: Array<{ text?: string; href?: string }> } | DirectedEvidence;
} | null;

function isDirectedEvidence(value: unknown): value is DirectedEvidence {
  return Boolean(value && typeof value === "object" && (value as { kind?: string }).kind === "directed-query");
}

function formatBoolean(value: boolean): string {
  return value ? "sim" : "não";
}

function formatDirectedAnswer(evidence: DirectedEvidence): string {
  if (!evidence.found) {
    return `Não foi localizado nenhum registro para **${evidence.query}** na consulta direcionada em ${evidence.source === "playwright-prod" ? "PROD" : "HML"}. Nenhuma alteração foi realizada.`;
  }

  if (evidence.target === "user") {
    const firstRow = evidence.rows[0] || [];
    const byColumn = Object.fromEntries(evidence.columns.map((column, index) => [normalizar(column), firstRow[index] || ""]));
    const role = String(evidence.details?.Papel || byColumn.papel || "não identificado");
    const status = String(byColumn.status || "não identificado");
    const client = String(evidence.details?.Cliente || "não identificado");
    const permissionText = evidence.permissions && Object.keys(evidence.permissions).length > 0
      ? Object.entries(evidence.permissions).map(([name, allowed]) => `**${name}:** ${formatBoolean(allowed)}`).join("; ")
      : "As permissões detalhadas não puderam ser abertas com um controle reconhecido como seguro";
    const limitations = evidence.limitations.length > 0 ? ` Limitação: ${evidence.limitations.join(" ")}` : "";
    const clientText = client !== "não identificado" ? ` **Cliente:** ${client}.` : "";
    return `O perfil de acesso de **${evidence.query}** foi consultado em modo somente leitura. **Papel:** ${role}. **Status:** ${status}.${clientText} **Permissões:** ${permissionText}. Nenhuma alteração foi realizada.${limitations}`;
  }

  const firstRow = evidence.rows[0] || [];
  const values = evidence.columns.map((column, index) => ({ column, value: firstRow[index] || "" }))
    .filter((item) => item.column && item.value && !/aç(ã|a)o|acao/i.test(item.column))
    .slice(0, 8)
    .map((item) => `**${item.column}:** ${item.value}`)
    .join("; ");
  return `A consulta direcionada encontrou **${evidence.count}** registro(s) para **${evidence.query}**. ${values || "A listagem foi localizada, mas não havia campos textuais suficientes para resumir."} Nenhuma alteração foi realizada.`;
}

function normalizar(texto: string): string {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function assuntoDaPergunta(pergunta: string): string {
  return normalizar(pergunta).replace(/[^a-z0-9\s]/g, " ").split(/\s+/)
    .filter((termo) => termo.length > 3)
    .filter((termo) => ![
      "como", "consulto", "consultar", "acesso", "acessar", "onde", "posso",
      "configuro", "configurar", "configuracao"
    ].includes(termo))
    .sort((a, b) => b.length - a.length)[0] || "";
}

function estaNoEscopoAtivo(menu: string): boolean {
  const permitidos = new Set([
    "configuracao do ateste",
    "configuracao usuario",
    "configuracao de publicacao",
    "configuracao do prazo",
    "configuracao de processos",
    "home",
    "agenda de prazos",
    "processos",
    "publicacoes",
    "prazos",
    "audiencia",
    "audiencia mutirao",
    "ateste"
  ]);
  return permitidos.has(normalizar(menu));
}

function localizarMenu(pergunta: string, resultados: SearchResult[], runtimeEvidence: RuntimeEvidence) {
  const assunto = assuntoDaPergunta(pergunta);
  if (!assunto) return null;
  const candidatos: Array<{ texto: string; href?: string }> = [];

  for (const resultado of resultados) {
    try {
      const json = JSON.parse(resultado.content);
      if (!Array.isArray(json)) continue;
      for (const item of json) {
        const texto = String(item.texto || item.menu || "").trim();
        const href = String(item.href || item.url || "").trim();
        if (texto) candidatos.push({ texto, href });
      }
    } catch {
      // Fontes não JSON permanecem disponíveis para rastreabilidade.
    }
  }

  const runtimeObject = runtimeEvidence && typeof runtimeEvidence.evidence === "object"
    ? runtimeEvidence.evidence
    : null;
  const menusRuntime = runtimeObject && "menus" in runtimeObject ? runtimeObject.menus || [] : [];
  for (const item of menusRuntime) {
    if (item.text) candidatos.push({ texto: item.text, href: item.href });
  }

  return candidatos.filter((item) => normalizar(`${item.texto} ${item.href || ""}`).includes(assunto))
    .sort((a, b) => {
      const aTexto = normalizar(a.texto);
      const bTexto = normalizar(b.texto);
      const aExato = aTexto === assunto || aTexto === `${assunto}s` ? 1 : 0;
      const bExato = bTexto === assunto || bTexto === `${assunto}s` ? 1 : 0;
      return bExato - aExato || a.texto.length - b.texto.length;
    })[0] || null;
}

function localizarFiltros(pergunta: string, resultados: SearchResult[]): string[] {
  const assunto = assuntoDaPergunta(pergunta);
  if (!assunto) return [];

  for (const resultado of resultados) {
    try {
      const json = JSON.parse(resultado.content);
      if (Array.isArray(json) || !Array.isArray(json.labels)) continue;
      if (!normalizar(String(json.path || "")).includes(assunto)) continue;

      const prioridades = ["numero do processo", "codigo do cliente", "status", "responsavel"];
      const nomes: Record<string, string> = {
        "numero do processo": "Número do processo",
        "codigo do cliente": "Código do cliente",
        "status": "Status",
        "responsavel": "Responsável"
      };
      return prioridades.filter((prioridade) =>
        json.labels.some((label: string) => normalizar(label) === prioridade)
      ).map((prioridade) => nomes[prioridade]);
    } catch {
      // Ignora fontes que não representam metadados estruturados de tela.
    }
  }
  return [];
}

function possuiEvidencia(resultados: SearchResult[], termos: string[]): boolean {
  return resultados.some((resultado) => {
    const base = normalizar(`${resultado.file}\n${resultado.content}`);
    return termos.every((termo) => base.includes(normalizar(termo)));
  });
}

function temIntencaoDeConsulta(pergunta: string): boolean {
  const texto = normalizar(pergunta);
  return [
    "consultar", "consulto", "consulta", "pesquisar", "pesquiso", "pesquisa",
    "localizar", "localizo", "buscar", "busco", "encontrar", "encontro",
    "acessar", "acesso", "onde vejo", "como vejo", "visualizar"
  ].some((sinal) => texto.includes(sinal));
}

function respostaProcedimental(pergunta: string, resultados: SearchResult[]): string | null {
  const texto = normalizar(pergunta);
  const intencaoDeConsulta = temIntencaoDeConsulta(pergunta);

  const perguntaSobreExclusaoDeProcesso = texto.includes("processo") && [
    "excluir",
    "excluido",
    "exclusao",
    "deletar",
    "deletado",
    "apagar",
    "apagado",
    "remover",
    "removido",
    "some do sistema",
    "sumir do sistema"
  ].some((sinal) => texto.includes(sinal));

  if (perguntaSobreExclusaoDeProcesso) {
    return "Não. **Nenhum processo é excluído da plataforma**. Quando ele não deve mais permanecer ativo, sua situação pode ser alterada para **Encerrado**, mas o processo continua registrado no sistema.";
  }

  const perguntaSobreResponsavelDoProcesso = texto.includes("processo") &&
    (texto.includes("responsavel") || texto.includes("responsabilidade")) && [
      "todo processo",
      "precisa ter",
      "deve ter",
      "obrigatorio",
      "sem responsavel",
      "pode ficar"
    ].some((sinal) => texto.includes(sinal));

  if (perguntaSobreResponsavelDoProcesso) {
    if (texto.includes("sem responsavel")) {
      return "Não. **Todo processo deve possuir pelo menos um responsável** vinculado; portanto, ele não deve permanecer sem responsável.";
    }
    return "Sim. **Todo processo deve possuir pelo menos um responsável** vinculado.";
  }

  if (texto.includes("prazo") && (texto.includes("data fatal") || texto.includes("prazo fatal"))) {
    return "Não. A alteração da **Data fatal** é restrita a usuários com permissão específica, configurada em **Configuração de Usuário**, no campo **Alteração**. Qualquer usuário pode alterar Tipo de prazo, Advogado responsável e Data do prazo, mas não a Data fatal sem essa permissão.";
  }

  if (texto.includes("prazo") && texto.includes("descricao") && (texto.includes("alter") || texto.includes("pode"))) {
    return "A alteração da **Descrição do prazo** exige permissão específica, configurada em **Configuração de Usuário**, no campo **Alteração**.";
  }

  if (texto.includes("prazo") && texto.includes("usuario") && (texto.includes("alter") || texto.includes("mudar")) &&
      (texto.includes("tipo") || texto.includes("advogado") || texto.includes("responsavel") || texto.includes("data do prazo"))) {
    return "Qualquer usuário pode alterar **Tipo de prazo**, **Advogado responsável** e **Data do prazo**. Essa permissão não inclui Data fatal nem Descrição, que exigem autorização específica na Configuração de Usuário.";
  }

  if (texto.includes("prazo") && (texto.includes("incluir") || texto.includes("criar")) && texto.includes("usuario")) {
    return "Qualquer usuário pode incluir um novo prazo, sem necessidade de permissão especial. O prazo deve ter Data do prazo, Data fatal, Tipo, Processo vinculado e Responsável.";
  }

  const perguntaSobrePermissao = [
    "qualquer usuario",
    "quem pode",
    "tem permissao",
    "possui permissao",
    "qual perfil",
    "quais perfis",
    "usuario pode"
  ].some((sinal) => texto.includes(sinal));

  if (perguntaSobrePermissao) {
    return "Não foi localizada uma regra comprovada de permissão por usuário ou perfil para essa ação. A funcionalidade foi observada na tela, mas será necessária uma análise manual para confirmar quem está autorizado a executá-la.";
  }

  if (texto.includes("publica") && texto.includes("duplic")) {
    return "A regra de duplicidade de publicação verifica uma janela fixa de **7 dias para trás**, com base na **Data de disponibilização**, e somente compara publicações do **mesmo Código do cliente**. Se o mesmo número de processo estiver associado a códigos de cliente diferentes, os registros não são duplicados entre si.";
  }

  if (texto.includes("document") && ["upload", "enviar", "anexar", "incluir"].some((sinal) => texto.includes(sinal)) &&
      possuiEvidencia(resultados, ["detalhes do processo", "upload"])) {
    return "Acesse **Processos**, informe o **Número do processo** e abra **Visualizar e tratar processo**. Na tela de detalhes, selecione **Documentos** e clique em **Upload**. Escolha o arquivo, confira a data de inclusão e clique em **Enviar**. O limite é de 10 MB por arquivo.";
  }

  if (texto.includes("publica") && intencaoDeConsulta && possuiEvidencia(resultados, ["publicações", "número do processo"])) {
    if (texto.includes("processo")) {
      return "Acesse **Publicações** e informe o **Número do processo**. Para incluir publicações já tratadas, remova o status padrão **Pendente**. A lista é atualizada automaticamente e permite abrir a publicação ou visualizar o processo.";
    }

    return "Acesse o menu **Publicações** e utilize os filtros disponíveis, como **Status**, **Área**, **Tipo de ação**, **Responsável**, **Código do cliente** ou **Número do processo**. A tela inicia com o status **Pendente** e atualiza a listagem automaticamente conforme os filtros selecionados.";
  }

  if (texto.includes("prazo") && intencaoDeConsulta && possuiEvidencia(resultados, ["prazos", "número do processo"])) {
    if (texto.includes("processo")) {
      return "Acesse **Prazos** e informe o **Número do processo**. Para consultar também prazos concluídos, limpe o status padrão **Pendente**. Use a ação da linha para abrir os detalhes ou consultar o histórico.";
    }
    return "Acesse o menu **Prazos** e utilize os filtros disponíveis. A tela inicia com o status **Pendente**; para consultar prazos concluídos, altere ou limpe esse filtro.";
  }

  if (texto.includes("audien") && intencaoDeConsulta && possuiEvidencia(resultados, ["audiência", "número do processo"])) {
    if (texto.includes("processo")) {
      return "Acesse **Audiência**, informe o **Número do processo** e localize o registro. Use a ação da linha para abrir os detalhes da audiência.";
    }
    return "Acesse o menu **Audiência** e utilize os filtros disponíveis para localizar o registro. Na ação da linha, abra a audiência para consultar seus detalhes.";
  }

  if (texto.includes("ateste") && intencaoDeConsulta && possuiEvidencia(resultados, ["ateste", "número do processo"])) {
    if (texto.includes("processo")) {
      return "Acesse **Ateste**, informe o **Número do processo** e localize o lançamento. Use a ação **Editar ateste** para abrir e consultar os dados.";
    }
    return "Acesse o menu **Ateste** e utilize um ou mais filtros, como **Status**, **Número do processo**, **Área de ateste**, **Tipo de ateste** ou os períodos de **Criação**, **Solicitação** e **Recebimento**. Na listagem, use **Editar ateste** para abrir os dados do lançamento.";
  }

  return null;
}

export function temRespostaOperacional(pergunta: string, resultados: SearchResult[]): boolean {
  const route = decideAnswerRoute(pergunta);
  if (route.route === "LIVE_PLATFORM") return false;
  if (route.route === "OPERATIONAL_PROCEDURE" || route.route === "BUSINESS_RULE" || route.route === "SCREEN_CONSULTATION") return true;
  const intencaoDeConsulta = temIntencaoDeConsulta(pergunta);
  return (!intencaoDeConsulta && interpretBusinessRule(pergunta) !== null) ||
    (intencaoDeConsulta && (findScreenConsultationGuide(pergunta) !== null || localizarMenu(pergunta, resultados, null) !== null));
}

export function gerarResposta(pergunta: string, resultados: SearchResult[], runtimeEvidence: RuntimeEvidence = null): string {
  const route = decideAnswerRoute(pergunta);
  if (route.route === "LIVE_PLATFORM") {
    const evidence = runtimeEvidence?.evidence;
    if (isDirectedEvidence(evidence)) return formatDirectedAnswer(evidence);
    return "Essa pergunta depende de uma consulta atual na plataforma, pois envolve dados de um usuário ou registro específico. A navegação automática disponível ainda não coletou evidência suficiente desse cadastro; será necessária uma consulta manual no Blunana antes de responder.";
  }

  if (route.route === "OPERATIONAL_PROCEDURE") {
    const respostaDaAcao = answerOperationalAction(pergunta);
    if (respostaDaAcao) return respostaDaAcao;
  }

  const intencaoDeConsulta = temIntencaoDeConsulta(pergunta);
  if (intencaoDeConsulta) {
    const respostaDaTela = answerScreenConsultation(pergunta);
    if (respostaDaTela) return respostaDaTela;
  }
  if (!intencaoDeConsulta) {
    const respostaDeRegra = answerBusinessRule(pergunta);
    if (respostaDeRegra) return respostaDeRegra;
  }

  const textoNormalizado = normalizar(pergunta);
  const perguntaSobreAtesteAutomaticoAoCumprirPrazo =
    textoNormalizado.includes("prazo") &&
    textoNormalizado.includes("ateste") &&
    ["cumpr", "conclu", "finaliz", "baix"].some((sinal) => textoNormalizado.includes(sinal)) &&
    ["automatic", "gera", "cria", "sai"].some((sinal) => textoNormalizado.includes(sinal));

  if (perguntaSobreAtesteAutomaticoAoCumprirPrazo) {
    return "Não foi localizada uma regra de negócio comprovada que determine se o cumprimento de um prazo gera um ateste automaticamente. Será necessária uma análise manual da equipe responsável.";
  }

  const procedimento = respostaProcedimental(pergunta, resultados);
  if (procedimento) return procedimento;

  const menu = intencaoDeConsulta ? localizarMenu(pergunta, resultados, runtimeEvidence) : null;
  if (menu) {
    if (!estaNoEscopoAtivo(menu.texto)) {
      return `A funcionalidade **${menu.texto}** ainda está em desenvolvimento e não faz parte do escopo atual de suporte. Para evitar uma orientação incorreta, encaminhe a dúvida para validação da equipe responsável.`;
    }
    const filtros = localizarFiltros(pergunta, resultados);
    if (filtros.length > 0) {
      return `Acesse o menu **${menu.texto}** e utilize um ou mais filtros, como **${filtros.join("**, **")}**. A listagem é atualizada automaticamente, e cada filtro acrescentado restringe os resultados da pesquisa.`;
    }
    return `Acesse o menu **${menu.texto}** para realizar a consulta desejada.`;
  }
  if (resultados.length === 0) {
    return "Não encontrei evidência suficiente para orientar esse procedimento com segurança. A tela precisa ser validada no Blunana ou pelo time de suporte.";
  }
  return "Encontrei materiais relacionados, mas eles não comprovam o passo a passo solicitado. A orientação deve ser validada no Blunana antes de ser enviada ao usuário.";
}
