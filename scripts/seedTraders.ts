import mongoose from "mongoose"
import { Trader } from "../lib/models"

// Use node --env-file=.env.local to load environment variables

const UNSPLASH_IDS = [
  "0_x2UZSI73o",
  "0Zx1bDv5BNY",
  "3TLl_97HNJo",
  "40BesxQcNlw",
  "5aGUyCW_PJw",
  "5WbUYsarRrQ",
  "64s0u0CbSYw",
  "6VPEOdpFNAs",
  "6WZQIm_WUoU",
  "7dEMLAcWW4g",
  "7YVZYZeITc8",
  "82ckjvxTQdk",
  "83BadwuAncw",
  "9BzPNeyMhNI",
  "9PWGki5WCGs",
  "9wy8aiAFI18",
  "a26S7TqsS6M",
  "A3MleA0jtoE",
  "ABGaVhJxwDQ",
  "B4TjXnI0Y2c",
  "C8Ta0gwPbQg",
  "c_GmwfHBDzk",
  "d1UPkiFd04A",
  "dDCbQJ8HxrA",
  "DItYlc26zVI",
  "dm87JsfUNNY",
  "eNU5XUeQKw4",
  "et_78QkMMQs",
  "fEznjuOELxU",
  "fvJcgOm1yHc",
  "gbnVkmT8t2w",
  "GlqGCCn9XYA",
  "GxXYxeDbaas",
  "HaNi1rsZ6Nc",
  "hbz6REXzrTc",
  "iFgRcqHznqg",
  "ILip77SbmOE",
  "jmURdhtm7Ng",
  "JN0SUcTOig0",
  "JXDFfSHarvY",
  "kjKfNGzr1Io",
  "_M6gy9oHgII",
  "mEZ3PoFGs_k",
  "mjRwhvqEC0U",
  "n31JPLu8_Pw",
  "Nf0rrrR4z0E",
  "nF8ms1BtYMI",
  "nQ3S3YtdR3M",
  "NRmeHK1uRIo",
  "nSBl2cfwnmE",
]

const FIRST_NAMES = [
  "Liam",
  "Noah",
  "Oliver",
  "Elijah",
  "James",
  "William",
  "Benjamin",
  "Lucas",
  "Henry",
  "Theodore",
  "Emma",
  "Olivia",
  "Ava",
  "Isabella",
  "Sophia",
  "Mia",
  "Charlotte",
  "Amelia",
  "Harper",
  "Evelyn",
  "Aiden",
  "Jackson",
  "Mason",
  "Logan",
  "Alexander",
  "Ethan",
  "Jacob",
  "Michael",
  "Daniel",
  "Matthew",
  "Abigail",
  "Emily",
  "Elizabeth",
  "Mila",
  "Ella",
  "Avery",
  "Sofia",
  "Camila",
  "Aria",
  "Scarlett",
  "David",
  "Joseph",
  "Samuel",
  "Sebastian",
  "Owen",
  "Gabriel",
  "Carter",
  "Jayden",
  "John",
  "Luke",
]
const LAST_NAMES = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
  "Green",
  "Adams",
  "Nelson",
  "Baker",
  "Hall",
  "Rivera",
  "Campbell",
  "Mitchell",
  "Carter",
  "Roberts",
]
const ROLES = [
  "Professional Trader",
  "Algo Trader",
  "Independent Analyst",
  "Expert Advisor",
  "Day Trader",
  "Swing Trader",
  "Crypto Specialist",
  "Forex Expert",
  "Quantitative Analyst",
  "Portfolio Manager",
]

const MIN_INVESTMENTS = [100, 200, 500, 1000, 2000, 4000, 5000, 10000]

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI")
    process.exit(1)
  }

  await mongoose.connect(process.env.MONGODB_URI)
  console.log("Connected to MongoDB.")

  // Optionally clear existing traders
  await Trader.deleteMany({})
  console.log("Cleared existing traders.")

  const traders = []

  for (let i = 0; i < 50; i++) {
    const firstName = getRandomItem(FIRST_NAMES)
    const lastName = getRandomItem(LAST_NAMES)
    const name = `${firstName} ${lastName}`
    const role = getRandomItem(ROLES)
    const minInvestment = getRandomItem(MIN_INVESTMENTS)
    const imageIndex = (i % 70) + 1 // pravatar supports 1-70

    traders.push({
      name,
      avatar: `https://i.pravatar.cc/150?img=${imageIndex}`,
      role,
      copiers: getRandomInt(500, 2500),
      metrics: {
        winRate: getRandomInt(65, 95),
        monthlyReturn: getRandomInt(5, 45),
        minInvestment,
        profitShareFee: getRandomItem([5, 10, 15, 20]),
      },
      status: "live",
      simulationProfile: {
        volatility: getRandomItem(["low", "medium", "high"]),
        trend: getRandomItem(["bullish", "bearish", "neutral"]),
        dailyExpectedReturnPct: parseFloat(
          (Math.random() * 0.5 + 0.1).toFixed(2)
        ),
      },
    })
  }

  await Trader.insertMany(traders)
  console.log(`Inserted ${traders.length} traders.`)

  await mongoose.disconnect()
  console.log("Disconnected from MongoDB.")
}

seed().catch((err) => {
  console.error("Seed error:", err)
  process.exit(1)
})
