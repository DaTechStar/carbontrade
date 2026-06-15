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

interface PasswordChangedEmailProps {
  name: string
  date: string
}

export const PasswordChangedEmail = ({
  name = "User",
  date = new Date().toLocaleString(),
}: PasswordChangedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Security Alert: Your CarbonTrade password was changed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Password Changed</Heading>
          <Text style={text}>Hello {name},</Text>
          <Text style={text}>
            This is a confirmation that the password for your CarbonTrade
            account was recently changed on <strong>{date}</strong>.
          </Text>

          <Section style={alertContainer}>
            <Text style={alertText}>
              If you made this change, you don't need to do anything. If you did
              not authorize this change, please reset your password and contact
              support immediately to secure your account.
            </Text>
          </Section>

          <Text style={footer}>
            &copy; {new Date().getFullYear()} CarbonTrade. All rights reserved.
            <br />
            <span style={{ fontSize: "10px", color: "#aaa" }}>
              This is an automated security notification.
            </span>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default PasswordChangedEmail

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

const alertContainer = {
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: "8px",
  margin: "20px 0",
  padding: "20px",
}

const alertText = {
  color: "#991b1b",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
  fontWeight: "500",
}

const footer = {
  color: "#999",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "40px 0 0",
  textAlign: "center" as const,
}
