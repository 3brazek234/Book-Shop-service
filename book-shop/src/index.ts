import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { connectDB } from './config/db' // 👈 استدعاء دالة الاتصال
import { authRouter } from './modules/auth/auth.routes'
import booksRouter from './modules/books/books.routes'

const app = new Hono()
app.get('/', (c) => c.text('Hello Book Shop! 📚'))
app.route('/auth', authRouter)
app.route('/books', booksRouter);
const startServer = async () => {
  try {
    await connectDB(); 
    
    const port = 3000;
    console.log(`🚀 Server is running on port ${port}`);

    serve({
      fetch: app.fetch,
      port
    });

  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();