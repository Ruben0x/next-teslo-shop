import { getWebPayTransactionStatus } from '@/actions/payments';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { token_ws } = await req.json();

    if (!token_ws) {
        return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const resp = await getWebPayTransactionStatus(token_ws);


    return NextResponse.json(resp);
}