import { redirect } from "next/navigation";

interface Props {
    searchParams: { token_ws?: string; error?: string };
}

export default async function WebpayResultPage({ searchParams }: Props) {
    const { token_ws, error } = searchParams;

    if (error || !token_ws) {
        redirect("/webpay-result/failure");
    }

    // Redirige a un handler que procesa la compra en servidor
    redirect(`/webpay-result/processing?token_ws=${token_ws}`);
}
