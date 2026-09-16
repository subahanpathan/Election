import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, electionSettingsTable, studentsTable, votesTable, candidatesTable } from "@workspace/db";
import { UpdateElectionSettingsBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const [settings] = await db.select().from(electionSettingsTable).limit(1);

    if (!settings) {
      const [created] = await db
        .insert(electionSettingsTable)
        .values({})
        .returning();
      return res.json({
        ...created,
        electionEndDate: created.electionEndDate ? created.electionEndDate.toISOString() : null,
      });
    }

    return res.json({
      ...settings,
      electionEndDate: settings.electionEndDate ? settings.electionEndDate.toISOString() : null,
    });
  } catch (err) {
    logger.error({ err }, "Error fetching election settings");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/", async (req, res) => {
  const parsed = UpdateElectionSettingsBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid request body" });

  try {
    const [existing] = await db.select().from(electionSettingsTable).limit(1);

    const updates: Partial<typeof electionSettingsTable.$inferInsert> = {};
    const b = parsed.data;
    if (b.electionName !== undefined) updates.electionName = b.electionName;
    if (b.isVotingOpen !== undefined) updates.isVotingOpen = b.isVotingOpen;
    if (b.electionEndDate !== undefined) {
      updates.electionEndDate = b.electionEndDate ? new Date(b.electionEndDate) : null;
    }
    if (b.schoolName !== undefined) updates.schoolName = b.schoolName;
    if (b.welcomeMessage !== undefined) updates.welcomeMessage = b.welcomeMessage;

    let result;
    if (!existing) {
      const [created] = await db.insert(electionSettingsTable).values({ ...updates }).returning();
      result = created;
    } else {
      const [updated] = await db
        .update(electionSettingsTable)
        .set(updates)
        .where(eq(electionSettingsTable.id, existing.id))
        .returning();
      result = updated;
    }

    return res.json({
      ...result,
      electionEndDate: result.electionEndDate ? result.electionEndDate.toISOString() : null,
    });
  } catch (err) {
    logger.error({ err }, "Error updating election settings");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/reset", async (_req, res) => {
  try {
    await db.delete(votesTable);
    await db.update(studentsTable).set({ hasVoted: false, votedAt: null });
    await db.update(candidatesTable).set({ voteCount: 0 });

    return res.json({ success: true, message: "Election has been reset. All votes have been cleared." });
  } catch (err) {
    logger.error({ err }, "Error resetting election");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
