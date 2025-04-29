import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req });
  const isLoggedIn = !!token;
  
  // Public routes - no authentication needed
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/api");

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check if user is logged in for protected routes
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based access control
  const userRole = token?.role;
  const isAdminRoute = pathname.startsWith("/admin");
  const isRunnerRoute = pathname.startsWith("/runner");
  const isMarshalRoute = pathname.startsWith("/marshal");

  if (isAdminRoute && userRole !== "Admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isRunnerRoute && userRole !== "Runner" && userRole !== "Admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isMarshalRoute && userRole !== "Marshal" && userRole !== "Admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// See https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}; 