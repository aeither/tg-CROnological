async function main() {
    const telegramResponse = await fetch(
        'https://api.telegram.org/bot<BOT_TOKEN>/sendMessage',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: "CHAT_ID",
                text: "hello",
            }),
        }
    );
    if (!telegramResponse.ok) {
        throw new Error(`Error sending request: ${await telegramResponse.text()}`);
    }
    console.log(telegramResponse);
    
}
main();