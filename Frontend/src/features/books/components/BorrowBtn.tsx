import { Book } from "lucide-react"
import { Button } from "@/components/ui/button"

function BorrowBtn() {
  return (
   <Button variant="default" size="lg" className="bg-[#EED1AC] text-black hover:bg-[#EED1AC]/90 transition-colors duration-300 flex gap-2 items-center cursor-pointer font-bebas-neue text-xl">
     <Book size={30} />
    Borrow Book Request
   </Button>
)
}

export default BorrowBtn