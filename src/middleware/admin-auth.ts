import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      podsyAdmin?: { email: string };
    }
  }
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const adminSecret = req.headers["x-admin-secret"] || req.cookies?.admin_secret;
  
  if (!process.env.ADMIN_SECRET) {
    console.error("ADMIN_SECRET is not set in environment variables!");
    return res.status(500).json({ error: "Server misconfigured" });
  }

  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: "Unauthorized. Invalid admin secret." });
  }

  req.podsyAdmin = { email: "admin@podsy.pro" };
  next();
}
