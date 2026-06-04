"use client";

import Image from "next/image";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function AdminLoginPage() {
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
          maxWidth: 500,

          p: {
            xs: 4,
            md: 5,
          },

          borderRadius: "24px",

          background: "#fff",

          border: "1px solid #ececec",

          boxShadow:
            "0 20px 60px rgba(0,0,0,0.08)",
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <Image
            src="/logo.jpeg"
            alt="Menmai Foods"
            width={160}
            height={160}
            style={{
              borderRadius: "50%",
            }}
          />
        </Box>

        <Typography
          align="center"
          sx={{
            fontSize: {
              xs: "2rem",
              md: "2.4rem",
            },
            fontWeight: 700,
            color: "#5A1F00",
            mb: 1,
          }}
        >
          Admin Login
        </Typography>

        <Typography
          align="center"
          sx={{
            color: "#6b7280",
            mb: 4,
          }}
        >
          Sign in to access Menmai Foods Admin Panel
        </Typography>

        <TextField
          fullWidth
          label="Username"
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineIcon />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon />
              </InputAdornment>
            ),
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            mb: 3,
          }}
        >
          <FormControlLabel
            control={<Checkbox />}
            label="Remember Me"
          />

          <Typography
            sx={{
              color: "#00695c",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Forgot Password?
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          sx={{
            height: 56,
            borderRadius: "14px",

            backgroundColor: "#5A1F00",

            fontSize: "1rem",
            fontWeight: 700,
            textTransform: "none",

            "&:hover": {
              backgroundColor: "#401500",
            },
          }}
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
}