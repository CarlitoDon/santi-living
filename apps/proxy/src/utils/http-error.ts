import type { Response } from "express";

export type HttpErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "BAD_REQUEST"
  | "NOT_FOUND"
  | "SERVICE_UNAVAILABLE"
  | "INTERNAL_ERROR";

export const sendHttpError = (
  res: Response,
  status: number,
  code: HttpErrorCode,
  message: string,
) => {
  return res.status(status).json({
    success: false,
    error: {
      code,
      message,
    },
  });
};
