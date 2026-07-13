import { generateSync } from "otplib";

export function gerarCodigoMFA(secret: string): string {
  if (!secret) {
    throw new Error("MFA_SECRET não configurado.");
  }

  const normalizedSecret = secret.startsWith("otpauth://")
    ? new URL(secret).searchParams.get("secret")
    : secret;

  if (!normalizedSecret) {
    throw new Error("MFA_SECRET invalido.");
  }

  return generateSync({ secret: normalizedSecret.replace(/\s/g, "") });
}
