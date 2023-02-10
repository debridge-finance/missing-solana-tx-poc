/* eslint-disable no-console */
import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import { DeBridgeSolanaClient } from "@debridge-finance/solana-contracts-client";
import { helpers, WRAPPED_SOL_MINT, crypto } from "@debridge-finance/solana-utils";
import {
  AccountMeta,
  clusterApiUrl,
  ComputeBudgetProgram,
  Connection,
  Keypair,
  MessageV0,
  PublicKey,
  VersionedTransaction,
} from "@solana/web3.js";
import { config } from "dotenv";
import { sendAll } from "./sendHelpers";

import { IDL } from "./wrapper";

config();

function now() {
  const date = new Date();

  return `${date.getUTCHours().toString().padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}:${date
    .getUTCSeconds()
    .toString()
    .padStart(2, "0")}`;
}

function accountsToMeta(context: Awaited<ReturnType<DeBridgeSolanaClient["buildSendContext"]>>["accounts"]) {
  const result: AccountMeta[] = [
    { isSigner: false, isWritable: true, pubkey: new PublicKey(context.bridgeCtx.bridge) },
    { isSigner: false, isWritable: true, pubkey: new PublicKey(context.bridgeCtx.tokenMint) },
    { isSigner: false, isWritable: true, pubkey: new PublicKey(context.bridgeCtx.stakingWallet) },
    { isSigner: false, isWritable: false, pubkey: new PublicKey(context.bridgeCtx.mintAuthority) },
    { isSigner: false, isWritable: false, pubkey: new PublicKey(context.bridgeCtx.chainSupportInfo) },
    { isSigner: false, isWritable: false, pubkey: new PublicKey(context.bridgeCtx.settingsProgram) },
    { isSigner: false, isWritable: false, pubkey: new PublicKey(context.bridgeCtx.splTokenProgram) },
    { isSigner: false, isWritable: true, pubkey: new PublicKey(context.stateCtx.state) },
    { isSigner: false, isWritable: true, pubkey: new PublicKey(context.stateCtx.feeBeneficiary) },
    { isSigner: false, isWritable: true, pubkey: new PublicKey(context.nonceStorage) },
    { isSigner: false, isWritable: true, pubkey: new PublicKey(context.sendFromWallet) },
    { isSigner: false, isWritable: false, pubkey: new PublicKey(context.systemProgram) },
    { isSigner: false, isWritable: true, pubkey: new PublicKey(context.externalCallStorage) },
    { isSigner: false, isWritable: true, pubkey: new PublicKey(context.externalCallMeta) },
    { isSigner: true, isWritable: true, pubkey: new PublicKey(context.sendFrom) },
    { isSigner: false, isWritable: false, pubkey: new PublicKey(context.discount) },
    { isSigner: false, isWritable: false, pubkey: new PublicKey(context.bridgeFee) },
  ];

  return result;
}

async function buildSendIx(
  client: DeBridgeSolanaClient,
  deBridgeWrapper: Program<typeof IDL>,
  sender: PublicKey,
  amount: BN,
  chainId: number,
  receiver: string,
  additionalAccounts: AccountMeta[],
) {
  const context = await client.buildSendContext(
    sender,
    null,
    amount,
    WRAPPED_SOL_MINT,
    receiver,
    chainId,
    false,
    0,
    receiver,
  );
  const sendIxBuilder = deBridgeWrapper.methods.sendViaDebridge(
    amount,
    Array.from(crypto.normalizeChainId(chainId)),
    helpers.hexToBuffer(receiver),
    false,
  );
  sendIxBuilder.remainingAccounts([
    ...accountsToMeta(context.accounts), // accounts needed for deBridge send
    { isSigner: false, isWritable: false, pubkey: client.program.programId }, // deBridge program
    ...additionalAccounts, // rubbish accounts to make tx "heavier"
  ]);

  return sendIxBuilder.instruction();
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

async function main() {
  const wallet = new helpers.Wallet(Keypair.fromSecretKey(helpers.hexToBuffer(process.env.WALLET!)));
  const connection = new Connection(process.env.RPC || clusterApiUrl("mainnet-beta"));
  const txNum = process.env.TX_NUM || 10;
  const deBridgeWrapper = new Program(
    IDL,
    "9uM1PaLR9r331UAw7tZ9sCotefvLNBCPvyWDeTp2M7j3",
    new AnchorProvider(connection, {} as Wallet, {}),
  );
  const client = new DeBridgeSolanaClient(connection, undefined, {
    programId: "Lima82j8YvHFYe8qa4kGgb3fvPFEnR3PoV6UyGUpHLq",
    settingsProgramId: "settFZVDbqC9zBmV2ZCBfNMCtTzia2R7mVeR6ccK2nN",
  });
  await client.init();
  const receiver = "0xc42E56c08D5274D70C3D7D9a00a5634A0Cb3A176";
  const chainId = 137;
  const rubbishAccounts = [
    new PublicKey("HJkVaM9tsVVtoVMxAEDoSVegqrXZXKtcJ6CxmRXXQLM7"),
    new PublicKey("CjbUPZFLEwSPc6xJ4LMq4kEuuozVmEdgHHRKzoHVEbbB"),
    new PublicKey("46a3M5TZRnKvnYk19SfpP7GQ39FeYxAaXGMDgkok4EXL"),
    new PublicKey("3b57LZzwNVQgZDcHKxYMut5NFzk4nAXh7qLH4QMaCU9p"),
    new PublicKey("CKQU33CY5dQeiuYL1vETYNEdwyBKagbBoVUrHeRU1K3w"),
    new PublicKey("8W3TXrEgbuWYr9fSe8UB5Nimxr48yXex9QnB8HexrFmU"),
    new PublicKey("GogzZVjiCDWBitry7gtYGG7Pef9mr4CNbM4p4ooRpueQ"),
    new PublicKey("Sysvar1nstructions1111111111111111111111111"),
    new PublicKey("BsiQ62pMHmcBhXvurHChYyBpyz2MiqKZv6DtHk51duP8"),
    new PublicKey("8u5w3GHcJxnNYRLKZQK66gxx7gA3y2dkQStE5uEDo1Lv"),
    new PublicKey("5ovE6WAsiU3XgH4qYuksmczjdrsyHxGDQCmTKEbBGKHS"),
    new PublicKey("AuymdUNJBsoENVB8nkLt2G4o2PLvKz78v9CFdqXU5oXj"),
  ];

  const sentTxIds: string[] = [];
  for (let i = 0; i < txNum; i++) {
    const amount = new BN(randomInt(0, 30));
    console.log(`Iteration ${i + 1}/${txNum}`);
    const isWritable = (i: number) => true; //i % 2 === 0;
    // debridge send + some rubbish accounts to make tx "heavier"
    const junkAccountsToSend = rubbishAccounts.map((pk, i) => ({ isSigner: false, isWritable: isWritable(i), pubkey: pk }));
    const shuffle = <T extends unknown[]>(arr: T) => arr.sort(() => (Math.random() > .5) ? 1 : -1)
    const ix = await buildSendIx(
      client,
      deBridgeWrapper,
      wallet.publicKey,
      amount,
      chainId,
      receiver,
      shuffle(junkAccountsToSend),
    );
    const alt = await connection.getAddressLookupTable(new PublicKey("Z9SwCHdnxCpAEHdTewMXqZedbQBuBpQr16G9yedAU9q"));
    if (!alt || !alt.value) throw new Error("failed to get ALT");
    /* simulate transaction, get latest blockhash, sign the tx and call `sendTransaction` multiple times
    NB: we convert tx -> txV0 to simulate transaction with `{ sigVerify: false, replaceRecentBlockhash: true }` params
    */
    const [txId] = await sendAll(
      connection,
      wallet,
      new VersionedTransaction(
        MessageV0.compile({
          instructions: [ix],
          payerKey: wallet.publicKey,
          recentBlockhash: "1".repeat(32),
          addressLookupTableAccounts: [alt.value],
        }),
      ),
      {
        debug: true,
        rpcCalls: 4,
        convertIntoTxV0: true
      }
    );
    console.log(`[${now()}] Sent: ${txId}`);
    sentTxIds.push(txId);
    await helpers.sleep(3000);
  }

  console.log(`[${now()}] Sent all the transactions, waiting for 20 seconds and checking if something is missing`);
  console.log(`[${now()}] Sent transactions: ${sentTxIds.join(", ")}`);
  await helpers.sleep(20000);

  while (true) {
    try {
      const fetchConnection = new Connection(clusterApiUrl("mainnet-beta"));

      const fetchedTxs = await fetchConnection.getTransactions(sentTxIds, {
        maxSupportedTransactionVersion: 0,
        commitment: "confirmed",
      });

      const processedTxs = fetchedTxs.map((fetchedTx, i) => ({
        txHash: sentTxIds[i],
        isMissing: fetchedTx === null,
        ...fetchedTx,
      }));

      const missing = processedTxs.filter((ftx) => ftx.isMissing === true);
      console.log(
        `[${now()}] Missing count: ${missing.length}/${txNum}\nMissing ids: ${missing
          .map((missing) => missing.txHash)
          .join(", ")}`,
      );
      return;
    } catch (e) {
      console.log(`[${now}] Failed to get transactions, retrying`);
      await helpers.sleep(2000);
    }
  }
}

main().catch(console.error);
