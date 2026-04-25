"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  TextField,
  Checkbox,
  FormControlLabel,
  Divider,
  Paper,
  Grid,
  Stack,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CalendarViewMonthOutlinedIcon from "@mui/icons-material/CalendarViewMonthOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import EggOutlinedIcon from "@mui/icons-material/EggOutlined";

const theme = createTheme({
  palette: {
    primary: { main: "#5C2008" },
    success: { main: "#2E7D32" },
    text: { primary: "#1A1A1A", secondary: "#666666" },
    background: { default: "#F5F5F5", paper: "#FFFFFF" },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", borderRadius: 10 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
  },
});

const initialCartItems = [
  {
    id: 1,
    name: "Soft Chapathi",
    pieces: 10,
    mrp: 50,
    price: 40,
    qty: 1,
    img: "/img/products/chapathi1.jpeg",
  },
  {
    id: 2,
    name: "Soft Poori",
    pieces: 15,
    mrp: 55,
    price: 45,
    qty: 1,
    img: "/img/products/poori1.jpeg",
  },
];

const trustBadges = [
  {
    icon: <StarOutlinedIcon sx={{ color: "var(--brown)", fontSize: 28 }} />,
    label: "100% Homemade",
    sub: "Made with love",
  },
  {
    icon: <EggOutlinedIcon sx={{ color: "var(--green)", fontSize: 28 }} />,
    label: "No Preservatives",
    sub: "Pure & Natural",
  },
  {
    icon: (
      <ShoppingCartOutlinedIcon sx={{ color: "var(--brown)", fontSize: 28 }} />
    ),
    label: "Hygienically Packed",
    sub: "Safe & Fresh",
  },
  {
    icon: (
      <LocalShippingOutlinedIcon sx={{ color: "var(--brown)", fontSize: 28 }} />
    ),
    label: "On-time Delivery",
    sub: "Right to your door",
  },
];

export default function CartCheckout() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    saveAddress: false,
  });

  const updateQty = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, qty: Math.max(0, item.qty + delta) }
            : item,
        )
        .filter((item) => item.qty > 0),
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          py: 8,
          background:
            "linear-gradient(135deg, var(--ivory) 0%, var(--cream) 100%)",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "var(--brown)",
                fontFamily: "'Cormorant Garamond', serif",
                // fontSize: "clamp(1.9rem, 3vw, 2.7rem)",
                // lineHeight: 1.15,
                // margin: "8px 0 12px",
              }}
            >
              Your Cart &amp; Checkout
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "var(--text)",
                // fontSize: ".95rem",
                // lineHeight: 1.8,
              }}
            >
              Review your items and place your order
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  p: 2.5,
                  border: "1px solid var(--ivory)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        bgcolor: "#FFF3E8",
                        borderRadius: 2,
                        p: 0.8,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ShoppingCartOutlinedIcon
                        sx={{ color: "var(--brown)", fontSize: 20 }}
                      />
                    </Box>
                    <Typography fontWeight={700} fontSize={15}>
                      Your Cart{" "}
                      <Typography
                        component="span"
                        color="text.secondary"
                        fontSize={14}
                        fontWeight={400}
                      >
                        ({cartItems.length} Items)
                      </Typography>
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    sx={{
                      color: "var(--brown)",
                      fontWeight: 600,
                      fontSize: 13,
                      borderColor: "var(--brown)",
                      "&:hover": {
                        borderColor: "var(--brown)",
                        bgcolor: "var(--brown)",
                        color: "var(--ivory)",
                      },
                    }}
                  >
                    + Add Items
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />

                {/* Cart Items */}
                <Stack spacing={2.5}>
                  {cartItems.map((item) => (
                    <Box key={item.id}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box
                          component="img"
                          src={item.img}
                          alt={item.name}
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: 2.5,
                            objectFit: "cover",
                            flexShrink: 0,
                            border: "1px solid #F0F0F0",
                          }}
                          onError={(e: any) => {
                            e.target.src =
                              "https://via.placeholder.com/80x80?text=Food";
                          }}
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            <Box>
                              <Typography fontWeight={700} fontSize={14}>
                                {item.name}
                              </Typography>
                              <Typography fontSize={12} color="text.secondary">
                                Pack of {item.pieces}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography fontWeight={700} fontSize={15}>
                                ₹{item.price * item.qty}.00
                              </Typography>
                              <Typography
                                fontSize={11}
                                color="text.secondary"
                                sx={{ textDecoration: "line-through" }}
                              >
                                ₹ {item.mrp * item.qty}.00
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              mt: 1,
                            }}
                          >
                            {/* Qty Control */}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                border: "1px solid #E0E0E0",
                                borderRadius: 2,
                                px: 1,
                                py: 0.3,
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={() => updateQty(item.id, -1)}
                                sx={{
                                  p: 0.3,
                                  color: "var(--brown)",
                                }}
                              >
                                <RemoveIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                              <Typography
                                fontWeight={700}
                                fontSize={14}
                                sx={{ minWidth: 20, textAlign: "center" }}
                              >
                                {item.qty}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => updateQty(item.id, 1)}
                                sx={{ p: 0.3, color: "var(--brown)" }}
                              >
                                <AddIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Box>

                            <IconButton
                              size="small"
                              onClick={() => removeItem(item.id)}
                              sx={{
                                color: "error.main",
                                p: 0.5,
                              }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                      <Divider sx={{ mt: 2.5 }} />
                    </Box>
                  ))}
                </Stack>

                {/* Free Delivery Banner */}
                <Box
                  sx={{
                    mt: 2.5,
                    bgcolor: "#F0FFF4",
                    border: "1px solid #C8E6C9",
                    borderRadius: 2.5,
                    px: 2,
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <LocalShippingOutlinedIcon
                    sx={{ color: "var(--green)", fontSize: 26 }}
                  />
                  <Box>
                    <Typography
                      fontWeight={700}
                      fontSize={13}
                      color="var(--green)"
                    >
                      Free Delivery
                    </Typography>
                    <Typography fontSize={12} color="var(--green)">
                      For the above order
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* RIGHT: Delivery + Summary */}
            <Grid item xs={12} md={6}>
              <Stack spacing={2.5}>
                {/* Delivery Details */}
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    p: 2.5,
                    border: "1px solid var(--ivory)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "#FFF3E8",
                        borderRadius: 2,
                        p: 0.8,
                        display: "flex",
                      }}
                    >
                      <LocationOnOutlinedIcon
                        sx={{ color: "var(--brown)", fontSize: 20 }}
                      />
                    </Box>
                    <Typography fontWeight={700} fontSize={15}>
                      Delivery Details
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <Stack spacing={2}>
                    <Box>
                      <Typography fontSize={13} fontWeight={600} mb={0.5}>
                        Full Name
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Enter your full name"
                        value={form.fullName}
                        onChange={(e) =>
                          setForm({ ...form, fullName: e.target.value })
                        }
                      />
                    </Box>
                    <Box>
                      <Typography fontSize={13} fontWeight={600} mb={0.5}>
                        Phone Number
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Enter your phone number"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                      />
                    </Box>
                    <Box>
                      <Typography fontSize={13} fontWeight={600} mb={0.5}>
                        Delivery Address
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="House / Street / Area"
                        value={form.address}
                        onChange={(e) =>
                          setForm({ ...form, address: e.target.value })
                        }
                      />
                    </Box>
                    <Grid container>
                      <Grid item xs={6} pr={2}>
                        <Typography fontSize={13} fontWeight={600} mb={0.5}>
                          City / Town
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Enter city"
                          value={form.city}
                          onChange={(e) =>
                            setForm({ ...form, city: e.target.value })
                          }
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontSize={13} fontWeight={600} mb={0.5}>
                          Pincode
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Enter pincode"
                          value={form.pincode}
                          onChange={(e) =>
                            setForm({ ...form, pincode: e.target.value })
                          }
                        />
                      </Grid>
                    </Grid>
                    {/* <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={form.saveAddress}
                          onChange={(e) =>
                            setForm({ ...form, saveAddress: e.target.checked })
                          }
                          sx={{
                            color: "#E8650A",
                            "&.Mui-checked": { color: "#E8650A" },
                          }}
                        />
                      }
                      label={
                        <Typography fontSize={13}>
                          Save this address for next time
                        </Typography>
                      }
                    /> */}
                  </Stack>
                </Paper>

                {/* Order Summary */}
                <Paper
                  elevation={0}
                  sx={{ borderRadius: 3, p: 2.5, border: "1px solid #ECECEC" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "var(--ivory)",
                        borderRadius: 2,
                        p: 0.8,
                        display: "flex",
                      }}
                    >
                      <CalendarViewMonthOutlinedIcon
                        sx={{ color: "var(--brown)", fontSize: 20 }}
                      />
                    </Box>
                    <Typography fontWeight={700} fontSize={15}>
                      Order Summary
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1.2,
                    }}
                  >
                    <Typography fontSize={14} color="text.secondary">
                      Subtotal
                    </Typography>
                    <Typography fontSize={14} fontWeight={500}>
                      ₹{subtotal}.00
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1.5,
                    }}
                  >
                    <Typography fontSize={14} color="text.secondary">
                      Delivery Charge
                    </Typography>
                    <Typography fontSize={14} fontWeight={700} color="#2E7D32">
                      FREE
                    </Typography>
                  </Box>
                  <Divider sx={{ borderStyle: "dashed", mb: 1.5 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2.5,
                    }}
                  >
                    <Typography fontSize={15} fontWeight={700}>
                      Total Amount
                    </Typography>
                    <Typography
                      fontSize={17}
                      fontWeight={800}
                      color="var(--brown)"
                    >
                      ₹{subtotal}.00
                    </Typography>
                  </Box>

                  {/* Place Order Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<LockOutlinedIcon />}
                    sx={{
                      bgcolor: "var(--brown)",
                      "&:hover": { bgcolor: "#6e2f18" },
                      py: 1.6,
                      fontSize: 15,
                      fontWeight: 700,
                      borderRadius: 2.5,
                      boxShadow: "0 4px 16px rgba(232,101,10,0.3)",
                    }}
                  >
                    Place Order &amp; Pay
                  </Button>

                  <Typography
                    fontSize={12}
                    color="text.secondary"
                    textAlign="center"
                    mt={1}
                  >
                    🔒 You will be redirected to Razorpay
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    <VerifiedOutlinedIcon
                      sx={{ color: "var(--green)", fontSize: 15 }}
                    />
                    <Typography
                      fontSize={12}
                      color="var(--green)"
                      fontWeight={500}
                    >
                      Secure Payments
                    </Typography>
                  </Box>
                </Paper>
              </Stack>
            </Grid>
          </Grid>

          {/* Trust Badges */}
          <Paper
            elevation={0}
            sx={{ borderRadius: 3, p: 2.5, mt: 3, border: "1px solid #ECECEC" }}
          >
            <Grid container spacing={2}>
              {trustBadges.map((badge, i) => (
                <Grid item xs={6} md={3} key={i}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        bgcolor: "var(--ivory)",
                        borderRadius: 2,
                        p: 1,
                        display: "flex",
                      }}
                    >
                      {badge.icon}
                    </Box>
                    <Box>
                      <Typography fontSize={13} fontWeight={700}>
                        {badge.label}
                      </Typography>
                      <Typography fontSize={11} color="text.secondary">
                        {badge.sub}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
