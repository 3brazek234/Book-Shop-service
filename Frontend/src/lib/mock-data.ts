import { Book, User } from "@/types"

// Mock in-memory data storage
let books: Book[] = [
  {
    id: "1",
    title: "The Midnight Library",
    price: 15.99,
    thumbnail: "https://placehold.co/400x600.png",
    author: "Matt Haig",
    category: "Fiction",
    description: "A novel about a library that contains books with different versions of your life.",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Atomic Habits",
    price: 12.99,
    thumbnail: "https://placehold.co/400x600.png",
    author: "James Clear",
    category: "Self-Help",
    description: "An easy and proven way to build good habits and break bad ones.",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    title: "The Seven Husbands of Evelyn Hugo",
    price: 14.99,
    thumbnail: "https://placehold.co/400x600.png",
    author: "Taylor Jenkins Reid",
    category: "Fiction",
    description: "A captivating novel about a reclusive Hollywood icon.",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
]

// Mock users (for my-books endpoint)
const mockUsers: User[] = [
  {
    id: "user-1",
    email: "admin@books.com",
    name: "Admin User",
    role: "admin",
  },
]

// User-book ownership mapping (user ID -> book IDs)
const userBooks: Record<string, string[]> = {
  "user-1": ["1", "2"],
}

// Export functions to interact with mock data
export const getBooks = (): Book[] => [...books]

export const getBookById = (id: string): Book | undefined => {
  return books.find((book) => book.id === id)
}

export const createBook = (bookData: Omit<Book, "id" | "createdAt" | "updatedAt">): Book => {
  const newBook: Book = {
    ...bookData,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  books.push(newBook)
  return newBook
}

export const updateBook = (id: string, updates: Partial<Book>): Book | null => {
  const index = books.findIndex((book) => book.id === id)
  if (index === -1) return null

  books[index] = {
    ...books[index],
    ...updates,
    updatedAt: new Date(),
  }
  return books[index]
}

export const deleteBook = (id: string): boolean => {
  const index = books.findIndex((book) => book.id === id)
  if (index === -1) return false

  books.splice(index, 1)
  return true
}

export const getUserBooks = (userId: string): Book[] => {
  const bookIds = userBooks[userId] || []
  return books.filter((book) => bookIds.includes(book.id))
}

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find((user) => user.id === id)
}

export const getUserByEmail = (email: string): User | undefined => {
  return mockUsers.find((user) => user.email === email)
}

