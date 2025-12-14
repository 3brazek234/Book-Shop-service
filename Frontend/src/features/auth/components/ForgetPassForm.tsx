import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ForgetPasswordInput,
  forgetPasswordSchema,
  LoginInput,
} from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AuthView } from "@/types";
import toast from "react-hot-toast";
import { forgetPassword } from "@/services";

const ForgetPassForm = ({ onSwitchView }: { onSwitchView: (view: AuthView) => void }) => {
  const form = useForm<ForgetPasswordInput>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: { email: "" },
  });
  async function onSubmit(data: ForgetPasswordInput) {
    const res = await forgetPassword(data.email);
    if (res.success) {
      toast.success("Password reset otp sent to your email");
      onSwitchView("LOGIN");
    } else {
      toast.error(res.message || "Error in sending reset link");
    }
  }
  const onSwitch = (view: AuthView) => {
    onSwitchView(view);
  };
  return (
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
        <Button
          type="submit"
          className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold"
        >
          Send OTP
        </Button>
      </form>
    </Form>
  );
};
export default ForgetPassForm;