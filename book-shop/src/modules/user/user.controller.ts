import { Context } from "hono";
import { profileService } from "./user.service";
import { uploadToCloudinary } from "../../utils/cloudinary";

export const updateProfile = async (c: Context) => {
  try {
    const user = c.get("jwtPayload");
    const body = await c.req.parseBody();
    const name = body['name'] as string;
    const imageFile = body['image'] as File | undefined;
    let imageUrl = undefined;
    if (imageFile && imageFile instanceof File) {
        imageUrl = await uploadToCloudinary(imageFile, 'book-shop/profiles');
    }
    const updateData: any = {};
    if (name) updateData.name = name;
    if (imageUrl) updateData.image = imageUrl;
    if (Object.keys(updateData).length === 0) {
        return c.json({ message: "No changes provided" }, 400);
    }
    const result = await profileService.updateProfile(user.id, updateData);
    return c.json({ success: true, ...result });
  } catch (error: any) {
    console.error(error);
    return c.json({ success: false, message: error.message }, 400);
  }
};
export const getProfile = async (c: Context) => {
  try {
    const user = c.get("jwtPayload");
    const result = await profileService.getProfile(user.id);
    return c.json({ success: true, ...result });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
};
export const updatePassword = async (c: Context) => {
  try {
    const user = c.get("jwtPayload");
    const body = await c.req.json();
    const result = await profileService.updatePassword(user.id, body);
    return c.json({ success: true, ...result });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 400);
  }
};
