"use client";

import { useState } from "react";
import Image from "next/image";  {/* ✅ back to next/image */}
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
  Box, Paper, Typography, TextField, Button,
  InputAdornment, Alert, IconButton,
} from "@mui/material";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername]         = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid username or password");
    } else {
      const isAdminSubdomain = window.location.hostname.startsWith("admin.");
      router.push(isAdminSubdomain ? "/dashboard" : "/admin/dashboard");
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
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
          <Image
            src="https://menmaifoods.com/logo.jpeg" 
            alt="Menmai Foods"
            width={130}
            height={130}
            style={{ borderRadius: "50%" }}
          />
        </Box>

        <Typography
          align="center"
          sx={{
            fontSize: { xs: "1.6rem", md: "1.9rem" },
            fontWeight: 700,
            color: "#5A1F00",
            mb: 1,
          }}
        >
          Admin Login
        </Typography>

        <Typography
          align="center"
          sx={{ color: "#6b7280", fontSize: "0.95rem", mb: 2 }}
        >
          Sign in to access Menmai Foods Admin Panel
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth size="small" label="Username" margin="normal"
          value={username} onChange={(e) => setUsername(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><PersonOutlineIcon /></InputAdornment>,
          }}
        />

        <TextField
          fullWidth size="small" label="Password" margin="normal"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          InputProps={{
            startAdornment: <InputAdornment position="start"><LockOutlinedIcon /></InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                  {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth variant="contained"
          onClick={handleLogin} disabled={loading}
          sx={{
            height: 48, mt: 3, borderRadius: "12px",
            backgroundColor: "#5A1F00",
            fontSize: "0.95rem", fontWeight: 700, textTransform: "none",
            "&:hover": { backgroundColor: "#401500" },
          }}
        >
          {loading ? "Signing in…" : "Login"}
        </Button>
      </Paper>
    </Box>
  );
}