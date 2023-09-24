import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  // if no token, redirect to home
  function middleware(req) {
    const homeUrl = new URL('/', req.url)
    if (!req.nextauth.token) {
      return NextResponse.redirect(homeUrl)
    }
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
)
//define path to be protected by auth middleware
export const config = {
  matcher: ['/profil/:path*', '/watchlist/:path*', '/portfolio/:path*'],
}
