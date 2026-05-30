"use client";

import { useSearchParams } from "next/navigation";
import { Box, Typography, Button, Paper, Container } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Link from "next/link";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const totalAmount = searchParams.get("totalAmount");

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
              mb: 1,
            }}
          >
            Order Placed!
          </Typography>

          <Typography
            sx={{
              fontSize: "1rem",
              color: "text.secondary",
              mb: 3,
            }}
          >
            Thank you for your order. We'll start preparing it soon.
          </Typography>

          {/* Order Details */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: "#f7f6f3",
              borderRadius: 3,
              p: 2.5,
              mb: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography fontSize={14} color="text.secondary">
                Order Number
              </Typography>
              <Typography fontSize={14} fontWeight={700}>
                {orderNumber}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography fontSize={14} color="text.secondary">
                Total Amount
              </Typography>
              <Typography fontSize={14} fontWeight={700}>
                ₹{totalAmount}.00
              </Typography>
            </Box>
          </Paper>

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
                borderRadius: 2.5,
                textTransform: "none",
                fontSize: 15,
                "&:hover": { bgcolor: "var(--primary-teal-mid)" },
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}