import { clusterApiUrl, Connection } from "@solana/web3.js";

const txIds =
  ""

async function main() {
  const ids = txIds.split(", ");
  const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const fetchedTxs = await connection.getTransactions(ids, {
    maxSupportedTransactionVersion: 0,
    commitment: "confirmed",
  });
  const processedTxs = fetchedTxs.map((fetchedTx, i) => ({
    txHash: ids[i],
    isMissing: fetchedTx === null,
    ...fetchedTx,
  }));

  const missing = processedTxs.filter((ftx) => ftx.isMissing === true);
  console.log(
    `Missing count: ${missing.length}/${fetchedTxs.length}\nMissing ids: ${missing
      .map((missing) => missing.txHash)
      .join(", ")}`,
  );
}

main().catch(console.error);
