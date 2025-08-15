import { NextResponse } from "next/server";

const publicRoutes = ["/login", "/signup"];

export function middleware(req) {
  const path = req.nextUrl.pathname;

  const isPublicRoute = publicRoutes.includes(path);
  const session = req.cookies.get("session")?.value;

  if (path.startsWith("/api")) {
    return NextResponse.next();
  }

  if (!isPublicRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.png).*)",
  ],
};
