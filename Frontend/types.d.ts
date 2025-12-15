
export type Books = {
  id: string
  title: string
  userId: string
  description: string
  price: string
  coverImage: string
  publicationYear: string
  authorId: string
  categoryId: string
  createdAt: string
  updatedAt: string
  category: {
    id: string
    name: string
  }
  user: {
    id: string
    name: string
    email: string
  }
}

interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
  universityId: number;
  universityCard: string;
}

interface BookParams {
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverUrl: string;
  coverColor: string;
  description: string;
  totalCopies: number;
  videoUrl: string;
  summary: string;
}

interface BorrowBookParams {
  bookId: string;
  userId: string;
}