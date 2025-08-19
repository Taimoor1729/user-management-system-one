// eslint-disable-next-line @typescript-eslint/no-unused-vars
import express from 'express';

export interface JWTPayload {
  sub: string;
  email: string;
}

export interface AuthUser {
  _id: string;
  email: string;
  name: string;
  role?: {
    _id: string;
    name: string;
    permissions: string[];
  } | null;
  overrides: string[];
  effectivePermissions: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
