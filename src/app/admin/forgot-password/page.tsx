// FILE 5: app/forgot-password/page.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Box, Paper, Typography, TextField,
  Button, InputAdornment, Alert,
} from "@mui/material";

import PersonOutlineIcon  from "@mui/icons-material/PersonOutline";
import ArrowBackIcon      from "@mui/icons-material/ArrowBack";
import MarkEmailReadIcon  from "@mui/icons-material/MarkEmailRead";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [sent,     setSent]     = useState(false);

  const handleSubmit = async () => {
    if (!username.trim()) {
      setError("Please enter your username");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/forgot-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ username: username.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
      } else {
        setSent(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8f9fb",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: { xs: 3, md: 4 },
          borderRadius: "20px",
          background: "#fff",
          border: "1px solid #ececec",
          boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Image
            src="/logow.webp"
            alt="Menmai Foods"
            width={100}
            height={100}
            style={{ borderRadius: "50%" }}
          />
        </Box>

        {/* ── Success state ── */}
        {sent ? (
          <Box sx={{ textAlign: "center" }}>
            <MarkEmailReadIcon sx={{ fontSize: 56, color: "#5A1F00", mb: 1.5 }} />
            <Typography sx={{ fontSize: "1.4rem", fontWeight: 700, color: "#5A1F00", mb: 1 }}>
              Check your email
            </Typography>
            <Typography sx={{ color: "#6b7280", fontSize: "0.92rem", lineHeight: 1.7, mb: 3 }}>
              If <strong>{username}</strong> exists in our system, a password reset
              link has been sent to the registered email address.
              The link expires in <strong>1 hour</strong>.
            </Typography>
            <Button
              fullWidth variant="outlined"
              onClick={() => router.push("/admin")}
              sx={{
                borderRadius: "12px", height: 46,
                borderColor: "#5A1F00", color: "#5A1F00", fontWeight: 600,
                textTransform: "none",
                "&:hover": { bgcolor: "#FFF8F5", borderColor: "#5A1F00" },
              }}
            >
              Back to Login
            </Button>
          </Box>
        ) : (
          /* ── Form state ── */
          <>
            <Typography
              align="center"
              sx={{ fontSize: { xs: "1.4rem", md: "1.7rem" }, fontWeight: 700, color: "#5A1F00", mb: 1 }}
            >
              Forgot Password
            </Typography>

            <Typography
              align="center"
              sx={{ color: "#6b7280", fontSize: "0.9rem", mb: 3, lineHeight: 1.6 }}
            >
              Enter your admin username and we will send a reset link to the registered email.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth size="small" label="Username" margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"><PersonOutlineIcon /></InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth variant="contained"
              onClick={handleSubmit} disabled={loading}
              sx={{
                height: 48, mt: 3, borderRadius: "12px",
                backgroundColor: "#5A1F00",
                fontSize: "0.95rem", fontWeight: 700, textTransform: "none",
                "&:hover": { backgroundColor: "#401500" },
              }}
            >
              {loading ? "Sending…" : "Send Reset Link"}
            </Button>

            {/* Back to login */}
            <Box
              onClick={() => router.push("/admin")}
              sx={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 0.5, mt: 2.5, cursor: "pointer",
                color: "#5A1F00", fontWeight: 600, fontSize: "0.85rem",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 16 }} />
              Back to Login
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}
