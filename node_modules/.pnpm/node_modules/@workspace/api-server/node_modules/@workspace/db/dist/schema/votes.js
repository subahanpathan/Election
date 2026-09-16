import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { studentsTable } from "./students";
import { candidatesTable } from "./candidates";
export const votesTable = pgTable("votes", {
    id: serial("id").primaryKey(),
    studentId: integer("student_id").notNull().references(() => studentsTable.id),
    headBoyCandidateId: integer("head_boy_candidate_id").notNull().references(() => candidatesTable.id),
    headGirlCandidateId: integer("head_girl_candidate_id").notNull().references(() => candidatesTable.id),
    votedAt: timestamp("voted_at").notNull().defaultNow(),
});
