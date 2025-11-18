import { webpayCheckPayment } from "@/actions/payments";
import { redirect } from "next/navigation";

interface Props {
    searchParams: { token_ws?: string };
}

export default async function ProcessingPage({ searchParams }: Props) {
    const { token_ws } = await searchParams;

    if (!token_ws) {
        redirect("/webpay-result/failure");
    }

    const resp = await webpayCheckPayment(token_ws);

    if (resp?.ok) {
        // redirect(`/webpay-result/success?token_ws=${token_ws}`);
        redirect(`/webpay-result/success?token_ws=${token_ws}`);
    } else {
        redirect("/webpay-result/failure");
    }
}
