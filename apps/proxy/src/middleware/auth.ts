import type { Request, Response, NextFunction } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = process.env.API_KEY;

  // Skip auth in development if no API_KEY set
  if (!apiKey) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing authorization header" });
  }

  const token = authHeader.substring(7);

  if (token !== apiKey) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  next();
};
