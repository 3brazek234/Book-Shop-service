// src/config/db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from '../db/schema';
import 'dotenv/config';

// 1. تعريف الكلاينت
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

// 2. الدالة دي هنصدرها عشان نناديها في index.ts
export const connectDB = async () => {
  try {
    await client.connect();
    console.log("✅ PostgreSQL Connected Successfully");
  } catch (error) {
    console.error("❌ PostgreSQL Connection Failed:", error);
    process.exit(1); // اقفل البرنامج لو مفيش داتابيز
  }
};

export const db = drizzle(client, { schema });