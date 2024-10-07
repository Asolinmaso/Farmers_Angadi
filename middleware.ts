import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/cart", "/profile"]; // Add more protected routes as needed

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const token = await getToken({ req: request, secret: process.env.JWT_SECRET });

  const currentPath = request.nextUrl.pathname;

  // Check if the route is protected
  if (protectedRoutes.includes(currentPath)) {
    // If token or role is not present, redirect to authentication page
    if (!token || !token.role) {
      return NextResponse.redirect(new URL("/authentication", request.url));
    }
  }

  // Allow access to all other routes
  return NextResponse.next();
}

// Define the paths that the middleware should run on
export const config = {
  matcher: [
    "/",           // Homepage
    "/about",       // Cart page (protected)
    "/products",    // Profile page (protected)
    "/dashboard",  // Example of additional protected routes
  ],
};
