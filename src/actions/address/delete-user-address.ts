'use server'

import { prisma } from "@/lib/prisma";

export const deleteUserAdrress = async (userId: string) => {
    try {

        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {

            return {
                ok: false,
                message: 'usuario no existe'
            }
        } else {

            await prisma.userAddress.delete({
                where: { userId }
            })
        }

        return {
            ok: true,
            message: 'Direccion eliminada'
        }


    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo eliminar la dirección'
        }
    }
}