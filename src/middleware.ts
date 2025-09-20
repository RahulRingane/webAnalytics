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

import { NextResponse } from "next/server";
import { auth } from "./auth";
import { DEFAULT_LOGIN_REDIRECT, PUBLIC_ROUTES, AUTH_ROUTES } from "@/routes";
import { cookies } from "next/headers";

export default auth(async (req) => {
  const { nextUrl } = req;
  const token =(await cookies()).get("authjs.session-token"); 
  const isAuthenticated = !!token;

  // Allow specific paths without auth
  if (
    nextUrl.pathname === "/api/track" ||
    nextUrl.pathname === "/tracking-script.js"
  ) {
    console.log("Passed");
    return NextResponse.next();
  }

  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isApiRoute = nextUrl.pathname.startsWith("/api");

  console.log("isAuthenticated", isAuthenticated, "path:", nextUrl.pathname);

  // Always allow API & public routes
  if (isApiRoute || isPublicRoute) {
    return NextResponse.next();
  }

  // If user is signed in and tries to visit an auth page (e.g. /signin), redirect them
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
  }

  // If user is not signed in and tries to visit a protected route, redirect to signin
  if (!isAuthenticated && !isAuthRoute) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // Otherwise just continue
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
