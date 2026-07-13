using System.Text.RegularExpressions;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using Robo_CEF.Constants;
using Robo_CEF.Models;
using SeleniumExtras.WaitHelpers;

namespace Robo_CEF.Workers
{
    internal class Extractor
    {
        public static void ReboundClickingWithScroll(IWebDriver _driver, string elementXPath, int rounds)
        {
            WebDriverWait wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(30));

            for (int i = 0; i < rounds; i++)
            {
                try
                {
                    Thread.Sleep(2000);
                    wait.Until(ExpectedConditions.ElementToBeClickable(By.XPath(elementXPath))).Click();
                    break;
                }
                catch (NoSuchElementException)
                {
                    try
                    {
                        var js = (IJavaScriptExecutor)_driver;
                        js.ExecuteScript("window.scrollBy(0, 200);");
                        Thread.Sleep(500);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Scroll failed: " + ex.Message);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    Thread.Sleep(1000);
                    continue;
                }
            }
        }

        public static async Task<ResumoExtracao> ExtractCEFData(IWebDriver _driver, DateTime dataInicio, DateTime dataFim, bool isSegundoGrau = false)
        {
            int grau = isSegundoGrau ? 2 : 1;
            Console.WriteLine($"Buscando no {grau}º Grau:");

            _driver.Navigate().GoToUrl("https://www.juridico.caixa.gov.br/modulos/CtrlSistemico/_Ajustes/?pg=AjustesSIJURFaseAClassificar");

            await Task.Delay(3000);

            Console.WriteLine($"- Definindo Data Inicio: {dataInicio:dd/MM/yyyy}");
            string FromDateInputXPath = "/html/body/div/div[4]/div/div/div[4]/div/div[1]/div/div[2]/div/div/div[2]/div/form/div/div[8]/div/div/input[1]";
            IWebElement FromDateInput = _driver.FindElement(By.XPath(FromDateInputXPath));
            FromDateInput.Clear();
            FromDateInput.SendKeys(dataInicio.ToString("dd/MM/yyyy"));
            FromDateInput.SendKeys(Keys.Escape);

            Console.WriteLine($"- Definindo Data Fim: {dataFim:dd/MM/yyyy}");
            string ToDateInputXPath = "/html/body/div/div[4]/div/div/div[4]/div/div[1]/div/div[2]/div/div/div[2]/div/form/div/div[8]/div/div/input[2]";
            IWebElement ToDateInput = _driver.FindElement(By.XPath(ToDateInputXPath));
            ToDateInput.Clear();
            ToDateInput.SendKeys(dataFim.ToString("dd/MM/yyyy"));
            ToDateInput.SendKeys(Keys.Escape);

            string faseProcessual = FasesProcessuais.Fase1;

            if (isSegundoGrau)
            {
                SelectElement selectGrauExpediente = new SelectElement(_driver.FindElement(By.Id("nGrauExpediente")));
                selectGrauExpediente.SelectByValue("2");
                faseProcessual = FasesProcessuais.Fase2;
            }

            string LocateButtonXPath = "/html/body/div/div[4]/div/div/div[4]/div/div[1]/div/div[2]/div/div/div[2]/div/form/div/div[1]/div[2]/button";
            ReboundClickingWithScroll(_driver, LocateButtonXPath, 3);
            await Task.Delay(2000);

            int totalPortal = GetTotalPortal(_driver);
            await Task.Delay(2000);

            Console.WriteLine($"- Selecionando 500 registros por página");
            SelectCountByPage(_driver);

            Console.WriteLine("- Executando extração");
            var (chamadasProc, totalSucesso, totalErros) = await TableDataExtractor.ExtractTableDataAsync(_driver, dataFim.ToString("dd/MM/yyyy"), faseProcessual);

            return new()
            {
                TotalPortal = totalPortal,
                TotalNovos = chamadasProc,
                TotalSucesso = totalSucesso,
                TotalErros = totalErros
            };
        }

        private static int GetTotalPortal(IWebDriver driver)
        {
            try
            {
                var element = driver.FindElement(By.CssSelector("caption[class^='table']"));
                string captionTotal = element.Text;

                var match = Regex.Match(captionTotal, @"Total:\s*(\d+)", RegexOptions.IgnoreCase);

                if (match.Success)
                {
                    if (int.TryParse(match.Groups[1].Value, out int total))
                    {
                        Console.WriteLine($"- Total do portal: {total}");
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

        private static void SelectCountByPage(IWebDriver driver, int countByPage = 500)
        {
            try
            {
                var waitSelect = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
                var selecionarQtdPorPagElement = waitSelect.Until(ExpectedConditions.ElementExists(By.CssSelector("select.nQtdRegistrosPagina")));
                var selecionarQtdPorPag = new SelectElement(selecionarQtdPorPagElement);

                selecionarQtdPorPag.SelectByValue($"{countByPage}");

                var botaoSelecionarQtdPorPag = driver.FindElement(
                    By.CssSelector("select.nQtdRegistrosPagina + button")
                );

                botaoSelecionarQtdPorPag.Click();
                botaoSelecionarQtdPorPag.Click();

                Thread.Sleep(1000);

                var waitLoading = new WebDriverWait(driver, TimeSpan.FromSeconds(60));
                waitLoading.Until(d => d.FindElements(By.ClassName("loading")).Count == 0);
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine($"- Ocorreu um erro ao tentar aumentar a quantidade de itens por página: {ex.Message}");
                Console.ResetColor();
            }
        }
    }
}
