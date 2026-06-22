"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  useMediaQuery,
  IconButton,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  open: boolean;
  message?: string;
  onClose: () => void;
  onContinue: () => void;
};

export default function RetailDeliveryCutoffDialog({
  open,
  message,
  onClose,
  onContinue,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        onClose();
      }}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          mx: isMobile ? 2 : "auto",
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: isMobile ? 2 : 3,
          pt: isMobile ? 2 : 3,
        }}
      >
        <Box display="flex" alignItems="center" gap={isMobile ? 1 : 1.5}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "var(--primary-teal-dark)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LocalShippingOutlinedIcon sx={{ color: "#fff", fontSize: 22 }} />
          </Box>

          <Typography
            sx={{
              fontWeight: 700,
              fontSize: isMobile ? 17 : 20,
              lineHeight: 1.2,
            }}
          >
            {" "}
            Delivery Information
          </Typography>
        </Box>

        {/* Close Button */}
        <IconButton onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ px: isMobile ? 2 : 3, pt: 2 }}>
        <Typography sx={{ fontSize: 14, lineHeight: 1.6 }}>
          {message}
          <br />
          <br />
          Do you want to continue checkout?
        </Typography>
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          px: isMobile ? 2 : 3,
          pb: isMobile ? 2 : 3,
          gap: 1,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <Button
          onClick={onClose}
          color="error"
          variant="outlined"
          fullWidth={isMobile}
        >
          No, Cancel
        </Button>

        <Button
          onClick={onContinue}
          variant="contained"
          fullWidth={isMobile}
          sx={{
            bgcolor: "var(--primary-teal-dark)",
            "&:hover": {
              bgcolor: "var(--primary-teal-mid)",
            },
          }}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
