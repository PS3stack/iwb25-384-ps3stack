import { NextResponse, type NextRequest } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = [
  '/admin',
  '/observer', 
  '/field-staff',
  '/support',
  '/census',
  '/voters',
  '/elections',
  '/monitoring'
]

// Define public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/',
  '/public'
]

// Role-based route access
const roleRoutes = {
  admin: ['/admin'],
  observer: ['/observer'],
  field_staff: ['/field-staff'],
  polling_staff: ['/polling-staff']
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get('auth_token')?.value

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route))

  // Allow public routes without authentication
  if (isPublicRoute && !isProtectedRoute) {
    return NextResponse.next()
  }

  // Redirect to login if no auth token for protected routes
  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If we have a token, validate it and check role permissions
  if (authToken && isProtectedRoute) {
    try {
      // Decode the token to get user info
      const tokenParts = authToken.split('.')
      if (tokenParts.length !== 2) {
        throw new Error('Invalid token format')
      }

      // Decode base64 payload
      const payload = JSON.parse(atob(tokenParts[0]))
      const currentTime = Math.floor(Date.now() / 1000)

      // Check if token is expired
      if (payload.exp < currentTime) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        loginUrl.searchParams.set('expired', 'true')
        const response = NextResponse.redirect(loginUrl)
        response.cookies.delete('auth_token')
        return response
      }

      // Check role-based access
      const userRole = payload.role as string
      const roleId = payload.role_id as number

      // Admin can access everything
      if (roleId === 1) {
        return NextResponse.next()
      }

      // Check specific role permissions
      if (pathname.startsWith('/admin') && roleId !== 1) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }

      if (pathname.startsWith('/observer') && roleId !== 2 && roleId !== 1) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }

      if (pathname.startsWith('/field-staff') && roleId !== 3 && roleId !== 1) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }

      // Valid token and authorized role
      return NextResponse.next()

    } catch (error) {
      console.error('Token validation error:', error)
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('auth_token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
