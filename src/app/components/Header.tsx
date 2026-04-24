"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Toolbar,
  Button,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import "./Header.css";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Header() {
  const cartCount = 2;
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  return (
    <>
      <Box
        component="header"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 1100,
          backgroundColor: "var(--brown)",
          // backgroundColor: "rgba(255, 253, 248, .97)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(232, 114, 12, .12)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              height: 66,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Image
                  src="/logo.jpeg"
                  alt="Menmai Foods"
                  width={180}
                  height={80}
                  priority
                  style={{
                    height: "66px",
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Link>

            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {NAV_LINKS.map(({ label, href }) => (
                  <Button
                    key={href}
                    component={Link}
                    href={href}
                    disableRipple
                    sx={{
                      // color: isActive(href) ? "var(--or)" : "var(--brown)",
                      color: isActive(href) ? "var(--cream)" : "var(--gray)",
                      padding: "8px 14px",
                      "&:hover": { background: "none", color: "var(--cream)" },
                      "&::after": {
                        background: "var(--cream)",
                        transform: isActive(href) ? "scaleX(1)" : "scaleX(0)",
                      },
                    }}
                    className={`nav-link ${isActive(href) ? "active" : ""}`}
                  >
                    {label}
                  </Button>
                ))}
                {/* <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                 
                  <Button
                    startIcon={<LocationOnOutlinedIcon sx={{ fontSize: 18 }} />}
                    sx={{
                      textTransform: "none",
                      fontSize: "0.85rem",
                      color: "var(--brown)",
                      border: "1px solid rgba(232,114,12,.25)",
                      borderRadius: "20px",
                      px: 2,
                      "&:hover": {
                        backgroundColor: "rgba(232,114,12,.08)",
                        color: "var(--or)",
                      },
                    }}
                  >
                    Check Delivery
                  </Button>

                  <CartIcon cartCount={cartCount} />
                </Box> */}
                <CartIcon cartCount={cartCount} />
              </Box>
            )}

            {/* MOBILE */}
            {isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CartIcon cartCount={cartCount} />
                <IconButton
                  onClick={handleDrawerOpen}
                  sx={{
                    transition: "transform 0.3s ease",
                    color: "var(--cream)",
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </Box>

      {/* DRAWER */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        transitionDuration={300}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              backgroundColor: "var(--brown)",
              borderLeft: "1px solid rgba(232, 114, 12, .12)",
            },
          },
        }}
      >
        <Box sx={{ width: 260 }}>
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: 600,
              color: "var(--cream)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Menu
            <IconButton onClick={handleDrawerClose}>
              <CloseIcon sx={{ color: "var(--cream)" }} />
            </IconButton>
          </Box>

          <Divider sx={{ borderColor: "rgba(232, 114, 12, .12)" }} />

          <List>
            {NAV_LINKS.map(({ label, href }) => (
              <ListItemButton
                key={href}
                component={Link}
                href={href}
                sx={{
                  mx: 1.5,
                  my: 0.5,
                  transition: "all 0.2s ease",
                  backgroundColor: isActive(href)
                    ? "rgba(255, 255, 255, .07)"
                    : "transparent",

                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, .07)",
                    transform: "translateX(4px)",
                  },
                }}
              >
                <ListItemText
                  primary={label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: 14,
                        fontWeight: 500,
                        letterSpacing: "0.05em",
                        color: isActive(href) ? "var(--cream)" : "var(--gray)",
                        ":hover": {
                          color: "var(--cream)",
                        },
                      },
                    },
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

function CartIcon({ cartCount }: { cartCount: number }) {
  return (
    <IconButton
      component={Link}
      href="/cart"
      sx={{
        transition: "transform 0.3s ease",
        color: "var(--cream)",
      }}
    >
      <Badge badgeContent={cartCount} color="error">
        <ShoppingCartOutlinedIcon />
      </Badge>
    </IconButton>
  );
}
