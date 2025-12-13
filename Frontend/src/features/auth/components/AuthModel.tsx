import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LogIn } from "lucide-react";
import { LoginForm } from "./LoginForm";
import Signup from "./SignupForm";
import SignupForm from "./SignupForm";
import { AuthView } from "@/types";
// import { OtpForm } from "./OtpForm"; // لما تعملهم
// import { ResetPasswordForm } from "./ResetPasswordForm";

export const AuthModal = () => {
  const [view, setView] = useState<AuthView>("LOGIN");
  const [isOpen, setIsOpen] = useState(false);

  const getTitle = () => {
    switch (view) {
      case "LOGIN": return "Welcome Back";
      case "SIGNUP": return "Create Account";
      case "FORGOT_PASSWORD": return "Reset Password";
      case "OTP": return "Verify Email";
      default: return "Authentication";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <LogIn className="cursor-pointer text-white" onClick={() => {
            setView("LOGIN");
            setIsOpen(true);
        }} />
      </DialogTrigger>
      
      <DialogContent className="bg-gradient-to-br from-[#3d287d] to-[#5c3a9f] border-0 text-white p-0 overflow-hidden">
        <div className="p-8">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-2xl font-bold text-center mb-2">
              {getTitle()}
            </DialogTitle>
          </DialogHeader>

          {/* هنا السحر: بنعرض الكومبوننت حسب الـ State */}
          {view === "LOGIN" && <LoginForm onSwitchView={setView} />}
          {view === "SIGNUP" && <SignupForm onSwitchView={setView} />}
          
          {/* مستقبلاً هتضيف دول بسهولة:
            {view === "FORGOT_PASSWORD" && <ForgotPasswordForm onSwitchView={setView} />}
            {view === "OTP" && <OtpForm onSwitchView={setView} />}
          */}
        
        </div>
      </DialogContent>
    </Dialog>
  );
};