import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeJwt(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('JWT decode error in proxy:', err);
    return null;
  }
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get('ak_token')?.value;
  const { pathname } = request.nextUrl;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const decoded = decodeJwt(token);
  if (!decoded) {
    // Clear invalid cookie
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('ak_token');
    return response;
  }

  // Check expiration
  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (decoded.exp && currentTimestamp > decoded.exp) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('ak_token');
    return response;
  }

  // Advisor routes protection
  if (pathname.startsWith('/advisor') && decoded.role !== 'advisor') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Client routes protection
  if (pathname.startsWith('/client') && decoded.role !== 'client') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/advisor/:path*',
    '/client/:path*',
  ],
};
