"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import {  User, Tag, BookOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Books } from "../../../../types";



interface BookDetailsDialogProps {
  book: Books | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookDetailsDialog({
  book,
  open,
  onOpenChange,
}: BookDetailsDialogProps) {
  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-white/10 text-white p-0 overflow-hidden">
        <div className="grid md:grid-cols-5 h-full max-h-[80vh]">
          {/* Left Side - Image Cover */}
          <div className="md:col-span-2 bg-gray-800 relative min-h-[300px] md:min-h-full">
            <Image
              src={
                book.coverImage ||
                "https://placehold.co/400x600/1f2937/fff?text=No+Cover"
              }
              alt={book.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />
          </div>

          {/* Right Side - Details */}
          <div className="md:col-span-3 p-6 flex flex-col h-full">
            <DialogHeader>
              <div className="flex justify-between items-start gap-4">
                <DialogTitle className="text-2xl font-bold text-white leading-tight">
                  {book.title}
                </DialogTitle>
                <div className="text-amber-400 font-bold text-xl whitespace-nowrap">
                  ${book.price}
                </div>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm mt-2">
                <User className="w-4 h-4" />
                <span>Added by {book.user?.name || "Unknown"}</span>
              </div>
            </DialogHeader>

            <DialogDescription className="text-white/80 text-base leading-relaxed whitespace-pre-wrap">
              {book.description || "No description available."}
            </DialogDescription>

            <Separator className="bg-white/10 my-4" />

            {/* Footer Metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm text-white/70">
              {book.category?.name && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <span>Category: {book.category.name}</span>
                </div>
              )}
              {book.publicationYear && (
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Year: {book.publicationYear}</span>
                </div>
              )}
     
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
