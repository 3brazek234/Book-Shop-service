"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FilterSidebar,
  FilterState,
} from "@/features/books/components/FilterSidebar";
import BookList from "@/features/books/components/BookList";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AddBook } from "@/features/books/components/AddBook";
import { Books } from "../../types";

interface PaginationMeta {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

interface LibraryViewProps {
  title: string;
  books: Books[];
  pagination: PaginationMeta;
  showAddButton?: boolean;
}

export default function LibraryView({
  title,
  books,
  pagination,
  showAddButton = false,
}: LibraryViewProps) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const updateUrl = (key: string, value: string | number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, String(value));
    } else {
      params.delete(key);
    }
    if (key !== "page") {
      params.set("page", "1");
    }

    router.push(`?${params.toString()}`, { scroll: true });
  };
const updatePage = (newPage: number) => {
     const params = new URLSearchParams(searchParams.toString());
     params.set("page", String(newPage));
     router.push(`?${params.toString()}`, { scroll: true });
  };
  const handleFilterChange = (newFilters: FilterState) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newFilters.search) {
      params.set("search", newFilters.search);
    } else {
      params.delete("search");
    }
    if (newFilters.sortBy) {
      params.set("sortBy", newFilters.sortBy);
    } else {
      params.delete("sortBy");
    }
    if (newFilters.sortOrder) {
      params.set("sortOrder", newFilters.sortOrder);
    } else {
      params.delete("sortOrder");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: true });
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4">
        <div className="mb-2 flex justify-between items-center pt-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-white">{title}</h1>
            {isMobile && (
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-white/20 text-white ml-4"
                  >
                    <Filter className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-80 p-0 bg-gray-900 border-white/10"
                >
                  <FilterSidebar
                    onFilterChange={handleFilterChange}
                    onClose={() => setIsSidebarOpen(false)}
                  />
                </SheetContent>
              </Sheet>
            )}
          </div>

          {showAddButton && (
            <Button
              onClick={() => setOpenAddDialog(true)}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Add Book +
            </Button>
          )}
        </div>

        <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
              <DialogDescription>Fill in the details below.</DialogDescription>
            </DialogHeader>
            <AddBook setOpen={setOpenAddDialog} />
          </DialogContent>
        </Dialog>

        <div className="flex gap-6">
          {!isMobile && (
            <aside className="flex-shrink-0 sticky top-4 h-fit">
              <FilterSidebar onFilterChange={handleFilterChange} />
            </aside>
          )}

          <main className="flex-1 pb-12">
            {books.length > 0 ? (
              <>
                <BookList title="" books={books} />

                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                     onClick={() => updatePage(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="border-white/20 text-white hover:bg-white/10 disabled:opacity-30"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                    </Button>
                    <span className="text-white text-sm bg-white/5 px-4 py-2 rounded-md border border-white/10">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => updatePage(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="border-white/20 text-white hover:bg-white/10 disabled:opacity-30"
                    >
                      Next <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10 mt-6">
                <p className="text-white/70 text-lg">No books found.</p>
                <Button
                  variant="link"
                  className="text-amber-400 mt-2"
                  onClick={() => router.push("?")}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
