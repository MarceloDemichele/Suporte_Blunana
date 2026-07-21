"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerarCodigoMFA = gerarCodigoMFA;
async function gerarCodigoMFA(secret) {
    if (!secret) {
        throw new Error("MFA_SECRET não configurado.");
    }
    const normalizedSecret = secret.startsWith("otpauth://")
        ? new URL(secret).searchParams.get("secret")
        : secret;
    if (!normalizedSecret) {
        throw new Error("MFA_SECRET invalido.");
    }
    const { generateSync } = await import("otplib");
    return generateSync({ secret: normalizedSecret.replace(/\s/g, "") });
}
