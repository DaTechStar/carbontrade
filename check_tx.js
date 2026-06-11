import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const TransactionSchema = new mongoose.Schema({}, { strict: false });
const Transaction = mongoose.model("Transaction", TransactionSchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const txs = await Transaction.find({ type: "deposit" });
  console.log("All Deposits:", txs.map(t => ({ id: t._id, type: t.type, status: t.status, amount: t.amount })));
  process.exit(0);
}
run();
