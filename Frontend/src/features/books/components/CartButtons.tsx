import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

function CartButtons() {
  return (
    <div className="w-full flex">
      <AlertDialog>
        <AlertDialogTrigger>
          <button className="w-full text-white text-xs bg-amber-400 rounded-tl-lg rounded-bl-lg p-4">
            Add To Cart
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              How would you like to add this book?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please choose an option to add Book Title to your cart.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Button>Add to Purchase Cart</Button>
            </AlertDialogCancel>
            <AlertDialogAction>
              <Button>Add to Borrowing Cart </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <button className=" bg-gray-800 p-2 rounded-tr-lg rounded-br-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
        <Heart className="ml-2 text-white hover:text-red-500" />
      </button>
    </div>
  );
}

export default CartButtons;
