import { redirect } from "next/navigation";

interface SearchParams {
    token_ws?: string;
    error?: string;
}

export default async function WebpayResultPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const { token_ws, error } = await searchParams;

    if (error || !token_ws) {
        redirect("/webpay-result/failure");
    }

    redirect(`/webpay-result/processing?token_ws=${token_ws}`);
}