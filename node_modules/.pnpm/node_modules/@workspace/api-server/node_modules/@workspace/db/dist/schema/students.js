import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export const studentsTable = pgTable("students", {
    id: serial("id").primaryKey(),
    studentId: text("student_id").notNull().unique(),
    name: text("name").notNull(),
    className: text("class_name").notNull(),
    hasVoted: boolean("has_voted").notNull().default(false),
    votedAt: timestamp("voted_at"),
});
export const insertStudentSchema = createInsertSchema(studentsTable).omit({ id: true, hasVoted: true, votedAt: true });
