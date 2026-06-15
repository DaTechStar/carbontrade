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

interface DailyPnLEmailProps {
  name: string
  date: string
  totalProfit: string
  performanceStr: string
}

export const DailyPnLEmail = ({
  name = "User",
  date = new Date().toLocaleDateString(),
  totalProfit = "+$45.00",
  performanceStr = "+2.4%",
}: DailyPnLEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your Daily P&L Summary from CarbonTrade</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Daily P&L Summary</Heading>
          <Text style={text}>Hello {name},</Text>
          <Text style={text}>
            Here is your daily profit and loss summary for{" "}
            <strong>{date}</strong>.
          </Text>

          <Section style={detailsContainer}>
            <Text style={detailText}>
              <strong>Total Profit/Loss:</strong> {totalProfit}
            </Text>
            <Text style={detailText}>
              <strong>Daily Performance:</strong> {performanceStr}
            </Text>
          </Section>

          <Text style={text}>
            Keep up the good work! Log in to your dashboard to see a detailed
            breakdown of your portfolio.
          </Text>
          <Text style={footer}>
            &copy; {new Date().getFullYear()} CarbonTrade. All rights reserved.
            <br />
            <span style={{ fontSize: "10px", color: "#aaa" }}>
              You received this email because you opted into Daily P&L alerts in
              your notification preferences.
            </span>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default DailyPnLEmail

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
  margin: "0 0 8px",
}

const footer = {
  color: "#999",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "40px 0 0",
  textAlign: "center" as const,
}
