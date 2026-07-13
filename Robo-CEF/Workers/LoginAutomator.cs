using OpenQA.Selenium;
using Robo_CEF.Models;

namespace Robo_CEF.Workers
{
    internal class LoginAutomator
    {
        public static async Task LoginIntoCaixaWebsiteAsync(IWebDriver _driver)
        {
            _driver.Navigate().GoToUrl("https://www.juridico.caixa.gov.br/logon.asp");

            CredentialsModel credentialsModel = CredentialsFetcher.GetUserCredentials();

            string LoginInputXPath = "/html/body/div/div[2]/div[1]/div/div/div[2]/form/div[1]/input";
            IWebElement LoginInputElement = _driver.FindElement(By.XPath(LoginInputXPath));
            LoginInputElement.SendKeys(credentialsModel.Username);

            string PasswordInputXPath = "/html/body/div/div[2]/div[1]/div/div/div[2]/form/div[2]/input";
            IWebElement PasswordInputElement = _driver.FindElement(By.XPath(PasswordInputXPath));
            PasswordInputElement.SendKeys(credentialsModel.Password);

            string CaptchaXPath = "/html/body/div/div[2]/div[1]/div/div/div[2]/form/div[4]/span/img";

            while (_driver.FindElements(By.XPath(CaptchaXPath)).Count > 0)
            {
                try
                {
                    bool isSuccess = await CaptchaSolver.CaptchaBreaker(_driver);

                    if (isSuccess)
                    {
                        string EnterButtonXPath = "/html/body/div/div[2]/div[1]/div/div/div[2]/form/div[6]/div/button";
                        IWebElement EnterButtonElement = _driver.FindElement(By.XPath(EnterButtonXPath));
                        EnterButtonElement.Click();
                    }
                    else
                    {
                        string CaptchaRefreshButtonXpath = "/html/body/div/div[2]/div[1]/div/div/div[2]/form/div[4]/button";
                        IWebElement CaptchaRefreshButtonElement = _driver.FindElement(By.XPath(CaptchaRefreshButtonXpath));
                        CaptchaRefreshButtonElement.Click();
                    }
                }
                catch
                {
                    break;
                }
            }

            if (_driver.Url.Contains("https://www.juridico.caixa.gov.br/"))
            {
                Console.WriteLine("Login successful, navigating to the main page.");
            }
            else
            {
                Console.WriteLine("Login failed, please check your credentials or captcha solving.");
                DateTime now = DateTime.Now;
                var slackMessage = $@"
                Inicio Processamento: [{now:yyyy-MM-dd HH:mm:ss}]

                [{now:yyyy-MM-dd HH:mm:ss}]
                MONITORAMENTO PROCESSOS ROCHA

                TERCEIRIZAÇÃO PROCESSOS CEF
                ERRO: Não foi possível realizar o login no sistema da CEF.

                Fim Processamento: [{now:yyyy-MM-dd HH:mm:ss}]
                ";
                TableDataExtractor.SendSlackNotificationAsync(slackMessage).Wait();
                throw new Exception("Login failed. Please check your credentials or captcha solving.");
            }
        }
    }
}
