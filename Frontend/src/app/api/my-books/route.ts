import { NextRequest, NextResponse } from "next/server"
import { getUserBooks } from "@/lib/mock-data"
import { BooksResponse } from "@/types"

// GET /api/my-books
export async function GET(request: NextRequest) {
  try {
    // TODO: Get user ID from session/auth token
    // For now, using mock user ID
    const userId = "user-1" // This should come from authentication

    const books = getUserBooks(userId)

    const response: BooksResponse = {
      books,
      total: books.length,
      page: 1,
      limit: books.length,
      totalPages: 1,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching user books:", error)
    return NextResponse.json(
      { error: "Failed to fetch user books" },
      { status: 500 }
    )
  }
}

