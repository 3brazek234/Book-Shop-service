"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UpdateProfileInput, updateProfileSchema } from "@/lib/validation";
import { updateProfile as updateProfileService } from "@/services/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "@/providers/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UpdateProfile = () => {
    const { user, refetchUser } = useAuth();
    const [previewImage, setPreviewImage] = useState<string | null>(user?.image || null);

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
            await refetchUser(); 
            setPreviewImage(user?.image || null); 
        } catch (error) {
            toast.error("Failed to update profile");
            console.error(error);
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            updateProfileForm.setValue('image', file);
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white/5 rounded-lg border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Update Profile</h2>
            
            <div className="flex justify-center mb-6 relative">
                <Avatar className="w-24 h-24 cursor-pointer" onClick={() => document.getElementById('image-upload')?.click()}>
                    <AvatarImage src={previewImage || user?.image} alt="Profile" />
                    <AvatarFallback className="text-white bg-gray-600">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                </Avatar>
                <Button
                    type="button"
                    size="sm"
                    className="absolute bottom-0 right-1/2 translate-x-12 bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-full w-8 h-8 p-0"
                    onClick={() => document.getElementById('image-upload')?.click()}
                >
                    📷
                </Button>
            </div>

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

                    {/* Image Upload Field */}
                    <FormField
                        control={updateProfileForm.control}
                        name="image"
                        render={({ field: { value, onChange, ...field } }) => (
                            <FormItem className="hidden">
                                <FormControl>
                                    <Input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
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