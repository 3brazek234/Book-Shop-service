import { NextRequest, NextResponse } from "next/server"
import {
  getBooks,
  createBook,
} from "@/lib/mock-data"
import { BooksQueryParams, BooksResponse, CreateBookDto } from "@/types"

// GET /api/books
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const sort = (searchParams.get("sort") || "title") as BooksQueryParams["sort"]
    const order = (searchParams.get("order") || "asc") as "asc" | "desc"

    let books = getBooks()

    // Apply search filter
    if (search) {
      books = books.filter(
        (book) =>
          book.title.toLowerCase().includes(search.toLowerCase()) ||
          book.author.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Apply sorting
    books.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sort) {
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case "author":
          aValue = a.author.toLowerCase()
          bValue = b.author.toLowerCase()
          break
        case "price":
          aValue = a.price
          bValue = b.price
          break
        case "createdAt":
          aValue = a.createdAt?.getTime() || 0
          bValue = b.createdAt?.getTime() || 0
          break
        default:
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
      }

      if (aValue < bValue) return order === "asc" ? -1 : 1
      if (aValue > bValue) return order === "asc" ? 1 : -1
      return 0
    })

    // Apply pagination
    const total = books.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedBooks = books.slice(startIndex, endIndex)

    const response: BooksResponse = {
      books: paginatedBooks,
      total,
      page,
      limit,
      totalPages,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching books:", error)
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    )
  }
}

// POST /api/books
export async function POST(request: NextRequest) {
  try {
    const body: CreateBookDto = await request.json()

    // Validate required fields
    if (
      !body.title ||
      !body.author ||
      !body.category ||
      !body.description ||
      body.price === undefined ||
      !body.thumbnail
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const newBook = createBook({
      title: body.title,
      price: body.price,
      thumbnail: body.thumbnail,
      author: body.author,
      category: body.category,
      description: body.description,
    })

    return NextResponse.json(newBook, { status: 201 })
  } catch (error) {
    console.error("Error creating book:", error)
    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 }
    )
  }
}

