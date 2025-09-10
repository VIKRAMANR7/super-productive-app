import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  name: string;
  verificationUrl: string;
}

export function VerificationEmail({ name, verificationUrl }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Verify your email address for Super Productive App</Preview>
        <Container style={container}>
          <Section style={coverSection}>
            <Section style={imageSection}>
              <Text style={logoText}>Super Productive App</Text>
            </Section>
            <Section style={upperSection}>
              <Heading style={h1}>Verify your email address</Heading>
              <Text style={mainText}>Hi {name},</Text>
              <Text style={mainText}>
                Thanks for signing up for Super Productive App! We want to make sure it's
                really you. Please click the button below to verify your email address. If
                you didn't create an account, you can safely ignore this message.
              </Text>

              <Section style={buttonSection}>
                <Button style={button} href={verificationUrl}>
                  Verify Email Address
                </Button>
              </Section>

              <Text style={alternativeText}>
                Or click this link:{" "}
                <Link href={verificationUrl} style={link}>
                  Verify your account
                </Link>
              </Text>

              <Text style={validityText}>(This link is valid for 24 hours)</Text>
            </Section>
            <Hr style={hr} />
            <Section style={lowerSection}>
              <Text style={cautionText}>
                Super Productive App will never email you and ask you to disclose or
                verify your password, credit card, or banking account information.
              </Text>
            </Section>
          </Section>
          <Text style={footerText}>
            This message was produced and distributed by Super Productive App. © 2025.
            All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#fff",
  color: "#212121",
};

const container = {
  padding: "20px",
  margin: "0 auto",
  backgroundColor: "#eee",
  maxWidth: "580px",
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "15px",
  textAlign: "center" as const,
};

const link = {
  color: "#2754C5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  textDecoration: "underline",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0",
};

const imageSection = {
  backgroundColor: "#000",
  display: "flex",
  padding: "20px 0",
  alignItems: "center",
  justifyContent: "center",
};

const logoText = {
  color: "#fff",
  fontSize: "22px",
  fontWeight: "bold",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  margin: "0",
};

const coverSection = {
  backgroundColor: "#fff",
  borderRadius: "5px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const upperSection = { padding: "25px 35px" };

const lowerSection = { padding: "25px 35px" };

const footerText = {
  ...text,
  fontSize: "12px",
  padding: "0 20px",
  textAlign: "center" as const,
  color: "#666",
  maxWidth: "380px",
  marginLeft: "auto",
  marginRight: "auto",
};

const buttonSection = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#000",
  borderRadius: "5px",
  color: "#fff",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 28px",
  border: "none",
};

const alternativeText = {
  ...text,
  fontSize: "14px",
  textAlign: "center" as const,
  color: "#666",
  margin: "16px 0 8px 0",
};

const validityText = {
  ...text,
  fontSize: "13px",
  margin: "0px",
  textAlign: "center" as const,
  color: "#666",
  fontStyle: "italic",
};

const mainText = {
  ...text,
  marginBottom: "14px",
  lineHeight: "24px",
};

const cautionText = {
  ...text,
  margin: "0px",
  fontSize: "13px",
  color: "#666",
  textAlign: "center" as const,
  lineHeight: "20px",
  maxWidth: "400px",
  marginLeft: "auto",
  marginRight: "auto",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "0",
};
