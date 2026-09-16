import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, studentsTable, electionSettingsTable } from "@workspace/db";
import { StudentLoginBody, AdminLoginBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router = Router();

router.post("/student-login", async (req, res) => {
  const parsed = StudentLoginBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { studentId } = parsed.data;

  try {
    const [student] = await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.studentId, studentId))
      .limit(1);

    if (!student) {
      return res.status(401).json({ error: "Student ID not found. Please check your ID and try again." });
    }

    const token = Buffer.from(`student:${student.id}:${Date.now()}`).toString("base64");

    return res.json({
      student: {
        id: student.id,
        studentId: student.studentId,
        name: student.name,
        className: student.className,
        hasVoted: student.hasVoted,
        votedAt: student.votedAt ? student.votedAt.toISOString() : null,
      },
      token,
      hasVoted: student.hasVoted,
    });
  } catch (err) {
    logger.error({ err }, "Error during student login");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin-login", async (req, res) => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { username, password } = parsed.data;

  if (username === "admin" && password === "election2026") {
    const token = Buffer.from(`admin:${Date.now()}`).toString("base64");
    return res.json({ token });
  }

  return res.status(401).json({ error: "Invalid admin credentials" });
});

export default router;
