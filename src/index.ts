/* eslint-disable no-console */
import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import { DeBridgeSolanaClient } from "@debridge-finance/solana-contracts-client";
import { helpers, WRAPPED_SOL_MINT, crypto } from "@debridge-finance/solana-utils";
import { AccountMeta, clusterApiUrl, Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { config } from "dotenv";

import { IDL } from "./wrapper";

config();

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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

async function main() {
  const wallet = new helpers.Wallet(Keypair.fromSecretKey(helpers.hexToBuffer(process.env.WALLET!)));
  const connection = new Connection(process.env.RPC || clusterApiUrl("mainnet-beta"));
  const deBridgeWrapper = new Program(
    IDL,
    "5UaXbex7paiRDykrN2GaRPW7j7goEQ1ZWqQvUwnAfFTF",
    new AnchorProvider(connection, {} as Wallet, {}),
  );
  const client = new DeBridgeSolanaClient(connection, undefined, {
    programId: "DEbrdGj3HsRsAzx6uH4MKyREKxVAfBydijLUF3ygsFfh",
    settingsProgramId: "DeSetTwWhjZq6Pz9Kfdo1KoS5NqtsM6G8ERbX4SSCSft",
  });
  await client.init();
  const receiver = "0xc42E56c08D5274D70C3D7D9a00a5634A0Cb3A176";
  const chainId = 137;
  const amount = new BN(10);
  const MAX = 10;

  for (let i = 0; i < 10; i++) {
    console.log(`Iteration ${i}/${MAX}`);
    // debridge send + some rubbish accounts to make tx "heavier"
    const ix = await buildSendIx(client, deBridgeWrapper, wallet.publicKey, amount, chainId, receiver, [
      { isSigner: false, isWritable: true, pubkey: new PublicKey("HJkVaM9tsVVtoVMxAEDoSVegqrXZXKtcJ6CxmRXXQLM7") },
      { isSigner: false, isWritable: false, pubkey: new PublicKey("CjbUPZFLEwSPc6xJ4LMq4kEuuozVmEdgHHRKzoHVEbbB") },
      { isSigner: false, isWritable: true, pubkey: new PublicKey("46a3M5TZRnKvnYk19SfpP7GQ39FeYxAaXGMDgkok4EXL") },
      { isSigner: false, isWritable: false, pubkey: new PublicKey("3b57LZzwNVQgZDcHKxYMut5NFzk4nAXh7qLH4QMaCU9p") },
      { isSigner: false, isWritable: true, pubkey: new PublicKey("CKQU33CY5dQeiuYL1vETYNEdwyBKagbBoVUrHeRU1K3w") },
      { isSigner: false, isWritable: false, pubkey: new PublicKey("8W3TXrEgbuWYr9fSe8UB5Nimxr48yXex9QnB8HexrFmU") },
      { isSigner: false, isWritable: true, pubkey: new PublicKey("GogzZVjiCDWBitry7gtYGG7Pef9mr4CNbM4p4ooRpueQ") },
      { isSigner: false, isWritable: false, pubkey: new PublicKey("Sysvar1nstructions1111111111111111111111111") },
      { isSigner: false, isWritable: true, pubkey: new PublicKey("BsiQ62pMHmcBhXvurHChYyBpyz2MiqKZv6DtHk51duP8") },
      { isSigner: false, isWritable: false, pubkey: new PublicKey("8u5w3GHcJxnNYRLKZQK66gxx7gA3y2dkQStE5uEDo1Lv") },
      { isSigner: false, isWritable: true, pubkey: new PublicKey("5ovE6WAsiU3XgH4qYuksmczjdrsyHxGDQCmTKEbBGKHS") },
      { isSigner: false, isWritable: false, pubkey: new PublicKey("AuymdUNJBsoENVB8nkLt2G4o2PLvKz78v9CFdqXU5oXj") },
    ]);

    /* simulate transaction, get latest blockhash, sign the tx and call `sendTransaction` multiple times
    NB: we convert tx -> txV0 to simulate transaction with `{ sigVerify: false, replaceRecentBlockhash: true }` params
    */
    const [txId] = await helpers.sendAll(
      connection,
      wallet,
      [new Transaction().add(ix)],
      undefined,
      undefined,
      false,
      true,
      true, // convert tx -> txV0
    );
    console.log(txId);
    await helpers.sleep(5000);
    const info = await connection.getTransaction(txId, { maxSupportedTransactionVersion: 0, commitment: "confirmed" });
    if (!info) throw new Error(`Missing tx: ${txId}`);
  }
}

main().catch(console.error);
