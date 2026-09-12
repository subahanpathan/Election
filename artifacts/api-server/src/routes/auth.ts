import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, studentsTable, adminsTable } from "@workspace/db";
import { StudentLoginBody, AdminLoginBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";
import { hashPassword, verifyPassword } from "../lib/password";
import {
  setStudentSessionCookie,
  clearStudentSessionCookie,
  setAdminSessionCookie,
  clearAdminSessionCookie,
  getAdminSession,
  requireStudent,
} from "../lib/session";

const router = Router();

router.get("/student/me", requireStudent, async (req, res) => {
  try {
    const session = req.studentSession!;
    const [student] = await db
      .select({
        id: studentsTable.id,
        studentId: studentsTable.studentId,
        name: studentsTable.name,
        className: studentsTable.className,
        hasVoted: studentsTable.hasVoted,
        votedAt: studentsTable.votedAt,
      })
      .from(studentsTable)
      .where(eq(studentsTable.id, session.id))
      .limit(1);

    if (!student) {
      clearStudentSessionCookie(res);
      return res.status(401).json({ error: "Session is no longer valid." });
    }

    return res.json({
      id: student.id,
      studentId: student.studentId,
      name: student.name,
      className: student.className,
      hasVoted: student.hasVoted,
      votedAt: student.votedAt ? student.votedAt.toISOString() : null,
    });
  } catch (err) {
    logger.error({ err }, "Error fetching student session");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/student/login", async (req, res) => {
  const parsed = StudentLoginBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid request body" });
  }

  const { studentId, password } = parsed.data;

  try {
    const [student] = await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.studentId, studentId))
      .limit(1);

    if (!student || !verifyPassword(password, student.passwordHash, student.passwordSalt)) {
      return res.status(401).json({ error: "Invalid student ID or password." });
    }

    setStudentSessionCookie(res, { role: "student", id: student.id });

    return res.json({
      id: student.id,
      studentId: student.studentId,
      name: student.name,
      className: student.className,
      hasVoted: student.hasVoted,
      votedAt: student.votedAt ? student.votedAt.toISOString() : null,
    });
  } catch (err) {
    logger.error({ err }, "Error during student login");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/student/logout", (_req, res) => {
  clearStudentSessionCookie(res);
  return res.json({ success: true, message: "Logged out successfully." });
});

router.get("/admin/me", async (req, res) => {
  const session = getAdminSession(req);
  if (!session) return res.status(401).json({ error: "Not authenticated." });

  try {
    const [admin] = await db
      .select({ id: adminsTable.id, username: adminsTable.username, name: adminsTable.name })
      .from(adminsTable)
      .where(eq(adminsTable.id, session.id))
      .limit(1);

    if (!admin) {
      clearAdminSessionCookie(res);
      return res.status(401).json({ error: "Session is no longer valid." });
    }

    return res.json(admin);
  } catch (err) {
    logger.error({ err }, "Error fetching admin session");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/login", async (req, res) => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid request body" });
  }

  const { username, password } = parsed.data;

  try {
    await ensureDefaultAdmin();

    const [admin] = await db
      .select()
      .from(adminsTable)
      .where(eq(adminsTable.username, username))
      .limit(1);

    if (!admin || !verifyPassword(password, admin.passwordHash, admin.passwordSalt)) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    setAdminSessionCookie(res, { role: "admin", id: admin.id });

    return res.json({ id: admin.id, username: admin.username, name: admin.name });
  } catch (err) {
    logger.error({ err }, "Error during admin login");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/logout", (_req, res) => {
  clearAdminSessionCookie(res);
  return res.json({ success: true, message: "Logged out successfully." });
});

export async function ensureDefaultAdmin(): Promise<void> {
  try {
    const [existing] = await db.select({ id: adminsTable.id }).from(adminsTable).limit(1);
    if (existing) return;

    const envUsername = process.env["ADMIN_USERNAME"] ?? "admin";
    const envPassword = process.env["ADMIN_PASSWORD"] ?? "admin123";

    if (!process.env["ADMIN_USERNAME"] || !process.env["ADMIN_PASSWORD"]) {
      logger.warn(
        "ADMIN_USERNAME or ADMIN_PASSWORD not set — using insecure defaults (admin / admin123). " +
          "Set these environment variables in the .env file and restart the server.",
      );
    }

    const { hash, salt } = hashPassword(envPassword);

    await db.insert(adminsTable).values({
      username: envUsername,
      name: "Administrator",
      passwordHash: hash,
      passwordSalt: salt,
    });

    logger.info(`Default admin account created (username=${envUsername}).`);
  } catch (err) {
    logger.error({ err }, "Error ensuring default admin");
  }
}

export default router;
