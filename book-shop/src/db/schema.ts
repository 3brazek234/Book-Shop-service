import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  decimal,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
export const UserTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  otp: varchar("otp", { length: 6 }),
  isActivated: boolean("is_activated").default(false),
  otpExpiry: timestamp("otp_expiry", { mode: "date" }),
  role: varchar("role", { length: 20 }).default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const AuthorTable = pgTable("authors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  bio: text("bio"),
});

export const CategoryTable = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
});
export const TagTable = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull().unique(),
});
export const BookTable = pgTable("books", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  userId: uuid("user_id")
    .references(() => UserTable.id)
    .notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  coverImage: text("cover_image"),
  publicationYear: integer("publication_year"),
  authorId: uuid("author_id")
    .references(() => AuthorTable.id)
    .notNull(),
  categoryId: uuid("category_id")
    .references(() => CategoryTable.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const BookTagsTable = pgTable(
  "book_tags",
  {
    bookId: uuid("book_id")
      .references(() => BookTable.id)
      .notNull(),
    tagId: uuid("tag_id")
      .references(() => TagTable.id)
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.bookId, t.tagId] }),
  })
);
export const BookRelations = relations(BookTable, ({ one, many }) => ({
  author: one(AuthorTable, {
    fields: [BookTable.authorId],
    references: [AuthorTable.id],
  }),
  category: one(CategoryTable, {
    fields: [BookTable.categoryId],
    references: [CategoryTable.id],
  }),
  user: one(UserTable, {
    fields: [BookTable.userId],
    references: [UserTable.id],
  }),
  tags: many(BookTagsTable),
}));

export const AuthorRelations = relations(AuthorTable, ({ many }) => ({
  books: many(BookTable),
}));

export const CategoryRelations = relations(CategoryTable, ({ many }) => ({
  books: many(BookTable),
}));

export const TagRelations = relations(TagTable, ({ many }) => ({
  books: many(BookTagsTable),
}));

// علاقات الجدول الوسيط (بيربط الاتنين ببعض)
export const BookTagsRelations = relations(BookTagsTable, ({ one }) => ({
  book: one(BookTable, {
    fields: [BookTagsTable.bookId],
    references: [BookTable.id],
  }),
  tag: one(TagTable, {
    fields: [BookTagsTable.tagId],
    references: [TagTable.id],
  }),
}));
