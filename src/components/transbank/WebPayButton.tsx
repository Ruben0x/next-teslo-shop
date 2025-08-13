'use client';

import { getWebPayToken } from "@/actions/payments";

interface Props {
    amount: number;
    buyOrder: string;
    orderId: string
}



export const WebPayButton = ({ amount, buyOrder, orderId }: Props) => {

    const handleOnClick = async () => {

        // const resp = await getWebPayToken(amount, buyOrder, 'api/webpay/commit', orderId)
        const resp = await getWebPayToken(amount, buyOrder, 'webpay-result', orderId)

        console.log({ resp });

        if (!resp?.token || !resp?.url) {
            console.error('Error obteniendo token de WebPay', resp);
            return;
        }

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = resp.url;

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'token_ws';
        input.value = resp.token;

        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
    }

    return (
        <div className="btn-primary" onClick={handleOnClick}>WebPayButton</div>
    )
}