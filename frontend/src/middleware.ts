import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Redirect /admin on localhost:3000 to /
  if (hostname === "localhost:3000" && url.pathname.startsWith("/admin")) {
    return NextResponse.redirect("localhost:3000"); // hoặc 404
  }

  // Rewrite to /admin
  if (hostname === "admin.localhost:3000") {
    return NextResponse.rewrite(new URL(`/admin${url.pathname}`, url.origin));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
