import mongoose from "mongoose"

async function main() {
  await mongoose.connect(
    "mongodb+srv://legend4tech1_db_user:MwNYarYEPkakfs0h@cluster0.wcdf1kv.mongodb.net/carbontrade"
  )
  const users = await mongoose.connection.collection("users").find({}).toArray()
  console.log(
    "Users:",
    JSON.stringify(
      users.map((u) => ({ id: u._id, balances: u.balances })),
      null,
      2
    )
  )

  const positions = await mongoose.connection
    .collection("copypositions")
    .find({})
    .toArray()
  console.log(
    "Positions:",
    JSON.stringify(
      positions.map((p) => ({ status: p.status, invested: p.investedAmount })),
      null,
      2
    )
  )
  process.exit(0)
}
main()
