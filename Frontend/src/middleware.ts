import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 1. هل التوكن موجود في الكوكيز؟
  const token = request.cookies.get('token')?.value

  // 2. تحديد المسارات المحمية (اللي لازم لوجين)
  const protectedPaths = ['/my-books', '/books/create', '/authors/new', '/profile']
  
  // 3. هل المسار الحالي واحد منهم؟
  const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}