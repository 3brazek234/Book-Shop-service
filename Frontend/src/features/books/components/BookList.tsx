"use client";

import { useState } from "react";
import Image from "next/image";
import { BookDetailsDialog } from "./BookDetailsDialog";
import { Books } from "../../../../types";



interface BookListProps {
  books: Books[];
  title?: string;
}

export default function BookList({
  books,
  title = "All Books",
}: BookListProps) {
  const [selectedBook, setSelectedBook] = useState<Books | null>(null);
  const isDialogOpen = !!selectedBook;
  const handleCloseDialog = () => {
    setSelectedBook(null);
  };

  return (
    <section>
      {title && <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            // 1. Make the card clickable
            onClick={() => setSelectedBook(book)}
            // 2. Add cursor pointer and hover effect for feedback
            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 group cursor-pointer"
          >
            <div className="aspect-[2/3] relative overflow-hidden">
              <Image
                src={
                  book.coverImage ||
                  "https://placehold.co/400x600/1f2937/fff?text=No+Cover"
                }
                alt={book.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
              />
              {/* Optional: Overlay icon on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                  View Details
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3
                className="text-white font-semibold line-clamp-1 mb-1"
                title={book.title}
              >
                {book.title}
              </h3>
              <div className="flex justify-between items-center text-sm">
                <p className="text-white/60">
                  by {book.user?.name || "Unknown"}
                </p>
                {/* You can add price here if you want a quick glance */}
                <span className="text-amber-400 font-medium">
                  ${book.price}
                </span>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* 3. Render the dialog outside the map loop */}
      <BookDetailsDialog
        book={selectedBook}
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
      />
    </section>
  );
}
