import { Request, Response } from "express";

export function listSources(req: Request, res: Response) {
  return res.json({
    sources: [
      ".memory",
      "knowledge",
      "docs",
      "index",
      "tickets",
      "support",
      "outputs",
      "engenharia-reversa"
    ]
  });
}

export function search(req: Request, res: Response) {
  return res.json({
    ok: true,
    query: req.body.query
  });
}