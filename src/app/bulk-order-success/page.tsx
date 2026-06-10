"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import Link from "next/link";

function BulkOrderSuccessContent() {
  const searchParams = useSearchParams();
  const bulkOrderId  = searchParams.get("bulkOrderId");
  const totalAmount  = searchParams.get("totalAmount");

  const fmt = (n: string | null) => {
    if (!n) return "–";
    return Number(n).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f7f6f3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            borderRadius: "24px",
            p: { xs: 3, sm: 5 },
            textAlign: "center",
            border: "1.5px solid rgba(0,0,0,0.08)",
            backgroundColor: "#fff",
          }}
        >
          {/* Success icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: "color-mix(in srgb, var(--primary-teal-dark), transparent 88%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2.5,
            }}
          >
            <CheckCircleOutlineIcon
              sx={{ fontSize: 46, color: "var(--primary-teal-dark)" }}
            />
          </Box>

          <Typography
            sx={{
              fontSize: { xs: "1.5rem", sm: "1.9rem" },
              fontWeight: 700,
              fontFamily: "var(--font-heading)",
              color: "var(--primary-maroon-dark)",
              lineHeight: 1.2,
              mb: 1,
            }}
          >
            Bulk Order Placed!
          </Typography>

          <Typography
            sx={{
              fontSize: "0.95rem",
              color: "var(--text)",
              lineHeight: 1.65,
              mb: 3.5,
              maxWidth: 380,
              mx: "auto",
            }}
          >
            Thank you! Your bulk order has been received. Our team will review
            it and get back to you with confirmation shortly.
          </Typography>

          {/* Order summary card */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: "#f7f6f3",
              borderRadius: "16px",
              p: { xs: 2.5, sm: 3 },
              mb: 3.5,
              textAlign: "left",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            {/* Order ID row */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Inventory2OutlinedIcon
                  sx={{ fontSize: 17, color: "var(--primary-teal-dark)" }}
                />
                <Typography
                  sx={{ fontSize: "0.83rem", color: "var(--text)", opacity: 0.65 }}
                >
                  Order Reference
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--primary-maroon-dark)",
                  fontFamily: "monospace",
                  letterSpacing: "0.04em",
                }}
              >
                #BO-{bulkOrderId?.padStart(5, "0") ?? "–"}
              </Typography>
            </Box>

            <Divider sx={{ opacity: 0.5, mb: 1.5 }} />

            {/* Total amount row */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarTodayOutlinedIcon
                  sx={{ fontSize: 17, color: "var(--primary-teal-dark)" }}
                />
                <Typography
                  sx={{ fontSize: "0.83rem", color: "var(--text)", opacity: 0.65 }}
                >
                  Estimated Total
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "var(--primary-maroon-dark)",
                }}
              >
                ₹ {fmt(totalAmount)}
              </Typography>
            </Box>

            <Divider sx={{ opacity: 0.5, mb: 1.5 }} />

            {/* Status */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{ fontSize: "0.83rem", color: "var(--text)", opacity: 0.65 }}
              >
                Status
              </Typography>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.4,
                  borderRadius: "20px",
                  backgroundColor: "color-mix(in srgb, var(--or), transparent 85%)",
                  border: "1px solid color-mix(in srgb, var(--or), transparent 60%)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "var(--or)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Pending Review
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* What happens next */}
          <Box
            sx={{
              borderRadius: "14px",
              border: "1.5px solid rgba(0,0,0,0.07)",
              p: { xs: 2, sm: 2.5 },
              mb: 3.5,
              textAlign: "left",
              backgroundColor: "color-mix(in srgb, var(--primary-teal-dark), transparent 94%)",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.83rem",
                fontWeight: 700,
                color: "var(--primary-teal-dark)",
                mb: 1.25,
              }}
            >
              What happens next?
            </Typography>
            {[
              "Our team will review your order details",
              "You'll receive a confirmation call/message within 2 hours",
              "Payment link will be shared on your registered number",
              "Order will be prepared and delivered on your chosen date",
            ].map((step, i) => (
              <Box
                key={i}
                sx={{ display: "flex", alignItems: "flex-start", gap: 1.25, mb: i < 3 ? 1 : 0 }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    backgroundColor: "var(--primary-teal-dark)",
                    color: "#fff",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    mt: 0.1,
                  }}
                >
                  {i + 1}
                </Box>
                <Typography sx={{ fontSize: "0.82rem", color: "var(--text)", lineHeight: 1.5 }}>
                  {step}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Buttons */}
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
                borderRadius: "12px",
                textTransform: "none",
                fontSize: 15,
                "&:hover": { bgcolor: "var(--primary-teal-mid)" },
              }}
            >
              Continue Shopping
            </Button>
            <Button
              component={Link}
              href="/bulkorder"
              variant="outlined"
              fullWidth
              sx={{
                py: 1.4,
                fontWeight: 600,
                borderRadius: "12px",
                textTransform: "none",
                fontSize: 14,
                borderColor: "rgba(0,0,0,0.15)",
                color: "var(--text)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.03)", borderColor: "rgba(0,0,0,0.25)" },
              }}
            >
              Place Another Bulk Order
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default function BulkOrderSuccessPage() {
  return (
    <Suspense fallback={<Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><Typography>Loading...</Typography></Box>}>
      <BulkOrderSuccessContent />
    </Suspense>
  );
}