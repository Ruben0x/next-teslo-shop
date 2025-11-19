// app/api/orders/route.ts

import { NextResponse } from "next/server";
import { auth } from "@/auth.config";
import { prisma } from "@/lib/prisma";
import type { Address, Size } from "@/interfaces";

interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size;
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        const userId = session?.user.id;

        if (!userId) {
            return NextResponse.json(
                { ok: false, message: "No hay sesión de usuario" },
                { status: 401 }
            );
        }

        const { productsToOrder, address }:
            { productsToOrder: ProductToOrder[]; address: Address } = await req.json();


        // Obtener los productos
        const products = await prisma.product.findMany({
            where: {
                id: { in: productsToOrder.map((p) => p.productId) },
            },
        });

        const itemsInOrder = productsToOrder.reduce((sum, p) => sum + p.quantity, 0);

        const { subTotal, tax, total } = productsToOrder.reduce(
            (totals, item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) throw new Error(`${item.productId} no existe - 500`);

                const productSubTotal = product.price * item.quantity;

                totals.subTotal += productSubTotal;
                totals.tax += productSubTotal * 0.15;
                totals.total += productSubTotal + productSubTotal * 0.15;

                return totals;
            },
            { subTotal: 0, tax: 0, total: 0 }
        );

        // Transacción
        const prismaTx = await prisma.$transaction(async (tx) => {
            // 1. Actualizar stock
            const updatedProducts = await Promise.all(
                products.map((product) => {
                    const totalQtyForProduct = productsToOrder
                        .filter((p) => p.productId === product.id)
                        .reduce((acc, item) => acc + item.quantity, 0);

                    return tx.product.update({
                        where: { id: product.id },
                        data: {
                            inStock: { decrement: totalQtyForProduct },
                        },
                    });
                })
            );

            updatedProducts.forEach((p) => {
                if (p.inStock < 0) {
                    throw new Error(`${p.title} no tiene inventario suficiente`);
                }
            });

            // 2. Crear la orden
            const order = await tx.order.create({
                data: {
                    userId,
                    itemsInOrder,
                    subTotal,
                    tax,
                    total,
                    OrderItem: {
                        createMany: {
                            data: productsToOrder.map((p) => ({
                                quantity: p.quantity,
                                size: p.size,
                                productId: p.productId,
                                price: products.find((prod) => prod.id === p.productId)?.price ?? 0,
                            })),
                        },
                    },
                },
            });

            // 3. Dirección

            const cleanAddress = {
                firstName: address.firstName,
                lastName: address.lastName,
                address: address.address,
                address2: address.address2 || "",
                postalCode: address.postalCode,
                city: address.city,
                phone: address.phone,
                countryId: address.country,   // NOTE: tu store usa "country"
            };

            // const { country, ...restAddress } = address;

            const orderAddress = await tx.orderAddress.create({
                data: {
                    ...cleanAddress,
                    // countryId: country,
                    orderId: order.id,
                },
            });

            return { order, orderAddress };
        });

        return NextResponse.json({ ok: true, order: prismaTx.order });
    } catch (error: any) {
        return NextResponse.json(
            { ok: false, message: error.message || "Error en la orden" },
            { status: 500 }
        );
    }
}
