'use client'

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { CreateOrderActions, CreateOrderData, OnApproveActions, OnApproveData } from "@paypal/paypal-js"
import { paypalCheckPayment, setTransactionId } from "@/actions/payments"

interface Props {
    orderId: string,
    amount: number
}

export const PayPalButton = ({ amount, orderId }: Props) => {

    const [{ isPending }] = usePayPalScriptReducer()

    const roundedAmount = (Math.round(amount * 100) / 100).toString()

    if (isPending) {
        return (
            <div className="animate-pulse mb-16">
                <div className="h-11 bg-gray-300 rounded" />
                <div className="h-11 bg-gray-300 rounded mt-2" />
            </div>
        )
    }

    const createOrder = async (data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {
        const transactionId = await actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    invoice_id: orderId,
                    amount: {
                        currency_code: 'USD',
                        value: roundedAmount,
                    }
                }
            ]
        })

        const { ok } = await setTransactionId(transactionId, orderId)

        if (!ok) {
            throw new Error('No se pudo actualizar la orden')
        }

        return transactionId
    }

    const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
        const details = await actions.order?.capture();
        if (!details || !details?.id) return;

        await paypalCheckPayment(details.id)

    }

    return (
        <div className="relative z-0">
            <PayPalButtons
                createOrder={createOrder}
                onApprove={onApprove}
            />
        </div>
    )
}