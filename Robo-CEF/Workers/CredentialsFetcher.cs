using Robo_CEF.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;

namespace Robo_CEF.Workers
{

    internal class CredentialsFetcher
    {
        public static string GetDefaultConnectionString()
        {
            var configBuilder = new ConfigurationBuilder()
                .AddJsonFile("config.json", optional: true, reloadOnChange: true);
            var configuration = configBuilder.Build();
            return configuration["ConnectionStrings:DefaultConnection"];
        }

        public static CredentialsModel GetUserCredentials()
        {
            var configFilePath = Path.Combine(AppContext.BaseDirectory, "config.json");
            if (!File.Exists(configFilePath))
                throw new FileNotFoundException($"Config file not found at: {configFilePath}");

            var configuration = new ConfigurationBuilder()
                .SetBasePath(AppContext.BaseDirectory)
                .AddJsonFile("config.json", optional: false, reloadOnChange: true)
                .Build();

            var username = configuration["LoginUser:UserName"];
            var password = configuration["LoginUser:PassWord"];

            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
                throw new Exception("LoginUser:UserName and LoginUser:PassWord must be set in config.json.");

            return new CredentialsModel
            {
                Username = username,
                Password = password
            };
        }
    }
}
