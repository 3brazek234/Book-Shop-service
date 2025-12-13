"use client";
import React, { useState } from "react";
import Logo from "@/components/ui/Logo";
import NavLinks from "@/features/profile/components/NavLinks";
import SideBar from "../features/auth/components/SideBar";
import { ShoppingCart } from "lucide-react";
import { AuthModal } from "../features/auth/components/AuthModel";

function Header() {
  
    return (
      <header className="my-10 flex justify-between gap-5">
        <Logo />
        <NavLinks className="hidden md:flex flex-row" />
        <div className="items-center gap-4 hidden md:flex">
          <div className="text-white">
           <AuthModal/>
          </div>
        </div>
        <SideBar />
      </header>
    );
  }

export default Header;