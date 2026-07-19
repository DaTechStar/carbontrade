"use client"

import { PaymentsTab } from "./_components/payments-tab"
import type { PaymentMethod } from "./_components/types"

export default function SettingsClient({
  initialPaymentMethods,
}: {
  initialPaymentMethods: PaymentMethod[]
}) {
  return <PaymentsTab initialPaymentMethods={initialPaymentMethods} />
}
