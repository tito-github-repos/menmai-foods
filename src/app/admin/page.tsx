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
          maxWidth: 400,

          p: {
            xs: 3,
            md: 4,
          },

          borderRadius: "20px",

          background: "#fff",

          border: "1px solid #ececec",

          boxShadow:
            "0 15px 40px rgba(0,0,0,0.08)",
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 1,
          }}
        >
          <Image
            src="/logo.jpeg"
            alt="Menmai Foods"
            width={130}
            height={130}
            style={{
              borderRadius: "50%",
            }}
          />
        </Box>

        {/* Title */}
        <Typography
          align="center"
          sx={{
            fontSize: {
              xs: "1.6rem",
              md: "1.9rem",
            },
            fontWeight: 700,
            color: "#5A1F00",
            mb: 1,
          }}
        >
          Admin Login
        </Typography>

        {/* Subtitle */}
        <Typography
          align="center"
          sx={{
            color: "#6b7280",
            fontSize: "0.95rem",
            mb: 2,
          }}
        >
          Sign in to access Menmai Foods Admin Panel
        </Typography>

        {/* Username */}
        <TextField
          fullWidth
          size="small"
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

        {/* Password */}
        <TextField
          fullWidth
          size="small"
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

        {/* Remember Me */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",

            mt: 1,
            mb: 2,
          }}
        >
          {/* <FormControlLabel
            control={<Checkbox size="small" />}
            label={
              <Typography fontSize="0.9rem">
                Remember Me
              </Typography>
            }
          /> */}

          {/* <Typography
            sx={{
              color: "#00695c",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Forgot Password?
          </Typography> */}
        </Box>

        {/* Login Button */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            height: 48,

            borderRadius: "12px",

            backgroundColor: "#5A1F00",

            fontSize: "0.95rem",
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