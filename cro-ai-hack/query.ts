
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

const baseUrl = 'http://localhost:8000';

const queryRoute = async (queryRequest: QueryRequest) => {
    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(queryRequest)
    };

    try {
        const response = await fetch(`${baseUrl}/api/v1/cdc-ai-agent-service/query`, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
};

if (!process.env.OPEN_AI_API_KEY) throw new Error('OPEN_AI_API_KEY not found')
if (!process.env.EXPLORER_API_KEY) throw new Error('EXPLORER_API_KEY not found')

const exampleRequestBody: QueryRequest = {
    query: 'get latest block',
    options: {
        openAI: {
            apiKey: process.env.OPEN_AI_API_KEY,
        },
        chainId: 240,
        explorer: {
            apiKey: process.env.EXPLORER_API_KEY,
        },
    },
};

queryRoute(exampleRequestBody);
