import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const roleId = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  // Daftar path yang memerlukan autentikasi administrator
  const adminProtectedPaths = [
    "/settings",
    "/settings/pages",
    "/settings/roles",
    "/settings/users",
  ];

  // If the user is not logged in and trying to access protected routes
  if (!token && pathname !== "/auth") {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // If the user is logged in and trying to access auth page
  if (token && pathname === "/auth") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If the user is trying to access admin-only routes
  if (adminProtectedPaths.some((path) => pathname.startsWith(path))) {
    if (!token || roleId !== "66f4ef543336e7123f662bd1") {
      console.log(
        "Access denied to admin route. Token:",
        token,
        "RoleId:",
        roleId
      ); // Tambahkan log ini
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
