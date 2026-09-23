import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const SESSION_COOKIE = "bataglia_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 horas, de sobra para una demo

function secret() {
  return process.env.AUTH_SECRET ?? "bataglia-demo-secret-dev-only";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function createToken(email: string) {
  const emailB64 = Buffer.from(email, "utf8").toString("base64url");
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `${emailB64}.${expires}`;
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string): { email: string } | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [emailB64, expiresStr, signature] = parts;
  const payload = `${emailB64}.${expiresStr}`;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Date.now() > Number(expiresStr)) return null;
  return { email: Buffer.from(emailB64, "base64url").toString("utf8") };
}

export async function login(
  email: string,
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) return { ok: false, error: "Usuario o contraseña incorrectos." };

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return { ok: false, error: "Usuario o contraseña incorrectos." };

  const jar = await cookies();
  jar.set(SESSION_COOKIE, createToken(user.email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });

  return { ok: true };
}

export async function logout() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<{ email: string } | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireSession(): Promise<{ email: string }> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}
