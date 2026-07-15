"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const env = process.env.APP_ENV || "prod";
dotenv_1.default.config({
    path: `.env.${env}`,
    quiet: true
});
console.log(`Ambiente carregado: ${env}`);
