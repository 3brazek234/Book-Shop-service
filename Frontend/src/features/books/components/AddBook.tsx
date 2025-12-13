"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AddBookFormInput, AddBookInput, addBookFormSchema } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { createBook } from "@/services"
import toast from "react-hot-toast"
import { useState } from "react"

// Dummy authors data
const AUTHORS = [
  { id: "550e8400-e29b-41d4-a716-446655440001", name: "J.K. Rowling" },
  { id: "550e8400-e29b-41d4-a716-446655440002", name: "George R.R. Martin" },
  { id: "550e8400-e29b-41d4-a716-446655440003", name: "Stephen King" },
  { id: "550e8400-e29b-41d4-a716-446655440004", name: "Agatha Christie" },
  { id: "550e8400-e29b-41d4-a716-446655440005", name: "Jane Austen" },
  { id: "550e8400-e29b-41d4-a716-446655440006", name: "Ernest Hemingway" },
  { id: "550e8400-e29b-41d4-a716-446655440007", name: "Toni Morrison" },
  { id: "550e8400-e29b-41d4-a716-446655440008", name: "Maya Angelou" },
]

// Dummy categories data
const CATEGORIES = [
  { id: "550e8400-e29b-41d4-a716-446655440101", name: "Fiction" },
  { id: "550e8400-e29b-41d4-a716-446655440102", name: "Non-Fiction" },
  { id: "550e8400-e29b-41d4-a716-446655440103", name: "Science Fiction" },
  { id: "550e8400-e29b-41d4-a716-446655440104", name: "Mystery" },
  { id: "550e8400-e29b-41d4-a716-446655440105", name: "Romance" },
  { id: "550e8400-e29b-41d4-a716-446655440106", name: "Thriller" },
  { id: "550e8400-e29b-41d4-a716-446655440107", name: "Biography" },
  { id: "550e8400-e29b-41d4-a716-446655440108", name: "History" },
  { id: "550e8400-e29b-41d4-a716-446655440109", name: "Self-Help" },
  { id: "550e8400-e29b-41d4-a716-446655440110", name: "Fantasy" },
]

interface AddBookProps {
  onSuccess?: () => void
  userId?: string
}

export const AddBook = ({ onSuccess, userId = "user-1" }: AddBookProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AddBookFormInput>({
    resolver: zodResolver(addBookFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      coverImage: "",
      publicationYear: "",
      authorId: "",
      categoryId: "",
    },
  })

  const onSubmit = async (data: AddBookFormInput) => {
    setIsSubmitting(true)
    try {
      // Transform form data to API format
      const price = parseFloat(data.price);
      if (isNaN(price) || price <= 0) {
        toast.error("Price must be a valid number greater than 0");
        setIsSubmitting(false);
        return;
      }

      let publicationYear: number | undefined = undefined;
      if (data.publicationYear && data.publicationYear !== "") {
        const year = parseInt(data.publicationYear);
        if (!isNaN(year) && year >= 1000 && year <= new Date().getFullYear()) {
          publicationYear = year;
        }
      }

      let coverImage: string | undefined = undefined;
      if (data.coverImage && data.coverImage !== "") {
        try {
          new URL(data.coverImage);
          coverImage = data.coverImage;
        } catch {
          toast.error("Invalid cover image URL");
          setIsSubmitting(false);
          return;
        }
      }

      const bookData: AddBookInput & { userId: string } = {
        title: data.title,
        description: data.description,
        price,
        coverImage,
        publicationYear,
        authorId: data.authorId,
        categoryId: data.categoryId,
        userId,
      }

      await createBook(bookData)
      toast.success("Book added successfully! 📚")
      form.reset()
      onSuccess?.()
    } catch (error: any) {
      console.error("Error adding book:", error)
      toast.error(error?.response?.data?.error || "Failed to add book. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl border border-white/10 shadow-2xl backdrop-blur-sm">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Add New Book</h2>
        <p className="text-white/70 text-sm">Fill in the details to add a new book to the collection</p>
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
                  <FormLabel className="text-white/90">Publication Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1000"
                      max={new Date().getFullYear()}
                      placeholder="YYYY"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-amber-400/50"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value || undefined)}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          {/* Cover Image URL Field */}
          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/90">Cover Image URL</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://example.com/book-cover.jpg"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-amber-400/50"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

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
                      {AUTHORS.map((author) => (
                        <option key={author.id} value={author.id} className="bg-gray-800 text-white">
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
                      {CATEGORIES.map((category) => (
                        <option key={category.id} value={category.id} className="bg-gray-800 text-white">
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
  )
}
