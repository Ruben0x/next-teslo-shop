import { prisma } from "@/lib/prisma";

export default async function SuccessPage({ searchParams }: { searchParams: { token_ws?: string } }) {
    const order = await prisma.order.findFirst({
        where: { transactionId: searchParams.token_ws },
        // cacheStrategy: { ttl: 0 }, // Evitar caché
    });

    return (
        <div>
            <h1>✅ Pago exitoso</h1>
            <p>Orden: {order?.id}</p>
            <p>Monto: {order?.total}</p>
            <p>Fecha: {order?.paidAt?.toLocaleString()}</p>
        </div>
    );
}
