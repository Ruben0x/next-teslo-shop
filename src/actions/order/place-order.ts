'use server'


import { auth } from "@/auth.config"
import type { Address, Size } from "@/interfaces"
import { prisma } from "@/lib/prisma"

interface ProductToOrder {
    productId: string
    quantity: number
    size: Size
}

export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {

    const session = await auth()

    const userId = session?.user.id

    //Verificar sesión de usuario
    if (!userId) {
        return {
            ok: false,
            message: 'No hay sesión de usuario'
        }
    }

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds.map(p => p.productId)
            }
        }
    })

    //Calcular montos

    const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0)

    const { subTotal, tax, total } = productIds.reduce((totals, item) => {

        const productQuantity = item.quantity;

        const product = products.find(product => product.id === item.productId)

        if (!product) throw new Error(`${item.productId} no existe - 500`)

        const subTotal = product.price * productQuantity

        totals.subTotal += subTotal
        totals.tax += subTotal * 0.15
        totals.total += subTotal + (subTotal * 0.15)


        return totals
    }, { subTotal: 0, tax: 0, total: 0 })

    try {
        const prismaTx = await prisma.$transaction(async (tx) => {
            //1. actualizar stock de productos

            const updatedProductsPromises = products.map((product) => {

                //Acumular valores
                const productQuantity = productIds.filter(
                    p => p.productId === product.id
                ).reduce((acc, item) => item.quantity + acc, 0)

                if (productQuantity === 0) {
                    throw new Error(`${product.id}, no tiene cantidad definida`)
                }


                return tx.product.update({
                    where: { id: product.id },
                    data: {

                        inStock: {
                            decrement: productQuantity
                        }
                    }
                })

            })


            const updatedProducts = await Promise.all(updatedProductsPromises)


            //verificar valores negativos == no hay stock

            updatedProducts.forEach(product => {
                if (product.inStock < 0) {
                    throw new Error(`${product.title} no tiene inventario suficiente`)
                }
            });


            //2. crear la orden - Encabezadoc- detalle

            const order = await tx.order.create({
                data: {
                    userId,
                    itemsInOrder,
                    subTotal,
                    tax,
                    total,
                    OrderItem: {
                        createMany: {
                            data: productIds.map(p => ({
                                quantity: p.quantity,
                                size: p.size,
                                productId: p.productId,
                                price: products.find(product => product.id === p.productId)?.price ?? 0
                            }))
                        }
                    }
                }
            })

            //3. crear direccion de la orden

            const { country, ...resstAddress } = address
            const orderAddress = await tx.orderAddress.create({
                data: {
                    ...resstAddress,
                    countryId: country,
                    orderId: order.id
                }
            })

            return {
                order,
                orderAddress,
                updatedProducts
            }
        })

        return {
            ok: true,
            order: prismaTx.order,
            prismaTx
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return {
            ok: false,
            message: error?.message
        }
    }




}