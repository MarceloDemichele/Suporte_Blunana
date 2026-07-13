using Microsoft.Extensions.Configuration;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;

namespace Robo_CEF.Services;

public class LoginService(IWebDriver driver, CaptchaService captchaService, IConfiguration config)
{
    public async Task RunAsync()
    {
        TimeSpan[] listaDeTimeouts = [
            TimeSpan.FromSeconds(5),
            TimeSpan.FromSeconds(15),
            TimeSpan.FromSeconds(30),
        ];

        int contadorDeTentativas = 1;

        Console.WriteLine("Iniciando o login");

        foreach(var timeout in listaDeTimeouts)
        {
            try 
            {
                driver.Navigate().GoToUrl("https://www.juridico.caixa.gov.br");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao navegar: {ex.Message}");
            }

            Console.WriteLine($"- Tentativa: {contadorDeTentativas}");
            Console.WriteLine($"- Tempo limite do carregamento da página: {timeout.TotalSeconds}s");

            bool isSuccess = await LoginAsync(timeout);

            if (isSuccess)
            {
                Console.WriteLine("- Login realizado com sucesso");
                return;
            }

            contadorDeTentativas++;
        }

        throw new InvalidOperationException("Ocorreu um erro ao se logar no sistema após 3 tentativas");
    }

    private async Task<bool> LoginAsync(TimeSpan loadingTimeout)
    {
        try
        {
            if (!driver.Url.Contains("logon"))
            {
                Console.WriteLine("- Usuário já está logado");
                return true;
            }

            string login = config["LoginUser:UserName"] ?? throw new Exception("Erro ao obter UserName");
            string senha = config["LoginUser:PassWord"] ?? throw new Exception("Erro ao obter PassWord");

            driver.SwitchTo().Window(driver.CurrentWindowHandle);
            await Task.Delay(5000);

            // Preencher Usuário
            var inputMatricula = driver.FindElement(By.CssSelector("input#sMatricula"));
            inputMatricula.Clear();
            inputMatricula.SendKeys(login);

            // Preencher Senha
            var inputSenha = driver.FindElement(By.CssSelector("input#sSenha"));
            inputSenha.Clear();
            inputSenha.SendKeys(senha);

            var elementImageCaptcha = driver.FindElement(By.CssSelector("img#imgCaptcha"));
            
            ITakesScreenshot screenshotDriver = (ITakesScreenshot)elementImageCaptcha;
            Screenshot screenshot = screenshotDriver.GetScreenshot();
            string base64ImageCaptcha = screenshot.AsBase64EncodedString;

            string captchaText = await captchaService.ResolveAsync(base64ImageCaptcha);
            Console.WriteLine($"- Resultado do Captcha: {captchaText}");

            const string inputCaptchaSelector = "input#sCaptcha";
            var inputCaptcha = driver.FindElement(By.CssSelector(inputCaptchaSelector));

            inputCaptcha.Clear();
            inputCaptcha.SendKeys(captchaText);

            var btnLogin = driver.FindElement(By.CssSelector("button#btn-login"));
            btnLogin.Click();

            var wait = new WebDriverWait(driver, loadingTimeout);

            try
            {
                // Espera o loading aparecer
                wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(".loading")));

                // Espera o loading desaparecer
                wait.Until(ExpectedConditions.InvisibilityOfElementLocated(By.CssSelector(".loading")));

                // Espera a url mudar para a tela inicial sem logon
                wait.Until(d => !d.Url.Contains("logon"));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"- Erro ao logar: {ex.Message}");
                return false;
            }

            await Task.Delay(2000);
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro durante o processo de login: {ex.Message}");
            return false;
        }
    }
}