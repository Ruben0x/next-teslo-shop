'use server'

import { auth } from "@/auth.config"
import { WebpayResponse } from "@/interfaces"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"


const commerceCode = process.env.Tbk_Api_Key_Id || ''
const apiKey = process.env.Tbk_Api_Key_Secret || ''
const webpayUrl = process.env.TB_Host + '/rswebpaytransaction/api/webpay/v1.2/transactions'




// const response = await transaction.create(
//     buyOrder,
//     sessionId,
//     amount,
//     returnUrl
// );




export const getWebPayToken = async (amount: number, buy_order: string, return_url: string, orderId: string) => {

    const session = await auth()

    const session_id = session?.user.id

    // console.log(JSON.stringify({ amount, session_id, buy_order, return_url }));


    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Tbk-Api-Key-Id", commerceCode);
    myHeaders.append("Tbk-Api-Key-Secret", apiKey);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
            buy_order,
            session_id,
            amount: Math.round(amount),
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${return_url}`,
        }),
        // redirect: "follow"
    }

    try {
        const result = await fetch(webpayUrl, {
            ...requestOptions,
            cache: "no-store"
        })
            .then((response) => response.json())


        if (!result.token) {
            return {
                ok: false,
                message: 'Error al obtener el token de WebPay',
                error: result
            }
        }

        // Guardar el token como transactionId en la orden
        const saveTokenResult = await saveTokenAsTransactionId(result.token, orderId)

        if (!saveTokenResult.ok) {
            return {
                ok: false,
                message: 'Error al guardar el token de transacción',
                error: saveTokenResult.message
            }
        }


        return result

    } catch (error) {
        console.log(error);
        return null
    }



}


const saveTokenAsTransactionId = async (token: string, orderId: string): Promise<{ ok: boolean; message?: string }> => {
    if (!token || !orderId) {
        return {
            ok: false,
            message: 'Token o ID de orden no proporcionados'
        }
    }
    try {
        await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                transactionId: token
            }
        })
        return { ok: true }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Error al guardar el token de transacción'
        }
    }
}


export const getWebPayTransactionStatus = async (token: string): Promise<WebpayResponse | null> => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Tbk-Api-Key-Id", commerceCode);
    myHeaders.append("Tbk-Api-Key-Secret", apiKey);

    const requestOptions = {
        method: "PUT",
        headers: myHeaders,
    };

    try {
        const result = await fetch(`${webpayUrl}/${token}`, {
            ...requestOptions,
            cache: "no-store"
        })
            .then((response) => response.json())

        console.log({ result });

        return result

    } catch (error) {
        console.log(error);
        return null
    }
}


export const webpayCheckPayment = async (token: string) => {

    const transtactionStatus = await getWebPayTransactionStatus(token)

    console.log({ transtactionStatus });

    if (transtactionStatus?.vci !== 'TSY') {
        return {
            ok: false,
            message: 'Transacción no autorizada'
        }
    }

    try {
        //marcar la orden como pagada
        const order = await prisma.order.findFirst({
            where: {
                transactionId: token
            }
        })

        if (!order) {
            return {
                ok: false,
                message: 'Orden no encontrada'
            }
        }

        if (order.isPaid) {
            return {
                ok: true,
                message: 'Orden ya fue pagada'
            }
        }

        await prisma.order.update({
            where: {
                id: order.id
            },
            data: {
                isPaid: true,
                paidAt: new Date(),
                paymentType: 'webpay'
            }
        })

        // revalidatePath(`/webpay-result?token_ws=${token}`)

        return {
            ok: true,
            orderId: order.id,
            message: 'Pago verificado correctamente'
        }
    }
    catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'El pago no se pudo realizar'
        }
    }

}




