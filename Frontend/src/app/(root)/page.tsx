import { sampleBooks } from "@/constant";
import BookCard from "@/features/books/components/BookCard";
import BookOverView from "@/features/books/components/BookOverView";
import BorrowNow from "@/features/books/components/BorrowNow";
import React from "react";

function Home() {
  return (
    <>
      <BookOverView {...sampleBooks[0]} />
      <div className="py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Featured Books</h1>
        <p className="text-white/70 text-lg">
          Discover our collection of amazing books available for borrowing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4">
        {sampleBooks.map((book) => (
          <BookCard key={book.id} {...book} />
        ))}
      </div>
    </div>

      <BorrowNow />
 
    </>
  );
}

export default Home;
