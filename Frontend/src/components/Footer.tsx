import React from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import SocialIcons from "@/components/SocialIcons";
import NavLinks from "@/components/NavLinks";

const currentYear = new Date().getFullYear();

function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Logo />
            </div>
            <p className="text-amber-400">
              Your platform for borrowing and lending books. Join our community
              of book lovers today!
            </p>
            <div className="pt-2">
              <SocialIcons />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Quick Links
            </h3>
            <NavLinks className="flex flex-col gap-2 items-start justify-start" />
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Categories
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/category/fiction"
                  className="hover:text-amber-400 transition-colors"
                >
                  Fiction
                </Link>
              </li>
              <li>
                <Link
                  href="/category/non-fiction"
                  className="hover:text-amber-400 transition-colors"
                >
                  Non-Fiction
                </Link>
              </li>
              <li>
                <Link
                  href="/category/sci-fi"
                  className="hover:text-amber-400 transition-colors"
                >
                  Science Fiction
                </Link>
              </li>
              <li>
                <Link
                  href="/category/fantasy"
                  className="hover:text-amber-400 transition-colors"
                >
                  Fantasy
                </Link>
              </li>
              <li>
                <Link
                  href="/category/biography"
                  className="hover:text-amber-400 transition-colors"
                >
                  Biography
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Contact Us
            </h3>
            <address className="not-italic space-y-2">
              <p>123 Book Street, Library District</p>
              <p>City, Country 12345</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:info@bookshare.com"
                  className="text-amber-400 hover:underline"
                >
                  info@bookshare.com
                </a>
              </p>
              <p>
                Phone:{" "}
                <a
                  href="tel:+1234567890"
                  className="text-amber-400 hover:underline"
                >
                  +1 (234) 567-890
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>© {currentYear} BookShare. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link
              href="/privacy"
              className="hover:text-amber-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              href="/terms"
              className="hover:text-amber-400 transition-colors"
            >
              Terms of Service
            </Link>
            <span>•</span>
            <Link
              href="/cookies"
              className="hover:text-amber-400 transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
