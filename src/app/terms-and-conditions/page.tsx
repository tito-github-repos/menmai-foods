"use client";

import { Box, Container, Paper, Typography } from "@mui/material";

const sections = [
  {
    title: "Introduction",
    content: `These Terms and Conditions govern your use of the MENMAI FOODS website and services. By accessing our website or placing an order, you agree to be bound by these Terms and Conditions.
If you do not agree with any part of these terms, please do not use our website or services.`,
  },
  {
    title: "Products and Orders",
    content: `MENMAI FOODS offers food products through its website. All orders are subject to product availability and acceptance by MENMAI FOODS.
We reserve the right to refuse, cancel, or limit any order where necessary, including situations involving inaccurate pricing, suspected fraudulent activity, or operational limitations.`,
  },
  {
    title: "Pricing and Payments",
    content: `All prices displayed on the website are in Indian Rupees (INR) unless otherwise stated and may be updated from time to time without prior notice.
Payments must be completed through the payment methods provided on the website. Orders will be processed only after successful payment confirmation.`,
  },
  {
    title: "Shipping and Delivery Policy",
    content: `MENMAI FOODS currently delivers within Madurai and nearby serviceable locations.
Same-day delivery may be available depending on the delivery location, order timing, and operational conditions.
Delivery timelines are estimates and may be affected by weather conditions, traffic, public holidays, operational requirements, or circumstances beyond our reasonable control.`,
  },
  {
    title: "Refund and Cancellation Policy",
    content: `Orders cannot be cancelled once they have been confirmed.
Refunds or replacements may be considered only if a product is delivered in a damaged condition, contains a manufacturing defect, differs from the product ordered by the customer, or has expired.
Customers are requested to report such issues as soon as reasonably possible after delivery. MENMAI FOODS reserves the right to verify the reported issue before approving any refund or replacement.`,
  },
  {
    title: "Customer Responsibilities",
    content: `Customers are responsible for providing accurate delivery information, contact details, and payment information at the time of placing an order.
MENMAI FOODS shall not be responsible for delays, failed deliveries, or additional costs arising from inaccurate or incomplete information provided by customers.`,
  },
  {
    title: "Intellectual Property",
    content: `All content available on this website, including text, graphics, images, logos, product descriptions, branding elements, and other materials, is the property of MENMAI FOODS unless otherwise stated.
Such content may not be copied, reproduced, distributed, modified, or used without prior written permission from MENMAI FOODS.`,
  },
  {
    title: "Limitation of Liability",
    content: `MENMAI FOODS strives to provide accurate information and quality products. However, we do not guarantee that the website will always operate without interruption or error.
To the fullest extent permitted by law, MENMAI FOODS shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our website, products, or services.
Any liability, where applicable, shall be limited to the value of the order placed by the customer.`,
  },
  {
    title: "Changes to Terms and Conditions",
    content: `MENMAI FOODS reserves the right to update, modify, or replace these Terms and Conditions at any time.
Any changes will become effective immediately upon publication on this page. Continued use of the website following such updates constitutes acceptance of the revised Terms and Conditions.`,
  },
  {
    title: "Governing Law",
    content: `These Terms and Conditions shall be governed by and interpreted in accordance with the laws of India.
Any disputes arising from the use of this website or our services shall be subject to the exclusive jurisdiction of the courts located in Madurai, Tamil Nadu.`,
  },
  {
    title: "Contact Us",
    content: `If you have any questions regarding these Terms and Conditions, please contact us.

MENMAI FOODS
4/417, Vadivel Nagar,
Nagamalai Pudukottai,
Madurai, Tamil Nadu – 625019
Email: menmaifoodsmdu@gmail.com
Phone:
+91 9894777825`,
  },
];

export default function TermsAndConditions() {
  return (
    <Box sx={{ minHeight: "100vh", pb: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          backgroundColor: "#f7f6f3",
          borderBottom: "1px solid #e5e5e5",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 700,
              color: "var(--primary-maroon-dark)",
              mb: 1,
              fontFamily: "var(--font-heading)",
            }}
          >
            Terms & Conditions
          </Typography>

          {/* <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.95rem",
              mb: 3,
            }}
          >
            Last Updated: 19 June 2026
          </Typography> */}

          <Typography
            sx={{
              color: "text.secondary",
              lineHeight: 1.8,
            }}
          >
            These Terms and Conditions govern your use of the MENMAI FOODS
            website and services. By accessing our website or placing an order,
            you agree to comply with and be bound by these terms.
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
            <Box key={section.title} sx={{ mb: 5 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "var(--primary-maroon-dark)",
                  mb: 2,
                }}
              >
                {section.title}
              </Typography>

              <Typography
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.9,
                  whiteSpace: "pre-line",
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
