import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DEFAULT_LOGIN_REDIRECT, PUBLIC_ROUTES, AUTH_ROUTES } from "@/routes";

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const token = (await cookies()).get("__Secure-authjs.session-token");
  const isAuthenticated = !!token;

  const pathname = nextUrl.pathname;

  // Always allow API & public routes
  if (pathname.startsWith("/api") || PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // Redirect signed-in users away from auth pages
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
  }

  // Redirect not-signed-in users away from protected pages
  if (!isAuthenticated && !isAuthRoute) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
