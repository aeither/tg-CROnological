import { Client, CronosZkEvm, Wallet } from '@crypto.com/developer-platform-client';
import type Env from "../environment";

export interface WebhookPayload {
    id: string;
    action: string;
    data: Record<string, any>;
    timestamp: string;
}

interface QueryRequest {
    query: string;
    options: {
        openAI: {
            apiKey: string;
        };
        chainId: number;
        explorer: {
            apiKey: string;
        };
    };
}

export async function handleWebhook(req: Request, env: Env): Promise<Response> {
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        const payload = (await req.json()) as WebhookPayload;

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
        // Initialize client
        Client.init({
            chain: CronosZkEvm.Testnet,
            apiKey: env.EXPLORER_API_KEY,
        });

        // Create wallet
        const wallet = await Wallet.create();

        // Send telegram notification
        const message = `New wallet created!\nAddress: ${wallet.data.address}`;
        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${env.BOT_TOKEN_DEV}/sendMessage`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: data.chatId,
                    text: message,
                }),
            }
        );

        if (!telegramResponse.ok) {
            throw new Error('Failed to send Telegram notification');
        }

        return new Response(
            JSON.stringify({
                success: true,
                address: wallet.data.address,
                privateKey: wallet.data.privateKey,
                mnemonic: wallet.data.mnemonic,
                notification: await telegramResponse.json()
            }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        }
        );
    } catch (error) {
        console.error('Create wallet error:', error);
        return new Response(
            JSON.stringify({ success: false, error: 'Failed to create wallet or send notification' }),
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
        if (!env.OPEN_AI_API_KEY) throw new Error('OPEN_AI_API_KEY not found');
        if (!env.EXPLORER_API_KEY) throw new Error('EXPLORER_API_KEY not found');

        const queryRequest: QueryRequest = {
            query: data.query || 'get latest block',
            options: {
                openAI: {
                    apiKey: env.OPEN_AI_API_KEY,
                },
                chainId: data.chainId || 240,
                explorer: {
                    apiKey: env.EXPLORER_API_KEY,
                },
            },
        };

        const CDC_AI_AGENT_URL = "http://localhost:8000"
        const response = await fetch(`${CDC_AI_AGENT_URL}/api/v1/cdc-ai-agent-service/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(queryRequest)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Send telegram notification if chatId is provided
        if (data.chatId) {
            const telegramResponse = await fetch(
                `https://api.telegram.org/bot${env.BOT_TOKEN_DEV}/sendMessage`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: data.chatId,
                        text: JSON.stringify(result, null, 2),
                    }),
                }
            );

            if (!telegramResponse.ok) {
                throw new Error('Failed to send Telegram notification');
            }
        }

        return new Response(JSON.stringify({ success: true, data: result }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Fetch onchain data error:', error);
        return new Response(
            JSON.stringify({ success: false, error: 'Failed to fetch onchain data' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
