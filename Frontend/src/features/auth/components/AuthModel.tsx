import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { LogIn, User as UserIcon, LogOut, Settings } from "lucide-react";

import { LoginForm } from "./LoginForm";
import SignupForm from "./SignupForm";
import { AuthView } from "@/types";
import { useAuth } from "@/providers/AuthProvider";
import ForgetPassForm from "./ForgetPassForm";
import VerifyAccount from "./VerifyAccount";

export const AuthModal = () => {
  const [view, setView] = useState<AuthView>("SIGNUP");
  const [isOpen, setIsOpen] = useState(false);
  
  // 1. Get User and Logout from context
  const { isLoggedIn, user } = useAuth();

  const getTitle = () => {
    switch (view) {
      case "LOGIN": return "Welcome Back";
      case "SIGNUP": return "Create Account";
      case "FORGOT_PASSWORD": return "Reset Password";
      case "OTP": return "Verify Email";
      default: return "Authentication";
    }
  };
console.log("User in AuthModal:", user);

  // 2. LOGGED IN VIEW: Render the User Dropdown
  

  // 3. LOGGED OUT VIEW: Render the Login Dialog
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <LogIn
          className="cursor-pointer text-white hover:text-gray-200 transition"
          onClick={() => {
            setView("LOGIN");
            setIsOpen(true);
          }}
        />
      </DialogTrigger>

      <DialogContent className="bg-gradient-to-br from-[#3d287d] to-[#5c3a9f] border-0 text-white p-0 overflow-hidden sm:max-w-[425px]">
        <div className="p-8">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-2xl font-bold text-center mb-2">
              {getTitle()}
            </DialogTitle>
          </DialogHeader>

          {view === "LOGIN" && <LoginForm onSwitchView={setView} />}
          {view === "SIGNUP" && <SignupForm onSwitchView={setView} />}
          {view === "FORGOT_PASSWORD" && <ForgetPassForm onSwitchView={setView}/>}
          {view === "OTP" && <VerifyAccount/>}
        </div>
      </DialogContent>
    </Dialog>
  );
};