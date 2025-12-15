// src/config/db.ts
import { drizzle } from 'drizzle-orm/node-postgres'; // 👈 تأكد إنها node-postgres
import { Pool } from 'pg';
import * as schema from '../db/schema';
import 'dotenv/config'; // 👈 ضروري عشان يحمل المتغيرات هنا

// تأكد إن الرابط موجود
if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is missing in .env file");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // شيلنا SSL عشان انت شغال local، لو رفعت علي سيرفر رجعها
});

// اختبار بسيط عشان نتأكد إن الاتصال شغال أول ما السيرفر يقوم
pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

export const db = drizzle(pool, { schema });