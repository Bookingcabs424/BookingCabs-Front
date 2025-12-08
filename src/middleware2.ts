import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("isLoggedIn")?.value;
    const path = request.nextUrl.pathname;
 
  if (path === "/") {
    return NextResponse.next();
  }
  if (!token ) {
    // return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
 matcher: [
    "/((?!^$|login|signup|api|_next|favicon.ico|static|public).*)",
  ]
  
  };
