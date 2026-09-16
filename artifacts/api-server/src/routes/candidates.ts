import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, candidatesTable } from "@workspace/db";
import {
  CreateCandidateBody,
  UpdateCandidateParams,
  UpdateCandidateBody,
  DeleteCandidateParams,
  GetCandidateParams,
} from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router = Router();

function formatCandidate(c: typeof candidatesTable.$inferSelect) {
  return {
    id: c.id,
    name: c.name,
    role: c.role,
    className: c.className,
    photoUrl: c.photoUrl,
    bio: c.bio,
    promises: c.promises ?? [],
    voteCount: c.voteCount,
    color: c.color ?? null,
  };
}

router.get("/", async (_req, res) => {
  try {
    const candidates = await db.select().from(candidatesTable).orderBy(candidatesTable.id);
    return res.json(candidates.map(formatCandidate));
  } catch (err) {
    logger.error({ err }, "Error fetching candidates");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const parsed = GetCandidateParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid ID" });

  try {
    const [candidate] = await db
      .select()
      .from(candidatesTable)
      .where(eq(candidatesTable.id, parsed.data.id))
      .limit(1);

    if (!candidate) return res.status(404).json({ error: "Candidate not found" });
    return res.json(formatCandidate(candidate));
  } catch (err) {
    logger.error({ err }, "Error fetching candidate");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const parsed = CreateCandidateBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid request body" });

  try {
    const [created] = await db
      .insert(candidatesTable)
      .values({
        name: parsed.data.name,
        role: parsed.data.role,
        className: parsed.data.className,
        photoUrl: parsed.data.photoUrl ?? "",
        bio: parsed.data.bio,
        promises: parsed.data.promises ?? [],
        color: parsed.data.color ?? null,
      })
      .returning();
    return res.status(201).json(formatCandidate(created));
  } catch (err) {
    logger.error({ err }, "Error creating candidate");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  const paramsParsed = UpdateCandidateParams.safeParse({ id: Number(req.params.id) });
  if (!paramsParsed.success) return res.status(400).json({ error: "Invalid ID" });

  const bodyParsed = UpdateCandidateBody.safeParse(req.body);
  if (!bodyParsed.success) return res.status(400).json({ error: "Invalid request body" });

  try {
    const updates: Partial<typeof candidatesTable.$inferInsert> = {};
    const b = bodyParsed.data;
    if (b.name !== undefined) updates.name = b.name;
    if (b.role !== undefined) updates.role = b.role;
    if (b.className !== undefined) updates.className = b.className;
    if (b.photoUrl !== undefined) updates.photoUrl = b.photoUrl;
    if (b.bio !== undefined) updates.bio = b.bio;
    if (b.promises !== undefined) updates.promises = b.promises;
    if (b.color !== undefined) updates.color = b.color;

    const [updated] = await db
      .update(candidatesTable)
      .set(updates)
      .where(eq(candidatesTable.id, paramsParsed.data.id))
      .returning();

    if (!updated) return res.status(404).json({ error: "Candidate not found" });
    return res.json(formatCandidate(updated));
  } catch (err) {
    logger.error({ err }, "Error updating candidate");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const parsed = DeleteCandidateParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid ID" });

  try {
    await db.delete(candidatesTable).where(eq(candidatesTable.id, parsed.data.id));
    return res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Error deleting candidate");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
