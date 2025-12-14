import React from 'react'
import { Sheet, SheetContent, SheetFooter, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import NavLinks from '@/components/NavLinks'
import SocialIcons from '@/components/SocialIcons'

function SideBar() {
  return (
       <div className="block md:hidden">

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6 text-amber-500 cursor-pointer rounded-tr-4xl rounded-br-4xl" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-6 bg-[#0A1019]">
            <Logo />
            <NavLinks className="flex flex-col justify-start" />
            <SheetFooter>
              <p className="text-sm text-center text-gray-500">
                &copy; {new Date().getFullYear()} Book Shelf. All rights
                reserved.
              </p>
              <SocialIcons />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
  )
}

export default SideBar