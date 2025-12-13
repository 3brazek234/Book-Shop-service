import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Roboto } from "next/font/google"; // 1. استدعاء الفونت
import Provider from "@/providers/MainProvider";

const roboto = Roboto({
  subsets: ["latin"], // مهم: أضف 'arabic' لدعم اللغة العربية
  weight: ["400", "500", "700"], // اختر الأوزان التي ستستخدمها فقط
  variable: "--font-roboto", // سيقوم بإنشاء متغير CSS بهذا الاسم
});

const bebasNeue = localFont({
  src: [
    { path: "./fonts/BebasNeue-Regular.ttf", weight: "400", style: "normal" },
  ],
  variable: "--bebas-neue",
});

export const metadata: Metadata = {
  title: "BookWise",
  description:
    "BookWise is a book borrowing university library management solution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} ${bebasNeue.variable} antialiased`}
      >
        <Provider>
          {children}

        </Provider>

      </body>
    </html>
  );
}
