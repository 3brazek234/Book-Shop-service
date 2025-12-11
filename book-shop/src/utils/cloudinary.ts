// src/utils/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

// 1. إعداد الاتصال
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * دالة لرفع ملف (Buffer) إلى Cloudinary
 * @param fileBlob الملف اللي جاي من Hono
 * @param folder اسم الفولدر على Cloudinary (اختياري)
 */
export const uploadToCloudinary = async (fileBlob: Blob, folder: string = 'book-shop') => {
  try {
    // تحويل الـ Blob إلى Buffer عشان Node.js يفهمه
    const arrayBuffer = await fileBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder, 
            resource_type: 'auto', 
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

    return result.secure_url as string;

  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("Image upload failed");
  }
};