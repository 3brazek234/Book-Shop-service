import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import React from "react";

function SocialIcons() {
  return (
    <div className="flex items-center gap-4">
      <a
        href="#"
        className="text-gray-500 hover:text-amber-500 transition-colors duration-700"
      >
        <Facebook />
      </a>
      <a
        href="#"
        className="text-gray-500 hover:text-amber-500 transition-colors duration-700"
      >
        <Twitter />
      </a>
      <a
        href="#"
        className="text-gray-500 hover:text-amber-500 transition-colors duration-700"
      >
        <Instagram />
      </a>
      <a
        href="#"
        className="text-gray-500 hover:text-amber-500 transition-colors duration-700"
      >
        <Youtube />
      </a>
    </div>
  );
}

export default SocialIcons;
