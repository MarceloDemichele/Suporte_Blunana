using Zennolab.CapMonsterCloud;
using Zennolab.CapMonsterCloud.Requests;

namespace Robo_CEF.Services;

public class CaptchaService
{
    private readonly ICapMonsterCloudClient _cmCloudClient;

    public CaptchaService(string clientKey)
    {
        _cmCloudClient = CapMonsterCloudClientFactory.Create(
            new ClientOptions
            {
                ClientKey = clientKey
            }
        );
    }

    public async Task<string> ResolveAsync(string base64ImageCaptcha)
    {
        var imageToText = new ImageToTextRequest()
        {
            CaseSensitive = false,
            Body = base64ImageCaptcha,
        };

        var task = await _cmCloudClient.SolveAsync(imageToText);

        if (task.Error != null)
        {
            throw new Exception($"Erro eo resolver o captcha: {task.Error}");
        }

        return task.Solution.Value;
    }
}