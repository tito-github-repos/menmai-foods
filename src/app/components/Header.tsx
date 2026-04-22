"use client";

import { useEffect, useState, useCallback } from "react";
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
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MOCK_CART_COUNT = 2;

const BRAND = "#88391d";
const BRAND_LIGHT = "rgba(136,57,29,0.07)";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Header() {
  const cartCount = MOCK_CART_COUNT;
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuRotate, setMenuRotate] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
    setMenuRotate(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setMenuRotate(false);
  };

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (cartCount > 0) {
      setAnimateCart(true);
      const t = setTimeout(() => setAnimateCart(false), 400);
      return () => clearTimeout(t);
    }
  }, [cartCount]);

  const navStyle = useCallback(
    (path: string) => ({
      fontSize: "13px",
      fontWeight: isActive(path) ? 500 : 400,
      letterSpacing: "0.07em",
      textTransform: "uppercase" as const,
      color: isActive(path) ? BRAND : "#3a2015",
      borderRadius: "2px",
      px: 1.5,
      py: 0.75,
      minWidth: 0,
      position: "relative" as const,
      transition: "color 0.2s ease",
      "&:hover": { color: BRAND, backgroundColor: BRAND_LIGHT },
      "&::after": {
        content: '""',
        position: "absolute",
        left: "12px",
        right: "12px",
        bottom: "3px",
        height: "2px",
        background: BRAND,
        transform: isActive(path) ? "scaleX(1)" : "scaleX(0)",
        transition: "transform 0.28s ease",
      },
      "&:hover::after": { transform: "scaleX(1)", height: "2px" },
    }),
    [pathname],
  );

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
          backgroundColor: "rgba(255,253,249,0.96)",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(136,57,29,0.22)"
            : "1px solid rgba(136,57,29,0.11)",
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
            {/* LOGO (BIG IMAGE - UPDATED) */}
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

            {/* DESKTOP NAV */}
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {NAV_LINKS.map(({ label, href }) => (
                  <Button
                    key={href}
                    component={Link}
                    href={href}
                    disableRipple
                    sx={navStyle(href)}
                  >
                    {label}
                  </Button>
                ))}
                <CartIcon cartCount={cartCount} animateCart={animateCart} />
              </Box>
            )}

            {/* MOBILE */}
            {isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CartIcon cartCount={cartCount} animateCart={animateCart} />
                <IconButton
                  onClick={handleDrawerOpen}
                  sx={{
                    transform: menuRotate ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
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
              background: "linear-gradient(180deg, #fffaf6, #fff3ea)",
              borderLeft: "1px solid rgba(136,57,29,0.15)",
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
              color: BRAND,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Menu
            <IconButton onClick={handleDrawerClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ borderColor: "rgba(136,57,29,0.2)" }} />

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
                  "&:hover": {
                    backgroundColor: "rgba(136,57,29,0.08)",
                    transform: "translateX(4px)",
                    color: BRAND,
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
                        color: "#3a2015",
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

function CartIcon({
  cartCount,
  animateCart,
}: {
  cartCount: number;
  animateCart: boolean;
}) {
  return (
    <IconButton
      component={Link}
      href="/cart"
      sx={{
        border: "1px solid rgba(136,57,29,0.22)",
        width: 38,
        height: 38,
        transform: animateCart ? "scale(1.2)" : "scale(1)",
        transition: "transform 0.3s ease",
      }}
    >
      <Badge badgeContent={cartCount} color="error">
        <ShoppingCartOutlinedIcon />
      </Badge>
    </IconButton>
  );
}
