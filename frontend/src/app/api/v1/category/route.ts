import { prisma } from "@/libs/server/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const products = await prisma.product.findFirst({
    include: { activeWholesale: { include: { details: true } } },
  });
  const url = new URL(req.url);
  console.log(url);
  return NextResponse.json({ message: products });
}
