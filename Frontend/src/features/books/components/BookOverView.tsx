import star from "@/assets/icons/star.svg";
import Image from "next/image";
import BorrowBtn from "./BorrowBtn";
import BookCover from "./BookCover";
import { Book } from "@/types";
function BookOverView({
  title,
  author,
  genre,
  rating,
  total_copies,
  available_copies,
  description,
  cover,
  color,
}: Book) {
  return (
    <section className="flex flex-col-reverse items-center gap-12 sm:gap-32 xl:flex-row xl:gap-8">
      <div className="flex flex-1 flex-col gap-5">
        <h1 className="text-5xl font-semibold text-white md:text-7xl">
          {title}
        </h1>
        <div className="mt-7 flex flex-row flex-wrap gap-4 text-xl text-white/70">
          <div className="flex items-center gap-2">
            <p>By:</p>
            <span className="font-semibold text-[#EED1AC]">{author}</span>
          </div>
          <div className="flex items-center gap-2">
            <p>Category:</p>
            <span className="text-black ms-0.5 bg-[#EED1AC] px-1 py-1 rounded-full text-sm">
              {genre.slice(
                0,
                /\s/.test(genre) ? genre.indexOf(" ") : genre.length
              )}
            </span>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <Image src={star.src} alt="star" width={20} height={20} />
            <span className="font-semibold text-[#EED1AC]">{rating}</span>
          </div>
          <div className="flex flex-row flex-wrap gap-4 mt-1">
            <p className="text-xl text-light-100">
              Total Books:{" "}
              <span className="font-semibold text-[#EED1AC]">
                {total_copies}
              </span>
            </p>
            <p className="text-xl text-light-100">
              Available Books:{" "}
              <span className="font-semibold text-[#EED1AC]">
                {available_copies}
              </span>
            </p>
          </div>
          <p className="mt-2 text-justify text-sm text-light-100">
            {description}
          </p>
        </div>
        <BorrowBtn />
      </div>
      <div className="relative flex flex-1 justify-center">
        <BookCover
          variant="wide"
          className="z-10"
          coverColor={color}
          coverUrl={cover}
        />
        <div className="absolute left-58 top-10 rotate-12 opacity-40 max-sm:hidden">
          <BookCover
            variant="wide"
            className="z-10"
            coverColor={color}
            coverUrl={cover}
          />
        </div>
      </div>
    </section>
  );
}

export default BookOverView;