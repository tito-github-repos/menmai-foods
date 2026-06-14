"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  Box,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function SessionExpiredModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleExpired = () => setOpen(true);
    window.addEventListener("session-expired", handleExpired);
    return () => window.removeEventListener("session-expired", handleExpired);
  }, []);

  const handleOk = () => {
    signOut({ callbackUrl: "/admin?reason=timeout" });
  };

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown        // ← cant close with Escape key
      hideBackdrop={false}
      slotProps={{
        backdrop: {
          sx: { cursor: "not-allowed" }, // ← clicking background does nothing
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 1,
          maxWidth: 380,
          width: "100%",
          textAlign: "center",
        },
      }}
    >
      <DialogContent>
        {/* Icon */}
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            bgcolor: "#FFF3E0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 32, color: "#5A1F00" }} />
        </Box>

        {/* Title */}
        <DialogTitle sx={{ p: 0, mb: 1, fontWeight: 700, fontSize: 20, color: "#5A1F00" }}>
          Session Expired
        </DialogTitle>

        {/* Message */}
        <Typography color="text.secondary" fontSize={14} mb={3}>
          Your session has expired due to inactivity. Please login again to continue.
        </Typography>

        {/* OK Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleOk}
          sx={{
            bgcolor: "#5A1F00",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            fontSize: 15,
            py: 1.2,
            "&:hover": { bgcolor: "#401500" },
          }}
        >
          OK, Take me to Login
        </Button>
      </DialogContent>
    </Dialog>
  );
}