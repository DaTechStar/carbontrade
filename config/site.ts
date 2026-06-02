export const siteConfig = {
  name: "CarbonTrade",
  description: "Trade with the Intelligence of Experts.",
  url: "https://carbontrade.com",
  ogImage: "https://carbontrade.com/og.jpg",
  links: {
    twitter: "https://twitter.com/carbontrade",
    github: "https://github.com/carbontrade",
    docs: "https://carbontrade.com/docs",
  },
  stats: {
    activeTraders: "50,403+",
    accuracyRate: "99.99%",
    startupBusinesses: "5,000+",
    happyClients: "98%",
    dailyVolume: "29 Billion+",
  },
  regulatory: {
    fsca: "Reg. No. 47490",
    slibc: "Reg. No. 2023-00068",
    bankRating: "AA-Rated Global Bank",
  },
  features: {
    executionSpeed: "<40ms",
    spreads: "0.0 Pips",
    instruments: "1000+",
    servers: "Equinix NY4",
  }
}

export type SiteConfig = typeof siteConfig
