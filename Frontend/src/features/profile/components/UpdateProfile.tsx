"use client";
import React from 'react';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UpdateProfileInput, updateProfileSchema } from "@/lib/validation";
import { updateProfile as updateProfileService } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "@/providers/AuthProvider";

const UpdateProfile = () => {
    const { user, refetchUser } = useAuth();

    const updateProfileForm = useForm<UpdateProfileInput>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
        },
    });

    const onUpdateProfileSubmit = async (data: UpdateProfileInput) => {
        try {
            await updateProfileService(data);
            toast.success("Profile updated successfully");
            await refetchUser(); // Refresh user data
        } catch (error) {
            toast.error("Failed to update profile");
            console.error(error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white/5 rounded-lg border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Update Profile</h2>
            <Form {...updateProfileForm}>
                <form
                    onSubmit={updateProfileForm.handleSubmit(onUpdateProfileSubmit)}
                    className="space-y-6"
                >
                    {/* Name Field */}
                    <FormField
                        control={updateProfileForm.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Name</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Enter your name"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    {/* Email Field */}
                    <FormField
                        control={updateProfileForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
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
                        disabled={updateProfileForm.formState.isSubmitting}
                    >
                        {updateProfileForm.formState.isSubmitting ? "Updating..." : "Update Profile"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default UpdateProfile;