using Robo_CEF.Utils;
using Microsoft.Extensions.Configuration;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using Robo_CEF.Constants;
using Robo_CEF.Models;
using Robo_CEF.Repositories;
using Robo_CEF.Services;

namespace Robo_CEF;

public class RoboCEF
{
    public static IWebDriver DriverBuilder(bool isFullScreen)
    {
        var chromeOptions = new ChromeOptions();
        chromeOptions.AddArgument("--disable-blink-features=AutomationControlled");
        chromeOptions.AddArgument("--disable-infobars");
        chromeOptions.AddArgument("--disable-extensions");

        if (isFullScreen)
        {
            chromeOptions.AddArgument("--start-maximized");
        }
        else
        {
            chromeOptions.AddArgument("--window-size=1920,1080");
        }

        chromeOptions.AddUserProfilePreference("profile.default_content_setting_values.images", 1); // Ensure images load

        IWebDriver _driver = new ChromeDriver(chromeOptions);
        _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);
        return _driver;
    }

    public static void CloseAndClean(IWebDriver _driver)
    {
        _driver.Quit();
        _driver.Dispose();
        Console.WriteLine("Driver closed and cleaned up.");
    }

    public static async Task Main(string[] args)
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("config.json", optional: false, reloadOnChange: true);

        var config = builder.Build();

        int diasRetroativos = int.Parse(config["DiasRetroativos"] ?? "0");
        bool isDevelopment = bool.Parse(config["IsDevelopment"] ?? "false");

        string connectionString = config.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Erro ao obter configuração do banco");

        string capMonsterKey = config["Capmonster:Key"]
            ?? throw new InvalidOperationException("Erro ao obter configuração do cap monster");

        Console.WriteLine("RoboCEF starting...");
        Console.WriteLine("BLUE PROJECTS - BOT CEF PUBLICAÇÕES");
        IWebDriver driver = DriverBuilder(isFullScreen: isDevelopment);

        var dataInicioProcessamento = DateTime.Now;
        Exception? erroGlobal = null;


        var dataInicio = dataInicioProcessamento.AddDays(-diasRetroativos);
        var dataFim = dataInicioProcessamento;


        var whatsAppRepository = new WhatsAppRepository(connectionString);
        var logsRepository = new LogsRepository(connectionString);
        var publicacoesRepository = new PublicacoesRepository(connectionString);

        var captchaService = new CaptchaService(capMonsterKey);
        var loginService = new LoginService(driver, captchaService, config);
        var publicacoesService = new PublicacoesService(driver, config);
        var notifyService = new NotifyService(whatsAppRepository);

        ResumoExtracao resumoPrimeiroGrau = new();
        ResumoExtracao resumoSegundoGrau = new();

        try
        {
            await logsRepository.LogInicializacaoAsync();
            await loginService.RunAsync();

            resumoPrimeiroGrau = await ProcessarFaseAsync(
                publicacoesService,
                publicacoesRepository,
                logsRepository,
                dataInicio,
                dataFim,
                isSegundoGrau: false
            );

            resumoSegundoGrau = await ProcessarFaseAsync(
                publicacoesService,
                publicacoesRepository,
                logsRepository,
                dataInicio,
                dataFim,
                isSegundoGrau: true
            );
        }
        catch (Exception ex)
        {
            Environment.ExitCode = 1;
            erroGlobal = ex;
            throw;
        }
        finally
        {
            var dataFimProcessamento = DateTime.Now;

            string dataInicioStr = dataInicio.ToString(TipoDatas.DataBrasil);
            string dataFimStr = dataFim.ToString(TipoDatas.DataBrasil);

            string dataInicioProcessamentoStr = dataInicioProcessamento.ToString(TipoDatas.DataHoraBrasil);
            string dataFimProcessamentoStr = dataFimProcessamento.ToString(TipoDatas.DataHoraBrasil);

            string resumoErro = string.Empty;

            if (erroGlobal != null)
            {
                resumoErro = $"\nERRO CRÍTICO: {erroGlobal.Message}";
            }

            string notificacaoMensagem = $"""
            Inicio Processamento: [{dataInicioProcessamentoStr}]

            MONITORAMENTO PROCESSOS ROCHA

            PUBLICAÇÕES PROCESSOS CEF
            RESUMO DO PROCESSAMENTO:
            - Período pesquisado no portal: {dataInicioStr} - {dataFimStr} ({diasRetroativos} dias atrás)
            - 1º Grau:
                - Portal: {resumoPrimeiroGrau.TotalPortal}
                - Extraídas: {resumoPrimeiroGrau.TotalEncontrado}
                - Extraídas Sem Expedientes Duplicados: {resumoPrimeiroGrau.TotalNaoDuplicado}
                - Existentes: {resumoPrimeiroGrau.TotalExistente}
                - Novas: {resumoPrimeiroGrau.TotalNovos}
                    - Com Sucesso: {resumoPrimeiroGrau.TotalSucesso}
                    - Com Erro: {resumoPrimeiroGrau.TotalErros}
            - 2º Grau:
                - Portal: {resumoSegundoGrau.TotalPortal}
                - Extraídas: {resumoSegundoGrau.TotalEncontrado}
                - Extraídas Sem Expedientes Duplicados: {resumoSegundoGrau.TotalNaoDuplicado}
                - Existentes: {resumoSegundoGrau.TotalExistente}
                - Novas: {resumoSegundoGrau.TotalNovos}
                    - Com Sucesso: {resumoSegundoGrau.TotalSucesso}
                    - Com Erro: {resumoSegundoGrau.TotalErros}
            {resumoErro}
            Fim Processamento: [{dataFimProcessamentoStr}]
            """.Trim();

            Console.WriteLine(notificacaoMensagem);
            await notifyService.NotificarSlackAsync(notificacaoMensagem);
            await notifyService.NotificarWhatsAppAsync(notificacaoMensagem);
            await logsRepository.LogFinalizacaoAsync();
            CloseAndClean(driver);
        }
    }

    private static async Task<ResumoExtracao> ProcessarFaseAsync(
        PublicacoesService publicacoesService,
        PublicacoesRepository publicacoesRepository,
        LogsRepository logsRepository,
        DateTime dataInicio,
        DateTime dataFim,
        bool isSegundoGrau
    )
    {
        var resumo = new ResumoExtracao();

        string faseProcessual = isSegundoGrau
            ? FasesProcessuais.Fase2
            : FasesProcessuais.Fase1;

        var htmlTables = publicacoesService.PesquisarPublicacoes(
            dataInicio,
            dataFim,
            filtrarPorSegundoGrau: isSegundoGrau
        );

        resumo.TotalPortal = publicacoesService.GetTotalPortal();
        Console.WriteLine($"[{faseProcessual}] Total do portal: {resumo.TotalPortal}");

        var publicacoes = htmlTables
            .SelectMany(HtmlTableParser.Parse<PublicacoesTable>)
            .Select(publicacao =>
            {
                publicacao.p_FASEPROCESSUAL = faseProcessual;
                return publicacao;
            })
            .ToList();

        resumo.TotalEncontrado = publicacoes.Count;
        Console.WriteLine($"[{faseProcessual}] Total extraído das tabelas: {resumo.TotalEncontrado}");

        HashSet<string> expedientesList = publicacoes
            .Select(publicacao => publicacao.p_EXPEDIENTE ?? string.Empty)
            .Where(expediente => !string.IsNullOrEmpty(expediente))
            .ToHashSet();

        resumo.TotalNaoDuplicado = expedientesList.Count;
        Console.WriteLine($"[{faseProcessual}] Total extraído das tabelas sem expedientes duplicados: {resumo.TotalNaoDuplicado}");

        var expedientesExistentes = await publicacoesRepository.ObterExpedientesExistentesAsync(expedientesList);

        resumo.TotalExistente = expedientesExistentes.Count;
        Console.WriteLine($"[{faseProcessual}] Total que existe no banco: {resumo.TotalExistente}");

        var novasPublicacoes =  publicacoes
            .Where(p => !expedientesExistentes.Contains(p.p_EXPEDIENTE ?? string.Empty))
            .DistinctBy(p => p.p_EXPEDIENTE)
            .ToList();

        resumo.TotalNovos = novasPublicacoes.Count;
        Console.WriteLine($"[{faseProcessual}] Total de novas publicações encontradas: {resumo.TotalNovos}");
        await logsRepository.LogEmProcessamentoAsync(novasPublicacoes.Count);

        if (novasPublicacoes.Count > 0)
        {
            var (Sucessos, Erros) = await publicacoesRepository.ImportarPublicacoesAsync(novasPublicacoes, logsRepository);
            resumo.TotalSucesso = Sucessos;
            resumo.TotalErros = Erros;
        }
        else
        {
            Console.WriteLine($"[{faseProcessual}] Não foi encontrado nenhuma publicação nova para importar");
        }

        return resumo;
    }
}