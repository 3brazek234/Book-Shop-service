import { eq } from "drizzle-orm";
import { db } from "../../config/db";
import { UserTable } from "../../db/schema";
import { UpdatePasswordInput, UpdateUserInput } from "./user.schema";
import bcrypt from "bcryptjs";

export const profileService = {
  getProfile: async (userId: string) => {
    const user = await db.query.UserTable.findFirst({
      where: eq(UserTable.id, userId),
      columns: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        image: true,
      },
    });
    return user;
  },
  updateProfile: async (userId: string, data: UpdateUserInput) => {
    const [updatedUser] = await db
      .update(UserTable)
      .set(data)
      .where(eq(UserTable.id, userId))
      .returning({
        id: UserTable.id,
        name: UserTable.name,
        email: UserTable.email,
        image: UserTable.image,
        role: UserTable.role,
        createdAt: UserTable.createdAt,
      });
    return updatedUser;
  },
  updatePassword: async (userId: string, body: UpdatePasswordInput) => {
    const user = await db.query.UserTable.findFirst({
      where: eq(UserTable.id, userId),
    });
    if (!user) {
      throw new Error("Invaild Credintials");
    }
    const isMatch = await bcrypt.compare(body.oldPassword, user.password);
    if (!isMatch) throw new Error("Incorrect old password");
    const hashedPassword = await bcrypt.hash(body.newPassword, 10);
    await db
      .update(UserTable)
      .set({ password: hashedPassword })
      .where(eq(UserTable.id, userId));
    return { message: "Password updated successfully" };
  },
};
