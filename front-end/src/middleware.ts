import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoggedIn = request.cookies.get('is_logged_in')?.value === 'true';
  const peran = request.cookies.get('peran')?.value; 

  const isPublicPage =
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/register';

  // 1. PUBLIC PAGE LOGIC
  if (isPublicPage) {
    if (isLoggedIn && peran) {
      const target = peran === 'admin' ? '/admin/dashboard' : '/dashboard';
      return NextResponse.redirect(new URL(target, request.url));
    }
    return NextResponse.next();
  }

  // 2. PROTECTED ROUTE CHECK
  const isProtectedRoute =
    pathname.startsWith('/admin') || 
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/katalog') ||
    pathname.startsWith('/peminjaman') ||
    pathname.startsWith('/pengembalian') ||
    pathname.startsWith('/profile');

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. ROLE CHECK (Authorization)
  
  // Guard untuk Admin
  if (pathname.startsWith('/admin')) {
    if (peran !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Guard untuk User Route (/dashboard, /katalog, dll)
  const isUserRoute = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/katalog') ||
    pathname.startsWith('/peminjaman') ||
    pathname.startsWith('/pengembalian') ||
    pathname.startsWith('/profile');

  if (isUserRoute) {
    // Admin tidak boleh masuk ke rute user biasa, arahkan ke admin dashboard
    if (peran === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // Hanya izinkan jika peran adalah user, siswa, atau guru
    const allowedRoles = ['user', 'siswa', 'guru'];
    if (!peran || !allowedRoles.includes(peran)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/admin/:path*',
    '/dashboard/:path*',
    '/katalog/:path*',
    '/peminjaman/:path*',
    '/pengembalian/:path*',
    '/profile/:path*',
  ],
};