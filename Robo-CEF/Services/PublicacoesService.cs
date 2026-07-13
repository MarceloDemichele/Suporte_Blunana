using System.Text.RegularExpressions;
using Microsoft.Extensions.Configuration;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using Robo_CEF.Constants;
using SeleniumExtras.WaitHelpers;

namespace Robo_CEF.Services;

public class PublicacoesService
{
    private readonly IWebDriver _driver;

    private readonly WebDriverWait _waitDefault;
    private readonly WebDriverWait _waitLoading;

    private readonly int _itemsPerPage;


    public PublicacoesService(IWebDriver driver, IConfiguration config)
    {
        int timeoutDefaultSeconds = int.Parse(config["TimeoutSeconds:Default"] ?? "30");
        int timeoutLoadingSeconds = int.Parse(config["TimeoutSeconds:Loading"] ?? "60");
        _itemsPerPage = int.Parse(config["ItemsPerPage"] ?? "500");

        _driver = driver;


        _waitDefault = new(driver, TimeSpan.FromSeconds(timeoutDefaultSeconds));
        _waitLoading = new(driver, TimeSpan.FromSeconds(timeoutLoadingSeconds));
    }

    public List<string> PesquisarPublicacoes(DateTime dataInicio, DateTime dataFim, bool filtrarPorSegundoGrau = false)
    {
        int grau = filtrarPorSegundoGrau ? 2 : 1;
        Console.WriteLine($"Buscando no {grau}º Grau:");

        _driver.Navigate().GoToUrl("https://www.juridico.caixa.gov.br/modulos/CtrlSistemico/_Ajustes/?pg=AjustesSIJURFaseAClassificar");

        _waitDefault.Until(d => d.FindElement(By.Id("iniBuscaFaseClassificar")));

        string dataInicioStr = dataInicio.ToString(TipoDatas.DataBrasil);
        string dataFimStr = dataFim.ToString(TipoDatas.DataBrasil);

        Console.WriteLine($"- Definindo Data Inicio: {dataInicioStr}");
        IWebElement FromDateInput = _driver.FindElement(By.Id("iniBuscaFaseClassificar"));
        FromDateInput.Clear();
        FromDateInput.SendKeys(dataInicioStr);
        FromDateInput.SendKeys(Keys.Enter);
        Thread.Sleep(1000);

        Console.WriteLine($"- Definindo Data Fim: {dataFimStr}");
        IWebElement ToDateInput = _driver.FindElement(By.Id("fimBuscaFaseClassificar"));
        ToDateInput.Clear();
        ToDateInput.SendKeys(dataFimStr);
        ToDateInput.SendKeys(Keys.Enter);
        Thread.Sleep(1000);

        if (filtrarPorSegundoGrau)
        {
            var selectGrauExpediente = new SelectElement(_driver.FindElement(By.Id("nGrauExpediente")));
            selectGrauExpediente.SelectByValue("2");
        }

        // Cancela a sobreposição dos elementos de data
        _driver.FindElement(By.ClassName("form-group")).Click();
        Thread.Sleep(1000);

        Console.WriteLine("- Pesquisando...");
        _driver.FindElement(By.Id("btFiltrar")).Click();

        WaitLoading();
        SelectCountByPage();
        WaitLoading();

        Console.WriteLine("- Iniciando extração das tabelas");

        List<string> htmlTables = [];

        while (true)
        {
            var tableElement = _waitDefault.Until(d => d.FindElement(By.CssSelector("table#tabListaFasesAClassificar")));
            string? htmlTable = tableElement.GetAttribute("outerHTML");

            if (!string.IsNullOrWhiteSpace(htmlTable))
                htmlTables.Add(htmlTable);

            Console.WriteLine("- Tetando clicar na próxima página");
            Console.WriteLine($"  - Página atual: {htmlTables.Count}");

            // Tenta encontrar o botão de próxima página
            var nextButtons = _driver.FindElements(By.CssSelector("button.btnProxima"));
            if (nextButtons.Count == 0 || !nextButtons[0].Enabled || !nextButtons[0].Displayed)
                break;

            nextButtons[0].Click();
            WaitLoading();
        }

        return htmlTables;
    }

    public int GetTotalPortal()
    {
        try
        {
            var element = _driver.FindElement(By.CssSelector("caption[class^='table']"));
            string captionTotal = element.Text;

            var match = Regex.Match(captionTotal, @"Total:\s*([.,\d]+)", RegexOptions.IgnoreCase);

            if (match.Success)
            {
                string value = match.Groups[1].Value
                    .Replace(".", "")
                    .Replace(",", "")
                    .Trim();

                if (int.TryParse(value, out int total))
                {
                    return total;
                }
            }
        }
        catch (NoSuchElementException notFoundElement)
        {
            Console.WriteLine($"Erro ao obter o elemento do total no portal: {notFoundElement.Message}");
            return 0;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao obter total do portal: {ex.Message}");
            return 0;
        }

        return 0;
    }

    public void WaitLoading()
    {
        var loadingLocator = By.ClassName("loading");
        _waitLoading.Until(d => d.FindElements(loadingLocator).Count == 0);
    }

    private void SelectCountByPage()
    {
        try
        {
            var selecionarQtdPorPagElement = _waitDefault.Until(ExpectedConditions.ElementExists(By.CssSelector("select.nQtdRegistrosPagina")));
            var selecionarQtdPorPag = new SelectElement(selecionarQtdPorPagElement);

            Console.WriteLine($"- Selecionando {_itemsPerPage} itens por página");
            selecionarQtdPorPag.SelectByValue($"{_itemsPerPage}");

            var botaoSelecionarQtdPorPag = _driver.FindElement(
                By.CssSelector("select.nQtdRegistrosPagina + button")
            );

            botaoSelecionarQtdPorPag.Click();
            botaoSelecionarQtdPorPag.Click();
        }
        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine($"- Ocorreu um erro ao tentar aumentar a quantidade de itens por página: {ex.Message}");
            Console.ResetColor();
        }
    }
}