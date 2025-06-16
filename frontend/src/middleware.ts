import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  console.log(req.url);
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
