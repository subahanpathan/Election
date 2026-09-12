import { createHmac, timingSafeEqual } from "node:crypto";
import type { Request, Response, NextFunction } from "express";

export type SessionRole = "student" | "admin";

interface SessionPayload {
  role: SessionRole;
  id: number;
}

const STUDENT_COOKIE = "student_session";
const ADMIN_COOKIE = "admin_session";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

function secret(): string {
  const s = process.env["SESSION_SECRET"];
  if (!s) {
    throw new Error(
      "SESSION_SECRET environment variable is required. " +
        "Set it in the .env file at the project root before starting the server.",
    );
  }
  return s;
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function stringify(payload: SessionPayload): string {
  return JSON.stringify(payload);
}

function parse(raw: string): SessionPayload | null {
  const dot = raw.lastIndexOf(".");
  if (dot === -1) return null;
  const body = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const parsed = JSON.parse(body) as SessionPayload;
    if (parsed.role !== "student" && parsed.role !== "admin") return null;
    if (typeof parsed.id !== "number" || !Number.isInteger(parsed.id)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function createSession(payload: SessionPayload): string {
  const body = stringify(payload);
  return `${body}.${sign(body)}`;
}

export function setStudentSessionCookie(res: Response, payload: SessionPayload): void {
  res.cookie(STUDENT_COOKIE, createSession(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env["NODE_ENV"] === "production",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export function setAdminSessionCookie(res: Response, payload: SessionPayload): void {
  res.cookie(ADMIN_COOKIE, createSession(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env["NODE_ENV"] === "production",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export function clearStudentSessionCookie(res: Response): void {
  res.clearCookie(STUDENT_COOKIE, { path: "/" });
}

export function clearAdminSessionCookie(res: Response): void {
  res.clearCookie(ADMIN_COOKIE, { path: "/" });
}

function readSession(req: Request, cookieName: string): SessionPayload | null {
  const raw = req.cookies?.[cookieName];
  if (!raw || typeof raw !== "string") return null;
  return parse(raw);
}

export function getStudentSession(req: Request): SessionPayload | null {
  return readSession(req, STUDENT_COOKIE);
}

export function getAdminSession(req: Request): SessionPayload | null {
  return readSession(req, ADMIN_COOKIE);
}

export function requireStudent(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const session = getStudentSession(req);
  if (!session) {
    res.status(401).json({ error: "Authentication required. Please log in as a student." });
    return;
  }
  req.studentSession = { role: "student", id: session.id };
  next();
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const session = getAdminSession(req);
  if (!session) {
    res.status(401).json({ error: "Authentication required. Please log in as an administrator." });
    return;
  }
  req.adminSession = { role: "admin", id: session.id };
  next();
}
