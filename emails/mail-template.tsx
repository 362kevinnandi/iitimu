import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface EmailTemplateProps {
  name: string;
  message: string;
  buttonText: string;
  link?: string;
}

const baseUrl = process.env.BASE_URL || "http://localhost:3000";

export default function DailyTmEmailTemplate({
  name,
  message,
  buttonText,
  link,
}: EmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>TM-iitimu</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={coverSection}>
            <Section style={imageSection}>
              <Img
                src={`https://sneis3mvdo.ufs.sh/f/HGg34cn9OJhW4dOlCq59IWmwpaOUV5MKtJcgv3A2PeYiyXSF`}
                width="180"
                height="60"
                alt="TM-iitimu's Logo"
              />
            </Section>
            <Section style={upperSection}>
              <Heading style={h1}>Hello, {name}</Heading>
              <Text style={mainText}>
                {message || "System generated message"}
              </Text>
            </Section>
            <Hr />
            <Section style={lowerSection}>
              <Button style={button} href={link || baseUrl}>
                {buttonText || "Click Here"}
              </Button>
            </Section>
          </Section>
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
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "15px",
};

const imageSection = {
  backgroundColor: "#0f172a",
  display: "flex",
  padding: "20px 0",
  alignItems: "center",
  justifyContent: "center",
  borderTopLeftRadius: "10px",
  borderTopRightRadius: "10px",
  margin: "0 auto",
};

const button = {
  backgroundColor: "#656ee8",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "10px",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0",
};

const coverSection = { backgroundColor: "#fff" };

const upperSection = { padding: "25px 35px" };

const lowerSection = { padding: "25px 35px" };

const mainText = { ...text, marginBottom: "14px" };
