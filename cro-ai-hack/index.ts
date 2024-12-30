import { Client, CronosZkEvm, Wallet } from '@crypto.com/developer-platform-client';
import dotenv from "dotenv";
dotenv.config()

if (!process.env.EXPLORER_API_KEY) throw new Error('EXPLORER_API_KEY not found')
const EXPLORER_API_KEY = process.env.EXPLORER_API_KEY

const main = async () => {
    Client.init({
        chain: CronosZkEvm.Testnet, 
        apiKey: EXPLORER_API_KEY,
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


