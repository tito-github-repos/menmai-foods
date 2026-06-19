"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
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
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import { ListItemIcon } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const NAV_LINKS = [
  { label: "Home", href: "/", icon: <HomeOutlinedIcon fontSize="small" /> },
  {
    label: "About",
    href: "/about",
    icon: <GroupOutlinedIcon fontSize="small" />,
  },
  {
    label: "Contact",
    href: "/contact",
    icon: <LocalPhoneOutlinedIcon fontSize="small" />,
  },
] as const;

export default function Header() {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0),
  );
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
          backgroundColor: "var(--white)",
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
                  src="/logow.webp"
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
                      color: isActive(href)
                        ? "var(--primary-teal-dark)"
                        : "var(--primary-maroon-dark)",
                      padding: "8px 14px",
                      fontWeight: "500",
                      "&:hover": {
                        background: "none",
                        color: "var(--primary-teal-dark)",
                      },
                      "&::after": {
                        background: "var(--primary-teal-dark)",
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
                  aria-label="Open Menu"
                  onClick={handleDrawerOpen}
                  sx={{
                    transition: "transform 0.3s ease",
                    color: "var(--primary-teal-dark)",
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
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: "var(--white)",
            borderLeft: "1px solid rgba(232, 114, 12, .12)",
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
              color: "var(--primary-teal-dark)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Menu
            <IconButton aria-label="Close Menu" onClick={handleDrawerClose}>
              <CloseIcon sx={{ color: "var(--primary-teal-dark)" }} />
            </IconButton>
          </Box>

          <List>
            {NAV_LINKS.map(({ label, href, icon }) => (
              <ListItemButton
                key={href}
                component={Link}
                href={href}
                sx={{
                  mx: 1.5,
                  my: 0.5,
                  borderRadius: 3,
                  transition: "all 0.2s ease",

                  "&.MuiListItemButton-root": {
                    background: isActive(href)
                      ? "linear-gradient(90deg, var(--primary-teal-dark) 0%, var(--primary-teal-mid) 100%)"
                      : "transparent",

                    borderBottom: isActive(href)
                      ? "none"
                      : "1px solid rgba(232, 114, 12, .12)",
                  },

                  "& .MuiListItemText-primary": {
                    color: isActive(href)
                      ? "var(--white)"
                      : "var(--primary-maroon-dark)",
                  },
                  "&.MuiListItemButton-root:hover": {
                    background:
                      "linear-gradient(90deg, var(--primary-teal-dark) 0%, var(--primary-teal-mid) 100%)",
                    transform: "translateX(4px)",
                    borderBottom: "none",

                    "& .MuiListItemText-primary": {
                      color: "var(--white)",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: "40px",
                    color: isActive(href)
                      ? "var(--white)"
                      : "var(--primary-maroon-dark)",
                    ".MuiListItemButton-root:hover &": {
                      color: "var(--white)",
                    },
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    sx: {
                      fontSize: 14,
                      fontWeight: 500,
                      letterSpacing: "0.05em",
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
      aria-label="Shopping Cart"
      sx={{
        transition: "transform 0.3s ease",
        color: "var(--primary-maroon-dark)",
      }}
    >
      <Badge badgeContent={cartCount} color="error">
        <ShoppingCartOutlinedIcon />
      </Badge>
    </IconButton>
  );
}
