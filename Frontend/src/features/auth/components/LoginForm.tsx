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

interface LoginFormProps {
    onSwitchView: (view: AuthView) => void;
}

export const LoginForm = ({ onSwitchView }: LoginFormProps) => {
    const router = useRouter(); 
    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            const res = await login(data)
            if (!res.success) {
                toast.error("error in login")
            }
            await setAuthCookie(res.token)
            toast.success("login successfully")
            router.push("/dashboard");
           
        } catch (err) { console.log(err) }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Email Field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="bg-white/5 border-white/10"
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
                                        <FormLabel>Password</FormLabel>
                                        <a
                                            href="#"
                                            className="text-xs text-amber-300 hover:underline"
                                        >
                                            Forgot password?
                                        </a>
                                    </div>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="bg-white/5 border-white/10"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        <p className="text-center text-sm text-white/70">
                            Don't have an account?{" "}
                            <a
                                href="#"
                                className="text-amber-300 hover:underline font-medium"
                                onClick={() => onSwitchView("SIGNUP")}
                            >
                                Sign up
                            </a>
                        </p>
                    </form>
                </Form>
                <div className="flex justify-center">
                    <button type="button" onClick={() => onSwitchView("FORGOT_PASSWORD")} className="text-xs text-amber-300">
                        Forgot password?
                    </button>
                </div>

                <Button type="submit" className="w-full bg-amber-400 text-gray-900">Log In</Button>
            </form>
        </Form>
    );
};