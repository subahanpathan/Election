import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, studentsTable } from "@workspace/db";
import {
  CreateStudentBody,
  UpdateStudentParams,
  UpdateStudentBody,
  DeleteStudentParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/session";
import { hashPassword } from "../lib/password";
import { logger } from "../lib/logger";

const router = Router();

router.use(requireAdmin);

function formatStudent(s: typeof studentsTable.$inferSelect) {
  return {
    id: s.id,
    studentId: s.studentId,
    name: s.name,
    className: s.className,
    hasVoted: s.hasVoted,
    votedAt: s.votedAt ? s.votedAt.toISOString() : null,
  };
}

router.get("/", async (_req, res) => {
  try {
    const students = await db.select().from(studentsTable).orderBy(studentsTable.id);
    return res.json(students.map(formatStudent));
  } catch (err) {
    logger.error({ err }, "Error fetching students");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const parsed = CreateStudentBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid request body" });

  try {
    const password = parsed.data.password ?? parsed.data.studentId;
    const { hash, salt } = hashPassword(password);

    const [created] = await db
      .insert(studentsTable)
      .values({
        studentId: parsed.data.studentId,
        name: parsed.data.name,
        className: parsed.data.className,
        passwordHash: hash,
        passwordSalt: salt,
      })
      .returning();
    return res.status(201).json(formatStudent(created));
  } catch (err) {
    logger.error({ err }, "Error creating student");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  const paramsParsed = UpdateStudentParams.safeParse({ id: Number(req.params.id) });
  if (!paramsParsed.success) return res.status(400).json({ error: "Invalid ID" });

  const bodyParsed = UpdateStudentBody.safeParse(req.body);
  if (!bodyParsed.success) return res.status(400).json({ error: "Invalid request body" });

  try {
    const updates: Partial<typeof studentsTable.$inferInsert> = {};
    const b = bodyParsed.data;
    if (b.studentId !== undefined) updates.studentId = b.studentId;
    if (b.name !== undefined) updates.name = b.name;
    if (b.className !== undefined) updates.className = b.className;
    if (b.password !== undefined) {
      const { hash, salt } = hashPassword(b.password);
      updates.passwordHash = hash;
      updates.passwordSalt = salt;
    }

    const [updated] = await db
      .update(studentsTable)
      .set(updates)
      .where(eq(studentsTable.id, paramsParsed.data.id))
      .returning();

    if (!updated) return res.status(404).json({ error: "Student not found" });
    return res.json(formatStudent(updated));
  } catch (err) {
    logger.error({ err }, "Error updating student");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const parsed = DeleteStudentParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid ID" });

  try {
    await db.delete(studentsTable).where(eq(studentsTable.id, parsed.data.id));
    return res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Error deleting student");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
