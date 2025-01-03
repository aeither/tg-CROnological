# CROnological Telegram Bot

Make scheduling tasks as easy as talking to a friend. AI that plans your tasks when and where they make sense.

## Overview
CROnological is a Telegram bot that helps Web3 developers and crypto enthusiasts automate and schedule blockchain-related tasks using natural language. Just chat with the bot to schedule on-chain data fetching, monitoring, and notifications - no complex cron syntax needed.

![image](https://github.com/user-attachments/assets/78810db7-24e9-4dc1-a948-fc984327a58d)

## Instruction

Install deps `pnpm install` and set env vars

Run Triggerdotdev `pnpm dlx trigger.dev@latest dev`

Run Telegram Bot `pnpm run dev:webhook`

Expose Telegram Bot with ngrok `pnpm run dev:2` and set telegram bot webhook to the exposed url

Run ai locally with `npm run start` in `cryptocom-ai-agent-service`

## Key Features
* Natural language task scheduling (e.g. "check ETH gas every hour")
* Blockchain data monitoring and alerts
* Flexible scheduling (one-time, recurring, custom intervals)
* Smart notification delivery via Telegram
* Supports multiple chains (Ethereum, Polygon, etc.)
* Task management (view, edit, delete scheduled tasks)
* Context-aware scheduling based on blockchain events
* No-code automation for on-chain activities

## Problems Solved
* Eliminates the need to write complex cron jobs for blockchain monitoring
* Saves time by automating repetitive blockchain data checks
* Reduces missed opportunities with timely notifications
* Makes blockchain automation accessible to non-technical users
* Centralizes task scheduling and notifications in Telegram

## Use Cases
* Monitor gas prices and get notified of optimal times
* Track wallet balances and transactions
* Watch smart contract events
* Schedule regular data fetching from protocols
* Set up alerts for price movements
* Automate reporting of on-chain metrics
