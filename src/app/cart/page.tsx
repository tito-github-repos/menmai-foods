"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  TextField,
  Divider,
  Paper,
  Grid,
  Stack,
} from "@mui/material";
import * as Yup from "yup";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import CalendarViewMonthOutlinedIcon from "@mui/icons-material/CalendarViewMonthOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import EggOutlinedIcon from "@mui/icons-material/EggOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import InboxIcon from "@mui/icons-material/Inbox";
import LockIcon from "@mui/icons-material/Lock";

import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeFromCart, setQuantity } from "@/store/cartSlice";
import CheckoutDialog from "./CheckoutDialog";
import BulkOrderLimitDialog from "../components/BulkOrderLimitDialog";
import { getProductLimit } from "@/constants/productLimits";

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

const PINCODE_MIN = 625001;
const PINCODE_MAX = 625025;

const pincodeSchema = Yup.string()
  .required("Please enter your pincode.")
  .matches(/^\d{6}$/, "Pincode must be exactly 6 digits.")
  .test(
    "madurai-range",
    "Sorry! Currently we deliver only within Madurai city limits.",
    (value) => {
      if (!value || value.length !== 6) return true;
      const numeric = Number(value);
      return numeric >= PINCODE_MIN && numeric <= PINCODE_MAX;
    },
  );

export default function CartCheckout() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const [openOtp, setOpenOtp] = useState(false);

  const [pincodeStatus, setPincodeStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [pincodeError, setPincodeError] = useState<string>("");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    saveAddress: false,
  });

  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);

  const updateQty = (productId: number, delta: number) => {
    const item = cartItems.find((item) => item.productId === productId);
    if (!item) return;

    const newQty = item.quantity + delta;
    const MAX_RETAIL_QTY = getProductLimit(item.slug);

    if (newQty < 1) return;

    if (newQty > MAX_RETAIL_QTY) {
      setBulkDialogOpen(true);
      return;
    }

    dispatch(setQuantity({ productId, quantity: newQty }));
  };

  const removeItem = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const validatePincode = async (value: string, force = false) => {
    try {
      await pincodeSchema.validate(value);
      setPincodeStatus("success");
      setPincodeError("");
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        if (!force && value.length > 0 && value.length < 6) {
          // Still typing — stay silent
          setPincodeStatus("idle");
          setPincodeError("");
        } else {
          // Button click OR empty OR full 6 digits — show error
          setPincodeStatus("error");
          setPincodeError(err.message);
        }
      }
    }
  };

  const handlePincodeChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;

    // Block non-numeric and more than 6 digits
    if (!/^\d*$/.test(value) || value.length > 6) return;

    // Update form state
    setForm((prev) => ({ ...prev, pincode: value }));

    // Clear to idle when field is emptied
    if (value.length === 0) {
      setPincodeStatus("idle");
      setPincodeError("");
      return;
    }

    // Validate on every keystroke
    await validatePincode(value);
  };

  const handleCheckPincode = async () => {
    await validatePincode(form.pincode, true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ pb: 4 }}>
        <Box
          sx={{
            pt: 4,
            pb: 1.5,
            backgroundColor: "#f7f6f3",
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: ".74rem",
                    fontWeight: 500,
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    color: "var(--primary-teal-dark)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Review Your Items and Place Your Order
                </Typography>
                <Box
                  sx={{
                    width: 35,
                    height: 32,
                    backgroundColor: "var(--green)",
                    mask: "url('/plant.png') no-repeat center / contain",
                    WebkitMask: "url('/plant.png') no-repeat center / contain",
                    opacity: 0.7,
                    zIndex: 100,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  fontSize: { xs: "1.9rem", md: "2.5rem" },
                  fontWeight: 700,
                  fontFamily: "var(--font-heading)",
                  color: "var(--primary-maroon-dark)",
                  lineHeight: 1.25,
                  mb: 2,
                }}
              >
                Your Cart &amp; Checkout
              </Typography>

              <Typography
                sx={{
                  fontSize: "1rem",
                  color: "var(--text)",
                  lineHeight: 1.7,
                  mb: 3,
                  maxWidth: 480,
                }}
              >
                Fresh, Hygienic & Homemade - delivered to your door.
              </Typography>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg">
          <Box sx={{ py: 3 }}>
            {/* Delivery Availability Card */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                p: { xs: 2.5, md: 3 },
                mb: 4,
                backgroundColor:
                  "color-mix(in srgb, var(--primary-teal-dark), transparent 88%)",
              }}
            >
              <Grid container spacing={3} alignItems="center">
                {/* LEFT: Icon + Title + Description */}
                <Grid item xs={12} md={7}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: { xs: "center", md: "flex-start" },
                      flexDirection: { xs: "column", sm: "row" },
                      textAlign: { xs: "center", sm: "left" },
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "var(--primary-teal-dark)",
                        borderRadius: 10,
                        p: 1.2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <LocationOnOutlinedIcon
                        sx={{ color: "var(--white)", fontSize: 28 }}
                      />
                    </Box>

                    <Box>
                      <Typography
                        fontWeight={700}
                        sx={{
                          fontSize: { xs: "1.1rem", md: "1.35rem" },
                          mb: 0.5,
                        }}
                      >
                        Check Delivery Availability
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: ".95rem",
                          color: "var(--text)",
                          lineHeight: 1.7,
                          maxWidth: 560,
                        }}
                      >
                        Enter your pincode to check if we deliver in your area
                        (within 10 km of Madurai).
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* RIGHT: Input + Button + Status Message */}
                <Grid item xs={12} md={5}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                      justifyContent: { md: "flex-end" },
                    }}
                  >
                    {/* Input Row */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 1.5,
                        // alignItems: "stretch",
                        alignItems: "flex-start",
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Pincode"
                        required
                        placeholder="Enter your pincode"
                        value={form.pincode}
                        onChange={handlePincodeChange}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleCheckPincode()
                        }
                        inputProps={{ inputMode: "numeric", maxLength: 6 }}
                        error={pincodeStatus === "error"}
                        helperText={
                          pincodeStatus === "error"
                            ? pincodeError
                            : pincodeStatus === "success"
                              ? "✓ Delivery available in your area!"
                              : "\u00A0"
                        }
                        FormHelperTextProps={{
                          sx: {
                            color:
                              pincodeStatus === "success"
                                ? "var(--green)"
                                : undefined,
                            fontWeight: pincodeStatus !== "idle" ? 600 : 400,
                            fontSize: "0.75rem",
                            mt: 0.5,
                            ml: 0.5,
                          },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: "#fff",
                            "& fieldset": {
                              borderColor:
                                pincodeStatus === "success"
                                  ? "#C8E6C9"
                                  : pincodeStatus === "error"
                                    ? "#FFCDD2"
                                    : "var(--black)",
                              borderWidth: "1.5px",
                            },
                          },
                          "& input": {
                            py: { xs: 1.4, sm: 1.7 },
                          },
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnOutlinedIcon />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <Button
                        variant="contained"
                        onClick={handleCheckPincode}
                        sx={{
                          bgcolor: "var(--primary-teal-dark)",
                          px: 3,
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                          "&:hover": { bgcolor: "var(--primary-teal-mid)" },
                          width: { xs: "100%", sm: "auto" },
                          py: { xs: 1.4, sm: 1.7 },
                        }}
                      >
                        Check Now
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    p: 2.5,
                    border:
                      "1.5px solid color-mix(in srgb, var(--primary-teal-dark), transparent 70%)",
                    height: "100%",
                  }}
                >
                  {/* Header */}
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
                          bgcolor: "var(--primary-teal-dark)",
                          borderRadius: 2,
                          p: 0.8,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <ShoppingCartOutlinedIcon
                          sx={{ color: "var(--white)", fontSize: 20 }}
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
                          (
                          {cartItems.reduce(
                            (total, item) => total + item.quantity,
                            0,
                          )}{" "}
                          Items)
                        </Typography>
                      </Typography>
                    </Box>

                    {cartItems.length > 0 && (
                      <Button
                        variant="outlined"
                        component={Link}
                        href="/"
                        sx={{
                          color: "var(--primary-teal-dark)",
                          fontWeight: 600,
                          fontSize: 13,
                          borderColor: "var(--primary-teal-dark)",
                          "&:hover": {
                            borderColor: "var(--primary-teal-mid)",
                            bgcolor: "var(--primary-teal-mid)",
                            color: "var(--white)",
                          },
                        }}
                      >
                        + Add Items
                      </Button>
                    )}
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* Empty Cart */}
                  {cartItems.length === 0 ? (
                    <Box
                      sx={{
                        py: 2,
                        px: 2,
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <InboxIcon
                        sx={{
                          fontSize: 72,
                          color:
                            "color-mix(in srgb, var(--primary-teal-dark), transparent 50%)",
                          opacity: 0.7,
                          mb: 2,
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: "1.2rem",
                          fontWeight: 700,
                          color: "var(--primary-maroon-dark)",
                          mb: 1,
                        }}
                      >
                        Your cart is empty
                      </Typography>

                      <Button
                        component={Link}
                        href="/"
                        variant="contained"
                        sx={{
                          bgcolor: "var(--primary-maroon-mid)",
                          px: 4,
                          py: 1.3,
                          fontWeight: 700,
                          borderRadius: 2,
                          "&:hover": {
                            bgcolor: "var(--primary-maroon-dark)",
                          },
                        }}
                      >
                        Add Items
                      </Button>
                    </Box>
                  ) : (
                    <>
                      {/* Cart Items */}
                      <Stack spacing={2.5}>
                        {cartItems.map((item) => (
                          <Box key={item.productId}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
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

                                    <Typography
                                      fontSize={12}
                                      color="text.secondary"
                                    >
                                      Pack of {item.pieces}
                                    </Typography>
                                  </Box>

                                  <Box>
                                    <Typography fontWeight={700} fontSize={15}>
                                      ₹{item.price * item.quantity}.00
                                    </Typography>

                                    <Typography
                                      fontSize={11}
                                      color="text.secondary"
                                      sx={{ textDecoration: "line-through" }}
                                    >
                                      ₹ {item.mrp * item.quantity}.00
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
                                      disabled={item.quantity <= 1}
                                      onClick={() =>
                                        updateQty(item.productId, -1)
                                      }
                                      sx={{
                                        p: 0.3,
                                        color: "var(--brown)",

                                        "&.Mui-disabled": {
                                          color: "#BDBDBD",
                                          cursor: "not-allowed",
                                          pointerEvents: "auto",
                                        },
                                      }}
                                    >
                                      <RemoveIcon sx={{ fontSize: 16 }} />
                                    </IconButton>

                                    <Typography
                                      fontWeight={700}
                                      fontSize={14}
                                      sx={{ minWidth: 20, textAlign: "center" }}
                                    >
                                      {item.quantity}
                                    </Typography>

                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        updateQty(item.productId, 1)
                                      }
                                      sx={{
                                        p: 0.3,
                                        color: "var(--brown)",
                                      }}
                                    >
                                      <AddIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                  </Box>

                                  <IconButton
                                    size="small"
                                    onClick={() => removeItem(item.productId)}
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
                          sx={{
                            color: "var(--primary-teal-dark)",
                            fontSize: 26,
                          }}
                        />

                        <Box>
                          <Typography
                            fontWeight={700}
                            fontSize={13}
                            color="var(--primary-teal-dark)"
                          >
                            Free Delivery
                          </Typography>

                          <Typography
                            fontSize={12}
                            color="var(--primary-teal-dark)"
                          >
                            For the above order
                          </Typography>
                        </Box>
                      </Box>
                    </>
                  )}
                </Paper>
              </Grid>

              {/* RIGHT: Delivery + Summary */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2.5}>
                  {/* Order Summary */}
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      p: 2.5,
                      border:
                        "1.5px solid color-mix(in srgb, var(--primary-teal-dark), transparent 70%)",
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
                          bgcolor: "var(--primary-teal-dark)",
                          borderRadius: 2,
                          p: 0.8,
                          display: "flex",
                        }}
                      >
                        <CalendarViewMonthOutlinedIcon
                          sx={{ color: "var(--white)", fontSize: 20 }}
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
                        Subtotal (
                        {cartItems.reduce(
                          (sum, item) => sum + item.quantity,
                          0,
                        )}{" "}
                        items)
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
                      <Typography
                        fontSize={14}
                        fontWeight={700}
                        color="#2E7D32"
                      >
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
                        // color="var(--brown)"
                      >
                        ₹{subtotal}.00
                      </Typography>
                    </Box>

                    {/* Savings Banner */}
                    {cartItems.length > 0 && (
                      <Box
                        sx={{
                          bgcolor: "#F0FFF4",
                          border: "1px solid #C8E6C9",
                          borderRadius: 2.5,
                          px: 2,
                          py: 1.5,
                          mt: 2,
                          mb: 2,
                          textAlign: "center",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            mb: 0.3,
                          }}
                        >
                          <LocalOfferOutlinedIcon
                            sx={{
                              color: "var(--green)",
                              fontSize: 22,
                            }}
                          />

                          <Typography
                            fontSize={13}
                            sx={{ color: "var(--green)" }}
                          >
                            You saved{" "}
                            <Box component="span" sx={{ fontWeight: 700 }}>
                              ₹
                              {cartItems.reduce(
                                (total, item) =>
                                  total +
                                  (item.mrp - item.price) * item.quantity,
                                0,
                              )}
                              .00
                            </Box>{" "}
                            on this order
                          </Typography>
                        </Box>

                        <Typography
                          fontSize={12}
                          sx={{ color: "var(--green)" }}
                        >
                          Great choice!
                        </Typography>
                      </Box>
                    )}

                    {/* Place Order Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      disabled={cartItems.length === 0}
                      onClick={() => setOpenOtp(true)}
                      sx={{
                        bgcolor: "var(--primary-teal-dark)",
                        "&:hover": { bgcolor: "var(--primary-teal-mid)" },
                        py: 1.6,
                        fontSize: 15,
                        fontWeight: 700,
                        borderRadius: 2.5,

                        "& .arrow-icon": {
                          ml: 1,
                          transition: "transform 0.3s ease",
                        },

                        "&:not(.Mui-disabled):hover .arrow-icon": {
                          transform: "translateX(6px)",
                        },
                        "&.Mui-disabled": {
                          backgroundColor: "#B0BEC5",
                          color: "#FFFFFF",
                          cursor: "not-allowed",
                          pointerEvents: "auto",
                        },
                      }}
                    >
                      Proceed to Checkout
                      <ArrowRightAltOutlinedIcon className="arrow-icon" />
                    </Button>

                    <Typography
                      fontSize={12}
                      color="text.secondary"
                      textAlign="center"
                      mt={1}
                    >
                      <LockIcon
                        sx={{
                          fontSize: 16,
                          verticalAlign: "middle",
                          mr: 0.5,
                        }}
                      />{" "}
                      You will be redirected to Razorpay
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
          </Box>

          {/* Trust Badges */}
          <Paper
            elevation={0}
            sx={{ borderRadius: 3, p: 2.5, mt: 1, border: "1px solid #ECECEC" }}
          >
            <Grid container spacing={2}>
              {trustBadges.map((badge, i) => (
                <Grid item xs={6} md={3} key={i}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        bgcolor: "var(--ivory)",
                        border:
                          "1.5px solid color-mix(in srgb, var(--primary-maroon-mid), transparent 70%)",
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

        <CheckoutDialog
          open={openOtp}
          onClose={() => setOpenOtp(false)}
          cartItems={cartItems}
        />
      </Box>

      <BulkOrderLimitDialog
        open={bulkDialogOpen}
        onClose={() => setBulkDialogOpen(false)}
      />
    </ThemeProvider>
  );
}
