import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuth } from "firebase/auth";
import { app } from "@/lib/firebaseConfig"; // Firebase config here


// Paths that don't require authentication
const publicPaths = ["/login", "/signup", "/about", "landing"];

export function middleware(req: NextRequest) {
  const auth = getAuth(app); // Firebase Auth
  const currentUser = auth.currentUser; // Check current user

  const { pathname } = req.nextUrl;

  // If user is not authenticated and trying to access protected route
  if (!currentUser && !publicPaths.includes(pathname)) {
    // Redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If user is authenticated and tries to access login/signup, redirect to dashboard
  if (currentUser && ["/login", "/signup"].includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next(); // Allow access
}
