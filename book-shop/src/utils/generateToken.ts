import { sign } from "hono/jwt";
import "dotenv/config";

export const generateToken = async (id: string) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("❌ JWT_SECRET is not defined in .env file");
  }

  const payload = {
    id,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  return await sign(payload, secret);
};
