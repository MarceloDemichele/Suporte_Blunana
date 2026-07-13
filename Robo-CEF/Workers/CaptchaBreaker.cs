using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using OpenQA.Selenium;

public static class CaptchaSolver
{
    private static string CapMonsterApiKey => ReadCapKey();

    public static string ReadCapKey()
    {
        var configBuilder = new ConfigurationBuilder()
                    .AddJsonFile("config.json", optional: true, reloadOnChange: true);
        var configuration = configBuilder.Build();

        return configuration["Capmonster:Key"];
    }

    public static class MimeTypeHelper
    {
        private static readonly Dictionary<string, string> MimeTypeMappings = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            { "image/jpeg", ".jpg" },
            { "image/png", ".png" },
            { "image/gif", ".gif" },
            { "image/bmp", ".bmp" },
        };

        public static string GetExtension(string mimeType)
        {
            return MimeTypeMappings.TryGetValue(mimeType, out var extension) ? extension : ".dat"; // Retorna .dat se não encontrar
        }
    }

    public static async Task<bool> CaptchaBreaker(IWebDriver _driver)
    {
        try
        {
            var captchaImgElement = (ITakesScreenshot)_driver.FindElement(By.XPath("//img[contains(@src,'captcha.asp')]"));

            string finalFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "captcha.jpg");

            captchaImgElement.GetScreenshot().SaveAsFile(finalFilePath);

            Console.WriteLine("Imagem do captcha baixada em: " + finalFilePath);

            string captchaText = SolveCaptchaWithCapMonster(finalFilePath);
            if (string.IsNullOrEmpty(captchaText))
                throw new Exception("Falha ao resolver o captcha. O texto retornado é nulo ou vazio.");

            Console.WriteLine("Texto do Captcha: " + captchaText);

            var captchaInput = _driver.FindElement(By.XPath("//input[@placeholder='Digite o código acima']"));
            captchaInput.Clear();
            captchaInput.SendKeys(captchaText);

            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine("Falha ao processar o captcha: " + ex.Message);
            if (ex.InnerException != null)
            {
                Console.WriteLine("Inner Exception: " + ex.InnerException.Message);
            }
            return false;
        }
    }

    private static string SolveCaptchaWithCapMonster(string filePath)
    {
        using var httpClient = new HttpClient();
        var createTaskPayload = new
        {
            clientKey = CapMonsterApiKey,
            task = new
            {
                type = "ImageToTextTask",
                body = Convert.ToBase64String(File.ReadAllBytes(filePath))
            }
        };
        var createTaskContent = new StringContent(
            Newtonsoft.Json.JsonConvert.SerializeObject(createTaskPayload),
            System.Text.Encoding.UTF8,
            "application/json"
        );

        var createTaskResponse = httpClient.PostAsync("https://api.capmonster.cloud/createTask", createTaskContent).GetAwaiter().GetResult();
        createTaskResponse.EnsureSuccessStatusCode();
        var createTaskJson = JObject.Parse(createTaskResponse.Content.ReadAsStringAsync().Result);
        var taskId = createTaskJson["taskId"]?.ToString();

        if (string.IsNullOrEmpty(taskId))
            throw new Exception("TaskID came back as null from the captcha solver!");

        while (true)
        {
            Thread.Sleep(3000);
            var getTaskPayload = new { clientKey = CapMonsterApiKey, taskId = taskId };
            var getTaskContent = new StringContent(
                Newtonsoft.Json.JsonConvert.SerializeObject(getTaskPayload),
                System.Text.Encoding.UTF8,
                "application/json"
            );

            var getTaskResponse = httpClient.PostAsync("https://api.capmonster.cloud/getTaskResult", getTaskContent).GetAwaiter().GetResult();
            getTaskResponse.EnsureSuccessStatusCode();
            var getTaskJson = JObject.Parse(getTaskResponse.Content.ReadAsStringAsync().Result);

            if (getTaskJson["status"]?.ToString() == "ready")
            {
                return getTaskJson["solution"]?["text"]?.ToString();
            }
        }
    }
}
