import Image from "next/image";
import React from "react";
import borrowNowImage from "@/assets/images/debby-hudson-ERb-JXVwAfo-unsplash.jpg";
import { Button } from "./ui/button";

function BorrowNow() {
  return (
    <div className="mt-24 flex rounded-3xl shadow shadow-stone-400 overflow-hidden bg-white">
      <div className="w-1/2 hidden md:block">
        <Image
          src={borrowNowImage}
          alt="Borrow Now"
          className="h-full w-full object-cover rounded-l-3xl"
        />
      </div>

      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center text-center space-y-4">
        <h2 className="text-3xl font-bold text-amber-500">
          Get Started with Borrowing
        </h2>
        <p className="text-base text-gray-600 max-w-md">
          Sign up now to access our borrowing services quickly and securely.
          Join our growing community and unlock financial flexibility.
        </p>
        <p className="text-sm text-gray-500 max-w-md">
          Learn more about our flexible repayment options and low interest
          rates. We are committed to providing transparent and fair services.
        </p>
        <Button className="mt-4 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-full shadow-md">
          Borrow Now
        </Button>
        <div className="text-xs text-gray-400 mt-2">
          <p>*Terms and conditions apply. Subject to approval.</p>
        </div>
      </div>
    </div>
  );
}

export default BorrowNow;
