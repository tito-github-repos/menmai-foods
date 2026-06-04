"use client";

import React from "react";
import { usePathname } from "next/navigation";

import { Box, Typography, IconButton, Avatar, Badge } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

interface Props {
  handleDrawerToggle: () => void;
}

export default function AdminHeader({ handleDrawerToggle }: Props) {
  const pathname = usePathname();

  let title = "Dashboard";
  let subtitle = "Overview";

  if (pathname.includes("orders")) {
    title = "Orders";
    subtitle = "Manage customer orders";
  }

  if (pathname.includes("products")) {
    title = "Products";
    subtitle = "Manage products and inventory";
  }

  if (pathname.includes("customers")) {
    title = "Customers";
    subtitle = "Customer management";
  }

  if (pathname.includes("broadcast")) {
    title = "Broadcast";
    subtitle = "Send notifications";
  }

  return (
    <Box
      // In AdminHeader, update the root Box sx:
      sx={{
        height: 80,
        bgcolor: "#faf7f2",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 2, md: 3 },
        borderBottom: "1px solid #ece7df",
        boxShadow: "0 2px 10px rgba(0,0,0,.04)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%", // ← add this
        boxSizing: "border-box", // ← add this
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            display: {
              xs: "flex",
              lg: "none",
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: "1.4rem",
                md: "1.8rem",
              },
              fontWeight: 700,
              color: "#4A1E00",
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              color: "#777",
              fontSize: "0.85rem",

              display: {
                xs: "none",
                md: "block",
              },
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <IconButton>
          <Badge badgeContent={3} color="error">
            <NotificationsNoneOutlinedIcon />
          </Badge>
        </IconButton>

        <Avatar
          sx={{
            bgcolor: "#00695c",
            width: 42,
            height: 42,
          }}
        >
          A
        </Avatar>

        <Box
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
          }}
        >
          <Typography fontWeight={700}>Admin</Typography>

          <Typography variant="caption" color="text.secondary">
            Administrator
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
