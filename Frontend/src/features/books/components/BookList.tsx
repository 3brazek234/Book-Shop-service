import React from "react";
import BookCover from "./BookCover";
import CartButtons from "./CartButtons";
interface BookListProps {
  title: string;
  books: Book[];
  containerClassName?: string;
}
function BookList({ title, books, containerClassName }: BookListProps) {
  return (
    <section className={containerClassName}>
      <h2 className="text-2xl md:text-3xl !text-white font-bebas-neue">
        {title}
      </h2>
      <div className="mt-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
        {books ? (
          books.map((book, index) => {
            return (
              <div key={index} className="flex flex-col gap-4 justify-between">
                <div className="hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <BookCover
                    variant="medium"
                    coverUrl={book.coverImage}
                    coverColor={book.color}
                  />
                </div>
                <div className="flex flex-col gap-1 rounded-b-md w-3/4">
                  <h3 className="text-sm font-semibold text-white overflow-hidden whitespace-nowrap text-ellipsis">
                    {book.title}
                  </h3>
                  {/* <p className="text-gray-400">{book?.category.name}</p> */}
                  <p className="text-xs text-gray-400">{book.price}</p>
               {/* <p>added by: {book.user.name}</p> */}
                </div>
              </div>
            );
          })
        ) : (
          <div>No books available</div>
        )}
      </div>
    </section>
  );
}

export default BookList;
