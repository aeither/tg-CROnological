// webhook.ts

import type Env from "../environment";

export interface WebhookPayload {
    id: string;
    action: string;
    data: Record<string, any>;
    timestamp: string;
}

export async function handleWebhook(req: Request, env: Env): Promise<Response> {
    
    // Verify request method
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        const payload = (await req.json()) as WebhookPayload;

        // Handle different webhook actions
        switch (payload.action) {
            case 'create_wallet':
                return await handleCreateWallet(payload.data, env);
            case 'fetch_onchain_data':
                return await handleFetchOnchainData(payload.data, env);
            default:
                return new Response(`Unknown action: ${payload.action}`, { status: 400 });
        }
    } catch (error) {
        console.error('Webhook error:', error);
        return new Response('Invalid payload', { status: 400 });
    }
}

async function handleCreateWallet(
    data: Record<string, any>,
    env: Env
): Promise<Response> {
    try {
        // Implement wallet creation logic here
        // Example:
        // const wallet = await createNewWallet();
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: 'Failed to create wallet' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}

async function handleFetchOnchainData(
    data: Record<string, any>,
    env: Env
): Promise<Response> {
    try {
        // Implement onchain data fetching logic here
        // Example:
        // const onchainData = await fetchOnchainData(data.address);
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: 'Failed to fetch onchain data' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
