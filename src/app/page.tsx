"use client";

import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import CertifiedQualitySection from "./components/CertifiedQuality";
import {
  CustomerReviewsSection,
  DeliverySection,
} from "./components/DeliveryandReviews";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/cartSlice";
import { useMediaQuery, useTheme } from "@mui/material";

/* ─────────────────────────────────────────
   HERO BANNERS
───────────────────────────────────────── */
const banners: string[] = [
  "/img/herosection/prodhero1.png",
  "/img/herosection/prodhero3.png",
  "/img/herosection/prodhero2.png",
];

const mobileBanners: string[] = [
  "/img/herosection/mobilehero4.png",
  "/img/herosection/mobilehero6.png",
  "/img/herosection/mobilehero4.png",
];

/* ─────────────────────────────────────────
   PRODUCTS
───────────────────────────────────────── */
type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  mrp: number | null;
  netWeight: string | null;
  pieces: number | null;
  imageUrl: string | null;
  isActive: boolean;
  stockQuantity: number;
};

const productDisplay = {
  chapathi: {
    bg: "#F5F3EC",
    border: "#e4dfcf",
    desc: "Soft homemade chapathi prepared fresh daily with traditional taste.",
  },
  poori: {
    bg: "#F8F0E3",
    border: "#ecd8c7",
    desc: "Fluffy and delicious poori made with hygienic ingredients for perfect taste.",
  },
} as const;

/* ─────────────────────────────────────────
   BULK ORDER FORM TYPES
───────────────────────────────────────── */


interface BulkForm {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

const bulkFeatures = [
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="9" r="3" />
        <circle cx="15" cy="15" r="3" />
        <line x1="6" y1="18" x2="18" y2="6" />
      </svg>
    ),
    title: "Special Bulk Pricing",
    desc: "Save up to 10% on orders above 100 pieces. Volume discounts apply automatically.",
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 15.5 14" />
      </svg>
    ),
    title: "On-time Delivery",
    desc: "Schedule your delivery time and we'll be there — fresh, hot, and on time.",
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="21 8 21 21 3 21 3 8" />
        <rect x="1" y="3" width="22" height="5" />
        <line x1="10" y1="12" x2="14" y2="12" />
      </svg>
    ),
    title: "Hygienic Packaging",
    desc: "All bulk orders are packed in food-safe, leak-proof containers maintaining freshness.",
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Dedicated Support",
    desc: "All orders are packed to help you with your bulk order requirements.",
  },
];

const Shield = () => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const Star = () => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const Heart = () => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const People = () => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const WheatIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="#b07050"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22C6.5 11 2 8 2 5a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 3-4.5 6-10 17z" />
  </svg>
);
/* ─────────────────────────────────────────
   WHY CHOOSE ICONS
───────────────────────────────────────── */
const iconStyle = {
  width: 28,
  height: 28,
  fill: "none" as const,
  stroke: "#f5dfc0",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const Leaf = () => (
  <svg viewBox="0 0 24 24" style={iconStyle}>
    <path d="M17 8C8 10 5.9 16.17 3.82 19.63" />
    <path d="M6.5 12.5C8 14 9.5 15 12 15c5 0 9-3 9-9C15 3 8 4 6.5 12.5z" />
  </svg>
);
// const Heart = () => (
//   <svg viewBox="0 0 24 24" style={iconStyle}>
//     <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
//   </svg>
// );
const Sparkle = () => (
  <svg viewBox="0 0 24 24" style={iconStyle}>
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
  </svg>
);
const Clock = () => (
  <svg viewBox="0 0 24 24" style={iconStyle}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const MapPin = () => (
  <svg viewBox="0 0 24 24" style={iconStyle}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const whyItems = [
  {
    icon: <Leaf />,
    title: "Made with Quality Ingredients",
    desc: "Carefully selected for your family",
  },
  { icon: <Heart />, title: "Soft, Fresh & Tasty", desc: "Just like homemade" },
  {
    icon: <Sparkle />,
    title: "Hygienically Prepared",
    desc: "Packed with care and cleanliness",
  },
  {
    icon: <Clock />,
    title: "Ready in 2 Minutes",
    desc: "Heat & serve in no time",
  },
  {
    icon: <MapPin />,
    title: "Loved by many",
    desc: "Bringing freshness to your homes",
  },
];

/* ─────────────────────────────────────────
   CERT BADGES
───────────────────────────────────────── */
// const Shield = () => <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>;
const Droplets = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 2c0 0-8 7.58-8 12a8 8 0 0 0 16 0c0-4.42-8-12-8-12z" />
  </svg>
);
// const Star = () => <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
const Veg = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" />
    <path d="M12 8V5M12 19v-3M5 12H2M22 12h-3" />
  </svg>
);

const certBadges = [
  { icon: <Shield />, label: "FSSAI Certified" },
  { icon: <Droplets />, label: "Hygienically Prepared" },
  { icon: <Star />, label: "Quality Assured" },
  { icon: <Veg />, label: "100% Vegetarian" },
];

const badgeBar = [
  {
    icon: <Shield />,
    label: "Safe & Compliant",
    sub: "We adhere to strict food safety norms",
  },
  {
    icon: <Star />,
    label: "Trusted Standards",
    sub: "Certified by leading government bodies",
  },
  {
    icon: <Heart />,
    label: "Quality You Deserve",
    sub: "Pure ingredients and hygienic preparation",
  },
  {
    icon: <People />,
    label: "Committed to You",
    sub: "Your health & trust are our priority",
  },
];

/* ─────────────────────────────────────────
   INPUT STYLE (shared)
───────────────────────────────────────── */
const inputSx = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid rgba(90,40,20,0.15)",
  borderRadius: "10px",
  fontSize: "14px",
  fontFamily: "var(--font-main)",
  color: "#3d1a0e",
  background: "#fafaf8",
  outline: "none",
  boxSizing: "border-box" as const,
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function HomePage() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  const dispatch = useAppDispatch();

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setProductsLoading(false);
      });
  }, []);

  const fieldLabels: Partial<Record<keyof BulkForm, string>> = {
    name: "Full name",
    phone: "Phone number",
    email: "Email address",
    address: "Address",
    notes: "Occasion / Notes",
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BulkForm, string>> = {};
    if (!bulkForm.name.trim()) newErrors.name = "Full name is required.";
    if (!bulkForm.phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!phoneRegex.test(bulkForm.phone.trim()))
      newErrors.phone = "Enter a valid 10-digit Indian mobile number.";
    if (!bulkForm.email.trim()) newErrors.email = "Email address is required.";
    else if (!emailRegex.test(bulkForm.email.trim()))
      newErrors.email = "Enter a valid email address.";
    if (!bulkForm.address.trim())
      newErrors.address = "Delivery address is required.";
    if (!bulkForm.notes.trim())
      newErrors.notes = "Please mention the occasion or any notes.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [bulkForm, setBulkForm] = useState<BulkForm>({
    name: "",
  phone: "",
  email: "",
  address: "",
  notes: "",

  });

  const [errors, setErrors] = useState<Partial<Record<keyof BulkForm, string>>>(
    {},
  );

  const setField =
    (key: keyof BulkForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setBulkForm((f) => ({ ...f, [key]: e.target.value }));
      setErrors((prev) => ({ ...prev, [key]: "" })); // clear error on type
    };

  const blurField = (key: keyof BulkForm) => () => {
    if (!bulkForm[key]) {
      setErrors((prev) => ({
        ...prev,
        [key]: fieldLabels[key] + " is required.",
      }));
    }
  };
  // const handleBulkSubmit = () => {
  //   if (!validate()) return;
  //   setBulkSubmitted(true);
  //   setSnackOpen(true);
  // };


 const handleBulkSubmit = async () => {
  console.log("Submit clicked");

  try {
    const response = await fetch("/api/enquiry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bulkForm),
    });

    const result = await response.json();

    if (result.success) {
      setBulkSubmitted(true);
      setSnackOpen(true);

      setBulkForm({
        name: "",
        phone: "",
        email: "",
        address: "",
        notes: "",
      });
      
    } else {
      alert("Failed to send enquiry");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};

  const [bulkSubmitted, setBulkSubmitted] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false); // ← ADD

  const [activeWhy, setActiveWhy] = useState(0);
  const touchStartX = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveWhy((prev) => (prev + 1) % whyItems.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 30) {
      setActiveWhy(
        (prev) =>
          (prev + (dx < 0 ? 1 : -1) + whyItems.length) % whyItems.length,
      );
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (snackOpen) {
      const timer = setTimeout(() => setSnackOpen(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [snackOpen]);

  /* Banner rotation */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ══ 1. HERO ══ */}
      <Box sx={{ width: "100%", background: "#fff" }}>
        <Box
          component="img"
          src={isMobile ? mobileBanners[current] : banners[current]}
          alt="banner"
          sx={{
            width: "100%",
            height: { xs: "auto", md: "100%" },
            objectFit: { xs: "contain", md: "cover" },
          }}
        />
        {/* ══ TRUST TICKER (Hero Bottom) ══ */}
        <Box
          sx={{
            width: "100%",
            overflow: "hidden",
            background: "var(--primary-teal-dark)",
            py: { xs: 0.8, md: 1.2 },
            position: "relative",

            // /* Premium fade edges */
            // maskImage:
            //   "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            // WebkitMaskImage:
            //   "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "max-content",
              animation: "tickerScroll 28s linear infinite",

              "@keyframes tickerScroll": {
                "0%": { transform: "translateX(0%)" },
                "100%": { transform: "translateX(-50%)" },
              },

              "&:hover": {
                animationPlayState: "paused",
              },
            }}
          >
            {[...badgeBar, ...badgeBar].map((b, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 0.8, md: 1.2 },
                  px: { xs: 1.5, md: 4 },
                  minWidth: { xs: "20px", md: "240px" },
                }}
              >
                {/* ICON */}
                <Box
                  sx={{
                    color: "#f5dfc0",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {b.icon}
                </Box>

                {/* TEXT */}
                <Box>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-main)",
                      fontSize: { xs: 11, md: 12.5 },
                      fontWeight: 700,
                      color: "#f5dfc0",
                      lineHeight: 1.2,
                    }}
                  >
                    {b.label}
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: "var(--font-main)",
                      fontSize: { xs: 10, md: 11 },
                      color: "rgba(245,223,192,0.65)",
                      lineHeight: 1.2,
                    }}
                  >
                    {b.sub}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ══ PRODUCTS ══ */}
        {/* <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
          <Typography
            textAlign="center"
            sx={{
              fontFamily: "var(--font-heading)",
              fontSize: { xs: 25, md: 30 },
              fontWeight: 700,
              color: "var(--primary-maroon-dark)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              mb: 1.5,
            }}
          >
            Our Products
          </Typography>

         ══ PRODUCTS SECTION ══ */}
        <Box
          sx={{
            background: "#fff",
            py: { xs: 3, md: 4 },
            px: { xs: 2, md: 5 },
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* ── Header ── */}
          <Box
            sx={{
              textAlign: "center",
              mb: { xs: 3, md: 4 },
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.6,
                fontSize: 11,
                color: "#b07850",
                fontFamily: "var(--font-main)",
                mb: 0.5,
              }}
            >
              {/* <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#b07850" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
      </svg> */}
              Made with Love and Care
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="#d84040"
                stroke="none"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </Box>

            <Typography
              sx={{
                fontFamily: "var(--font-heading)",
                fontSize: { xs: 24, md: 32 },
                fontWeight: 700,
                color: "var(--primary-maroon-dark)",
                lineHeight: 1.05,
                mb: 0.5,
              }}
            >
              Our Products
            </Typography>

            <Typography
              sx={{
                fontFamily: "var(--font-main)",
                fontSize: 12,
                color: "#9a7a58",
                letterSpacing: "0.01em",
              }}
            >
              Authentic taste. Hygienically made. Always fresh.
            </Typography>
          </Box>
          <Grid container spacing={{ xs: 2, md: 3 }}>
          {productsLoading
            ? [0, 1].map((i) => (
                <Grid item xs={12} md={6} key={i}>
                  <Box
                    sx={{
                      borderRadius: "20px",
                      overflow: "hidden",
                      border: "1.5px solid #e8e2d8",
                      minHeight: 220,
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      background: "#fafaf8",
                      "@keyframes shimmer": {
                        "0%": { backgroundPosition: "200% 0" },
                        "100%": { backgroundPosition: "-200% 0" },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: "100%", md: "42%" },
                        height: { xs: 200, md: "auto" },
                        minHeight: { md: 220 },
                        background:
                          "linear-gradient(90deg, #f0ebe3 25%, #e8e2d8 50%, #f0ebe3 75%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 1.4s infinite",
                      }}
                    />
                    <Box
                      sx={{
                        flex: 1,
                        p: "14px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.4,
                      }}
                    >
                      <Box
                        sx={{
                          width: 80,
                          height: 18,
                          borderRadius: "20px",
                          background:
                            "linear-gradient(90deg, #e8e2d8 25%, #ddd7ce 50%, #e8e2d8 75%)",
                          backgroundSize: "200% 100%",
                          animation: "shimmer 1.4s infinite",
                        }}
                      />
                      <Box
                        sx={{
                          width: "55%",
                          height: 26,
                          borderRadius: "8px",
                          background:
                            "linear-gradient(90deg, #e8e2d8 25%, #ddd7ce 50%, #e8e2d8 75%)",
                          backgroundSize: "200% 100%",
                          animation: "shimmer 1.4s infinite",
                        }}
                      />
                      <Box
                        sx={{
                          width: "90%",
                          height: 13,
                          borderRadius: "6px",
                          background:
                            "linear-gradient(90deg, #ede8e0 25%, #e4ddd4 50%, #ede8e0 75%)",
                          backgroundSize: "200% 100%",
                          animation: "shimmer 1.4s infinite",
                        }}
                      />
                      <Box
                        sx={{
                          width: "70%",
                          height: 13,
                          borderRadius: "6px",
                          background:
                            "linear-gradient(90deg, #ede8e0 25%, #e4ddd4 50%, #ede8e0 75%)",
                          backgroundSize: "200% 100%",
                          animation: "shimmer 1.4s infinite",
                        }}
                      />
                      <Box
                        sx={{
                          mt: "auto",
                          display: "flex",
                          gap: 1,
                          pt: 1,
                        }}
                      >
                        <Box
                          sx={{
                            flex: 1,
                            height: 36,
                            borderRadius: "999px",
                            background:
                              "linear-gradient(90deg, #e8e2d8 25%, #ddd7ce 50%, #e8e2d8 75%)",
                            backgroundSize: "200% 100%",
                            animation: "shimmer 1.4s infinite",
                          }}
                        />
                        <Box
                          sx={{
                            flex: 1,
                            height: 36,
                            borderRadius: "999px",
                            background:
                              "linear-gradient(90deg, #e8e2d8 25%, #ddd7ce 50%, #e8e2d8 75%)",
                            backgroundSize: "200% 100%",
                            animation: "shimmer 1.4s infinite",
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))
            : products.map((product) => {
                const display =
                  productDisplay[product.slug as keyof typeof productDisplay];

                const isOutOfStock = product.stockQuantity === 0;

                const isTeal = product.name === "Chapathi";
                return (
                  <Grid item xs={12} md={6} key={product.name}>
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        borderRadius: "20px",
                        backgroundColor: display.bg,
                        border: `1.5px solid ${display.border}`,
                        boxShadow: "var(--shadow)",
                        overflow: "hidden",
                        minHeight: 220,
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          width: { xs: "100%", md: "42%" },
                          height: { xs: 200, md: "auto" },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          p: "10px 0 10px 10px",
                        }}
                      >
                        <Box
                          component="img"
                          src={product.imageUrl ?? ""}
                          alt={product.name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            maxHeight: 200,
                          }}
                        />

                        {isOutOfStock && (
                          <Box
                            sx={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backdropFilter: "blur(2px)",
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 800,
                                fontSize: 14,
                                color: "#d32f2f",
                                letterSpacing: 1,
                                background: "rgba(255,255,255,0.8)",
                                px: 2,
                                py: 0.5,
                                borderRadius: "12px",
                                fontFamily: "var(--font-heading)",
                              }}
                            >
                              OUT OF STOCK
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      <CardContent
                        sx={{
                          flex: 1,
                          p: {
                            xs: "12px 14px !important",
                            md: "14px 14px 14px 8px !important",
                          },
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              display: "inline-block",
                              fontSize: 10,
                              fontWeight: 700,
                              letterSpacing: 1.5,
                              px: 1.5,
                              py: 0.3,
                              borderRadius: "20px",
                              bgcolor: isTeal
                                ? "var(--primary-teal-mid)"
                                : "var(--primary-maroon-mid)",
                              color: "#fff",
                              mb: 0.5,
                              fontFamily: "var(--font-main)",
                            }}
                          >
                            {isTeal ? "BEST SELLER" : "HOME SPECIAL"}
                          </Typography>

                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: { xs: 22, md: 26 },
                              color: isTeal
                                ? "var(--primary-teal-dark)"
                                : "var(--primary-maroon-dark)",
                              fontFamily: "var(--font-heading)",
                              lineHeight: 1.1,
                              mb: 0.3,
                            }}
                          >
                            {product.name}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: 14,
                              color: "var(--primary-maroon-light)",
                              lineHeight: 1.45,
                              fontFamily: "var(--font-main)",
                              mb: 0.5,
                            }}
                          >
                            {display.desc}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              my: 0.75,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={
                                  isTeal
                                    ? "var(--primary-teal-mid)"
                                    : "var(--primary-maroon-mid)"
                                }
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 15.5 14" />
                              </svg>
                              <Typography
                                sx={{
                                  fontSize: 12,
                                  color: isTeal
                                    ? "var(--primary-teal-dark)"
                                    : "var(--primary-maroon-dark)",
                                  fontFamily: "var(--font-main)",
                                }}
                              >
                                Ready in 2 minutes
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke={
                                isTeal
                                  ? "var(--primary-teal-mid)"
                                  : "var(--primary-maroon-mid)"
                              }
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M6 2h12l2 6H4L6 2z" />
                              <rect x="3" y="8" width="18" height="13" rx="2" />
                            </svg>
                            <Typography
                              sx={{
                                fontSize: 11,
                                color: isTeal
                                  ? "var(--primary-teal-dark)"
                                  : "var(--primary-maroon-dark)",
                                fontFamily: "var(--font-main)",
                              }}
                            >
                              Net Wt. {product.netWeight}{" "}
                              <Box
                                component="span"
                                sx={{
                                  fontSize: 9,
                                  opacity: 0.7,
                                  fontStyle: "italic",
                                  ml: 0.3,
                                }}
                              >
                                (approx)
                              </Box>
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.75,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: 13,
                                color: isTeal
                                  ? "var(--primary-teal-dark)"
                                  : "var(--primary-maroon-dark)",
                                fontFamily: "var(--font-main)",
                              }}
                            >
                              MRP:
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 16,
                                fontWeight: 800,
                                color: isTeal
                                  ? "var(--primary-teal-mid)"
                                  : "var(--primary-maroon-mid)",
                                fontFamily: "var(--font-main)",
                              }}
                            >
                              ₹{product.price}
                            </Typography>
                            <Typography
                              component="span"
                              sx={{
                                fontSize: 13,
                                textDecoration: "line-through",
                                fontFamily: "var(--font-main)",
                                color: isTeal
                                  ? "var(--primary-teal-dark)"
                                  : "var(--primary-maroon-light)",
                              }}
                            >
                              ₹{product.mrp}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              borderTop: "1.5px dashed",
                              borderColor: isTeal
                                ? "var(--primary-teal-mid)"
                                : "var(--primary-maroon-light)",
                              my: 1,
                            }}
                          />

                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="contained"
                              onClick={() =>
                                dispatch(
                                  addToCart({
                                    productId: product.id,
                                    slug: product.slug,
                                    name: product.name,
                                    packLabel: product.netWeight ?? "",
                                    pieces: product.pieces ?? 0,
                                    mrp: product.mrp ?? product.price,
                                    price: product.price,
                                    quantity: 1,
                                    img: product.imageUrl ?? "",
                                  }),
                                )
                              }
                              sx={{
                                flex: 1,
                                borderRadius: "999px",
                                fontSize: 12,
                                fontWeight: 700,
                                height: 36,
                                fontFamily: "var(--font-main)",
                                boxShadow: "none",
                                whiteSpace: "nowrap",
                                bgcolor: isTeal
                                  ? "var(--primary-teal-mid)"
                                  : "var(--primary-maroon-mid)",
                                "&:hover": {
                                  bgcolor: isTeal
                                    ? "var(--primary-teal-dark)"
                                    : "var(--primary-maroon-dark)",
                                  boxShadow: "none",
                                },
                              }}
                              disabled={isOutOfStock}
                            >
                              Add to Cart
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => router.push(`/product/${product.slug}`)}
                              sx={{
                                flex: 1,
                                borderRadius: "999px",
                                fontSize: 12,
                                fontWeight: 700,
                                height: 36,
                                fontFamily: "var(--font-main)",
                                whiteSpace: "nowrap",
                                color: isTeal
                                  ? "var(--primary-teal-mid)"
                                  : "var(--primary-maroon-mid)",
                                borderColor: isTeal
                                  ? "var(--primary-teal-mid)"
                                  : "var(--primary-maroon-mid)",
                                "&:hover": {
                                  bgcolor: isTeal
                                    ? "rgba(9,97,113,0.08)"
                                    : "rgba(97,34,15,0.08)",
                                  borderColor: isTeal
                                    ? "var(--primary-teal-mid)"
                                    : "var(--primary-maroon-mid)",
                                },
                              }}
                            >
                              View Product
                            </Button>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
        </Grid>
        </Box>

        {/* ══ WHY CHOOSE MENMAI ══ */}
        <Box
          sx={{
            width: { xs: "calc(100% - 12px)", md: "100%" },
            position: "relative",
            overflow: "hidden",
            borderRadius: { xs: "24px 0 0 24px", md: "60px 0 0px 60px" },
            ml: { xs: 1.5, md: "40px" },
            mt: { xs: 2, md: 4 },
            mb: { xs: 2, md: 0 },
            py: { xs: 2.5, md: 4 },
            background:
              "linear-gradient(120deg, var(--primary-teal-dark) 0%, var(--primary-teal-mid) 70%, #0a5060 100%)",
          }}
        >
          <Box
            sx={{
              maxWidth: "1200px",
              mx: "auto",
              px: { xs: 3, md: 5 },
              pr: { xs: 3, md: "200px" },
              position: "relative",
              zIndex: 1,
            }}
          >
            <Typography
              sx={{
                fontFamily: "var(--font-heading)",
                textAlign: { xs: "center", md: "left" },
                color: "#f5dfc0",
                fontSize: { xs: 20, md: 22 },
                fontWeight: 700,
                mb: 1.5,
                whiteSpace: "nowrap",
              }}
            >
              Why Choose Menmai?
            </Typography>

            {/* ── Mobile: carousel ── */}
            <Box
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              sx={{
                display: { xs: "flex", md: "none" },
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                pb: 1,
              }}
            >
              <Box
                sx={{
                  mb: 1,
                  color: "#f5dfc0",
                  "& svg": { width: 28, height: 28 },
                }}
              >
                {whyItems[activeWhy].icon}
              </Box>

              <Typography
                sx={{
                  color: "#f5dfc0",
                  fontSize: 15,
                  fontWeight: 700,
                  lineHeight: 1.25,
                  maxWidth: "55%",
                }}
              >
                {whyItems[activeWhy].title}
              </Typography>

              <Typography
                sx={{
                  color: "rgba(245,223,192,0.75)",
                  fontSize: 12,
                  fontStyle: "italic",
                  mt: 0.8,
                  lineHeight: 1.4,
                  maxWidth: "55%",
                }}
              >
                {whyItems[activeWhy].desc}
              </Typography>

              <Box sx={{ display: "flex", gap: 0.7, mt: 1.5 }}>
                {whyItems.map((_, i) => (
                  <Box
                    key={i}
                    onClick={() => setActiveWhy(i)}
                    sx={{
                      width: i === activeWhy ? 16 : 6,
                      height: 6,
                      borderRadius: 99,
                      cursor: "pointer",
                      background:
                        i === activeWhy ? "#f5dfc0" : "rgba(245,223,192,0.35)",
                      transition: "all 0.25s ease",
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* ── Desktop: horizontal row ── */}
            <Grid
              container
              spacing={0}
              justifyContent="center"
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              {whyItems.map((item, i) => (
                <Grid item md={2.4} key={i}>
                  <Box
                    sx={{
                      textAlign: "center",
                      px: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <Box sx={{ mb: 1, color: "#f5dfc0" }}>{item.icon}</Box>

                    <Typography
                      sx={{
                        color: "#f5dfc0",
                        fontSize: 14,
                        fontWeight: 600,
                        lineHeight: 1.2,
                        textAlign: "center",
                        minHeight: 36,
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      sx={{
                        color: "rgba(245,223,192,0.7)",
                        fontSize: 12,
                        fontStyle: "italic",
                        mt: 0.5,
                        maxWidth: 150,
                        minHeight: 34,
                        textAlign: "center",
                      }}
                    >
                      {item.desc}
                    </Typography>

                    {i !== whyItems.length - 1 && (
                      <Box
                        sx={{
                          position: "absolute",
                          right: 0,
                          transform: "translate(60%, 50%)",
                          height: "60%",
                          width: "1px",
                          background:
                            "linear-gradient(to bottom, transparent, rgba(245,223,192,0.5), transparent)",
                        }}
                      />
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* ── Chapati image ── */}
          <Box
            component="img"
            src="/img/dec_img.png"
            alt=""
            aria-hidden="true"
            sx={{
              position: "absolute",
              right: { xs: "-10%", md: 0 },
              top: "50%",
              transform: "translateY(-50%)",
              width: { xs: 130, sm: 150, md: 220 },
              filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.4))",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />
        </Box>

        <Box
          sx={{
            width: "100%",
            py: { xs: 5, md: 8 },
            px: { xs: 2, md: 4 },
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              maxWidth: "1150px",
              mx: "auto",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 440px" },
              gap: { xs: 4, lg: 6 },
              alignItems: "flex-start",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* ── LEFT — HERO + FEATURES ── */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Badge */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.8,
                  background: "#3d1a0e",
                  color: "#fdf6ec",
                  fontSize: 11,
                  fontFamily: "var(--font-main)",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  px: 2,
                  py: 0.7,
                  borderRadius: "999px",
                  width: "fit-content",
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Bulk &amp; Catering
              </Box>

              {/* Two-column split: text + image */}
              <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                {/* TEXT SIDE */}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-heading)",
                      fontSize: { xs: 28, md: 36 },
                      fontWeight: 700,
                      color: "var(--primary-teal-dark)",
                      lineHeight: 1.08,
                      letterSpacing: "-0.02em",
                      mb: 1,
                    }}
                  >
                    Need Large
                    <br />
                    <Box
                      component="span"
                      sx={{
                        fontStyle: "italic",
                        color: "var(--primary-teal-dark)",
                      }}
                    >
                      Quantities?
                    </Box>
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: "var(--font-main)",
                      fontSize: 15,
                      color: "#9a6a50",
                      lineHeight: 1.7,
                      maxWidth: 380,
                    }}
                  >
                    Perfect for office lunches, temple functions, weddings, and
                    school events. We handle orders of{" "}
                    <Box
                      component="span"
                      sx={{ fontWeight: 700, color: "#7a2e14" }}
                    >
                      500 pieces to 5,000+
                    </Box>{" "}
                    with the same freshness guarantee.
                  </Typography>

                  <Button
                    variant="contained"
                    onClick={() => router.push("/bulkorder")}
                    startIcon={
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                    }
                    endIcon={
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    }
                    sx={{
                      mt: 1.5,
                      px: 3.5,
                      py: 1.4,
                      borderRadius: "999px",
                      background:
                        "linear-gradient(135deg, #3d1a0e 0%, #7a2e14 100%)",
                      color: "#fdf6ec",
                      fontFamily: "var(--font-main)",
                      fontSize: 14,
                      fontWeight: 700,
                      textTransform: "none",
                      boxShadow: "0 6px 20px rgba(61,26,14,0.25)",
                      width: "fit-content",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #2c1009 0%, #5e2410 100%)",
                        boxShadow: "0 10px 28px rgba(61,26,14,0.35)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.25s ease",
                    }}
                  >
                    Place Bulk Order
                  </Button>
                </Box>

                {/* ── BULK IMAGE ── */}
                <Box
                  sx={{
                    flex: "0 0 auto",
                    display: { xs: "none", md: "block" },
                    width: 200,
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      inset: -16,
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle, rgba(194,90,48,0.12) 0%, transparent 70%)",
                      pointerEvents: "none",
                    }}
                  />
                  <Box
                    component="img"
                    src="/img/bulk1.png"
                    alt="Menmai bulk boxes"
                    sx={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                      filter: "drop-shadow(0 16px 32px rgba(61,26,14,0.18))",
                      position: "relative",
                      zIndex: 1,
                    }}
                  />
                </Box>
              </Box>

              {/* FEATURE CARDS 2x2 */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 1.5,
                }}
              >
                {bulkFeatures.map(({ icon, title, desc }) => (
                  <Box
                    key={title}
                    sx={{
                      display: "flex",
                      gap: 1.8,
                      alignItems: "flex-start",
                      background: "rgba(255,255,255,0.65)",
                      border: "1.5px solid rgba(90,56,37,0.12)",
                      borderRadius: "14px",
                      p: "10px 14px",
                      backdropFilter: "blur(6px)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 8px 24px rgba(61,26,14,0.08)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "12px",
                        background:
                          "linear-gradient(135deg, #472112 0%, #743f21 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fdf6ec",
                        flexShrink: 0,
                      }}
                    >
                      {icon}
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: "var(--font-main)",
                          fontWeight: 700,
                          fontSize: 14,
                          color: "#3d1a0e",
                          mb: 0.3,
                        }}
                      >
                        {title}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "var(--font-main)",
                          fontSize: 12,
                          color: "#9a6a50",
                          lineHeight: 1.5,
                        }}
                      >
                        {desc}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* ── RIGHT — QUOTE FORM ── */}
            <Box
              sx={{
                background: "#fff",
                border: "1.5px solid rgba(90,40,20,0.12)",
                borderRadius: "24px",
                boxShadow:
                  "0 20px 60px rgba(61,26,14,0.10), 0 4px 16px rgba(61,26,14,0.06)",
                overflow: "hidden",
                position: "sticky",
                top: 20,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {bulkSubmitted ? (
                /* SUCCESS STATE */
                <Box
                  sx={{
                    p: "48px 28px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #3d1a0e, #c25a30)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: "'Georgia', serif",
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#3d1a0e",
                    }}
                  >
                    Request Sent!
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-main)",
                      fontSize: 14,
                      color: "#9a6a50",
                      lineHeight: 1.6,
                      maxWidth: 260,
                    }}
                  >
                    We will contact to you as soon
                    as possible.
                  </Typography>
                  <Button
                    onClick={() => setBulkSubmitted(false)}
                    sx={{
                      mt: 1,
                      borderRadius: "999px",
                      border: "1.5px solid #3d1a0e",
                      color: "#3d1a0e",
                      fontFamily: "var(--font-main)",
                      fontSize: 13,
                      fontWeight: 700,
                      px: 3,
                      textTransform: "none",
                    }}
                  >
                    Submit Another Request
                  </Button>
                </Box>
              ) : (
                <>
                  {/* FORM HEADER */}
                  <Box
                    sx={{
                      background:
                        "linear-gradient(135deg, #472112 0%, #743f21 100%)",
                      px: "20px",
                      py: "18px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "'Georgia', serif",
                        fontWeight: 700,
                        fontSize: 20,
                        color: "#fdf6ec",
                        mb: 0.5,
                      }}
                    >
                      Send an Enquiry
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "var(--font-main)",
                        fontSize: 13,
                        color: "rgba(253,246,236,0.7)",
                      }}
                    >
                      Fill in the details and we'll contact you as soon as
                      possible.
                    </Typography>
                  </Box>

                  {/* FORM BODY */}
                  <Box
                    sx={{
                      p: "20px 20px 20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                      flex: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 1.5,
                      }}
                    >
                      {/* Your Name */}
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#3d1a0e",
                            fontFamily: "var(--font-main)",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            mb: 0.6,
                          }}
                        >
                          Your Name{" "}
                          <Box component="span" sx={{ color: "#c0392b" }}>
                            *
                          </Box>
                        </Typography>
                        <input
                          style={{
                            ...inputSx,
                            borderColor: errors.name
                              ? "#c0392b"
                              : "rgba(90,40,20,0.15)",
                          }}
                          placeholder="Enter your full name"
                          value={bulkForm.name}
                          onChange={setField("name")}
                          onBlur={blurField("name")}
                        />
                        {errors.name && (
                          <Typography
                            sx={{
                              fontSize: 11,
                              color: "#c0392b",
                              fontFamily: "var(--font-main)",
                              mt: 0.4,
                              ml: 0.5,
                            }}
                          >
                            {errors.name}
                          </Typography>
                        )}
                      </Box>

                      {/* Phone */}
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#3d1a0e",
                            fontFamily: "var(--font-main)",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            mb: 0.6,
                          }}
                        >
                          Phone Number{" "}
                          <Box component="span" sx={{ color: "#c0392b" }}>
                            *
                          </Box>
                        </Typography>
                        <input
                          style={{
                            ...inputSx,
                            borderColor: errors.phone
                              ? "#c0392b"
                              : "rgba(90,40,20,0.15)",
                          }}
                          placeholder="Enter your phone number"
                          type="tel"
                          value={bulkForm.phone}
                          onChange={setField("phone")}
                          onBlur={blurField("phone")}
                        />
                        {errors.phone && (
                          <Typography
                            sx={{
                              fontSize: 11,
                              color: "#c0392b",
                              fontFamily: "var(--font-main)",
                              mt: 0.4,
                              ml: 0.5,
                            }}
                          >
                            {errors.phone}
                          </Typography>
                        )}
                      </Box>

                      {/* Email */}
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#3d1a0e",
                            fontFamily: "var(--font-main)",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            mb: 0.6,
                          }}
                        >
                          Email Address{" "}
                          <Box component="span" sx={{ color: "#c0392b" }}>
                            *
                          </Box>
                        </Typography>
                        <input
                          style={{
                            ...inputSx,
                            borderColor: errors.email
                              ? "#c0392b"
                              : "rgba(90,40,20,0.15)",
                          }}
                          placeholder="Enter your email"
                          type="email"
                          value={bulkForm.email}
                          onChange={setField("email")}
                          onBlur={blurField("email")}
                        />
                        {errors.email && (
                          <Typography
                            sx={{
                              fontSize: 11,
                              color: "#c0392b",
                              fontFamily: "var(--font-main)",
                              mt: 0.4,
                              ml: 0.5,
                            }}
                          >
                            {errors.email}
                          </Typography>
                        )}
                      </Box>

                      {/* Address */}
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#3d1a0e",
                            fontFamily: "var(--font-main)",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            mb: 0.6,
                          }}
                        >
                          Address{" "}
                          <Box component="span" sx={{ color: "#c0392b" }}>
                            *
                          </Box>
                        </Typography>
                        <input
                          style={{
                            ...inputSx,
                            borderColor: errors.address
                              ? "#c0392b"
                              : "rgba(90,40,20,0.15)",
                          }}
                          placeholder="Enter delivery address"
                          value={bulkForm.address}
                          onChange={setField("address")}
                          onBlur={blurField("address")}
                        />
                        {errors.address && (
                          <Typography
                            sx={{
                              fontSize: 11,
                              color: "#c0392b",
                              fontFamily: "var(--font-main)",
                              mt: 0.4,
                              ml: 0.5,
                            }}
                          >
                            {errors.address}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    {/* Notes */}
                    <Box>
                      <Typography
                        sx={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#3d1a0e",
                          fontFamily: "var(--font-main)",
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          mb: 0.6,
                        }}
                      >
                        Occasion / Notes{" "}
                        <Box component="span" sx={{ color: "#c0392b" }}>
                          *
                        </Box>
                      </Typography>
                      <textarea
                        style={{
                          ...inputSx,
                          height: 80,
                          resize: "none",
                          display: "block",
                          borderColor: errors.notes
                            ? "#c0392b"
                            : "rgba(90,40,20,0.15)",
                        }}
                        placeholder="e.g. Office lunch, Wedding, Temple function..."
                        value={bulkForm.notes}
                        onChange={setField("notes")}
                        onBlur={blurField("notes")}
                      />
                      {errors.notes && (
                        <Typography
                          sx={{
                            fontSize: 11,
                            color: "#c0392b",
                            fontFamily: "var(--font-main)",
                            mt: 0.4,
                            ml: 0.5,
                          }}
                        >
                          {errors.notes}
                        </Typography>
                      )}
                    </Box>

                    {/* Submit */}
                    <Button
                      onClick={handleBulkSubmit}
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 0.5,
                        py: 1.5,
                        borderRadius: "12px",
                        background:
                          "linear-gradient(135deg, #3d1a0e 0%, #7a2e14 100%)",
                        color: "#fdf6ec",
                        fontFamily: "var(--font-main)",
                        fontSize: 14,
                        fontWeight: 700,
                        textTransform: "none",
                        letterSpacing: "0.02em",
                        boxShadow: "none",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #2c1009 0%, #5e2410 100%)",
                          boxShadow: "0 8px 24px rgba(61,26,14,0.25)",
                        },
                      }}
                      startIcon={
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                      }
                    >
                      Submit Enquiry
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
        {/* ══ SNACKBAR TOAST ══ */}
        <Box
          sx={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: snackOpen
              ? "translateX(-50%) translateY(0)"
              : "translateX(-50%) translateY(100px)",
            transition: "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
            zIndex: 9999,
            pointerEvents: snackOpen ? "auto" : "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              background:
                "linear-gradient(135deg, var(--primary-teal-dark) 0%, var(--primary-teal-mid) 100%)",
              boxShadow:
                "0 8px 28px rgba(12,61,71,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
              px: 2.5,
              py: 1.5,
              borderRadius: "14px",
              minWidth: { xs: 260, sm: 340 },
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* ── Check icon with maroon dark bg ── */}
            <Box
              sx={{
                width: 32, // ← smaller icon circle
                height: 32,
                borderRadius: "50%",
                background: "var(--primary-maroon-dark)", // ← maroon dark
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                animation: snackOpen
                  ? "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)"
                  : "none",
                "@keyframes popIn": {
                  "0%": { transform: "scale(0)", opacity: 0 },
                  "100%": { transform: "scale(1)", opacity: 1 },
                },
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fdf6ec"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </Box>

            {/* ── Text ── */}
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontFamily: "var(--font-main)",
                  fontWeight: 700,
                  fontSize: 13.5,
                  color: "#fdf6ec",
                  lineHeight: 1.3,
                  mb: 0.2,
                }}
              >
                Enquiry Submitted!
              </Typography>
              <Typography
                sx={{
                  fontFamily: "var(--font-main)",
                  fontSize: 11.5,
                  color: "rgba(253,246,236,0.75)",
                  lineHeight: 1.3,
                }}
              >
                We'll reach out on{" "}
                <Box
                  component="span"
                  sx={{ fontWeight: 700, color: "#fdf6ec" }}
                >
                  {bulkForm.phone || "your number"}
                </Box>
                .
              </Typography>
            </Box>

            {/* ── Close button ── */}
            <Box
              onClick={() => setSnackOpen(false)}
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                "&:hover": { background: "rgba(255,255,255,0.12)" },
                transition: "background 0.2s",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(253,246,236,0.7)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </Box>

            {/* ── Progress bar — maroon dark, shrinks in 4s ── */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                height: "3px",
                borderRadius: "0 0 14px 14px",
                background: "var(--primary-maroon-dark)", // ← maroon dark
                animation: snackOpen ? "shrinkBar 4s linear forwards" : "none",
                "@keyframes shrinkBar": {
                  "0%": { width: "100%" },
                  "100%": { width: "0%" },
                },
              }}
            />
          </Box>
        </Box>
        <CertifiedQualitySection />
        <DeliverySection />
        <CustomerReviewsSection />
      </Box>
    </>
  );
}
