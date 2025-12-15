import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Client } from "pg"; 

const runMigration = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  const db = drizzle(client);
  await migrate(db, { migrationsFolder: "drizzle" });
  await client.end();
};
runMigration().catch((err) => {
  process.exit(1);
});