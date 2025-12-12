"use client";
import React, { useState } from "react";
import Logo from "@/components/ui/Logo";
import NavLinks from "@/features/profile/components/NavLinks";
import SideBar from "../features/auth/components/SideBar";
import { LogIn, ShoppingCart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoginInput, loginSchema, RegisterInput, registerSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login, signup } from "../services/index";
import toast from "react-hot-toast";
import { AuthModal } from "../features/auth/components/AuthModel";

function Header() {
  
    return (
      <header className="my-10 flex justify-between gap-5">
        <Logo />
        <NavLinks className="hidden md:flex flex-row" />
        <div className="items-center gap-4 hidden md:flex">
          <div className="relative cursor-pointer">
            <ShoppingCart className="h-6 w-6 text-white" />
          </div>
          <div className="text-white">
           <AuthModal/>
          </div>
        </div>
        <SideBar />
      </header>
    );
  }

export default Header;