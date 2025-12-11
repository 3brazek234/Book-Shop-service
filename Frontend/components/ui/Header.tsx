"use client";
import React from "react";
import Logo from "./Logo";
import NavLinks from "../NavLinks";
import SideBar from "../SideBar";
import { LogIn, ShoppingCart, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";

function Header() {
  return (
    <header className="my-10 flex justify-between gap-5">
      <Logo />
      <NavLinks className="hidden md:flex flex-row" />
      <div className="items-center gap-4 hidden md:flex">
        <div className="relative cursor-pointer">
          <ShoppingCart className="h-6 w-6 text-white" />
          {/* <span className="text-amber-400 absolute -top-2 left-2.5">0</span> */}
        </div>
        <div className="text-white">
          <Dialog>
            <DialogTrigger asChild>
              <LogIn />
            </DialogTrigger>
            <DialogContent className="bg-gradient-to-br from-[#3d287d] to-[#5c3a9f] border-0 text-white p-0 overflow-hidden">
              <div className="relative">
                <div className="p-8">
                  <DialogHeader className="mb-8">
                    <DialogTitle className="text-2xl font-bold text-center mb-2">
                      Welcome Back
                    </DialogTitle>
                    <p className="text-sm text-white/70 text-center">
                      Sign in to access your account
                    </p>
                  </DialogHeader>

                  <form action="" className="space-y-6">
                    <div className="space-y-1">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-white/20 focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label
                          htmlFor="password"
                          className="text-sm font-medium"
                        >
                          Password
                        </label>
                        <a
                          href="#"
                          className="text-xs text-amber-300 hover:underline"
                        >
                          Forgot password?
                        </a>
                      </div>
                      <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-white/20 focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium py-2.5 rounded-lg transition-colors"
                    >
                      Log In
                    </Button>

                    <p className="text-center text-sm text-white/70">
                      Don't have an account?{" "}
                      <a
                        href="#"
                        className="text-amber-300 hover:underline font-medium"
                      >
                        Sign up
                      </a>
                    </p>
                  </form>
                </div>

                <div className="bg-black/10 p-4 text-center border-t border-white/5">
                  <p className="text-xs text-white/60">
                    By continuing, you agree to our Terms of Service and Privacy
                    Policy
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <SideBar />
    </header>
  );
}

export default Header;
