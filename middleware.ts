import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Public routes - no authentication needed
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/api") || 
    pathname.includes("_next") ||
    pathname.includes("favicon.ico") ||
    pathname.startsWith("/assets/") ||  // Allow access to assets directory
    pathname.endsWith(".jpg") ||        // Allow access to jpg files
    pathname.endsWith(".png") ||        // Allow access to png files
    pathname.endsWith(".svg");          // Allow access to svg files

  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Try to get the token with some configurability for reliability
  const token = await getToken({ 
    req,
    secureCookie: process.env.NODE_ENV === "production",
  });
  
  const isLoggedIn = !!token;

  // Check if user is logged in for protected routes
  if (!isLoggedIn) {
    // Redirect to login
    const redirectUrl = new URL("/login", req.url);
    return NextResponse.redirect(redirectUrl);
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
  matcher: ["/((?!api|_next/static|_next/image|_next/data|assets|favicon.ico).*)"],
}; 