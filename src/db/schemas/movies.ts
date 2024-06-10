import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const movies = pgTable('movies', {
    id: serial("id").primaryKey(),
  name: text("name").notNull(),
  summary: text("summary").notNull(),
  category: varchar("category", { length: 255 }),
  director: varchar("director", { length: 255 }),
  castMembers: text("cast_members"),
})

export type Movie = typeof movies.$inferSelect