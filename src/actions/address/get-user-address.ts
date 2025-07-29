'use server'

import { prisma } from "@/lib/prisma";

export const getUserAddress = async (userId: string) => {
    try {

        const userAddress = await prisma.userAddress.findUnique({
            where: { userId }
        })

        if (!userAddress) return null

        const { countryId, address2, ...rest } = userAddress
        return {
            ...rest,
            address2: address2 ? address2 : '',
            country: countryId
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo obtener la dirección'
        }
    }
}