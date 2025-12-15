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

// Types and Context
import { AuthView } from "@/types";
import { useAuth } from "@/providers/AuthProvider";

// Form Components
import { LoginForm } from "./LoginForm";
import SignupForm from "./SignupForm";
import VerifyAccount from "./VerifyAccount";
// Assuming this component exists based on your usage
import ForgetPassForm from "./ForgetPassForm"; 

export const AuthModal = () => {
  const [view, setView] = useState<AuthView>("LOGIN");
  const [isOpen, setIsOpen] = useState(false);

  // 1. Get User, Logout, and isLogged from context
  const { isLoggedIn, logout, user } = useAuth();

  const getTitle = () => {
    switch (view) {
      case "LOGIN":
        return "Welcome Back";
      case "SIGNUP":
        return "Create Account";
      case "FORGOT_PASSWORD":
        return "Reset Password";
      case "OTP":
        return "Verify Email";
      default:
        return "Authentication";
    }
  };

  // 2. LOGGED IN VIEW: Render the User Dropdown
  if (isLoggedIn && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <Avatar className="cursor-pointer border-2 border-transparent hover:border-white/50 transition">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 bg-white" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            <a href="/profile">Profile</a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
 <DropdownMenuItem className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            <a href="/my-library">My Library</a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-100"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

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
          {view === "FORGOT_PASSWORD" && <ForgetPassForm onSwitchView={setView} />}
          {view === "OTP" && <VerifyAccount onSwitchView={setView} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};