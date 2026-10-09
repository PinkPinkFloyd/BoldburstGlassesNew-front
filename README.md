# BoldBurst Glasses

Nuxt 4 + Vue 3 + Pinia eyewear storefront, with a self-contained GitHub Pages demo.

- Demo: https://pinkpinkfloyd.github.io/BoldburstGlassesNew-front/
- Backend source: https://github.com/PinkPinkFloyd/boldburstGlassesNew
- Production website code remains on the main branch. Demo code and Pages deployment use github-pages-demo.

## Run the demo

Use Node.js 22 and npm. Run npm ci, then npm run dev:demo.
Sign in with demo@example.com and demo1234. You can also register a made-up identity using the same demo passphrase.

Four categories and sixteen products come from the existing backend seed data. Browse variants, add items, change quantities, place a simulated paid order, and inspect your order history.
All demo state uses the browser storage key boldburst:demo:v1. No passwords or shipping addresses are persisted. Orders are isolated per identity. Reset demo clears all demo identities, session, carts and orders.
No real API, database or payment service is required. Product photographs still load from Unsplash; icons are bundled locally. If browser storage is blocked, the current tab uses memory and refresh starts a new session.

## Checks and static build

Run npm run lint, npm run typecheck, npm test, and npm run generate:demo.
The static artifact is .output/public. Set NUXT_APP_BASE_URL=/BoldburstGlassesNew-front/ for repository hosting.
The Pages workflow publishes only github-pages-demo, with history routing fallback in 404.html. The existing Docker deployment is restricted to main and is not triggered by demo commits.

## Data and interfaces

The shop API plugin selects the local adapter when NUXT_PUBLIC_DEMO_MODE=true. It never falls back to a network request in demo mode. Product, identity, cart and order consumers share typed interfaces.
Prices retain the seed currency (USD); display conversion to INR uses 91 and rounded integer cents once. Cart and checkout use the same totals calculation, including 8% simulated tax.
The demo adapter covers products, category/detail lookup, auth, cart mutations, order creation/history and reset. The seed data has no live customer or order records.

## Production

Use the main branch for the original server deployment. This branch's checkout is deliberately a demonstration workflow. Do not deploy it as a real shop.
Never commit .env files or private keys. Copy .env.example for local configuration; browser-public configuration must not contain secrets.
