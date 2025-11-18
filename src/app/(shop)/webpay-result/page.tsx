import { redirect } from "next/navigation";

export default async function WebpayResultPage({
    searchParams,
}: {
    searchParams?: { token_ws?: string; error?: string };
}) {

    const token_ws = searchParams?.token_ws;
    const error = searchParams?.error;

    if (error || !token_ws) {
        redirect("/webpay-result/failure");
    }

    redirect(`/webpay-result/processing?token_ws=${token_ws}`);
}
