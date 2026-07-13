import dotenv from "dotenv";

const env = process.env.APP_ENV || "dev";

dotenv.config({
    path: `.env.${env}`,
    quiet: true
});

console.log(`Ambiente carregado: ${env}`);
