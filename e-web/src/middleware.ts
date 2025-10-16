import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) { throw new Error('A variável de ambiente JWT_SECRET não foi definida.'); }

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('authToken')?.value;
  let isUserAuthenticated = false;

  if (token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      isUserAuthenticated = true;
    } catch (error) {
      console.error("Erro de verificação do JWT no middleware:", error);
      isUserAuthenticated = false;
    }
  }

  const isProtectedRoute = pathname.startsWith('/portal');

  if (isProtectedRoute && !isUserAuthenticated) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('authToken');
    return response;
  }

  if (pathname === '/login' && isUserAuthenticated) {
    return NextResponse.redirect(new URL('/portal', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
