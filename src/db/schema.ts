import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  firstname: text().notNull(),
  lastname: text().notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
  avatar: text(),
});
