import jwt, { SignOptions } from "jsonwebtoken";
import { JWTPayload } from "../types/express";

export function signJwt(
  payload: JWTPayload,
  expiresIn: SignOptions["expiresIn"] = "7d"
): string {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

export function verifyJwt<T = JWTPayload>(token: string): T {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET) as T;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}
