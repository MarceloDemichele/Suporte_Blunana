import dotenv from "dotenv";

const env = process.env.APP_ENV || "prod";

dotenv.config({
    path: `.env.${env}`,
    quiet: true
});

console.log(`Ambiente carregado: ${env}`);
