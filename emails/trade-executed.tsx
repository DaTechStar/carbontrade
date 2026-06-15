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

interface TradeExecutedEmailProps {
  name: string
  traderName: string
  asset: string
  action: "Opened" | "Closed"
  amount: string
}

export const TradeExecutedEmail = ({
  name = "User",
  traderName = "Trader",
  asset = "BTC/USD",
  action = "Opened",
  amount = "$100",
}: TradeExecutedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>CarbonTrade: A copied trade was {action.toLowerCase()}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Trade {action}</Heading>
          <Text style={text}>Hello {name},</Text>
          <Text style={text}>
            We're letting you know that a trade has just been{" "}
            {action.toLowerCase()} in your copy-trading account.
          </Text>

          <Section style={detailsContainer}>
            <Text style={detailText}>
              <strong>Trader:</strong> {traderName}
            </Text>
            <Text style={detailText}>
              <strong>Asset:</strong> {asset}
            </Text>
            <Text style={detailText}>
              <strong>Action:</strong> {action}
            </Text>
            <Text style={detailText}>
              <strong>Amount:</strong> {amount}
            </Text>
          </Section>

          <Text style={text}>
            You can view the full details of this trade and monitor your open
            positions in your CarbonTrade dashboard.
          </Text>
          <Text style={footer}>
            &copy; {new Date().getFullYear()} CarbonTrade. All rights reserved.
            <br />
            <span style={{ fontSize: "10px", color: "#aaa" }}>
              You received this email because you opted into Trade alerts in
              your notification preferences.
            </span>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default TradeExecutedEmail

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
}

const detailText = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 8px",
}

const footer = {
  color: "#999",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "40px 0 0",
  textAlign: "center" as const,
}
