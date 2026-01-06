import { Request, Response } from "express";
import { BotSession } from "../bot/session";

export const getStatus = (req: Request, res: Response) => {
  const session = BotSession.getInstance();
  
  res.status(200).json({
    status: session.getStatus(),
    qrCode: session.getQrCode()
  });
};
