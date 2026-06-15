import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import * as React from "react"

interface TransactionUpdateEmailProps {
  name: string
  type: string
  amount: string
  status: "pending" | "completed" | "failed"
}

export const TransactionUpdateEmail = ({
  name = "User",
  type = "withdrawal",
  amount = "$500.00",
  status = "completed",
}: TransactionUpdateEmailProps) => {
  const statusColors = {
    pending: "#eab308",
    completed: "#22c55e",
    failed: "#ef4444",
  }

  return (
    <Html>
      <Head />
      <Preview>Update on your CarbonTrade {type}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Transaction Update</Heading>
          <Text style={text}>Hello {name},</Text>
          <Text style={text}>
            There is an update regarding your recent <strong>{type}</strong>{" "}
            request for <strong>{amount}</strong>.
          </Text>

          <Section style={detailsContainer}>
            <Text style={detailText}>
              Status:{" "}
              <strong style={{ color: statusColors[status] }}>
                {status.toUpperCase()}
              </strong>
            </Text>
          </Section>

          <Text style={text}>
            {status === "completed" &&
              "Your transaction has been successfully processed."}
            {status === "failed" &&
              "Unfortunately, your transaction could not be completed. Please contact support for assistance."}
            {status === "pending" &&
              "Your transaction is currently being reviewed and processed."}
          </Text>
          <Text style={footer}>
            &copy; {new Date().getFullYear()} CarbonTrade. All rights reserved.
            <br />
            <span style={{ fontSize: "10px", color: "#aaa" }}>
              You received this email because you opted into Transaction updates
              in your notification preferences.
            </span>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default TransactionUpdateEmail

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
  maxWidth: "600px",
}

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0 0 20px",
  textAlign: "center" as const,
}

const text = {
  color: "#555",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 20px",
}

const detailsContainer = {
  background: "#f4f4f4",
  borderRadius: "8px",
  margin: "20px 0",
  padding: "20px",
  textAlign: "center" as const,
}

const detailText = {
  color: "#333",
  fontSize: "18px",
  lineHeight: "28px",
  margin: "0",
}

const footer = {
  color: "#999",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "40px 0 0",
  textAlign: "center" as const,
}
