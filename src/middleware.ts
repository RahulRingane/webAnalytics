/*import { DEFAULT_LOGIN_REDIRECT, PUBLIC_ROUTES, AUTH_ROUTES } from "@/routes";
import { NextResponse } from "next/server";
import { auth } from "./auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default auth((req: any) => {
  const { nextUrl } = req;

  const isAuthenticated = !!req.auth;

  if (
    nextUrl.pathname === "/api/track" ||
    nextUrl.pathname === "/tracking-script.js"
  ) {
    console.log("Passed");
    return NextResponse.next();
  }

  console.log("isAuthenticated", isAuthenticated);

  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);
  if (
    nextUrl.pathname.startsWith("/api") ||
    PUBLIC_ROUTES.includes(nextUrl.pathname)
  ) {
    return NextResponse.next(); // Allow the request to proceed
  }

  if (isAuthRoute && isAuthenticated)
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
    console.log(req.url) 

  if (!isAuthenticated && !isAuthRoute)
    return NextResponse.redirect(new URL("/signin", req.url));
    console.log(req.url) 
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
*/

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
