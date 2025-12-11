import { db } from "../../config/db";
import { UserTable } from "../../db/schema";
import { LoginInput, RegisterInput } from "../../types/tupes";
import { sendEmail } from "../../utils/email";
import { generateOtp } from "../../utils/generateOtp";
import bcrypt from "bcryptjs";
export const authService = {
  register: async (body: RegisterInput) => {
    const { email, password, name } = body;

    const existingUser = await db.query.UserTable.findFirst({
      where: (table, { eq }) => eq(table.email, email),
    });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 3 * 60 * 1000);

    const [newUser] = await db
      .insert(UserTable)
      .values({
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpiry,
      })
      .returning();
    try {
      await sendEmail(
        email,
        "Verify your email",
        `<h1>Hello ${name} 👋</h1>
         <p>Verification code:</p>
         <h2 style="color: blue;">${otp}</h2>
         <p>Valid for 3 minutes only.</p>`
      );
    } catch (error) {
      console.error("Email sending failed but user created.");
    }
    const { password: _, otp: _otp, ...userSafeData } = newUser;
    return userSafeData;
  },
  login: async (body: LoginInput) => {},
};
