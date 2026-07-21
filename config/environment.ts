export type AppEnvironment = "dev" | "hml" | "prod";

export const currentEnvironment = (process.env.APP_ENV || "prod") as AppEnvironment;

export const environment = {
    name: currentEnvironment,
    url: process.env.APP_URL,
    user: process.env.APP_USER,
    password: process.env.APP_PASSWORD,
    mfaSecret: process.env.MFA_SECRET
};
