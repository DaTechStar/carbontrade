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

interface TierUnlockedEmailProps {
  name: string
  newTier: string
  benefits: string[]
}

export const TierUnlockedEmail = ({
  name = "User",
  newTier = "Level 2",
  benefits = [
    "Reduced trading fees",
    "Higher withdrawal limits",
    "Priority support",
  ],
}: TierUnlockedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Congratulations! You unlocked a new tier on CarbonTrade</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🎉 Congratulations, {name}!</Heading>
          <Text style={text}>
            You have successfully unlocked a new rank on CarbonTrade. You are
            now a <strong>{newTier}</strong> member!
          </Text>

          <Section style={detailsContainer}>
            <Text
              style={{
                ...detailText,
                fontWeight: "bold",
                marginBottom: "12px",
              }}
            >
              Your New Benefits:
            </Text>
            {benefits.map((benefit, index) => (
              <Text key={index} style={detailText}>
                ✅ {benefit}
              </Text>
            ))}
          </Section>

          <Text style={text}>
            Log in to your dashboard to explore your new perks and continue
            climbing the ranks!
          </Text>
          <Text style={footer}>
            &copy; {new Date().getFullYear()} CarbonTrade. All rights reserved.
            <br />
            <span style={{ fontSize: "10px", color: "#aaa" }}>
              You received this email because you opted into Rank & Reward
              updates in your notification preferences.
            </span>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default TierUnlockedEmail

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
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
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
