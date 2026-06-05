"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

import Image from "next/image";

export const drawerWidth = 210; // ← CHANGED FROM 250 TO 280

const menus = [
  { title: "Dashboard", path: "/admin/dashboard", icon: <DashboardOutlinedIcon /> },
  { title: "Orders", path: "/admin/orders", icon: <ShoppingBagOutlinedIcon /> },
  { title: "Products", path: "/admin/products", icon: <Inventory2OutlinedIcon /> },
  { title: "Broadcast", path: "/admin/broadcast", icon: <CampaignOutlinedIcon /> },
  { title: "Customers", path: "/admin/customers", icon: <PeopleOutlineOutlinedIcon /> },
];

interface Props {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

export default function AdminSidebar({ mobileOpen, handleDrawerToggle }: Props) {
  const pathname = usePathname();

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", position: "relative", color: "#fff" }}>
      <Box sx={{ position: "absolute", inset: 0, backgroundImage: "url('/img/admin/sidebar-img.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
      <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(65,15,0,.72), rgba(65,15,0,.92))" }} />

      <Box sx={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ py: 2, display: "flex", justifyContent: "center" }}>
          <Image
            src="/logo.jpeg"
            alt="Menmai"
            width={150}
            height={150}
            style={{ borderRadius: "50%", padding: 1 }}
          />
        </Box>

        <List sx={{ px: 2 }}>
          {menus.map((menu) => {
            const active = pathname.startsWith(menu.path);
            return (
              <Link key={menu.path} href={menu.path} style={{ textDecoration: "none" }}>
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
            sx={{ color: "#fff", height: 50, borderRadius: "14px", background: "rgba(255,255,255,.08)" }}
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
          width: 0,                             // ← KEEPS WRAPPER AT 0 WIDTH
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,                 // ← 280px
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