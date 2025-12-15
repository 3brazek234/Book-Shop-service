"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void
  onClose?: () => void
}

export interface FilterState {
  search: string
  category?: string
  author?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: "title" | "author" | "price" | "createdAt"
  sortOrder?: "asc" | "desc"
}

const SORT_OPTIONS = [
  { value: "title", label: "Title" },
  { value: "author", label: "Author" },
  { value: "price", label: "Price" },
  { value: "createdAt", label: "Date Added" },
]

export const FilterSidebar = ({ onFilterChange, onClose }: FilterSidebarProps) => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  })

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  return (
    <div className="w-64 bg-gray-900/50 border-r border-white/10 p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Filters</h3>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-black"
          >
            ✕
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white/90 mb-2">
          Search
        </label>
        <Input
          type="text"
          placeholder="Search books..."
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
        />
      </div>

      <Separator className="bg-white/10 mb-6" />

      {/* Sort By */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white/90 mb-2">
          Sort By
        </label>
        <select
          value={filters.sortBy || "createdAt"}
          onChange={(e) => updateFilter("sortBy", e.target.value)}
          className="w-full h-9 rounded-md border bg-white/5 border-white/10 text-black px-3 py-1 text-sm"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Order */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white/90 mb-2">
          Order
        </label>
        <select
          value={filters.sortOrder || "desc"}
          onChange={(e) => updateFilter("sortOrder", e.target.value)}
          className="w-full h-9 rounded-md border bg-white/5 border-white/10 text-black px-3 py-1 text-sm"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <Separator className="bg-white/10 mb-6" />

      {/* Category Filter */}
      {/* <div className="mb-6">
        <label className="block text-sm font-medium text-black mb-2">
          Category
        </label>
        <select
          value={filters.category || ""}
          onChange={(e) => updateFilter("category", e.target.value || undefined)}
          className="w-full h-9 rounded-md border bg-white/5 border-white/10 text-white px-3 py-1 text-sm"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div> */}

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white/90 mb-2">
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ""}
            onChange={(e) =>
              updateFilter("minPrice", e.target.value ? Number(e.target.value) : undefined)
            }
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ""}
            onChange={(e) =>
              updateFilter("maxPrice", e.target.value ? Number(e.target.value) : undefined)
            }
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
        </div>
      </div>

      <Separator className="bg-white/10 mb-6" />

      {/* Clear Filters */}
      <Button
        variant="outline"
        onClick={clearFilters}
        className="w-full border-white/20 text-white/90 hover:bg-white/10 hover:text-white"
      >
        Clear Filters
      </Button>
    </div>
  )
}
