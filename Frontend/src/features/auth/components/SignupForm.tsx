import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterInput, registerSchema } from "@/lib/validation";
import { signup } from "@/services";
import { AuthView } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface SignUpProps {
    onSwitchView: (view: AuthView) => void;
}

const SignupForm = ({ onSwitchView }: SignUpProps) => {
    // 1. تعريف الفورم
    const signupForm = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: { email: "", password: "", name: "" },
    });

    // 2. دالة الإرسال (Logic فقط بدون return للـ UI)
    const onSignupSubmit = async (data: RegisterInput) => {
        try {
            const response = await signup(data);
            console.log(response);
            toast.success("Signup successful");
            // ممكن هنا تعمل switch لصفحة الـ login أو otp
        } catch (error) {
            toast.error("Signup failed");
            console.error(error);
        }
    }; // <--- قفلنا دالة الـ submit هنا

    // 3. الـ Return الخاص بالكومبوننت نفسه (هنا بنرجع الـ JSX)
    return (
        <Form {...signupForm}>
            <form
                onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                className="space-y-6"
            >
                {/* Name Field */}
                <FormField
                    control={signupForm.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Enter your name"
                                    className="bg-white/5 border-white/10"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                        </FormItem>
                    )}
                />

                {/* Email Field */}
                <FormField
                    control={signupForm.control}
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
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between items-center">
                                <FormLabel>Password</FormLabel>
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

                <Button
                    type="submit"
                    className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium py-2.5 rounded-lg transition-colors"
                >
                    Sign Up
                </Button>

                <p className="text-center text-sm text-white/70">
                    Already have an account?{" "}
                    <a
                        href="#"
                        className="text-amber-300 hover:underline font-medium"
                        onClick={() => onSwitchView("LOGIN")}
                    >
                        Log in
                    </a>
                </p>
            </form>
        </Form>
    );
};

export default SignupForm;