import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"
import { mainnet, arbitrum, polygon, bsc, base } from "@reown/appkit/networks"

// Get projectID from https://cloud.reown.com
export const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  "b56e64d476b7b25206385d9c22881b89" // Fallback public demo project ID

export const networks = [mainnet, arbitrum, polygon, bsc, base]

// Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
})

export const config = wagmiAdapter.wagmiConfig
