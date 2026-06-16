import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import * as React from "react"

interface WelcomeEmailProps {
  name: string
}

export const WelcomeEmail = ({ name = "User" }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to CarbonTrade! Let's get started.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to CarbonTrade!</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            We're thrilled to have you on board! CarbonTrade is your premier
            platform for copy trading, investing, and growing your portfolio
            with top-tier traders from around the globe.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href="https://carbontrade.com/login">
              Go to Dashboard
            </Button>
          </Section>

          <Text style={text}>
            Here are a few things you can do to get started:
          </Text>
          <ul style={list}>
            <li style={listItem}>
              Complete your KYC verification to unlock all platform features.
            </li>
            <li style={listItem}>
              Fund your account using your preferred payment method.
            </li>
            <li style={listItem}>
              Browse our top-performing traders and start copy trading!
            </li>
          </ul>

          <Text style={text}>
            If you have any questions, our support team is always here to help.
          </Text>

          <Text style={footer}>
            &copy; {new Date().getFullYear()} CarbonTrade. All rights reserved.
            <br />
            <span style={{ fontSize: "10px", color: "#aaa" }}>
              You received this email because you registered an account on
              CarbonTrade.
            </span>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default WelcomeEmail

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

const list = {
  paddingLeft: "26px",
  margin: "0 0 20px",
  color: "#555",
}

const listItem = {
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "10px",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
}

const button = {
  backgroundColor: "#10B981", // Emerald 500
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "12px 24px",
}

const footer = {
  color: "#999",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "40px 0 0",
  textAlign: "center" as const,
}
