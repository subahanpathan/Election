import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const electionSettingsTable = pgTable("election_settings", {
  id: serial("id").primaryKey(),
  electionName: text("election_name").notNull().default("Student Leader Election 2026"),
  isVotingOpen: boolean("is_voting_open").notNull().default(false),
  electionEndDate: timestamp("election_end_date"),
  schoolName: text("school_name").notNull().default("Greenfield Academy"),
  welcomeMessage: text("welcome_message").notNull().default("Welcome to the Student Leader Election 2026. Your voice matters — cast your vote today!"),
});

export const insertElectionSettingsSchema = createInsertSchema(electionSettingsTable).omit({ id: true });
export type InsertElectionSettings = z.infer<typeof insertElectionSettingsSchema>;
export type ElectionSettings = typeof electionSettingsTable.$inferSelect;
