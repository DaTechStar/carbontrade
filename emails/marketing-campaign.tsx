import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components"
import * as React from "react"

interface MarketingCampaignEmailProps {
  name: string
  subject: string
  headline: string
  content: string
  ctaText?: string
  ctaUrl?: string
}

export const MarketingCampaignEmail = ({
  name = "CarbonTrader",
  subject = "New Features on CarbonTrade!",
  headline = "Exciting Updates Are Here",
  content = "We have just launched brand new copy trading tools to help you maximize your profits. Log in now to check out the latest updates.",
  ctaText = "Explore Now",
  ctaUrl = "https://carbontrade.com/dashboard",
}: MarketingCampaignEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{headline}</Heading>
          <Text style={text}>Hello {name},</Text>
          <Text style={text}>{content}</Text>

          {ctaText && ctaUrl && (
            <Section style={btnContainer}>
              <Button style={button} href={ctaUrl}>
                {ctaText}
              </Button>
            </Section>
          )}

          <Text style={text}>
            Happy Trading,
            <br />
            The CarbonTrade Team
          </Text>

          <Text style={footer}>
            &copy; {new Date().getFullYear()} CarbonTrade. All rights reserved.
            <br />
            <span style={{ fontSize: "10px", color: "#aaa" }}>
              You received this email because you opted into Marketing emails in
              your notification preferences.
            </span>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default MarketingCampaignEmail

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

const btnContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
}

const button = {
  backgroundColor: "#22c55e",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
}

const footer = {
  color: "#999",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "40px 0 0",
  textAlign: "center" as const,
}
