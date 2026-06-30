"use client";

import { useSearchParams } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Divider,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Link from "next/link";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const totalAmount = searchParams.get("totalAmount");
  const deliveryAddress = searchParams.get("deliveryAddress");
  const PHONE_NUMBER = "919894777825";

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            p: { xs: 3, sm: 5 },
            textAlign: "center",
            border: "1px solid #e0e0e0",
            width: "100%",
          }}
        >
          {/* Success Icon */}
          <CheckCircleOutlineIcon
            sx={{
              fontSize: 72,
              color: "var(--green)",
              mb: 2,
            }}
          />

          <Typography
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem" },
              fontWeight: 700,
              color: "var(--primary-maroon-dark)",
              mb: 0.5,
            }}
          >
            Order Confirmed!
          </Typography>

          <Typography
            sx={{
              fontSize: "0.95rem",
              color: "text.secondary",
              mb: 4,
            }}
          >
            We've received your order and started preparing it.
          </Typography>

          {/* Order Number & Status */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: "#f7f6f3",
              borderRadius: 3,
              p: 3,
              mb: 3,
            }}
          >
            <Box sx={{ mb: 2.5 }}>
              <Typography fontSize={12} color="text.secondary" sx={{ mb: 0.5 }}>
                Order Number
              </Typography>
              <Typography
                fontSize={18}
                fontWeight={700}
                sx={{ fontFamily: "monospace" }}
              >
                #{orderNumber}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Delivery Address */}
            <Box sx={{ mb: 1.5 }}>
              <Typography fontSize={12} color="text.secondary" sx={{ mb: 0.5 }}>
                Delivering to
              </Typography>
              <Typography fontSize={14} fontWeight={600}>
                {deliveryAddress || "Address not provided"}
              </Typography>
            </Box>
          </Paper>

          {/* Order Amount */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: "#fff9f7",
              borderRadius: 3,
              p: 2.5,
              mb: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography fontSize={15} fontWeight={600}>
                Total Amount
              </Typography>
              <Typography
                fontSize={18}
                fontWeight={700}
                sx={{ color: "var(--primary-maroon-dark)" }}
              >
                ₹{totalAmount}.00
              </Typography>
            </Box>
          </Paper>

          {/* Notifications Info */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: "#e7f5f5",
              borderRadius: 3,
              p: 2,
              mb: 4,
              border: "1px solid #c0e5e5",
            }}
          >
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
              <WhatsAppIcon
                sx={{ fontSize: 24, color: "#25d366", flexShrink: 0, mt: 0.5 }}
              />
              <Box sx={{ textAlign: "left" }}>
                <Typography fontSize={14} fontWeight={700} sx={{ mb: 0.5 }}>
                  Real-time Updates
                </Typography>
                <Typography fontSize={13} color="text.secondary">
                  We'll send order status updates and delivery notifications via
                  WhatsApp.
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* CTA Buttons */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Button
              component={Link}
              href="/"
              variant="contained"
              fullWidth
              sx={{
                bgcolor: "var(--primary-teal-dark)",
                py: 1.5,
                fontWeight: 700,
                borderRadius: 2.5,
                textTransform: "none",
                fontSize: 15,
                "&:hover": { bgcolor: "var(--primary-teal-mid)" },
              }}
            >
              Continue Shopping
            </Button>
          </Box>

          {/* Support Footer */}
          <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid #e0e0e0" }}>
            <Typography fontSize={12} color="text.secondary" sx={{ mb: 1 }}>
              Need help?
            </Typography>
            <Typography
              component={Link}
              href={`https://wa.me/91${PHONE_NUMBER}?text=Hi, I have a question about order #${orderNumber}`}
              target="_blank"
              sx={{
                fontSize: 13,
                color: "var(--primary-teal-dark)",
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Chat with us on WhatsApp
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
