/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";

import {
  Dialog,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  InputAdornment,
  Stack,
  Grid,
  CircularProgress,
} from "@mui/material";
import * as Yup from "yup";
import Script from "next/script";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/cartSlice";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";

interface Props {
  open: boolean;
  onClose: () => void;
  cartItems: {
    productId: number;
    quantity: number;
  }[];
}

const mobileSchema = Yup.object({
  mobile: Yup.string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, "Enter valid 10-digit mobile number"),
});

const otpSchema = Yup.object({
  otp: Yup.string()
    .required("OTP is required")
    .matches(/^\d{4}$/, "Enter valid 4-digit OTP"),
});

const addressSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .required("Full name is required")
    .test(
      "min-name",
      "Name must be at least 3 characters",
      (value) => !value || value.length >= 3,
    ),

  email: Yup.string()
    .trim()
    .test("email-validation", "Enter a valid email address", (value) => {
      if (!value || value.trim() === "") return true;

      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    }),

  address: Yup.string()
    .trim()
    .required("Delivery address is required")
    .test(
      "min-address",
      "Please enter a complete address",
      (value) => !value || value.length >= 5,
    ),

  city: Yup.string()
    .trim()
    .required("City is required")
    .test(
      "min-address",
      "City must be at least 3 characters",
      (value) => !value || value.length >= 3,
    ),

  pincode: Yup.string()
    .trim()
    .required("Pincode is required")
    .matches(/^\d{6}$/, {
      message: "Pincode must be 6 digits",
      excludeEmptyString: true,
    }),
});

export default function CheckoutDialog({ open, onClose, cartItems }: Props) {
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState<string | null>(null);

  const [customerId, setCustomerId] = useState<number | null>(null);

  const dispatch = useAppDispatch();

  const [step, setStep] = useState<"mobile" | "otp" | "address">("mobile");

  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState("");

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [resendCount, setResendCount] = useState(0);
  const [timer, setTimer] = useState(0);

  const [paymentInProgress, setPaymentInProgress] = useState(false);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [formErrors, setFormErrors] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [confirmClose, setConfirmClose] = useState(false);

  const [serverError, setServerError] = useState("");

  const [isPincodeServiceable, setIsPincodeServiceable] = useState(true);

  useEffect(() => {
    if (step === "address") {
      setForm((prev) => ({ ...prev, phone: mobile }));
      setFormErrors({
        fullName: "",
        email: "",
        address: "",
        city: "",
        pincode: "",
      });
      setServerError("");
    }
  }, [step]);

  // TIMER
  useEffect(() => {
    if (step !== "otp") return;
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [step, timer]);

  useEffect(() => {
    if (step === "otp") setTimer(60);
  }, [step]);

  const handleMobileChange = (value: string) => {
    setMobileError("");
    const digits = value.replace(/\D/g, "").slice(0, 10);
    setMobile(digits);

    // Reset otp state
    setOtp(["", "", "", ""]);
    setOtpError("");
    setResendCount(0);
    setTimer(0);
  };

  const formatMobile = (value: string) => {
    const parts = value.match(/(\d{0,5})(\d{0,5})/);
    if (!parts) return value;
    return [parts[1], parts[2]].filter(Boolean).join(" ");
  };

  // OTP
  const handleOtpChange = (value: string, index: number) => {
    setOtpError("");

    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const resendOtp = async () => {
    setOtp(["", "", "", ""]);
    setOtpError("");
    const cleanMobile = mobile.replace(/\s/g, "");

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile: cleanMobile }),
    });

    const data = await res.json();
    if (!res.ok) {
      setOtpError(data.message || "Failed to resend OTP. Try again.");
      return;
    }

    // Update resend count and timer
    setResendCount(data.resendCount ?? resendCount + 1);
    setTimer(data.resendCooldown ?? 60);
  };

  const validateField = async (name: string, value: string) => {
    try {
      await addressSchema.validateAt(name, { ...form, [name]: value });
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (error: any) {
      setFormErrors((prev) => ({ ...prev, [name]: error.message }));
    }
  };

  useEffect(() => {
    if (!open) {
      setStep("mobile");
      setMobile("");
      setMobileError("");
      setOtp(["", "", "", ""]);
      setOtpError("");
      setTimer(60);
      setCustomerId(null);
      setToken(null);
      setForm({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
      });
      setFormErrors({
        fullName: "",
        email: "",
        address: "",
        city: "",
        pincode: "",
      });
      setConfirmClose(false);
    }
  }, [open]);

  const checkPincodeAPI = async (pincode: string) => {
    const res = await fetch("/api/check-pincode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pincode }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;
  };

  useEffect(() => {
    const check = async () => {
      if (step !== "address") return;
      if (!form.pincode || form.pincode.length !== 6) return;

      try {
        const res = await checkPincodeAPI(form.pincode);
        setIsPincodeServiceable(res.serviceable);
      } catch {
        setIsPincodeServiceable(false);
      }
    };

    check();
  }, [form.pincode, step]);

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <Dialog
        open={open}
        onClose={(_, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") return;
          setConfirmClose(true);
        }}
        fullWidth
        maxWidth="xs"
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: { xs: "20px 20px 0 0", sm: "16px" },
            overflow: "hidden",
            p: 0,
            m: { xs: 0, sm: 2 },
            width: "100%",
            maxHeight: { xs: "92vh", sm: "90vh" },
            display: "flex",
            flexDirection: "column",
            position: { xs: "fixed", sm: "relative" },
            bottom: { xs: 0, sm: "auto" },
          },
        }}
        sx={{
          "& .MuiDialog-container": {
            alignItems: { xs: "flex-end", sm: "center" },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            px: { xs: 2, sm: 3 },
            pt: { xs: 2.5, sm: 3 },
            pb: { xs: 2, sm: 2.5 },
          }}
        >
          {/* LEFT SIDE */}
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              alignItems: "flex-start",
              flex: 1,
              pr: 2,
            }}
          >
            <Box
              sx={{
                background: "var(--primary-teal-mid)",
                borderRadius: "50px",
                p: { xs: 1, sm: 1.3 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {step === "mobile" ? (
                <PersonOutlineOutlinedIcon
                  sx={{
                    color: "white",
                    fontSize: { xs: 22, sm: 26 },
                  }}
                />
              ) : step === "otp" ? (
                <Box
                  component="img"
                  src="/otp-icon.svg"
                  alt="OTP Icon"
                  sx={{
                    width: { xs: 22, sm: 26 },
                    height: { xs: 22, sm: 26 },
                    filter: "brightness(0) invert(1)",
                  }}
                />
              ) : (
                <LocationOnOutlinedIcon
                  sx={{
                    color: "white",
                    fontSize: { xs: 22, sm: 26 },
                  }}
                />
              )}
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: { xs: "1rem", sm: "1.2rem" },
                  fontWeight: 700,
                  color: "var(--primary-teal-dark)",
                  lineHeight: 1.2,
                }}
              >
                {step === "mobile"
                  ? "Login to continue"
                  : step === "otp"
                    ? "Verify OTP"
                    : "Enter Address"}
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: 12.5, sm: 13.5 },
                  color: "#7a8a85",
                  mt: 0.5,
                  lineHeight: 1.4,
                }}
              >
                {step === "mobile" ? (
                  "Enter your mobile number — we'll send a one-time code."
                ) : step === "otp" ? (
                  <>
                    Enter 4 digit code sent to{" "}
                    <Box
                      component="span"
                      sx={{
                        fontWeight: 700,
                        color: "var(--text)",
                      }}
                    >
                      +91 {mobile}
                    </Box>{" "}
                    <span
                      style={{
                        color: "#1976d2",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                      onClick={() => {
                        setStep("mobile");
                        setOtp(["", "", "", ""]);
                        setOtpError("");
                        setTimer(60);
                      }}
                    >
                      Change
                    </span>
                  </>
                ) : (
                  "Fill delivery details"
                )}
              </Typography>
            </Box>
          </Box>

          {/* CLOSE BUTTON */}
          <IconButton
            onClick={() => setConfirmClose(true)}
            size="small"
            sx={{
              border: "1px solid #e0e0e0",
              width: { xs: 34, sm: 38 },
              height: { xs: 34, sm: 38 },
              bgcolor: "white",

              "&:hover": {
                bgcolor: "#f5f5f5",
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            pt: { xs: 3, sm: 4 },
            pb: 3,
            overflowY: "auto",
            maxHeight: "calc(90vh - 140px)",
          }}
        >
          {/* MOBILE STEP */}
          {step === "mobile" && (
            <TextField
              fullWidth
              label="Mobile Number"
              value={formatMobile(mobile)}
              onChange={(e) => {
                handleMobileChange(e.target.value);
                if (mobileError) setMobileError("");
              }}
              error={!!mobileError}
              helperText={mobileError}
              placeholder="99999 99999"
              inputProps={{
                inputMode: "numeric",
                maxLength: 11,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "& fieldset": {
                    borderColor: "#e2e8e6",
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
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        pr: 1.5,
                        mr: 1,
                        borderRight: "1.5px solid #e2e8e6",
                      }}
                    >
                      <Typography fontSize={14}>+91</Typography>
                    </Box>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <SmartphoneOutlinedIcon
                      sx={{ fontSize: 18, color: "#c0ccc8" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          )}

          {/* OTP STEP */}
          {step === "otp" && (
            <Box sx={{ textAlign: "center" }}>
              <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center" }}>
                {otp.map((val, i) => (
                  <TextField
                    key={i}
                    error={!!otpError}
                    inputRef={(el) => (inputRefs.current[i] = el)}
                    value={val}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    inputProps={{
                      inputMode: "numeric",
                      autoComplete: "one-time-code",
                      maxLength: 1,
                      style: {
                        textAlign: "center",
                        fontSize: 18,
                        fontWeight: 600,
                      },
                    }}
                    sx={{
                      width: 50,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        "& fieldset": {
                          borderColor: "#e2e8e6",
                          borderWidth: "1.5px",
                        },
                      },
                    }}
                  />
                ))}
              </Box>

              <Box sx={{ mt: 2 }}>
                {otpError && (
                  <Typography
                    sx={{
                      color: "error.main",
                      fontSize: 13,
                      mt: 1.5,
                    }}
                  >
                    {otpError}
                  </Typography>
                )}

                {timer > 0 ? (
                  <Typography fontSize={13} color="gray">
                    Resend OTP in 00:{timer < 10 ? `0${timer}` : timer}
                  </Typography>
                ) : (
                  <Button
                    size="small"
                    sx={{
                      color: "var(--primary-teal-mid)",
                    }}
                    onClick={resendOtp}
                  >
                    Resend OTP
                  </Button>
                )}
              </Box>
            </Box>
          )}

          {/* ADDRESS STEP */}
          {step === "address" && (
            <Stack spacing={2.2}>
              <TextField
                fullWidth
                label="Full Name"
                required
                placeholder="Enter your name"
                InputLabelProps={{ shrink: true }}
                value={form.fullName}
                onChange={(e) => {
                  setForm({ ...form, fullName: e.target.value });
                  validateField("fullName", e.target.value);
                }}
                error={!!formErrors.fullName}
                helperText={formErrors.fullName}
                inputProps={{
                  inputMode: "text",
                  maxLength: 60,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "& fieldset": {
                      borderColor: "#e2e8e6",
                      borderWidth: "1.5px",
                    },
                  },
                  "& input": {
                    py: { xs: 1.4, sm: 1.6 },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Email Address"
                placeholder="Enter your email address"
                InputLabelProps={{ shrink: true }}
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value.trimStart() });
                  validateField("email", e.target.value);
                }}
                error={!!formErrors.email}
                helperText={formErrors.email}
                inputProps={{
                  inputMode: "email",
                  maxLength: 100,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",

                    "& fieldset": {
                      borderColor: "#e2e8e6",
                      borderWidth: "1.5px",
                    },
                  },

                  "& input": {
                    py: { xs: 1.4, sm: 1.6 },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Mobile Number"
                size="small"
                placeholder="Enter your mobile number"
                value={form.phone}
                disabled
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "& fieldset": {
                      borderColor: "#e2e8e6",
                      borderWidth: "1.5px",
                    },
                  },
                  "& input": {
                    py: { xs: 1.4, sm: 1.6 },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Delivery Address"
                required
                placeholder="House / Street / Area"
                InputLabelProps={{ shrink: true }}
                multiline
                rows={3}
                value={form.address}
                onChange={(e) => {
                  setForm({ ...form, address: e.target.value });
                  validateField("address", e.target.value);
                }}
                error={!!formErrors.address}
                helperText={formErrors.address}
                inputProps={{ maxLength: 200 }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "& fieldset": {
                      borderColor: "#e2e8e6",
                      borderWidth: "1.5px",
                    },
                  },
                }}
              />

              <Grid container>
                <Grid item xs={6} sx={{ paddingLeft: 0, pr: "8px" }}>
                  <TextField
                    fullWidth
                    label="City / Town"
                    required
                    placeholder="Enter city"
                    value={form.city}
                    onChange={(e) => {
                      setForm({ ...form, city: e.target.value });
                      validateField("city", e.target.value);
                    }}
                    error={!!formErrors.city}
                    helperText={formErrors.city}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      inputMode: "text",
                      maxLength: 50,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        "& fieldset": {
                          borderColor: "#e2e8e6",
                          borderWidth: "1.5px",
                        },
                      },

                      "& input": {
                        py: { xs: 1.4, sm: 1.6 },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={6} sx={{ pl: "8px", pr: 0 }}>
                  <TextField
                    fullWidth
                    label="Pincode"
                    required
                    InputLabelProps={{ shrink: true }}
                    placeholder="Enter pincode"
                    value={form.pincode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setForm({ ...form, pincode: val });
                      validateField("pincode", val);
                    }}
                    error={!!formErrors.pincode}
                    helperText={formErrors.pincode}
                    inputProps={{
                      inputMode: "numeric",
                      maxLength: 6,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        "& fieldset": {
                          borderColor: "#e2e8e6",
                          borderWidth: "1.5px",
                        },
                      },

                      "& input": {
                        py: { xs: 1.4, sm: 1.6 },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Stack>
          )}

          {/* BUTTON */}
          {serverError && (
            <Typography
              color="error"
              fontSize={13}
              sx={{ mt: 1, mb: 1, textAlign: "center" }}
            >
              {serverError}
            </Typography>
          )}

          {step === "address" && !isPincodeServiceable && (
            <>
              <Box
                sx={{
                  mt: 3,
                  bgcolor: "#fdeded",
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.8,
                }}
              >
                <HighlightOffOutlinedIcon
                  sx={{ fontSize: 18, color: "#d32f2f" }}
                />

                <Typography fontSize={12} color="error.main">
                  Sorry, we don't deliver to this pincode yet. We currently
                  serve within 10 km of Madurai.
                </Typography>
              </Box>
            </>
          )}

          <Button
            fullWidth
            variant="contained"
            disabled={loading || (step === "address" && !isPincodeServiceable)}
            sx={{
              mt: { xs: 2.5, sm: 3 },
              py: { xs: 1.4, sm: 1.7 },
              fontSize: { xs: 14, sm: 15 },
              fontWeight: 700,
              borderRadius: "14px",
              bgcolor: "var(--primary-teal-dark)",
              textTransform: "none",

              "&:hover": { bgcolor: "var(--primary-teal-mid)" },
            }}
            onClick={async () => {
              if (paymentInProgress) return;
              setPaymentInProgress(true);

              setLoading(true);
              try {
                if (step === "mobile") {
                  try {
                    await mobileSchema.validate(
                      { mobile },
                      { abortEarly: false },
                    );
                    const res = await fetch("/api/auth/send-otp", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ mobile }),
                    });
                    const data = await res.json();
                    if (!res.ok) {
                      setMobileError(data.message);
                      setPaymentInProgress(false);
                      return;
                    }
                    setMobileError("");
                    setStep("otp");
                  } catch (error: any) {
                    if (error instanceof Yup.ValidationError) {
                      setMobileError(error.errors[0]);
                    }
                  }
                } else if (step === "otp") {
                  // Block if timer expired
                  if (timer === 0) {
                    setOtpError(
                      "OTP expired. Please click Resend OTP and try again.",
                    );
                    return;
                  }
                  try {
                    const enteredOtp = otp.join("");
                    await otpSchema.validate(
                      { otp: enteredOtp },
                      { abortEarly: false },
                    );
                    const res = await fetch("/api/auth/verify-otp", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ mobile, otp: enteredOtp }),
                    });
                    const data = await res.json();
                    if (!res.ok) {
                      setOtpError(data.message);
                      setPaymentInProgress(false);
                      return;
                    }
                    setCustomerId(data.customerId);
                    setToken(data.token);
                    localStorage.setItem("token", data.token);

                    await fetch("/api/cart/sync", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                      body: JSON.stringify({
                        items: cartItems,
                      }),
                    });

                    setOtpError("");
                    if (data.existingAddress) {
                      setForm((prev) => ({
                        ...prev,
                        fullName: data.existingAddress.fullName || "",
                        email: data.existingAddress.email || "",
                        address: data.existingAddress.fullAddress || "",
                        city: data.existingAddress.city || "",
                        pincode: data.existingAddress.pincode || "",
                      }));
                    }
                    setStep("address");
                  } catch (error: any) {
                    if (error instanceof Yup.ValidationError) {
                      setOtpError(error.errors[0]);
                    }
                  }
                } else if (step === "address") {
                  if (!isPincodeServiceable) {
                    setServerError("Delivery not available for this pincode");
                    setPaymentInProgress(false);
                    return;
                  }
                  // Validate form
                  try {
                    await addressSchema.validate(form, { abortEarly: false });
                  } catch (error: any) {
                    if (error instanceof Yup.ValidationError) {
                      const errors: any = {};
                      error.inner.forEach((err) => {
                        if (err.path) errors[err.path] = err.message;
                      });
                      setFormErrors(errors);
                      return;
                    }
                  }

                  // Clear errors
                  setFormErrors({
                    fullName: "",
                    email: "",
                    address: "",
                    city: "",
                    pincode: "",
                  });

                  const res = await fetch("/api/customer/address", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                      // customerId,
                      fullName: form.fullName,
                      email: form.email,
                      address: form.address,
                      city: form.city,
                      pincode: form.pincode,
                    }),
                  });
                  const data = await res.json();
                  if (!res.ok) {
                    setServerError(
                      data.message || "Failed to save address. Try again.",
                    );
                    setPaymentInProgress(false);
                    return;
                  }

                  // Create order after address saved
                  const orderRes = await fetch("/api/orders/create", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                      // customerId,
                      addressId: data.addressId,
                      items: cartItems.map((i) => ({
                        productId: i.productId,
                        quantity: i.quantity,
                        // NO price sent — backend fetches from DB
                      })),
                    }),
                  });

                  const orderData = await orderRes.json();
                  if (!orderRes.ok) {
                    setServerError(
                      orderData.message || "Failed to create order. Try again.",
                    );
                    setPaymentInProgress(false);
                    return;
                  }

                  const paymentRes = await fetch("/api/payment/create-order", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                      orderId: orderData.orderId,
                    }),
                  });

                  const paymentData = await paymentRes.json();

                  if (!paymentRes.ok) {
                    setServerError(
                      paymentData.message ||
                        "Failed to initiate payment. Try again.",
                    );
                    setPaymentInProgress(false);
                    return;
                  }

                  const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

                    amount: paymentData.amount,

                    currency: paymentData.currency,

                    order_id: paymentData.razorpayOrderId,

                    name: "Menmai Foods",

                    description: "Order Payment",

                    modal: {
                      ondismiss: function () {
                        setLoading(false);
                        setPaymentInProgress(false);
                      },
                    },

                    handler: async function (response: any) {
                      setPaymentInProgress(false);
                      const verifyRes = await fetch("/api/payment/verify", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({
                          razorpay_order_id: response.razorpay_order_id,
                          razorpay_payment_id: response.razorpay_payment_id,
                          razorpay_signature: response.razorpay_signature,
                          orderId: orderData.orderId,
                        }),
                      });

                      const verifyData = await verifyRes.json();

                      if (!verifyRes.ok) {
                        alert("Payment verification failed");
                        return;
                      }

                      dispatch(clearCart());

                      onClose();

                      window.location.href =
                        `/order-success?orderNumber=${orderData.orderNumber}` +
                        `&totalAmount=${orderData.totalAmount}`;
                    },

                    prefill: {
                      name: form.fullName,
                      contact: mobile,
                      email: form.email,
                    },

                    theme: {
                      color: "#0F766E",
                    },
                  };

                  if (!(window as any).Razorpay) {
                    alert("Razorpay SDK not loaded");
                    return;
                  }

                  const razorpay = new (window as any).Razorpay(options);

                  razorpay.open();

                  // dispatch(clearCart());
                  // Redirect to success page
                  // onClose();
                  //   window.location.href = `/order-success?orderNumber=${orderData.orderNumber}&totalAmount=${orderData.totalAmount}`;
                }
              } finally {
                setLoading(false);
                setPaymentInProgress(false);
              }
            }}
          >
            {loading ? (
              <CircularProgress size={22} sx={{ color: "white" }} />
            ) : step === "mobile" ? (
              "Send OTP"
            ) : step === "otp" ? (
              "Verify OTP"
            ) : (
              "Proceed to Pay"
            )}
          </Button>

          {/* FOOTER */}
          <Box
            sx={{
              mt: 3,
              bgcolor: "#F9F9F9",
              borderRadius: 2,
              py: 1.2,
              px: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.8,
            }}
          >
            <SecurityOutlinedIcon
              sx={{ fontSize: 16, color: "var(--green)" }}
            />
            <Typography fontSize={12} color="text.secondary">
              Your data is 100% secure and encrypted
            </Typography>
          </Box>
        </Box>
      </Dialog>
      <Dialog
        open={confirmClose}
        onClose={(_, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") return;
          setConfirmClose(false);
        }}
        PaperProps={{
          sx: {
            borderRadius: { xs: "20px 20px 0 0", sm: "16px" },
            p: 3,
            maxWidth: { xs: "100%", sm: 320 },
            width: "100%",
            m: { xs: 0, sm: 2 },
            position: { xs: "fixed", sm: "relative" },
            bottom: { xs: 0, sm: "auto" },
          },
        }}
        sx={{
          "& .MuiDialog-container": {
            alignItems: { xs: "flex-end", sm: "center" },
          },
        }}
      >
        <Typography fontWeight={700} fontSize={16} mb={1}>
          Cancel checkout?
        </Typography>
        <Typography fontSize={13.5} color="text.secondary" mb={3}>
          Are you sure you want to close? Your progress will be lost.
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setConfirmClose(false)}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#e2e8e6",
              color: "text.primary",
              "&:hover": { borderColor: "#ccc" },
            }}
          >
            Continue
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              setConfirmClose(false);
              onClose();
            }}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "var(--primary-teal-dark)",
              "&:hover": { bgcolor: "var(--primary-teal-mid)" },
            }}
          >
            Yes, Close
          </Button>
        </Box>
      </Dialog>
    </>
  );
}
