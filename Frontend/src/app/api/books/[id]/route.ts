import { NextRequest, NextResponse } from "next/server"
import { getBookById, updateBook, deleteBook } from "@/lib/mock-data"
import { UpdateBookDto } from "@/types"

// GET /api/books/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const book = getBookById(params.id)

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error("Error fetching book:", error)
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 }
    )
  }
}

// PUT /api/books/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: UpdateBookDto = await request.json()

    const updatedBook = updateBook(params.id, body)

    if (!updatedBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json(updatedBook)
  } catch (error) {
    console.error("Error updating book:", error)
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    )
  }
}

// DELETE /api/books/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = deleteBook(params.id)

    if (!deleted) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Book deleted successfully" })
  } catch (error) {
    console.error("Error deleting book:", error)
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    )
  }
}

