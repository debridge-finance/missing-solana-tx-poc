import { AddressLookupTableAccount, AddressLookupTableState, Commitment, Connection, Keypair, MessageAddressTableLookup, MessageCompiledInstruction, MessageV0, NonceAccount, NONCE_ACCOUNT_LENGTH, PublicKey, SystemProgram, Transaction, TransactionInstruction, VersionedMessage, VersionedTransaction } from "@solana/web3.js";
import { helpers, interfaces } from "@debridge-finance/solana-utils";

type AnyTransaction = VersionedTransaction | Transaction;
const sleep = helpers.sleep;

function isVersionedTx(arg: any): arg is VersionedTransaction {
    return "version" in arg;
}

async function sendWithRetries(connection: Connection, serialized: Buffer, lastValidBlockHeight: number | null, timesToSend: number = 5, blockhashCommitment: Commitment = "finalized") {
    const txId = await connection.sendRawTransaction(serialized, {
        skipPreflight: false,
        maxRetries: 1000,
    });
    let sent = 1;
    const validBlockheight = (current: number) => lastValidBlockHeight !== null ? current < lastValidBlockHeight : true;
    while (validBlockheight(await connection.getBlockHeight()) && sent < timesToSend) {
        await connection.sendRawTransaction(serialized, {
            skipPreflight: false,
            preflightCommitment: blockhashCommitment,
            maxRetries: 100,
        });
        await sleep(300);
        sent += 1;
    }
    return txId;
}

function txToV0(transaction: AnyTransaction, payer: PublicKey, blockhash: string) {
    if (isVersionedTx(transaction)) {
        return transaction;
    } else {
        const v0Message = MessageV0.compile({
            instructions: transaction.instructions,
            payerKey: transaction.feePayer || payer,
            recentBlockhash: transaction.recentBlockhash || blockhash,
        });
        return new VersionedTransaction(v0Message);
    }
}

function setBlockhash(transaction: AnyTransaction, blockhash: string) {
    if (isVersionedTx(transaction)) {
        transaction.message.recentBlockhash = blockhash
    } else {
        transaction.recentBlockhash = blockhash;
    }
}

type SendAllOptions = {
    /**
     * List of signers for each tx
     * E.g. you provided [tx1, tx2], tx2 requires additional signature
     * signers should be [[], [tx2Signer]]
     */
    signers?: Keypair[][];
    /**
     * Wait for number of milliseconds, if not provided will send all transactions simultaneously
     */
    waitBetweenSend?: number,
    skipPreflight?: boolean,
    /**
     * Dump serialized transaction before send? Default is `false`
     */
    debug?: boolean,
    /**
     * Convert all transactions from legacy to TransactionV0? Default is `true`
     */
    convertIntoTxV0?: boolean,
    /**
     * Number of `sendTrnasaction` rpc calls for each transaction
     */
    rpcCalls?: number,
    /**
     * Set blockhash with provided level for each transaction before sign & send. Default is `finalized`
     */
    blockhashCommitment?: Commitment,
}

/**
 * 
 * @param connection rpc connection
 * @param wallet wallet interface to sign transaction
 * @param transactions transaction(s) to send
 * @param options additional {@link SendAllOptions|options}
 * @returns 
 */
export async function sendAll(
    connection: Connection,
    wallet: interfaces.IWallet,
    transactions: AnyTransaction[] | AnyTransaction,
    options?: SendAllOptions
) {
    const blockhashCommitment: Commitment = options?.blockhashCommitment === undefined ? "finalized" : options.blockhashCommitment;
    const fakeBlockHash = "1".repeat(32);
    const convertIntoTxV0 = options?.convertIntoTxV0 === undefined ? true : options.convertIntoTxV0;
    const debug = options?.debug === undefined ? false : options.debug;
    const skipPreflight = options?.skipPreflight === undefined ? false : options.skipPreflight;
    const rpcCalls = options?.rpcCalls === undefined ? 5 : options.rpcCalls;

    if (!Array.isArray(transactions)) transactions = [transactions];

    if (convertIntoTxV0) {
        transactions = transactions.map((tx) => txToV0(tx, wallet.publicKey, fakeBlockHash));
    }
    let txIds: string[] = [];
    if (options?.waitBetweenSend === undefined || options.waitBetweenSend === 0) {
        await Promise.all(
            transactions.map(async (tx) => {
                let txV0: VersionedTransaction;
                if (isVersionedTx(tx)) {
                    tx.message.recentBlockhash = fakeBlockHash;
                    txV0 = tx;
                } else {
                    tx.recentBlockhash = fakeBlockHash;
                    tx.feePayer = wallet.publicKey;
                    txV0 = new VersionedTransaction(
                        MessageV0.compile({
                            addressLookupTableAccounts: [],
                            instructions: tx.instructions,
                            recentBlockhash: fakeBlockHash,
                            payerKey: tx.feePayer,
                        }),
                    );
                }

                if (!skipPreflight) {
                    const simulationResult = await connection.simulateTransaction(txV0, {
                        sigVerify: false,
                        replaceRecentBlockhash: true,
                        commitment: "confirmed",
                    });
                    if (simulationResult.value.err !== null) {
                        throw new Error(
                            `Tx simulation Error! Transaction message dump: ${Buffer.from(txV0.serialize()).toString(
                                "base64",
                            )}\n Error: ${JSON.stringify(simulationResult.value.err)}, logs:\n ${simulationResult.value.logs?.join("\n")}`,
                        );
                    }
                }
            }),
        );

        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash({ commitment: blockhashCommitment });
        // set real blockhash
        transactions.map((tx) => setBlockhash(tx, blockhash));
        // sign after setting correct blockhashes
        const signed = await wallet.signAllTransactions(transactions, options?.signers);
        txIds = await Promise.all(
            signed.map((signedTx) => {
                const serialized = Buffer.from(signedTx.serialize());
                if (debug) console.debug(serialized.toString("base64"));
                return sendWithRetries(connection, serialized, lastValidBlockHeight, rpcCalls, blockhashCommitment);
            }),
        );
    } else {
        for (let i = 0; i < transactions.length; i++) {
            const tx = transactions[i];
            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash({ commitment: blockhashCommitment });
            let txV0: VersionedTransaction;
            if (isVersionedTx(tx)) {
                tx.message.recentBlockhash = blockhash;
                txV0 = tx;
            } else {
                tx.recentBlockhash = blockhash;
                tx.feePayer = wallet.publicKey;
                txV0 = new VersionedTransaction(
                    MessageV0.compile({
                        addressLookupTableAccounts: [],
                        instructions: tx.instructions,
                        recentBlockhash: blockhash,
                        payerKey: tx.feePayer,
                    }),
                );
            }
            const signed = await wallet.signTransaction(tx, options?.signers && options?.signers.length > i ? options.signers[i] : undefined);
            if (!skipPreflight) {
                const simulationResult = await connection.simulateTransaction(txV0, {
                    sigVerify: false,
                    replaceRecentBlockhash: true,
                    commitment: "confirmed",
                });
                if (simulationResult.value.err !== null) {
                    throw new Error(
                        `Tx simulation Error! Transaction message dump: ${Buffer.from(txV0.serialize()).toString(
                            "base64",
                        )}\n Error: ${JSON.stringify(simulationResult.value.err)}, logs:\n ${simulationResult.value.logs?.join("\n")}`,
                    );
                }
            }
            const serialized = Buffer.from(signed.serialize());
            if (debug) console.debug(serialized.toString("base64"));
            txIds.push(await sendWithRetries(connection, serialized, lastValidBlockHeight, rpcCalls, blockhashCommitment));
            await sleep(options.waitBetweenSend);
        }
    }

    return txIds;
}
