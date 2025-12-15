import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VerifyOtpInput, verifyOtpSchema, resendOtpSchema } from "@/lib/validation";
import { verifyOtp, resendOtp } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AuthView } from '@/types';

interface VerifyAccountProps {
    onSwitchView?: (view: AuthView) => void;
}

const VerifyAccount = ({  onSwitchView }: VerifyAccountProps) => {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const verifyForm = useForm<VerifyOtpInput>({
        resolver: zodResolver(verifyOtpSchema),
        defaultValues: {
            email: '',
            otp: "",
        },
    });

    const resendForm = useForm<{ email: string }>({
        resolver: zodResolver(resendOtpSchema),
        defaultValues: {
            email: "",
        },
    });

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) {
            // Handle paste
            const otpArray = value.split("").slice(0, 6);
            setOtp(otpArray);
            otpArray.forEach((digit, i) => {
                if (inputRefs.current[i]) {
                    inputRefs.current[i]!.value = digit;
                }
            });
            if (otpArray.length === 6) {
                verifyForm.setValue("otp", otpArray.join(""));
            }
            return;
        }

        if (!/^\d*$/.test(value)) return; // Only allow digits

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Update form value
        verifyForm.setValue("otp", newOtp.join(""));
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const onVerifySubmit = async (data: VerifyOtpInput) => {
        try {
            await verifyOtp(data);
            toast.success("Account verified successfully");
            onSwitchView?.("LOGIN");
            
        } catch (error) {
            toast.error("Verification failed");
            console.error(error);
        }
    };

    const onResendOtp = async () => {
        try {
            // await resendOtp({ email });
            toast.success("OTP sent successfully");
        } catch (error) {
            toast.error("Failed to resend OTP");
            console.error(error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white/5 rounded-lg border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Verify Account</h2>
          

            <Form {...verifyForm}>
                <form
                    onSubmit={verifyForm.handleSubmit(onVerifySubmit)}
                    className="space-y-6"
                >
                      <FormField
                                  control={verifyForm.control}
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
              
                    {/* OTP Boxes */}
                    <FormField  
                        control={verifyForm.control}
                        name="otp"
                        render={() => (
                            <FormItem>
                                <FormLabel className="text-white text-center block">OTP Code</FormLabel>
                                <FormControl>
                                    <div className="flex justify-center space-x-2">
                                        {otp.map((digit, index) => (
                                            <Input
                                                key={index}
                                                ref={(el) => (inputRefs.current[index] = el)}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                className="w-12 h-12 text-center text-xl font-bold bg-white/5 border-white/10 text-white"
                                            />
                                        ))}
                                    </div>
                                </FormControl>
                                <FormMessage className="text-red-400 text-center" />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium py-2.5 rounded-lg transition-colors"
                        disabled={verifyForm.formState.isSubmitting}
                    >
                        {verifyForm.formState.isSubmitting ? "Verifying..." : "Verify Account"}
                    </Button>
                </form>
            </Form>

            <div className="mt-6 text-center">
             
                  
                    <button
                        type="button"
                        onClick={onResendOtp}
                        className="text-amber-300 hover:underline font-medium"
                        disabled={resendForm.formState.isSubmitting}
                    >
                        Resend OTP
                    </button>
        
                <p className="text-white/70 text-sm mt-2">
                    Wrong email?{" "}
                    <button
                        type="button"
                        onClick={() => onSwitchView?.("SIGNUP")}
                        className="text-amber-300 hover:underline font-medium"
                    >
                        Change Email
                    </button>
                </p>
            </div>
        </div>
    );
};

export default VerifyAccount;