"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // استدعاء دالة cn للمساعدة

// 1. عرّفنا اللينكات في مصفوفة لسهولة التعديل
const links = [
  { href: "/", label: "Home" },
  { href: "/contact", label: "Contact" },
  { href: "/library", label: "Library" },
  { href: "/blog", label: "Blog" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <ul className={cn("flex items-center gap-4", className)}>
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                "cursor-pointer text-white transition-colors hover:text-amber-400",
                isActive && "font-bold text-amber-400" // تطبيق الستايل النشط
              )}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}