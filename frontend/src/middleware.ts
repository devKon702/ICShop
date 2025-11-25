import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";
  // Redirect /admin on localhost:3000 to /
  if (hostname === "localhost" && url.pathname.startsWith("/admin")) {
    return NextResponse.redirect(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/"
        : process.env.NEXT_PUBLIC_CLIENT_URL || "/"
    ); // hoặc 404
  }
  // Rewrite to /admin
  if (hostname.startsWith("admin.")) {
    return NextResponse.rewrite(new URL(`/admin${url.pathname}`, url.origin));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
