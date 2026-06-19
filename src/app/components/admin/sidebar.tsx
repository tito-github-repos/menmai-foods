"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image"; // ✅ back to next/image

import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

import { signOut } from "next-auth/react";

export const drawerWidth = 220;

const menus = [
  { title: "Dashboard",     path: "/admin/dashboard",   icon: <DashboardOutlinedIcon /> },
  { title: "Retail Orders", path: "/admin/orders",      icon: <ShoppingBagOutlinedIcon /> },
  { title: "Bulk Orders",   path: "/admin/bulk-orders", icon: <LocalShippingOutlinedIcon /> },
  { title: "Products",      path: "/admin/products",    icon: <Inventory2OutlinedIcon /> },
  { title: "Broadcast",     path: "/admin/broadcast",   icon: <CampaignOutlinedIcon /> },
  { title: "Customers",     path: "/admin/customers",   icon: <PeopleOutlineOutlinedIcon /> },
];

interface Props {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

export default function AdminSidebar({ mobileOpen, handleDrawerToggle }: Props) {
  const pathname = usePathname();

  const isAdminSubdomain = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.location.hostname.startsWith("admin.");
  }, []);

  const normalizedPathname = isAdminSubdomain && !pathname.startsWith("/admin")
    ? `/admin${pathname}`
    : pathname;

  const handleLogout = () => {
    const callbackUrl = isAdminSubdomain
      ? "https://admin.menmaifoods.com/admin"
      : "/admin";
    signOut({ callbackUrl });
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        color: "#fff",
      }}
    >
      {/* ✅ Always use absolute URL — works on both localhost and subdomain */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('https://menmaifoods.com/img/admin/sidebar-img.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(rgba(65,15,0,.72), rgba(65,15,0,.92))",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* ✅ next/image with absolute URL */}
        <Box sx={{ py: 2, display: "flex", justifyContent: "center" }}>
          <Image
            src="/logow.webp"
            alt="Menmai"
            width={150}
            height={150}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
        </Box>

        <List sx={{ px: 2 }}>
          {menus.map((menu) => {
            const active = normalizedPathname.startsWith(menu.path);

            const href = isAdminSubdomain
              ? menu.path.replace("/admin", "") || "/dashboard"
              : menu.path;

            return (
              <Link key={menu.path} href={href} style={{ textDecoration: "none" }}>
                <ListItemButton
                  sx={{
                    height: 54,
                    borderRadius: "14px",
                    mb: 1.2,
                    background: active ? "#00695c" : "transparent",
                    color: active ? "#ffd54f" : "#fff",
                    "&:hover": {
                      background: active ? "#00695c" : "rgba(255,255,255,.08)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                    {menu.icon}
                  </ListItemIcon>
                  <ListItemText primary={menu.title} />
                </ListItemButton>
              </Link>
            );
          })}
        </List>

        <Box sx={{ mt: "auto", p: 2 }}>
          <Button
            fullWidth
            startIcon={<LogoutOutlinedIcon />}
            onClick={handleLogout}
            sx={{
              color: "#fff",
              height: 50,
              borderRadius: "14px",
              background: "rgba(255,255,255,.08)",
              "&:hover": { background: "rgba(255,255,255,.15)" },
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth, border: 0 },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", lg: "block" },
          width: 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            border: 0,
            position: "fixed",
            left: 0,
            top: 0,
            height: "100vh",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}