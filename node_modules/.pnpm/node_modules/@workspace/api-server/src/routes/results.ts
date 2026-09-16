import { Router } from "express";
import { eq, count } from "drizzle-orm";
import { db, candidatesTable, studentsTable, electionSettingsTable } from "@workspace/db";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const candidates = await db.select().from(candidatesTable).orderBy(candidatesTable.voteCount);

    const headBoyCandidates = candidates.filter((c) => c.role === "head_boy");
    const headGirlCandidates = candidates.filter((c) => c.role === "head_girl");

    const totalHeadBoyVotes = headBoyCandidates.reduce((sum, c) => sum + c.voteCount, 0);
    const totalHeadGirlVotes = headGirlCandidates.reduce((sum, c) => sum + c.voteCount, 0);

    const [settings] = await db.select().from(electionSettingsTable).limit(1);
    const isFinalized = settings ? !settings.isVotingOpen : false;

    const formatCandidateResult = (c: typeof candidatesTable.$inferSelect, totalVotes: number) => ({
      candidate: {
        id: c.id,
        name: c.name,
        role: c.role,
        className: c.className,
        photoUrl: c.photoUrl,
        bio: c.bio,
        promises: c.promises ?? [],
        voteCount: c.voteCount,
        color: c.color ?? null,
      },
      voteCount: c.voteCount,
      percentage: totalVotes > 0 ? Math.round((c.voteCount / totalVotes) * 100 * 10) / 10 : 0,
    });

    const headBoyResults = headBoyCandidates
      .map((c) => formatCandidateResult(c, totalHeadBoyVotes))
      .sort((a, b) => b.voteCount - a.voteCount);

    const headGirlResults = headGirlCandidates
      .map((c) => formatCandidateResult(c, totalHeadGirlVotes))
      .sort((a, b) => b.voteCount - a.voteCount);

    const totalVotesCount = await db.select({ count: count() }).from(studentsTable).where(eq(studentsTable.hasVoted, true));
    const totalVotes = totalVotesCount[0]?.count ?? 0;

    const winner = isFinalized
      ? {
          headBoy: headBoyResults[0]?.candidate ?? null,
          headGirl: headGirlResults[0]?.candidate ?? null,
        }
      : undefined;

    return res.json({
      headBoy: headBoyResults,
      headGirl: headGirlResults,
      totalVotes,
      isFinalized,
      winner,
    });
  } catch (err) {
    logger.error({ err }, "Error fetching results");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/summary", async (_req, res) => {
  try {
    const [settings] = await db.select().from(electionSettingsTable).limit(1);
    const totalStudentsResult = await db.select({ count: count() }).from(studentsTable);
    const totalVotedResult = await db.select({ count: count() }).from(studentsTable).where(eq(studentsTable.hasVoted, true));

    const totalStudents = totalStudentsResult[0]?.count ?? 0;
    const totalVoted = totalVotedResult[0]?.count ?? 0;
    const turnoutPercentage = totalStudents > 0 ? Math.round((totalVoted / totalStudents) * 100 * 10) / 10 : 0;

    return res.json({
      totalStudents,
      totalVoted,
      turnoutPercentage,
      isVotingOpen: settings?.isVotingOpen ?? false,
      electionName: settings?.electionName ?? "Student Leader Election 2026",
      electionEndDate: settings?.electionEndDate ? settings.electionEndDate.toISOString() : null,
    });
  } catch (err) {
    logger.error({ err }, "Error fetching results summary");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
