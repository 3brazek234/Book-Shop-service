import Image from "next/image";
import star from "@/assets/icons/star.svg";
import BookCover from "./BookCover";
import { Button } from "@/components/ui/button";

interface BookCardProps {
  id: number;
  title: string;
  author: string;
  genre: string;
  rating: number;
  total_copies: number;
  available_copies: number;
  description: string;
  cover: string;
  color: string;
}

function BookCard({
  title,
  author,
  genre,
  rating,
  total_copies,
  available_copies,
  description,
  cover,
  color,
}: BookCardProps) {
  return (
    <div className="bg-white/5 rounded-lg border border-white/10 p-6 hover:bg-white/10 transition-colors">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Book Cover */}
        <div className="flex-shrink-0">
          <BookCover
            variant="medium"
            coverUrl={cover}
            coverColor={color}
            className="mx-auto sm:mx-0"
          />
        </div>

        {/* Book Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
              {title}
            </h3>

            <div className="flex flex-wrap gap-4 text-sm text-white/70 mb-3">
              <div className="flex items-center gap-1">
                <span>By:</span>
                <span className="font-medium text-[#EED1AC]">{author}</span>
              </div>

              <div className="flex items-center gap-1">
                <span>Genre:</span>
                <span className="bg-[#EED1AC] text-black px-2 py-1 rounded-full text-xs font-medium">
                  {genre.split(" / ")[0]}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Image src={star.src} alt="star" width={16} height={16} />
                <span className="font-medium text-[#EED1AC]">{rating}</span>
              </div>
            </div>

            <p className="text-sm text-white/60 line-clamp-3 mb-4">
              {description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex gap-4 text-sm">
              <div className="text-white/70">
                Total: <span className="font-medium text-[#EED1AC]">{total_copies}</span>
              </div>
              <div className="text-white/70">
                Available: <span className="font-medium text-[#EED1AC]">{available_copies}</span>
              </div>
            </div>

            <Button
              className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium px-4 py-2 rounded-lg transition-colors"
              disabled={available_copies === 0}
            >
              {available_copies === 0 ? "Not Available" : "Borrow Now"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookCard;