import { redirect } from "next/navigation";

export default async function WebpayResultPage({
    searchParams,
}: {
    searchParams: Promise<{ token_ws?: string; error?: string }>;
}) {
    const { token_ws, error } = await searchParams;

    if (error || !token_ws) {
        redirect("/webpay-result/failure");
    }

    redirect(`/webpay-result/processing?token_ws=${token_ws}`);
}
