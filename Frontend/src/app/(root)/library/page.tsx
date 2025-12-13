"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { getBooks } from "@/services"
import { FilterSidebar, FilterState } from "@/features/books/components/FilterSidebar"
import BookList from "@/features/books/components/BookList"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Filter } from "lucide-react"
import toast from "react-hot-toast"
import type { Book as ApiBook } from "@/types"

interface Book {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  createdAt: Date | null;
  user: {
    name: string
  }
}

export default function LibraryPage() {
  const isMobile = useIsMobile()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  })
  const limit = 10

  const queryParams = {
    page,
    limit,
    search: filters.search || undefined,

  }

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["books", queryParams],
    queryFn: () => getBooks(queryParams),
    staleTime: 1000 * 60 * 5, 
  })
  useEffect(() => {
    setPage(2)
  }, [filters])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (error) {
    toast.error("Failed to load books. Please try again.")
  }



  const FilterSidebarContent = (
    <FilterSidebar
      onFilterChange={handleFilterChange}
      onClose={isMobile ? () => setIsSidebarOpen(false) : undefined}
    />
  )

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4">
        {/* Header */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-white">Library</h1>
            {isMobile && (
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="border-white/20 text-white">
                    <Filter className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0 bg-gray-900 border-white/10">
                  {FilterSidebarContent}
                </SheetContent>
              </Sheet>
            )}
          </div>
          <p className="text-white/70">Browse and discover books from our collection</p>
        </div>

        <div className="flex gap-6">
          {!isMobile && (
            <aside className="flex-shrink-0">
              {FilterSidebarContent}
            </aside>
          )}

          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-4">
                    <Skeleton className="w-full h-[199px] bg-white/10" />
                    <Skeleton className="w-3/4 h-4 bg-white/10" />
                    <Skeleton className="w-1/2 h-3 bg-white/10" />
                  </div>
                ))}
              </div>
            ) : data.data.length > 0 ? (
              <>
                <BookList title="" books={data.data} />
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-white/70 text-lg">No books found. Try adjusting your filters.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
