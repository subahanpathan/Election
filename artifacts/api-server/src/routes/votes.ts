import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, studentsTable, votesTable, candidatesTable } from "@workspace/db";
import { CastVoteBody, CheckVoteStatusParams } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router = Router();

router.post("/", async (req, res) => {
  const parsed = CastVoteBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid request body" });

  const { studentId, headBoyCandidateId, headGirlCandidateId } = parsed.data;

  try {
    const [student] = await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.id, studentId))
      .limit(1);

    if (!student) return res.status(404).json({ error: "Student not found" });
    if (student.hasVoted) {
      return res.status(409).json({ error: "You have already voted in this election." });
    }

    const [settings] = await db.select().from(
      (await import("@workspace/db")).electionSettingsTable
    ).limit(1);

    if (settings && !settings.isVotingOpen) {
      return res.status(403).json({ error: "Voting is currently closed." });
    }

    await db.insert(votesTable).values({
      studentId,
      headBoyCandidateId,
      headGirlCandidateId,
    });

    const now = new Date();
    await db
      .update(studentsTable)
      .set({ hasVoted: true, votedAt: now })
      .where(eq(studentsTable.id, studentId));

    await db
      .update(candidatesTable)
      .set({ voteCount: (await db.select({ voteCount: candidatesTable.voteCount }).from(candidatesTable).where(eq(candidatesTable.id, headBoyCandidateId)))[0].voteCount + 1 })
      .where(eq(candidatesTable.id, headBoyCandidateId));

    await db
      .update(candidatesTable)
      .set({ voteCount: (await db.select({ voteCount: candidatesTable.voteCount }).from(candidatesTable).where(eq(candidatesTable.id, headGirlCandidateId)))[0].voteCount + 1 })
      .where(eq(candidatesTable.id, headGirlCandidateId));

    return res.status(201).json({ success: true, message: "Vote cast successfully! Thank you for participating." });
  } catch (err) {
    logger.error({ err }, "Error casting vote");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/check/:studentId", async (req, res) => {
  const parsed = CheckVoteStatusParams.safeParse({ studentId: Number(req.params.studentId) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid student ID" });

  try {
    const [student] = await db
      .select({ hasVoted: studentsTable.hasVoted, votedAt: studentsTable.votedAt })
      .from(studentsTable)
      .where(eq(studentsTable.id, parsed.data.studentId))
      .limit(1);

    if (!student) return res.status(404).json({ error: "Student not found" });

    return res.json({
      hasVoted: student.hasVoted,
      votedAt: student.votedAt ? student.votedAt.toISOString() : null,
    });
  } catch (err) {
    logger.error({ err }, "Error checking vote status");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
