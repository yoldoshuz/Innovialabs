---
title: How to Integrate TON Connect into a Telegram Mini App
description: TON Connect in a Telegram Mini App: connecting a wallet, verifying ton_proof on the backend, sending transactions and the legal side of crypto payments.
summary: Connect wallets with @tonconnect/ui and a manifest, prove address ownership with ton_proof verified on the server, send transactions via sendTransaction and mark orders paid only after checking the blockchain — and sort out Telegram rules and local regulation before launch.
---
## How it works

**TON Connect** is the protocol a Mini App uses to talk to the user's wallet (Telegram Wallet, Tonkeeper and others). Your app never gets the keys — it only asks the wallet to sign data or a transaction.

The full flow has four parts:

1. **Manifest** — a JSON file describing your app.
2. **Wallet connection** — the user picks a wallet and approves.
3. **ton_proof** — cryptographic proof that the address really belongs to the user. Verified on the backend.
4. **Transactions** — the wallet signs and sends; the server checks the result on-chain.

## Step 1. Manifest and connection

Host `tonconnect-manifest.json` at a public HTTPS URL:

```json
{
  "url": "https://example.com",
  "name": "Example Shop",
  "iconUrl": "https://example.com/icon-180.png",
  "termsOfUseUrl": "https://example.com/terms",
  "privacyPolicyUrl": "https://example.com/privacy"
}
```

In a React app, use `@tonconnect/ui-react`:

```tsx
import { TonConnectUIProvider, TonConnectButton } from "@tonconnect/ui-react";

export function App() {
  return (
    <TonConnectUIProvider
      manifestUrl="https://example.com/tonconnect-manifest.json"
      actionsConfiguration={{ twaReturnUrl: "https://t.me/your_bot/app" }}
    >
      <TonConnectButton />
    </TonConnectUIProvider>
  );
}
```

`twaReturnUrl` brings the user back to the Mini App after approving in an external wallet. The `useTonWallet()` and `useTonAddress()` hooks expose the current connection.

## Step 2. ton_proof: proving address ownership

The address from `useTonAddress()` is client-side data. It is as easy to fake as `initDataUnsafe`. If you use the address for login, account linking or crediting anything, you need **ton_proof**.

The flow:

1. The backend generates a **random payload** (nonce) with a short lifetime and stores it.
2. The frontend passes it into the connection request.
3. The wallet signs a message containing your domain, a timestamp, the address and the payload.
4. The frontend sends the signature to the backend.

```ts
tonConnectUI.setConnectRequestParameters({ state: "loading" });
const payload = await fetch("/api/ton-proof/payload").then((r) => r.text());
tonConnectUI.setConnectRequestParameters({ state: "ready", value: { tonProof: payload } });

tonConnectUI.onStatusChange((wallet) => {
  const item = wallet?.connectItems?.tonProof;
  if (wallet && item && "proof" in item) {
    fetch("/api/ton-proof/check", {
      method: "POST",
      body: JSON.stringify({ account: wallet.account, proof: item.proof }),
    });
  }
});
```

What the backend checks:

- the **payload** was issued by you, has not expired and has not been used;
- the **domain** in the proof matches yours;
- the **timestamp** is fresh;
- the **public key** comes from `walletStateInit` or a query to the wallet contract, and the claimed address really derives from it;
- the **Ed25519 signature** is valid for the message built per the TON Connect specification.

Building the signed message is where byte-order mistakes happen. Rely on the official TON Connect backend examples rather than a hand-rolled implementation. After verification, issue your own session token.

## Step 3. Sending a transaction

```ts
import { beginCell, toNano } from "@ton/core";

const comment = beginCell().storeUint(0, 32).storeStringTail(`order:${orderId}`).endCell();

await tonConnectUI.sendTransaction({
  validUntil: Math.floor(Date.now() / 1000) + 300,
  messages: [
    {
      address: MERCHANT_ADDRESS,
      amount: toNano("1.5").toString(),
      payload: comment.toBoc().toString("base64"),
    },
  ],
});
```

- `amount` is in **nanotons**, as a string.
- A comment with the order number helps match the payment to the order.
- `validUntil` limits how long the user has to approve the transaction.

**The key rule:** a successful `sendTransaction` response means the wallet sent the message, not that the money arrived. The **backend** marks the order paid after finding the incoming transaction to your address through an indexer or blockchain API and matching the amount, address and comment. Processing must be idempotent: one transaction, one order.

## Rules and regulation

Wiring up TON is technically simple. The legal side is harder.

- **Telegram rules.** For digital goods and services inside Mini Apps, Telegram requires payment in **Stars**. Crypto features in the Mini Apps ecosystem are built around TON and TON Connect. Check the current rules before launch.
- **Local law.** In many countries, including Uzbekistan, crypto assets are regulated separately and services involving them require a license. Accepting crypto as payment may be restricted.
- **KYC and AML.** Depending on your business model, you may need customer identification and source-of-funds checks.
- **Taxes and accounting.** You need to know how to book incoming payments and at what rate.
- **Irreversibility.** A blockchain transaction cannot be reversed — design refunds as a separate process.
- **Volatility.** TON prices move: lock the rate for a short window or use stablecoins where allowed.

Get advice from a lawyer for your jurisdiction and model before development.

## FAQ

### Do I need ton_proof if I only accept payments?

For a simple order payment, verifying the incoming transaction on the server is enough. ton_proof is needed when the wallet address means something to your system: login, account linking, granting access.

### Why didn't the user return to the Mini App after approving in the wallet?

Check `twaReturnUrl` — it must point to your Mini App in Telegram. Without it, an external wallet does not know where to send the user back.

### Can I accept TON for digital goods?

Under Telegram's rules, digital goods and services in Mini Apps are sold for Stars. Use TON for scenarios the rules allow, and check the latest version of the rules.
