"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    setError("");

    if (!token) {
      setError("Invalid reset link");
      return;
    }

    if (!password.trim()) {
      setError("Please enter a new password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reset password");
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        router.push("/admin");
      }, 3000);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
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
          maxWidth: 420,
          p: 4,
          borderRadius: "20px",
          border: "1px solid #ececec",
          boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Image
            src="https://menmaifoods.com/logo.jpeg"
            alt="Menmai Foods"
            width={100}
            height={100}
            style={{ borderRadius: "50%" }}
          />
        </Box>
        {success ? (
          <Box sx={{ textAlign: "center" }}>
            <CheckCircleOutlineIcon
              sx={{
                fontSize: 70,
                color: "#2e7d32",
                mb: 2,
              }}
            />

            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1.5rem",
                mb: 1,
              }}
            >
              Password Updated
            </Typography>

            <Typography
              sx={{
                color: "#6b7280",
                lineHeight: 1.7,
              }}
            >
              Your password has been successfully changed.
              <br />
              Redirecting to login...
            </Typography>
          </Box>
        ) : (
          <>
            <Typography
              align="center"
              sx={{
                fontSize: "1.7rem",
                fontWeight: 700,
                color: "#5A1F00",
                mb: 1,
              }}
            >
              Reset Password
            </Typography>

            <Typography
              align="center"
              sx={{
                color: "#6b7280",
                mb: 3,
                fontSize: "0.9rem",
              }}
            >
              Enter your new password below.
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              type="password"
              label="New Password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              type="password"
              label="Confirm Password"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              disabled={loading}
              onClick={handleReset}
              sx={{
                mt: 3,
                height: 48,
                borderRadius: "12px",
                backgroundColor: "#5A1F00",
                textTransform: "none",
                fontWeight: 700,
                "&:hover": {
                  backgroundColor: "#401500",
                },
              }}
            >
              {loading ? "Updating..." : "Reset Password"}
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}
