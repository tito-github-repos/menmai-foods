"use client";

import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

interface FullScreenLoaderProps {
  open: boolean;
  title?: string;
  message?: string;
}

export default function FullScreenLoader({
  open,
  message,
}: FullScreenLoaderProps) {
  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: 9999,
        bgcolor: "rgba(255,255,255,0.95)",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          maxWidth: 350,
          px: 3,
        }}
      >
        <Typography
          sx={{
            mt: 1,
            color: "text.secondary",
            mb: 4,
          }}
        >
          {message}
        </Typography>

        <CircularProgress />
      </Box>
    </Backdrop>
  );
}
