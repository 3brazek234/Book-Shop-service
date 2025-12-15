import "dotenv/config";
import { db } from "../config/db";
import { BookTable, AuthorTable, CategoryTable, UserTable } from "./schema"; // 👈 تأكد من استيراد UserTable
export const sampleBooks = [
  {
    userId:"81ed403f-9d47-42de-9961-f221884182f8",
    title: "The Midnight Library",
    categoryId: "216ed56a-f54a-4769-b794-e44ab25dcc09",
    authorId: "0c033210-a10d-4bc4-8274-b6b27e70462e",
    description:
      "A dazzling novel about all the choices that go into a life well lived, The Midnight Library tells the story of Nora Seed as she finds herself between life and death.",
    cover: "https://m.media-amazon.com/images/I/81J6APjwxlL.jpg",
  },
  {
    userId:"81ed403f-9d47-42de-9961-f221884182f8",
    title: "Atomic Habits",
    categoryId: "216ed56a-f54a-4769-b794-e44ab25dcc09",
    authorId: "0c033210-a10d-4bc4-8274-b6b27e70462e",
    description:
      "A revolutionary guide to making good habits, breaking bad ones, and getting 1% better every day.",

    cover: "https://m.media-amazon.com/images/I/81F90H7hnML.jpg",
  },
  {
    userId:"81ed403f-9d47-42de-9961-f221884182f8",
    title: "You Don't Know JS: Scope & Closures",
    categoryId: "216ed56a-f54a-4769-b794-e44ab25dcc09",
    authorId: "0c033210-a10d-4bc4-8274-b6b27e70462e",

    description:
      "An essential guide to understanding the core mechanisms of JavaScript, focusing on scope and closures.",
    color: "#f8e036",
    cover:
      "https://m.media-amazon.com/images/I/7186YfjgHHL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    
    userId:"81ed403f-9d47-42de-9961-f221884182f8",
    title: "The Alchemist",
    categoryId: "216ed56a-f54a-4769-b794-e44ab25dcc09",
    authorId: "0c033210-a10d-4bc4-8274-b6b27e70462e",

    description:
      "A magical tale of Santiago, an Andalusian shepherd boy, who embarks on a journey to find a worldly treasure.",

    cover:
      "https://m.media-amazon.com/images/I/61HAE8zahLL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    
    userId:"81ed403f-9d47-42de-9961-f221884182f8",id: 5,
    title: "Deep Work",
    categoryId: "216ed56a-f54a-4769-b794-e44ab25dcc09",
    authorId: "0c033210-a10d-4bc4-8274-b6b27e70462e",
    description:
      "Rules for focused success in a distracted world, teaching how to cultivate deep focus to achieve peak productivity.",

    cover: "https://m.media-amazon.com/images/I/81JJ7fyyKyS.jpg",
  },
  {
    
    userId:"81ed403f-9d47-42de-9961-f221884182f8",
    title: "Clean Code",
    categoryId: "216ed56a-f54a-4769-b794-e44ab25dcc09",
    authorId: "0c033210-a10d-4bc4-8274-b6b27e70462e",
    description:
      "A handbook of agile software craftsmanship, offering best practices and principles for writing clean and maintainable code.",

    cover:
      "https://m.media-amazon.com/images/I/71T7aD3EOTL._UF1000,1000_QL80_.jpg",
  },
  {
    userId:"81ed403f-9d47-42de-9961-f221884182f8",
    title: "The Pragmatic Programmer",
    categoryId: "216ed56a-f54a-4769-b794-e44ab25dcc09",
    authorId: "0c033210-a10d-4bc4-8274-b6b27e70462e",

    description:
      "A timeless guide for developers to hone their skills and improve their programming practices.",

    cover:
      "https://m.media-amazon.com/images/I/71VStSjZmpL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    userId:"81ed403f-9d47-42de-9961-f221884182f8",
    title: "The Psychology of Money",
    categoryId: "216ed56a-f54a-4769-b794-e44ab25dcc09",
    authorId: "0c033210-a10d-4bc4-8274-b6b27e70462e",

    description:
      "Morgan Housel explores the unique behaviors and mindsets that shape financial success and decision-making.",

    cover:
      "https://m.media-amazon.com/images/I/81Dky+tD+pL._AC_UF1000,1000_QL80_.jpg",
  },
];
const seedBooks = async () => {
  console.log("🌱 Starting seeding process...");

  try {
    // 1. إنشاء مستخدم افتراضي (عشان نربط الكتب بيه)
    console.log("👤 Creating default User...");
    const [defaultUser] = await db.insert(UserTable).values({
        name: "Seed Admin",
        email: "seed_admin@test.com", // ايميل وهمي
        password: "hashed_password_123", // باسورد وهمي
        role: "admin", // لو عندك عمود role
    }).returning(); // 👈 لو ضرب ايرور هنا بسبب الايميل المكرر، غير الايميل

    console.log(`✅ Default User ID: ${defaultUser.id}`);

    // 2. إنشاء مؤلف افتراضي
    console.log("✍️ Creating default Author...");
    const [defaultAuthor] = await db.insert(AuthorTable).values({
        name: "Seed Author",
        bio: "System generated author.",
        image: "https://placehold.co/400",
    }).returning();

    // 3. إنشاء تصنيف افتراضي
    console.log("🏷️ Creating default Category...");
    const [defaultCategory] = await db.insert(CategoryTable).values({
        name: "General Knowledge",
    }).returning();

    // 4. تجهيز بيانات الكتب
    console.log("📚 Preparing books data...");
    
    const booksToInsert = sampleBooks.map((book) => ({
      title: book.title,
      description: book.description,
      
      categoryId: defaultCategory.id, 
      authorId: defaultAuthor.id,     
      
      // 👇 التعديل المهم جداً: بنستخدم ID اليوزر اللي لسه عاملينه فوق
      userId: defaultUser.id, 

      coverImage: book.cover, 
      price: "150", 
      publicationYear: 2023,
    }));

    // 5. إدخال الكتب
    console.log("💾 Inserting books into database...");
    await db.insert(BookTable).values(booksToInsert);

    console.log("🎉 SUCCESS: Books inserted successfully!");

  } catch (error) {
    console.error("❌ ERROR FAILED:", error);
  } finally {
    console.log("👋 Closing process.");
    process.exit(0);
  }
};

seedBooks();