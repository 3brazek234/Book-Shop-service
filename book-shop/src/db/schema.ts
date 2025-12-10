import { pgTable, uuid, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const UserTable = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password").notNull(),
    otp: varchar("otp", { length: 6 }),
    isActivated : boolean("is_activated").default(false),
    otpExpiry: timestamp("otp_expiry", { mode: "date" }),
    role: varchar("role", { length: 20 }).default("user").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
});