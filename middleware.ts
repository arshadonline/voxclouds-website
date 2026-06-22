import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'voxclouds-secret-change-in-prod-32chars!!'
)

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('vc_token')?.value
  const path = request.nextUrl.pathname

  // Public paths
  if (path === '/login' || path === '/signup' || path.startsWith('/api/signup') || (path.startsWith('/api/auth') && !path.includes('/me'))) {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const { payload } = await jwtVerify(token, SECRET)

    // Admin route protection
    if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
      if (payload.type !== -1) {
        return NextResponse.redirect(new URL('/dialpad', request.url))
      }
    }

    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/dialpad',
    '/calls',
    '/support',
    '/account',
    '/api/balance',
    '/api/cdrs',
    '/api/sip-config',
    '/api/auth/me',
  ],
}
