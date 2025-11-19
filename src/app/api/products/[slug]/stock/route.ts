import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {

    const { slug } = await params
    try {
        const product = await prisma.product.findUnique({
            where: { slug: slug },
            select: { inStock: true }
        });

        return NextResponse.json({ stock: product?.inStock ?? 0 });
    } catch (error) {
        return NextResponse.json({ stock: 0 });
    }
}