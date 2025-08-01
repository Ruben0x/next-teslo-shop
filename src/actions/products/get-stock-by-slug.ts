'use server'


import { prisma } from "@/lib/prisma"

export const getStockBySlug = async (slug: string): Promise<number> => {
    try {

        // await sleep(3) //Solo para ver animacion de skeleton


        const stock = await prisma.product.findFirst({

            where: { slug },
            select: { inStock: true }

        })

        return stock?.inStock ?? 0
    } catch (error) {
        return 0
    }
}