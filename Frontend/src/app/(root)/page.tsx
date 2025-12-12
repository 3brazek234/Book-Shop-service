import BookList from "@/features/books/components/BookList";
import BookOverView from "@/features/books/components/BookOverView";
import BorrowNow from "@/features/books/components/BorrowNow";
import { sampleBooks } from "@/constants";
import React from "react";

function Home() {
  return (
    <>
      <BookOverView {...sampleBooks[0]} />
      <BookList
        title="Latest Books"
        containerClassName="mt-28"
        books={sampleBooks}
      />

      <BorrowNow />

    </>
  );
}

export default Home;
