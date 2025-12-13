import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput, loginSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AuthView } from "@/types";
import { login } from "@/services";
import toast from "react-hot-toast";
import { setAuthCookie } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider"; // 1. استدعاء الهوك

interface LoginFormProps {
    onSwitchView: (view: AuthView) => void;
}

export const LoginForm = ({ onSwitchView }: LoginFormProps) => {
    const router = useRouter();
        const { refetchUser, closeLoginModal } = useAuth(); 
    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });
   
    const { isSubmitting } = form.formState;

    const onSubmit = async (data: LoginInput) => {
        try {
            const res = await login(data);
            if (!res.success) {
                toast.error(res.message || "Error in login");
                return;
            }
            await setAuthCookie(res.token);
            await refetchUser(); 
            toast.success("Login successfully");
            closeLoginModal(); 
            router.refresh(); 

        } catch (err: any) {
             console.error(err);
             toast.error("Something went wrong");
        }
    };

    return (
        // تم إصلاح هيكل الفورم (Form واحد فقط)
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Email Field */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                        </FormItem>
                    )}
                />

                {/* Password Field */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between items-center">
                                <FormLabel className="text-white">Password</FormLabel>
                                <button
                                    type="button"
                                    onClick={() => onSwitchView("FORGOT_PASSWORD")}
                                    className="text-xs text-amber-300 hover:underline cursor-pointer"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                        </FormItem>
                    )}
                />

                {/* Sign Up Link */}
                <p className="text-center text-sm text-white/70">
                    Don't have an account?{" "}
                    <button
                        type="button"
                        className="text-amber-300 hover:underline font-medium cursor-pointer"
                        onClick={() => onSwitchView("SIGNUP")}
                    >
                        Sign up
                    </button>
                </p>

                {/* Submit Button (داخل الفورم مباشرة) */}
                <Button 
                    type="submit" 
                    className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Logging in..." : "Log In"}
                </Button>
            </form>
        </Form>
    );
};