import { pgTable, serial, text, varchar, integer, numeric, timestamp, json } from 'drizzle-orm/pg-core';
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: integer("is_admin").default(0), 
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const movies = pgTable(
  "movies",
  {
    index: integer("index"), 
    budget: numeric("budget"), 
    genres: json("genres"), 
    homepage: text("homepage"), 
    id: serial("id").primaryKey(),
    keywords: json("keywords"), 
    originalLanguage: text("original_language"), 
    originalTitle: text("original_title"), 
    overview: text("overview"), 
    popularity: numeric("popularity"),
    productionCompanies: json("production_companies"), 
    productionCountries: json("production_countries"),
    releaseDate: timestamp("release_date"),
    revenue: numeric("revenue"), 
    runtime: numeric("runtime"), 
    spokenLanguages: json("spoken_languages"), 
    status: text("status"), 
    tagline: text("tagline"), 
    title: text("title"), 
    voteAverage: integer("vote_average"), 
    voteCount: integer("vote_count"), 
    cast: json("cast"),
    crew: json("crew"), 
    director: varchar("director", { length: 255 }), 
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (movies) => ({
    userIdFK: relations(movies.userId, "userIdFK"),
  })
);




export const comments = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), 
    movieId: integer("movie_id")
      .notNull()
      .references(() => movies.id, { onDelete: "cascade" }), 
    commentText: text("comment_text").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (comments) => ({
    userIdFK: relations(comments.userId, "userIdFK"),
  })
);

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export type InsertMovie = typeof movies.$inferInsert;
export type SelectMovie = typeof movies.$inferSelect;

export type InsertComment = typeof comments.$inferInsert;
export type SelectComment = typeof comments.$inferSelect;
