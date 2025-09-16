import { mysqlTable, varchar, text, datetime, int, serial } from "drizzle-orm/mysql-core";

export const events = mysqlTable("events", {
  id: varchar("id", { length: 16 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  date: datetime("date").notNull(),
  paps: datetime("paps").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  participants: int("participants").notNull().default(0),
  description: text("description"),
});

export const paps = mysqlTable("paps", {
  id: serial("id").primaryKey(),
  eid: varchar("eid", { length: 16 }).notNull().references(() => events.id),
  pxx: varchar("pxx", { length: 10 }).notNull(),
  date: datetime("date").notNull(),
});

export const users = mysqlTable("users", {
  id: varchar("id", { length: 16 }).notNull().primaryKey(),
  pxx: varchar("pxx", { length: 10 }),
});