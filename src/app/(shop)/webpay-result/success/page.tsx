import { prisma } from "@/lib/prisma";

interface Props {
    searchParams: {
        token_ws?: string;
    };
}

export default async function SuccessPage({ searchParams }: Props) {
    const { token_ws } = await searchParams;

    const order = await prisma.order.findFirst({
        where: { transactionId: token_ws },
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
