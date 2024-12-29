import { Client, CronosZkEvm, Wallet } from '@crypto.com/developer-platform-client';


const main = async () => {
    Client.init({
        chain: CronosZkEvm.Testnet, // Or CronosEvm.Mainnet for mainnet
        apiKey: 'YOUR_API_KEY', // Explorer API
        // provider: 'https://provider-url.com', // Optional provider URL for signing
    });

    const wallet = await Wallet.create();
    console.log(wallet);
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


