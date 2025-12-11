import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { connectDB } from './config/db' // 👈 استدعاء دالة الاتصال
import { authRouter } from './modules/auth/auth.routes'
import booksRouter from './modules/books/books.routes'
import categoriesRouter from './modules/category/category.routes'
import { cors } from 'hono/cors'; 
const app = new Hono()
app.use('/*', cors(
  {
    origin: "http://localhost:5173",
    credentials: true,
  }
));
app.get('/', (c) => c.text('Hello Book Shop! 📚'))
app.route('/auth', authRouter)
app.route('/category', categoriesRouter)
app.route('/books', booksRouter);
const startServer = async () => {
  try {
    await connectDB(); 
    
    const port = 3001;
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