import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // For now, allow all routes - will implement auth checks later
  // TODO: Fetch user from auth service via proxy
  // TODO: Enforce onboarding completion
  // TODO: Admin protection

  return NextResponse.next();
}

export const config = {
  matcher: ["/onboarding/:path*", "/app/:path*", "/admin/:path*"],
};

