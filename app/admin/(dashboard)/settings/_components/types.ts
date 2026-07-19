export type PaymentMethod = {
  id: string
  label: string
  value: string
  walletAddress: string
  isActive: boolean
}

export type PendingUser = {
  id: string
  name: string
  email: string
  country: string
  kycDocumentUrlFront: string
  kycDocumentUrlBack: string
  submittedAt: string
}
