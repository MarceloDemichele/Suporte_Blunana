"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = exports.currentEnvironment = void 0;
exports.currentEnvironment = (process.env.APP_ENV || "prod");
exports.environment = {
    name: exports.currentEnvironment,
    url: process.env.APP_URL,
    user: process.env.APP_USER,
    password: process.env.APP_PASSWORD,
    mfaSecret: process.env.MFA_SECRET
};
