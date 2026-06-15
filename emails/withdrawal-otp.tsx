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

interface WithdrawalOtpEmailProps {
  name: string
  otpCode: string
  amount: string
  asset: string
}

export const WithdrawalOtpEmail = ({
  name,
  otpCode,
  amount,
  asset,
}: WithdrawalOtpEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your CarbonTrade Withdrawal Verification Code</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Withdrawal Verification</Heading>
          <Text style={text}>Hello {name},</Text>
          <Text style={text}>
            We received a request to withdraw{" "}
            <strong>
              {amount} {asset}
            </strong>{" "}
            from your CarbonTrade account. Please use the verification code
            below to confirm this transaction.
          </Text>

          <Section style={codeContainer}>
            <Text style={code}>{otpCode}</Text>
          </Section>

          <Text style={text}>
            This code will expire in 10 minutes. If you did not request this
            withdrawal, please secure your account immediately and contact
            support.
          </Text>
          <Text style={footer}>
            &copy; {new Date().getFullYear()} CarbonTrade. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default WithdrawalOtpEmail

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

const codeContainer = {
  background: "#f4f4f4",
  borderRadius: "8px",
  margin: "20px 0",
  padding: "20px",
  textAlign: "center" as const,
}

const code = {
  color: "#000",
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "4px",
  margin: "0",
}

const footer = {
  color: "#999",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "40px 0 0",
  textAlign: "center" as const,
}
