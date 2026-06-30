"use client";

import { Box, Container, Paper, Typography } from "@mui/material";

const sections = [
  {
    title: "Introduction",
    content: `MENMAI FOODS respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, store, and protect your information when you visit our website, place an order, or interact with our services.
By using our website, you agree to the practices described in this Privacy Policy.`,
  },
  {
    title: "Information We Collect",
    content: `When you place an order through our website, we may collect personal information including your name, email address, mobile number, delivery address, and order-related information.`,
  },
  {
    title: "How We Use Your Information",
    content: `The information collected is used to process orders, arrange deliveries, provide customer support, communicate order updates, process payments, and improve our products and services.
We may also use information where necessary to comply with legal obligations and protect the security of our website and customers.`,
  },
  {
    title: "Payment Processing",
    content: `Payments made through our website are processed through secure third-party payment service providers.
MENMAI FOODS does not store complete debit card, credit card, banking, or payment credentials on its systems. Payment information is handled directly by authorized payment providers using industry-standard security measures.`,
  },
  {
    title: "Customer Communications",
    content: `We may communicate with customers through phone calls, email, SMS, WhatsApp, or other communication channels regarding order confirmations, delivery updates, customer support requests, and other service-related communications.
By providing your contact information, you consent to receiving such communications in connection with your orders and use of our services.`,
  },
  {
    title: "Information Sharing",
    content: `MENMAI FOODS does not sell, rent, or trade personal information to third parties.
Information may be shared only with trusted service providers involved in payment processing, delivery services, customer communication, or where required by applicable law. Such sharing is limited to the information necessary to perform the required service.`,
  },
  {
    title: "Data Security",
    content: `We take reasonable technical and organizational measures to protect personal information from unauthorized access, disclosure, alteration, misuse, or loss.
While we strive to maintain the security of our systems, no method of electronic transmission or storage can be guaranteed to be completely secure. Users acknowledge the inherent risks associated with internet-based communications.`,
  },
  {
    title: "Third-Party Services",
    content: `Our website may contain links to third-party websites or services. MENMAI FOODS is not responsible for the privacy practices, content, or policies of external websites.
Users are encouraged to review the privacy policies of any third-party services they access.`,
  },

  {
    title: "Governing Law",
    content: `This Privacy Policy shall be governed by and interpreted in accordance with the laws of India. Any disputes arising from this Privacy Policy shall be subject to the jurisdiction of the courts located in Madurai, Tamil Nadu.`,
  },
  {
    title: "Contact Us",
    content: `If you have any questions regarding this Privacy Policy or the handling of your personal information, please contact us.

MENMAI FOODS
4/417, Vadivel Nagar,
Nagamalai Pudukottai,
Madurai, Tamil Nadu – 625019
Email: menmaifoodsmdu@gmail.com
Phone: +91 9894777825`,
  },
];

export default function PrivacyPolicy() {
  return (
    <Box sx={{ minHeight: "100vh", pb: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 6, md: 6 },
          backgroundColor: "#f7f6f3",
          borderBottom: "1px solid #e5e5e5",
          fontFamily: "var(--font-heading)",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontSize: { xs: "1.9rem", sm: "1.9rem", md: "2.6rem" },
              fontWeight: 700,
              color: "var(--primary-maroon-dark)",
              mb: 1,
              fontFamily: "var(--font-heading)",
              textAlign: "center",
            }}
          >
            Privacy Policy
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: ".9rem", sm: "1rem" },
              color: "var(--text)",
              lineHeight: 1.7,
              textAlign: "center",
              fontFamily: "var(--font-heading)",
            }}
          >
            This Privacy Policy outlines how MENMAI FOODS collects, uses, and
            protects your personal information when you visit our website and
            use our services.
          </Typography>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            mt: 5,
          }}
        >
          {sections.map((section) => (
            <Box key={section.title} sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "1.3rem", md: "1.6rem" },
                  fontWeight: 600,
                  fontFamily: "var(--font-heading)",
                  color: "var(--text)",
                }}
              >
                {section.title}
              </Typography>

              <Typography
                sx={{
                  whiteSpace: "pre-line",
                  fontFamily: "var(--font-heading)",
                  fontSize: ".95rem",
                  color: "var(--text)",
                  lineHeight: 1.7,
                }}
              >
                {section.content}
              </Typography>
            </Box>
          ))}
        </Paper>
      </Container>
    </Box>
  );
}
