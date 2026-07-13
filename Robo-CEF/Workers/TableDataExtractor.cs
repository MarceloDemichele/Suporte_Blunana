using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace Robo_CEF.Workers
{
    internal class TableDataExtractor
    {
        public static async Task<(int chamadasProc, int totalSucesso, int totalErros)> ExtractTableDataAsync(IWebDriver driver, string? dataBuscada, string faseProcessual)
        {
            var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(120));
            string tableXPath = "/html/body/div/div[4]/div/div/div[4]/div/div[1]/div/div[3]/div/div[2]/div/div[2]/div/table/tbody";
            string nextPageBtnXPath = "//button[contains(text(), 'Próxima')]";

            int chamadasProc = 0;
            int totalSucesso = 0;
            int totalErros = 0;

            while (true)
            {
                wait.Until(d => d.FindElements(By.XPath(tableXPath)).Count > 0);
                var tableElement = driver.FindElements(By.XPath(tableXPath)).FirstOrDefault();
                if (tableElement == null) break;

                foreach (var row in tableElement.FindElements(By.TagName("tr")))
                {
                    IReadOnlyCollection<IWebElement> cells = [];
                    int cellRetryCount = 0;
                    while (cellRetryCount < 5)
                    {
                        try
                        {
                            cells = row.FindElements(By.TagName("td"));
                            break;
                        }
                        catch (StaleElementReferenceException)
                        {
                            cellRetryCount++;
                            await Task.Delay(1000);
                        }
                    }
                    if (cells.Count == 0) continue;

                    // Replace the selected code block with the following retry logic for stale element errors
                    Models.TableDataModel? dataModel = null;
                    int dataModelRetryCount = 0;
                    while (dataModel == null && dataModelRetryCount < 5)
                    {
                        try
                        {
                            // Try to get fresh cells reference before accessing their properties
                            cells = row.FindElements(By.TagName("td"));
                            dataModel = new Models.TableDataModel
                            {
                                expediente = cells.ElementAtOrDefault(0)?.Text.Trim(),
                                area_judicial = cells.ElementAtOrDefault(1)?.Text.Trim(),
                                situacao_cef = cells.ElementAtOrDefault(2)?.Text.Trim(),
                                data_fase = cells.ElementAtOrDefault(3)?.Text.Trim() ?? Convert.ToString(DateTime.Today),
                                descricao = cells.ElementAtOrDefault(4)?.Text.Trim()
                            };
                        }
                        catch (StaleElementReferenceException)
                        {
                            dataModelRetryCount++;
                            await Task.Delay(1000);
                        }
                    }
                    if (dataModel == null) continue;

                    try
                    {
                        MySqlDatabase.MySqlDatabase.InsertProcessesByProcedure(dataModel, faseProcessual);
                        totalSucesso++;
                    }
                    catch
                    {
                        Console.WriteLine($"- Erro ao inserir a linha com o expediente: {dataModel.expediente}");
                        totalErros++;
                    }

                    chamadasProc++;
                }

                // Try to find the next page button
                var nextPageBtns = driver.FindElements(By.XPath(nextPageBtnXPath));
                if (nextPageBtns.Count == 0 || !nextPageBtns[0].Displayed || !nextPageBtns[0].Enabled)
                {
                    // Last page reached, exit loop after processing
                    break;
                }

                // Click next page button until it works
                bool clicked = false;
                int retryCount = 0;
                while (!clicked && retryCount < 5)
                {
                    try
                    {
                        nextPageBtns[0].Click();
                        clicked = true;
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"- Click attempt {retryCount + 1} failed: {ex.Message}");
                        await Task.Delay(2000); // Wait before retrying
                        retryCount++;
                    }
                }
                await Task.Delay(30000); // Wait for page to load
            }

            Console.WriteLine("- Extração finalizada!");
            Console.WriteLine($"   - Total de chamadas na procedure: {chamadasProc}");
            Console.WriteLine($"   - Total com sucesso: {totalSucesso}");
            Console.WriteLine($"   - Total com erro: {totalErros}");

            return (chamadasProc, totalSucesso, totalErros);
        }

        internal static async Task SendSlackNotificationAsync(string slackMessage)
        {
            string slackWebhookUrl = ""; // Replace with your actual webhook URL
            using var httpClient = new HttpClient();
            var payload = new
            {
                text = slackMessage
            };
            var jsonPayload = System.Text.Json.JsonSerializer.Serialize(payload);
            var content = new StringContent(jsonPayload, System.Text.Encoding.UTF8, "application/json");
            var response = await httpClient.PostAsync(slackWebhookUrl, content);
            response.EnsureSuccessStatusCode();
        }
    }
}