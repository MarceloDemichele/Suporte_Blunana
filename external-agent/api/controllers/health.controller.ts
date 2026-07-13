import { Request, Response } from "express";

export function health(req: Request, res: Response) {
  return res.json({
    status: "ok",
    service: "external-agent-api",
    timestamp: new Date().toISOString()
  });
}