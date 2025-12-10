import { db } from "../../config/db";
import { UserTable } from "../../db/schema";
import { LoginInput, RegisterInput } from "../../types/tupes";
import { generateOtp } from "../../utils/generateOtp";
export const authService = {
  egister: async (body: RegisterInput) => {
    const { email, password, name } = body;
    const user = await db.query.UserTable.findFirst({
      where: (table, { eq }) => eq(table.email, email),
    });

    if (user) {
      throw new Error("Email already exists");
    }
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 3 * 60 * 1000);
    const newUser = await db.insert(UserTable).values({
      name,
      email,
      password,
      otp,
      otpExpiry,
    });
    return newUser;
  },
  login: async (body: LoginInput) => {},
};
