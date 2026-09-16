import { pgTable, serial, text, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const roleEnum = pgEnum("candidate_role", ["head_boy", "head_girl"]);

export const candidatesTable = pgTable("candidates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: roleEnum("role").notNull(),
  className: text("class_name").notNull(),
  photoUrl: text("photo_url").notNull().default(""),
  bio: text("bio").notNull().default(""),
  promises: text("promises").array().notNull().default([]),
  color: text("color"),
  voteCount: integer("vote_count").notNull().default(0),
});

export const insertCandidateSchema = createInsertSchema(candidatesTable).omit({ id: true, voteCount: true });
export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Candidate = typeof candidatesTable.$inferSelect;
