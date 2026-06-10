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
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { useRouter } from "next/navigation";

/* ── Types ── */
interface BulkOrderItem {
  productId: number;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface BulkFormData {
  fullName: string;
  phone: string;
  email: string;
  deliveryDate: string;
  deliveryTime: string;
  occasionDetails: string;
  deliveryAddress: string;
  pincode: string;
  items: BulkOrderItem[];
  subtotal: number;
  discountRate: number;
  discountAmt: number;
  estimatedTotal: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  formData: BulkFormData;
}

type Step = "mobile" | "otp" | "review";

/* ── Shared field styles ── */
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    "& fieldset": { borderColor: "#e2e8e6", borderWidth: "1.5px" },
    "&:hover fieldset": { borderColor: "var(--primary-teal-dark)" },
    "&.Mui-focused fieldset": { borderColor: "var(--primary-teal-dark)" },
  },
  "& input": { py: { xs: 1.4, sm: 1.7 } },
};

const fmt = (n: number) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* ════════════════════════════════════════
   COMPONENT
════════════════════════════════════════ */
export default function BulkCheckoutDialog({ open, onClose, formData }: Props) {
  const router = useRouter();

  const [step, setStep] = useState<Step>("mobile");
  const [loading, setLoading] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  /* Mobile */
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState("");

  /* OTP */
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  /* Auth */
  const [token, setToken] = useState<string | null>(null);

  /* Server error */
  const [serverError, setServerError] = useState("");

  /* ── Reset on open/close ── */
  useEffect(() => {
    if (!open) {
      setStep("mobile");
      setMobile("");
      setMobileError("");
      setOtp(["", "", "", ""]);
      setOtpError("");
      setTimer(30);
      setToken(null);
      setServerError("");
      setConfirmClose(false);
    }
  }, [open]);

  /* ── OTP timer ── */
  useEffect(() => {
    if (step !== "otp" || timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  useEffect(() => {
    if (step === "otp") setTimer(30);
  }, [step]);

  /* ── Handlers ── */
  const formatMobile = (v: string) => {
    const p = v.match(/(\d{0,5})(\d{0,5})/);
    if (!p) return v;
    return [p[1], p[2]].filter(Boolean).join(" ");
  };

  const handleMobileChange = (v: string) => {
    setMobileError("");
    setMobile(v.replace(/\D/g, "").slice(0, 10));
  };

  const handleOtpChange = (value: string, index: number) => {
    setOtpError("");
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const resendOtp = async () => {
    setOtp(["", "", "", ""]);
    setOtpError("");
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile }),
    });
    const data = await res.json();
    if (!res.ok) { setOtpError(data.message || "Failed to resend OTP."); return; }
    setTimer(30);
  };

  /* ── Send OTP ── */
  const handleSendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setMobileError("Enter valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (!res.ok) { setMobileError(data.message || "Failed to send OTP"); return; }
      setStep("otp");
    } finally {
      setLoading(false);
    }
  };

  /* ── Verify OTP ── */
  const handleVerifyOtp = async () => {
    const entered = otp.join("");
    if (!/^\d{4}$/.test(entered)) { setOtpError("Enter valid 4-digit OTP"); return; }
    if (timer === 0) { setOtpError("OTP expired. Please resend."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp: entered }),
      });
      const data = await res.json();
      if (!res.ok) { setOtpError(data.message || "Invalid OTP"); return; }
      setToken(data.token);
      setStep("review");
    } finally {
      setLoading(false);
    }
  };

  /* ── Place Order ── */
  const handlePlaceOrder = async () => {
    setServerError("");
    setLoading(true);
    try {
      const res = await fetch("/api/bulkorder/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: mobile,
          email: formData.email || null,
          deliveryDate: formData.deliveryDate,
          deliveryTime: formData.deliveryTime,
          occasionDetails: formData.occasionDetails,
          deliveryAddress: formData.deliveryAddress,
          pincode: formData.pincode,
          items: formData.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.message || "Failed to place order. Try again.");
        return;
      }
      onClose();
      router.push(
        `/bulk-order-success?bulkOrderId=${data.bulkOrderId}&totalAmount=${Math.round(data.totalAmount)}`
      );
    } finally {
      setLoading(false);
    }
  };

  /* ── Step meta ── */
  const stepMeta: Record<Step, { title: string; subtitle: React.ReactNode }> = {
    mobile: {
      title: "Verify Your Number",
      subtitle: "Enter your mobile number to confirm the bulk order.",
    },
    otp: {
      title: "Verify OTP",
      subtitle: (
        <>
          Enter 4-digit code sent to{" "}
          <Box component="span" sx={{ fontWeight: 700, color: "var(--text)" }}>
            +91 {mobile}
          </Box>{" "}
          <Box
            component="span"
            sx={{ color: "#1976d2", cursor: "pointer", fontWeight: 600 }}
            onClick={() => { setStep("mobile"); setOtp(["", "", "", ""]); setOtpError(""); }}
          >
            Change
          </Box>
        </>
      ),
    },
    review: {
      title: "Review Your Order",
      subtitle: "Confirm all details before placing your bulk order.",
    },
  };

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
  return (
    <>
      <Dialog
        open={open}
        onClose={(_, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") return;
          setConfirmClose(true);
        }}
        fullWidth
        maxWidth="sm"
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: { xs: "20px 20px 0 0", sm: "20px" },
            overflow: "hidden",
            p: 0,
            m: { xs: 0, sm: 2 },
            width: "100%",
            maxHeight: { xs: "94vh", sm: "92vh" },
            display: "flex",
            flexDirection: "column",
            position: { xs: "fixed", sm: "relative" },
            bottom: { xs: 0, sm: "auto" },
          },
        }}
        sx={{ "& .MuiDialog-container": { alignItems: { xs: "flex-end", sm: "center" } } }}
      >
        {/* ── Header ── */}
        <Box sx={{ px: { xs: 2.5, sm: 3 }, pt: { xs: 2.5, sm: 3 }, pb: 2, display: "flex", alignItems: "flex-start", justifyContent: "space-between", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", flex: 1, pr: 2 }}>
            <Box sx={{ background: "var(--primary-teal-dark)", borderRadius: "50px", p: { xs: 1, sm: 1.3 }, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {step === "review" ? (
                <TaskAltIcon sx={{ color: "white", fontSize: { xs: 22, sm: 26 } }} />
              ) : (
                <PersonOutlineOutlinedIcon sx={{ color: "white", fontSize: { xs: 22, sm: 26 } }} />
              )}
            </Box>
            <Box>
              <Typography sx={{ fontSize: { xs: "1rem", sm: "1.15rem" }, fontWeight: 700, color: "var(--primary-teal-dark)", lineHeight: 1.2 }}>
                {stepMeta[step].title}
              </Typography>
              <Typography sx={{ fontSize: { xs: 12.5, sm: 13.5 }, color: "#7a8a85", mt: 0.5, lineHeight: 1.4 }}>
                {stepMeta[step].subtitle}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setConfirmClose(true)} size="small"
            sx={{ border: "1px solid #e0e0e0", width: { xs: 34, sm: 38 }, height: { xs: 34, sm: 38 }, bgcolor: "white", "&:hover": { bgcolor: "#f5f5f5" } }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        {/* ── Body ── */}
        <Box sx={{ px: { xs: 2.5, sm: 3 }, pt: 3, pb: 3, overflowY: "auto", flex: 1 }}>

          {/* ── MOBILE STEP ── */}
          {step === "mobile" && (
            <TextField
              fullWidth
              label="Mobile Number"
              value={formatMobile(mobile)}
              onChange={(e) => handleMobileChange(e.target.value)}
              error={!!mobileError}
              helperText={mobileError}
              placeholder="99999 99999"
              inputProps={{ inputMode: "numeric", maxLength: 11 }}
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ display: "flex", alignItems: "center", pr: 1.5, mr: 1, borderRight: "1.5px solid #e2e8e6" }}>
                      <Typography fontSize={14}>+91</Typography>
                    </Box>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <SmartphoneOutlinedIcon sx={{ fontSize: 18, color: "#c0ccc8" }} />
                  </InputAdornment>
                ),
              }}
            />
          )}

          {/* ── OTP STEP ── */}
          {step === "otp" && (
            <Box sx={{ textAlign: "center" }}>
              <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center" }}>
                {otp.map((val, i) => (
                  <TextField key={i}
                    error={!!otpError}
                    inputRef={(el) => (inputRefs.current[i] = el)}
                    value={val}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    inputProps={{ inputMode: "numeric", maxLength: 1, style: { textAlign: "center", fontSize: 20, fontWeight: 700 } }}
                    sx={{ width: 54, "& .MuiOutlinedInput-root": { borderRadius: "10px", "& fieldset": { borderColor: val ? "var(--primary-teal-dark)" : "#e2e8e6", borderWidth: "1.5px" } } }}
                  />
                ))}
              </Box>
              {otpError && <Typography sx={{ color: "error.main", fontSize: 13, mt: 1.5 }}>{otpError}</Typography>}
              <Box sx={{ mt: 2 }}>
                {timer > 0 ? (
                  <Typography fontSize={13} color="gray">Resend OTP in 00:{timer < 10 ? `0${timer}` : timer}</Typography>
                ) : (
                  <Button size="small" sx={{ color: "var(--primary-teal-dark)" }} onClick={resendOtp}>Resend OTP</Button>
                )}
              </Box>
            </Box>
          )}

          {/* ── REVIEW STEP ── */}
          {step === "review" && (
            <Box>
              {/* Contact + Delivery info */}
              <Box sx={{ borderRadius: "14px", border: "1.5px solid rgba(0,0,0,0.08)", overflow: "hidden", mb: 2.5 }}>
                {/* Section header */}
                <Box sx={{ px: 2, py: 1.25, backgroundColor: "rgba(0,0,0,0.025)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text)", opacity: 0.55 }}>
                    Order Details
                  </Typography>
                </Box>

                <Box sx={{ px: 2, py: 1.5, display: "flex", flexDirection: "column", gap: 0 }}>
                  {[
                    { icon: <PersonOutlineOutlinedIcon sx={{ fontSize: 16 }} />, label: "Name", value: formData.fullName },
                    { icon: <SmartphoneOutlinedIcon sx={{ fontSize: 16 }} />,   label: "Phone", value: `+91 ${mobile}` },
                    ...(formData.email ? [{ icon: <PersonOutlineOutlinedIcon sx={{ fontSize: 16 }} />, label: "Email", value: formData.email }] : []),
                    { icon: <EventNoteOutlinedIcon sx={{ fontSize: 16 }} />,    label: "Occasion", value: formData.occasionDetails },
                    { icon: <CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} />,label: "Delivery Date", value: formatDate(formData.deliveryDate) },
                    { icon: <AccessTimeOutlinedIcon sx={{ fontSize: 16 }} />,   label: "Time Slot", value: formData.deliveryTime },
                    { icon: <LocationOnOutlinedIcon sx={{ fontSize: 16 }} />,   label: "Address", value: `${formData.deliveryAddress} – ${formData.pincode}` },
                  ].map((row, i, arr) => (
                    <Box key={row.label}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, py: 1.1 }}>
                        <Box sx={{ color: "var(--primary-teal-dark)", mt: 0.15, flexShrink: 0 }}>{row.icon}</Box>
                        <Typography sx={{ fontSize: "0.8rem", color: "var(--text)", opacity: 0.55, fontWeight: 600, minWidth: 90, flexShrink: 0 }}>{row.label}</Typography>
                        <Typography sx={{ fontSize: "0.83rem", color: "var(--primary-maroon-dark)", fontWeight: 500, wordBreak: "break-word", flex: 1 }}>{row.value}</Typography>
                      </Box>
                      {i < arr.length - 1 && <Divider sx={{ opacity: 0.4 }} />}
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Products table */}
              <Box sx={{ borderRadius: "14px", border: "1.5px solid rgba(0,0,0,0.08)", overflow: "hidden", mb: 2.5 }}>
                <Box sx={{ px: 2, py: 1.25, backgroundColor: "rgba(0,0,0,0.025)", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 1 }}>
                  <Inventory2OutlinedIcon sx={{ fontSize: 15, color: "var(--primary-teal-dark)" }} />
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text)", opacity: 0.55 }}>
                    Products Ordered
                  </Typography>
                </Box>

                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {["Product", "Qty", "Rate", "Total"].map((h) => (
                        <TableCell key={h} align={h === "Product" ? "left" : "right"} sx={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text)", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.05em", py: 1, px: 1.5, borderBottom: "1px solid rgba(0,0,0,0.06)", backgroundColor: "rgba(0,0,0,0.01)" }}>
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.items.map((item) => (
                      <TableRow key={item.productId} sx={{ "&:last-child td": { border: 0 } }}>
                        <TableCell sx={{ py: 1.25, px: 1.5, borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {item.image ? (
                              <Box component="img" src={item.image} alt={item.name}
                                sx={{ width: 32, height: 32, borderRadius: "7px", objectFit: "cover", border: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }}
                              />
                            ) : (
                              <Box sx={{ width: 32, height: 32, borderRadius: "7px", backgroundColor: "rgba(0,0,0,0.06)", flexShrink: 0 }} />
                            )}
                            <Typography sx={{ fontSize: "0.83rem", fontWeight: 600, color: "var(--primary-maroon-dark)" }}>{item.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.25, px: 1.5, fontSize: "0.83rem", color: "var(--text)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                          {item.quantity.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.25, px: 1.5, fontSize: "0.83rem", color: "var(--text)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                          ₹{item.unitPrice.toFixed(2)}
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.25, px: 1.5, fontSize: "0.83rem", fontWeight: 700, color: "var(--primary-maroon-dark)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                          ₹{fmt(item.total)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Totals */}
                <Box sx={{ px: 2, py: 1.5, borderTop: "1.5px solid rgba(0,0,0,0.07)", backgroundColor: "rgba(0,0,0,0.015)" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
                    <Typography sx={{ fontSize: ".82rem", color: "var(--text)", opacity: 0.7 }}>Subtotal</Typography>
                    <Typography sx={{ fontSize: ".82rem", color: "var(--text)", fontWeight: 500 }}>₹ {fmt(formData.subtotal)}</Typography>
                  </Box>
                  {formData.discountAmt > 0 && (
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
                      <Typography sx={{ fontSize: ".82rem", color: "var(--text)", opacity: 0.7 }}>
                        Bulk Discount ({Math.round(formData.discountRate * 100)}%)
                      </Typography>
                      <Typography sx={{ fontSize: ".82rem", color: "#c62828", fontWeight: 500 }}>
                        – ₹ {fmt(formData.discountAmt)}
                      </Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ fontSize: ".9rem", fontWeight: 700, color: "var(--primary-maroon-dark)" }}>Total Amount</Typography>
                    <Typography sx={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--primary-maroon-dark)" }}>
                      ₹ {fmt(formData.estimatedTotal)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {/* Server error */}
          {serverError && (
            <Typography color="error" fontSize={13} sx={{ mt: 1, mb: 1, textAlign: "center" }}>
              {serverError}
            </Typography>
          )}

          {/* CTA Button */}
          <Button fullWidth variant="contained" disabled={loading}
            onClick={step === "mobile" ? handleSendOtp : step === "otp" ? handleVerifyOtp : handlePlaceOrder}
            sx={{
              mt: step === "review" ? 0 : 3,
              py: { xs: 1.4, sm: 1.7 },
              fontSize: { xs: 14, sm: 15 },
              fontWeight: 700,
              borderRadius: "14px",
              bgcolor: step === "review" ? "var(--primary-maroon-dark)" : "var(--primary-teal-dark)",
              textTransform: "none",
              boxShadow: "0 4px 16px rgba(0,0,0,0.14)",
              "&:hover": {
                bgcolor: step === "review"
                  ? "color-mix(in srgb, var(--primary-maroon-dark), black 12%)"
                  : "var(--primary-teal-mid)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={22} sx={{ color: "white" }} />
            ) : step === "mobile" ? (
              "Send OTP"
            ) : step === "otp" ? (
              "Verify & Continue"
            ) : (
              "Confirm & Place Order"
            )}
          </Button>

          {/* Security footer */}
          <Box sx={{ mt: 2.5, bgcolor: "#F9F9F9", borderRadius: 2, py: 1.2, px: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 0.8 }}>
            <SecurityOutlinedIcon sx={{ fontSize: 16, color: "var(--green)" }} />
            <Typography fontSize={12} color="text.secondary">Your data is 100% secure and encrypted</Typography>
          </Box>
        </Box>
      </Dialog>

      {/* ── Confirm close dialog ── */}
      <Dialog
        open={confirmClose}
        onClose={(_, reason) => { if (reason === "backdropClick") return; setConfirmClose(false); }}
        PaperProps={{ sx: { borderRadius: { xs: "20px 20px 0 0", sm: "16px" }, p: 3, maxWidth: { xs: "100%", sm: 320 }, width: "100%", m: { xs: 0, sm: 2 }, position: { xs: "fixed", sm: "relative" }, bottom: { xs: 0, sm: "auto" } } }}
        sx={{ "& .MuiDialog-container": { alignItems: { xs: "flex-end", sm: "center" } } }}
      >
        <Typography fontWeight={700} fontSize={16} mb={1}>Cancel order?</Typography>
        <Typography fontSize={13.5} color="text.secondary" mb={3}>Are you sure you want to close? Your progress will be lost.</Typography>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button fullWidth variant="outlined" onClick={() => setConfirmClose(false)}
            sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 600, borderColor: "#e2e8e6", color: "text.primary" }}
          >
            Continue
          </Button>
          <Button fullWidth variant="contained" onClick={() => { setConfirmClose(false); onClose(); }}
            sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 600, bgcolor: "var(--primary-teal-dark)", "&:hover": { bgcolor: "var(--primary-teal-mid)" } }}
          >
            Yes, Close
          </Button>
        </Box>
      </Dialog>
    </>
  );
}