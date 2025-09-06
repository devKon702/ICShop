import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Not allow to
  if (hostname === "localhost:3000" && url.pathname.startsWith("/admin")) {
    return NextResponse.redirect("localhost:3000"); // hoặc 404
  }

  // Nếu là admin subdomain nhưng không vào route admin thì chuyển hướng
  if (
    hostname === "admin.localhost:3000" &&
    !url.pathname.startsWith("/admin")
  ) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
