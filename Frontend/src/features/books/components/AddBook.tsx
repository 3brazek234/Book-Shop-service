"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddBookFormInput,
  AddBookInput,
  addBookFormSchema,
} from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createBook, getCategories } from "@/services";
import toast from "react-hot-toast";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAuthors } from "@/services";
interface AddBookProps {
  onSuccess?: () => void;
  userId?: string;
  setOpen?: (open: boolean) => void;
}
export const AddBook = ({
  onSuccess,
  userId = "user-1",
  setOpen,
}: AddBookProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const form = useForm<AddBookFormInput>({
    resolver: zodResolver(addBookFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      thumbnail: "",
      publicationYear: "",
      authorId: "",
      categoryId: "",
    },
  });

  const { data, isLoading: authorDataLoader } = useQuery({
    queryKey: ["authors"],
    queryFn: () => getAuthors(),
  });

  const { data: categoryData, isLoading: categoryDataLoader } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
  const onSubmit = async (data: AddBookFormInput) => {
    // تحقق يدوي إن الصورة موجودة (لو هي إجباري)
    if (!coverImage) {
      toast.error("Please upload a cover image");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // 1. البيانات اللي جاية من React Hook Form
      formData.append("title", data.title);
      formData.append("price", data.price.toString());
      formData.append("categoryId", data.categoryId);
      formData.append("authorId", data.authorId);
      formData.append("description", data.description || "");
      if (data.publicationYear) {
        formData.append("publicationYear", data.publicationYear.toString());
      }

      // 2. الصورة اللي جاية من الـ State
      formData.append("thumbnail", coverImage); // 👈 هنا مربط الفرس

      console.log("Sending Form Data...");

      await createBook(formData);
      toast.success("Book added successfully! 📚");
      form.reset();
      onSuccess?.(); // لو جاي من مودال، اقفله
      setOpen?.(false); // لو جاي من Props
    } catch (error: any) {
      console.error("Error adding book:", error);
      toast.error(
        error?.response?.data?.error || "Failed to add book. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl border border-white/10 shadow-2xl backdrop-blur-sm">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Add New Book</h2>
        <p className="text-white/70 text-sm">
          Fill in the details to add a new book to the collection
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/90">Title *</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter book title"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-amber-400/50"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/90">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter book description..."
                    rows={4}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-amber-400/50 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Price Field */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90">Price ($) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-amber-400/50"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Publication Year Field */}
            <FormField
              control={form.control}
              name="publicationYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90">
                    Publication Year
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1000"
                      max={new Date().getFullYear()}
                      placeholder="YYYY"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-amber-400/50"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value || undefined)
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          {/* Cover Image URL Field - مفصول عن React Hook Form */}
          <div className="space-y-2">
            <FormLabel className="text-white/90">Cover Image</FormLabel>
            <Input
              type="file"
              accept="image/*"
              className="bg-white/5 border-white/10 text-white file:bg-amber-400 file:text-gray-900 hover:file:bg-amber-500 cursor-pointer"
              // 👇 هنا بنخزن الملف في الـ State بتاعتنا مباشرة
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setCoverImage(file);
                }
              }}
            />
            {/* لو عايز تعرض رسالة خطأ يدوية لو مفيش صورة */}
            {!coverImage && isSubmitting && (
              <p className="text-sm font-medium text-red-400">
                Cover image is required
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Author Dropdown */}
            <FormField
              control={form.control}
              name="authorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90">Author *</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full h-9 rounded-md border bg-white/5 border-white/10 text-white px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-amber-400/50 focus-visible:ring-amber-400/20 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&>option]:bg-gray-800 [&>option]:text-white"
                    >
                      <option value="" className="bg-gray-800 text-white/40">
                        Select an author
                      </option>
                      {data?.data?.map((author) => (
                        <option
                          key={author.id}
                          value={author.id}
                          className="bg-gray-800 text-white"
                        >
                          {author.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Category Dropdown */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90">Category *</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full h-9 rounded-md border bg-white/5 border-white/10 text-white px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-amber-400/50 focus-visible:ring-amber-400/20 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&>option]:bg-gray-800 [&>option]:text-white"
                    >
                      <option value="" className="bg-gray-800 text-white/40">
                        Select a category
                      </option>
                      {categoryData?.data?.map((category) => (
                        <option
                          key={category.id}
                          value={category.id}
                          className="bg-gray-800 text-white"
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-2.5 rounded-lg transition-all shadow-lg hover:shadow-amber-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Adding...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>📖</span>
                  Add Book
                </span>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isSubmitting}
              className="px-6 border-white/20 text-white/90 hover:bg-white/10 hover:text-white"
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
