import { db } from "../../config/db";
import { UserTable } from "../../db/schema";
import { LoginInput, RegisterInput, VerifyOtpInput } from "../../types/tupes";
import { sendEmail } from "../../utils/email";
import { generateOtp } from "../../utils/generateOtp";
import { eq } from "drizzle-orm";
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
  verifyOtp: async (body: VerifyOtpInput) => {
    const { email, otp } = body;
    const user = await db.query.UserTable.findFirst({
      where: (table, { eq }) => eq(table.email, email),
    });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.isActivated) {
      throw new Error("User is already verified");
    }
    if (user.otp !== otp) {
      throw new Error("Invalid OTP");
    }
    if (!user.otpExpiry || new Date() > user.otpExpiry) {
      throw new Error("OTP has expired");
    }
    await db
      .update(UserTable)
      .set({
        isActivated: true,
        otp: null,
        otpExpiry: null,
      })
      .where(eq(UserTable.id, user.id));
    return { message: "Account verified successfully" };
  },
  resendOtp: async (input: VerifyOtpInput) => {
    // هنستخدم نفس الـ Input بس هناخد الإيميل بس
    const { email } = input;

    const user = await db.query.UserTable.findFirst({
      where: (table, { eq }) => eq(table.email, email),
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.isActivated) {
      throw new Error("Account is already verified");
    }

    const newOtp = generateOtp();
    const newOtpExpiry = new Date(Date.now() + 3 * 60 * 1000);

    await db
      .update(UserTable)
      .set({
        otp: newOtp,
        otpExpiry: newOtpExpiry,
      })
      .where(eq(UserTable.id, user.id));

    try {
      await sendEmail(
        email,
        "إعادة إرسال كود التفعيل",
        `<h1>أهلاً بك مرة أخرى يا ${user.name} 👋</h1>
         <p>كود التفعيل الجديد هو:</p>
         <h2 style="color: blue;">${newOtp}</h2>
         <p>الكود صالح لمدة 3 دقائق فقط.</p>`
      );
    } catch (error) {
      console.error("Email sending failed:", error);
    }

    return { message: "OTP resent successfully" };
  },
  login: async (body: LoginInput) => {},
};
