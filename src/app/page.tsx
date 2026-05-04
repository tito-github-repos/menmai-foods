// "use client";

// import { useEffect, useState } from "react";
// import styles from "./page.module.css";

// const banners = [
//   "/img/banners/banners1.jpg",
//   "/img/banners/banners2.png",
//   "/img/banners/banners3.png",
// ];

// export default function Home() {
//   const [current, setCurrent] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % banners.length);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <main className={styles.container}>

//       {/* RUNNING TEXT */}
//       <div className={styles.ticker}>
//         <p className={styles.marquee}>
//         Freshly made chapathi daily | Free delivery above ₹199 | No preservatives
//         </p>
//       </div>

//       {/* HERO */}
//       <section className={styles.hero}>
//         <img src={banners[current]} className={styles.heroImage} />

//         <div className={styles.overlay}>
//           {/* <h1 className={styles.title}>
//             Fresh Chapathi, Ready in Seconds
//           </h1> */}
//           <p className={styles.subtitle}>
//             Soft • Healthy • Homemade Taste
//           </p>
//           <button className={styles.primaryBtn}>
//             Order Now
//           </button>
//         </div>
//       </section>

//       <section className={styles.products}>
//         <h2 className={styles.sectionTitle}>Our Products</h2>

//         <div className={styles.productGrid}>

//           {/* CARD 1 */}
//           <div className={styles.card}>
//             <img src="/img/products/chapthi1.jpeg" className={styles.productImg} />

//             <div className={styles.cardContent}>
//               <h3>Chapathi</h3>

//               <div className={styles.priceBox}>
//                 <span className={styles.oldPrice}>₹50</span>
//                 <span className={styles.newPrice}>₹40</span>
//               </div>

//               <button className={styles.primaryBtn}>Add to Cart</button>
//             </div>
//           </div>

//           {/* CARD 2 */}
//           <div className={styles.card}>
//             <img src="/img/products/poori1.jpeg" className={styles.productImg} />

//             <div className={styles.cardContent}>
//               <h3>Poori</h3>

//               <div className={styles.priceBox}>
//                 <span className={styles.oldPrice}>₹55</span>
//                 <span className={styles.newPrice}>₹45</span>
//               </div>

//               <button className={styles.primaryBtn}>Add to Cart</button>
//             </div>
//           </div>

//         </div>
//       </section>

//       {/* ABOUT */}
//       <section className={styles.about}>
//         <h2 className={styles.sectionTitle}>About Us</h2>
//         <p className={styles.aboutText}>
//           Menmai Foods provides fresh, hygienic, ready-to-eat chapathi and poori.
//           Our mission is to deliver convenient and healthy food solutions while
//           maintaining traditional taste and quality.
//         </p>
//       </section>

//       {/* DELIVERY */}
//       <section className={styles.delivery}>
//         <h2 className={styles.sectionTitle}>Delivery Area</h2>
//         <div className={styles.deliveryBox}>
//           We currently deliver within <strong>Madurai (10km radius)</strong>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className={styles.cta}>
//         <h2 className={styles.sectionTitle}>Order Now</h2>
//         <p>Contact us on WhatsApp</p>
//         <button className={styles.whatsappBtn}>
//           Chat on WhatsApp
//         </button>
//       </section>

//       {/* FLOAT WHATSAPP */}
//       <a href="https://wa.me/91XXXXXXXXXX" className={styles.whatsappFloat}>
//         💬
//       </a>

//       {/* WHY US */}
//       <section className={styles.why}>
//         <h2 className={styles.sectionTitle}>Why Choose Us</h2>

//         <div className={styles.whyGrid}>
//           <p>✅ No Preservatives</p>
//           <p>✅ Homemade Taste</p>
//           <p>✅ Ready in 30 Seconds</p>
//         </div>
//       </section>

//       {/* CTA */}
//       {/* <section className={styles.cta}>
//         <h2 className={styles.sectionTitle}>Order Now</h2>
//         <p>Contact us on WhatsApp</p>
//         <button className={styles.whatsappBtn}>
//           Chat on WhatsApp
//         </button>
//       </section> */}

//     </main>
//   );
// }
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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import CertifiedQualitySection from './components/CertifiedQuality';
import { CustomerReviewsSection, DeliverySection } from "./components/DeliveryandReviews";

/* ─────────────────────────────────────────
   HERO BANNERS
───────────────────────────────────────── */
const banners: string[] = [
  "/img/herosection/hero1.png",
  "/img/herosection/hero2.png",
  "/img/herosection/hero3.png",
];

/* ─────────────────────────────────────────
   PRODUCTS
───────────────────────────────────────── */
const products = [
  {
    name: "Chapathi",
    color: "var(--primary-teal-mid)",
    bg: "#F5F3EC",
    border: "#e4dfcf",
    img: "/img/products/chapathi.png",
    price: 40,
    oldPrice: 50,
    weight: "450g",
    desc: "Soft homemade chapathi prepared fresh daily with traditional taste.",
    desc1: " Ready in 2 seconds",
  },
  {
    name: "Poori",
    color: "var(--primary-maroon-mid)",
    bg: "#F8F0E3",
    border: "#ecd8c7",
    img: "/img/products/poori.png",
    price: 55,
    oldPrice: 45,
    weight: "500g",
    desc: "Fluffy and delicious poori made with hygienic ingredients for perfect taste.",
    desc1: " Ready in 2 seconds",
  },
];

/* ─────────────────────────────────────────
   BULK ORDER FORM TYPES
───────────────────────────────────────── */
type BulkProduct = "Chapathi" | "Poori" | "Both – Chapathi & Poori";

interface BulkForm {
  name: string;
  phone: string;
  email: string;     // ✅ add this
  address: string;
  product: BulkProduct | "";
  quantity: string;
  deliveryDate: string;
  notes: string;
}

const bulkProducts: BulkProduct[] = [
  "Chapathi",
  "Poori",
  "Both – Chapathi & Poori",
];

const bulkFeatures = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="9" r="3" /><circle cx="15" cy="15" r="3" />
        <line x1="6" y1="18" x2="18" y2="6" />
      </svg>
    ),
    title: "Special Bulk Pricing",
    desc: "Save up to 10% on orders above 100 pieces. Volume discounts apply automatically.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 15.5 14" />
      </svg>
    ),
    title: "On-time Delivery",
    desc: "Schedule your delivery time and we'll be there — fresh, hot, and on time.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" />
        <line x1="10" y1="12" x2="14" y2="12" />
      </svg>
    ),
    title: "Hygienic Packaging",
    desc: "All bulk orders are packed in food-safe, leak-proof containers maintaining freshness.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const Star = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const Heart = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const People = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const WheatIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#b07050" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
  { icon: <Leaf />,    title: "Made with Quality Ingredients", desc: "Carefully selected for your family" },
  { icon: <Heart />,   title: "Soft, Fresh & Tasty",           desc: "Just like homemade" },
  { icon: <Sparkle />, title: "Hygienically Prepared",         desc: "Packed with care and cleanliness" },
  { icon: <Clock />,   title: "Ready in 2 Minutes",            desc: "Heat & serve in no time" },
  { icon: <MapPin />,  title: "Loved by many",              desc: "Bringing freshness to your homes" },
];

/* ─────────────────────────────────────────
   CERT BADGES
───────────────────────────────────────── */
// const Shield = () => <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>;
const Droplets = () => <svg viewBox="0 0 24 24"><path d="M12 2c0 0-8 7.58-8 12a8 8 0 0 0 16 0c0-4.42-8-12-8-12z" /></svg>;
// const Star = () => <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
const Veg = () => <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" /><path d="M12 8V5M12 19v-3M5 12H2M22 12h-3" /></svg>;

const certBadges = [
  { icon: <Shield />,   label: "FSSAI Certified" },
  { icon: <Droplets />, label: "Hygienically Prepared" },
  { icon: <Star />,     label: "Quality Assured" },
  { icon: <Veg />,      label: "100% Vegetarian" },
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

  /* Bulk form state */
  const [bulkForm, setBulkForm] = useState<BulkForm>({
    name: "", phone: "",email: "",   
  address: "", product: "", quantity: "", deliveryDate: "", notes: "",
  });
  const [bulkSubmitted, setBulkSubmitted] = useState(false);

  const setField = (key: keyof BulkForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setBulkForm((f) => ({ ...f, [key]: e.target.value }));

  const handleBulkSubmit = () => {
    if (!bulkForm.name || !bulkForm.phone || !bulkForm.product || !bulkForm.quantity) return;
    setBulkSubmitted(true);
  };

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
          src={banners[current]}
          alt="banner"
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* ══ TRUST TICKER (Hero Bottom) ══ */}
<Box
  sx={{
    width: "100%",
    overflow: "hidden",
    background: "var(--primary-teal-dark)",
    py: 1.2,
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
          gap: 1.2,
          px: { xs: 2, md: 4 },
          minWidth: { xs: "180px", md: "240px" },
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
  <Box sx={{ textAlign: "center", mb: { xs: 3, md: 4 }, position: "relative", zIndex: 1 ,}}>
    <Box sx={{
      display: "inline-flex", alignItems: "center", gap: 0.6,
      fontSize: 11, color: "#b07850", fontFamily: "var(--font-main)", mb: 0.5,
    }}>
      {/* <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#b07850" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
      </svg> */}
      Made with Love and Care
      <svg width="11" height="11" viewBox="0 0 24 24" fill="#d84040" stroke="none">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </Box>

    <Typography sx={{
      fontFamily: "var(--font-heading)",
      fontSize: { xs: 24, md: 32 },
      fontWeight: 700,
      color: "var(--primary-maroon-dark)",
      lineHeight: 1.05,
      mb: 0.5,
    }}>
      Our Products
    </Typography>

    <Typography sx={{
      fontFamily: "var(--font-main)",
      fontSize: 12,
      color: "#9a7a58",
      letterSpacing: "0.01em",
    }}>
      Authentic taste. Hygienically made. Always fresh.
    </Typography>
  </Box>
  <Grid container spacing={{ xs: 2, md: 3 }}>
  {products.map((product) => {
    const isTeal = product.name === "Chapathi";
    return (
      <Grid item xs={12} md={6} key={product.name}>
        <Card
          sx={{
            display: "flex",
            borderRadius: "20px",
            backgroundColor: product.bg,
            border: `1.5px solid ${product.border}`,
            boxShadow: "var(--shadow)",
            overflow: "hidden",
            minHeight: 220,
          }}
        >
          <Box sx={{ width: "42%", flexShrink: 0, display: "flex", alignItems: "center", p: "10px 0 10px 10px" }}>
            <Box component="img" src={product.img} alt={product.name}
              sx={{ width: "100%", height: "100%", objectFit: "contain", maxHeight: 200 }}
            />
          </Box>

          <CardContent sx={{ flex: 1, p: "14px 14px 14px 8px !important", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Box>
              <Typography sx={{
                display: "inline-block", fontSize: 10, fontWeight: 700,
                letterSpacing: 1.5, px: 1.5, py: 0.3, borderRadius: "20px",
                bgcolor: isTeal ? "var(--primary-teal-mid)" : "var(--primary-maroon-mid)",
                color: "#fff", mb: 0.5, fontFamily: "var(--font-main)",
              }}>
                {isTeal ? "BEST SELLER" : "HOME SPECIAL"}
              </Typography>

              <Typography sx={{
                fontWeight: 700, fontSize: { xs: 22, md: 26 },
                color: isTeal ? "var(--primary-teal-dark)" : "var(--primary-maroon-dark)",
                fontFamily: "var(--font-heading)", lineHeight: 1.1, mb: 0.3,
              }}>
                {product.name}
              </Typography>

              <Typography sx={{ fontSize: 14, color: "var(--primary-maroon-light)", lineHeight: 1.45, fontFamily: "var(--font-main)", mb: 0.5 }}>
                {product.desc}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 0.75 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke={isTeal ? "var(--primary-teal-mid)" : "var(--primary-maroon-mid)"}
                    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 15.5 14" />
                  </svg>
                  <Typography sx={{ fontSize: 12, color: isTeal ? "var(--primary-teal-dark)" : "var(--primary-maroon-dark)", fontFamily: "var(--font-main)" }}>
                    Ready in 2 minutes
                  </Typography>
                </Box>
                
              </Box>
            </Box>

            <Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke={isTeal ? "var(--primary-teal-mid)" : "var(--primary-maroon-mid)"}
                    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2h12l2 6H4L6 2z" /><rect x="3" y="8" width="18" height="13" rx="2" />
                  </svg>
                  <Typography sx={{ fontSize: 11, color: isTeal ? "var(--primary-teal-dark)" : "var(--primary-maroon-dark)", fontFamily: "var(--font-main)" }}>
                    Net Wt. {product.weight}{" "}
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

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <Typography sx={{ fontSize: 13, color: isTeal ? "var(--primary-teal-dark)" : "var(--primary-maroon-dark)", fontFamily: "var(--font-main)" }}>
                  MRP:
                </Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 800, color: isTeal ? "var(--primary-teal-mid)" : "var(--primary-maroon-mid)", fontFamily: "var(--font-main)" }}>
                  ₹{product.price}
                </Typography>
                <Typography component="span" sx={{
                  fontSize: 13, textDecoration: "line-through", fontFamily: "var(--font-main)",
                  color: isTeal ? "var(--primary-teal-dark)" : "var(--primary-maroon-light)",
                }}>
                  ₹{product.oldPrice}
                </Typography>
              </Box>

              

              <Box sx={{
                borderTop: "1.5px dashed",
                borderColor: isTeal ? "var(--primary-teal-mid)" : "var(--primary-maroon-light)",
                my: 1,
              }} />

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button variant="contained" sx={{
                  flex: 1, borderRadius: "999px", fontSize: 12, fontWeight: 700,
                  height: 36, fontFamily: "var(--font-main)", boxShadow: "none",
                  whiteSpace: "nowrap",
                  bgcolor: isTeal ? "var(--primary-teal-mid)" : "var(--primary-maroon-mid)",
                  "&:hover": {
                    bgcolor: isTeal ? "var(--primary-teal-dark)" : "var(--primary-maroon-dark)",
                    boxShadow: "none",
                  },
                }}>
                  Add to Cart
                </Button>
                <Button variant="outlined"
                  onClick={() => router.push(`/product/${product.name.toLowerCase()}`)}
                  sx={{
                    flex: 1, borderRadius: "999px", fontSize: 12, fontWeight: 700,
                    height: 36, fontFamily: "var(--font-main)", whiteSpace: "nowrap",
                    color: isTeal ? "var(--primary-teal-mid)" : "var(--primary-maroon-mid)",
                    borderColor: isTeal ? "var(--primary-teal-mid)" : "var(--primary-maroon-mid)",
                    "&:hover": {
                      bgcolor: isTeal ? "rgba(9,97,113,0.08)" : "rgba(97,34,15,0.08)",
                      borderColor: isTeal ? "var(--primary-teal-mid)" : "var(--primary-maroon-mid)",
                    },
                  }}>
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
            width: "100%",
            position: "relative",
            overflow: "visible",
            borderRadius: "60px 0 0px 60px",
             ml: { xs: 2, md: "40px" },
            mt: { xs: 3, md: 4 },
            py: { xs: 3, md: 4 },
            background: "linear-gradient(120deg, var(--primary-teal-dark) 0%, var(--primary-teal-mid) 70%, #0a5060 100%)",
          }}
        >
          <Box sx={{ maxWidth: "1200px", mx: "auto", px: 5, pr: { md: "200px" }, position: "relative", zIndex: 1 }}>
            <Typography sx={{ fontFamily: "var(--font-heading)", textAlign: "left", color: "#f5dfc0", fontSize: 22, fontWeight: 700, mb: 1.5 }}>
              Why Choose Menmai?
            </Typography>

            <Grid container spacing={0} justifyContent="center">
              {whyItems.map((item, i) => (
                <Grid item xs={6} sm={4} md={2.4} key={i}>
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
                          background: "linear-gradient(to bottom, transparent, rgba(245,223,192,0.5), transparent)",
                        }}
                      />
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box
            component="img"
            src="/img/dec_img.png"
            alt="chapathi"
            sx={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: { xs: 100, md: 220 },
              filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.4))",
              zIndex: 2,
              display: { xs: "none", md: "block" },
            }}
          />
        </Box>

        {/* ══════════════════════════════════════════
            ══ 2. BULK ORDERS ══
            Placed after "Why Choose Menmai"
            and before "Certified Quality + Delivery"
        ══════════════════════════════════════════ */}
        <Box
          sx={{
            width: "100%",
            py: { xs: 5, md: 8 },
            px: { xs: 2, md: 4 },
            // background: "linear-gradient(135deg, #f5ede0 0%, #fdf6ec 55%, #fff8f0 100%)",
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
              alignItems: "stretch",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* ── LEFT — HERO + FEATURES ── */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 ,height: "100%",}}>

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
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Bulk &amp; Catering
              </Box>

              {/* Two-column split: text + image */}
              <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>

                {/* TEXT SIDE */}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-heading)",
                      fontSize: { xs: 34, md: 50 },
                      fontWeight: 700,
                      color: "var(--primary-teal-dark)",
                      lineHeight: 1.08,
                      letterSpacing: "-0.02em",
                      mb: 1.5,
                    }}
                  >
                    Need Large<br />
                    <Box component="span" sx={{ fontStyle: "italic", color: "var(--primary-teal-dark)" }}>
                      Quantities?
                    </Box>
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: "var(--font-main)",
                      fontSize: 18,
                      color: "#9a6a50",
                      lineHeight: 1.7,
                      maxWidth: 380,
                    }}
                  >
                    Perfect for office lunches, temple functions, weddings, and school
                    events. We handle orders of{" "}
                    <Box component="span" sx={{ fontWeight: 700, color: "#7a2e14" }}>
                      500 pieces to 5,000+
                    </Box>{" "}
                    with the same freshness guarantee.
                  </Typography>
                </Box>

                {/* ── BULK IMAGE ──
                    This is /img/bulk1.png from your original code.
                    It sits on the RIGHT of the headline text,
                    hidden on mobile, visible md+ */}
                <Box
                  sx={{
                    flex: "0 0 auto",
                    display: { xs: "none", md: "block" },
                    width: 220,
                    position: "relative",
                  }}
                >
                  {/* Warm glow behind image */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: -16,
                      borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(194,90,48,0.12) 0%, transparent 70%)",
                      pointerEvents: "none",
                    }}
                  />
                  <Box
                    component="img"
                    src="/img/bulk1.png"
                    alt="Menmai bulk boxes"
                    sx={{
                      width: "100%",
                      height: "300%",
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
                  gap: 2,
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
                      p: "14px 16px",
                      backdropFilter: "blur(6px)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 8px 24px rgba(61,26,14,0.08)",
                      },
                    }}
                  >
                    {/* Icon tile */}
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #472112 0%,  #743f21 100% )",
                        // background: "linear-gradient(135deg, #3d1a0e 0%, #7a2e14 100%)",
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
                          fontSize: 16,
                          color: "#3d1a0e",
                          mb: 0.4,
                        }}
                      >
                        {title}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "var(--font-main)",
                          fontSize: 12.5,
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
                boxShadow: "0 20px 60px rgba(61,26,14,0.10), 0 4px 16px rgba(61,26,14,0.06)",
                overflow: "auto",
                          
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
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </Box>
                  <Typography sx={{ fontFamily: "'Georgia', serif", fontSize: 22, fontWeight: 700, color: "#3d1a0e" }}>
                    Request Sent!
                  </Typography>
                  <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 14, color: "#9a6a50", lineHeight: 1.6, maxWidth: 260 }}>
                    We'll contact you to confirm your bulk order details as soon as possible.
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
                      background: "linear-gradient(135deg, #472112 0%,  #743f21 100% )",
                      px: "20px",
                      py: "20px",
                    }}
                  >
                    <Typography sx={{ fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: 21, color: "#fdf6ec", mb: 0.5 }}>
                      Request a Bulk Quote
                    </Typography>
                    <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 13, color: "rgba(253,246,236,0.7)" }}>
                      Fill in the details and we'll contact you as soons as possible.
                    </Typography>
                  </Box>

                  {/* FORM BODY */}
                  <Box sx={{ 
                    p: "24px 24px 24px", 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: 2 ,
                    flex: 1,                 
                    
                    }}>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2,
                      }}
                    >
                    {/* Your Name */}
                    <Box>
                      <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "#3d1a0e", fontFamily: "var(--font-main)", letterSpacing: "0.05em", textTransform: "uppercase", mb: 0.7 }}>
                        Your Name
                      </Typography>
                      <input
                        style={inputSx}
                        placeholder="Enter your full name"
                        value={bulkForm.name}
                        onChange={setField("name")}
                      />
                    </Box>

                    {/* Phone */}
                    <Box>
                      <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "#3d1a0e", fontFamily: "var(--font-main)", letterSpacing: "0.05em", textTransform: "uppercase", mb: 0.7 }}>
                        Phone Number
                      </Typography>
                      <input
                        style={inputSx}
                        placeholder="Enter your phone number"
                        type="tel"
                        value={bulkForm.phone}
                        onChange={setField("phone")}
                      />
                    </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2,
                      }}
                    >
                      {/* Email */}
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: "#3d1a0e",
                            fontFamily: "var(--font-main)",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            mb: 0.7,
                          }}
                        >
                          Email Address
                        </Typography>
                        <input
                          style={inputSx}
                          placeholder="Enter your email"
                          type="email"
                          value={bulkForm.email || ""}
                          onChange={(e) =>
                            setBulkForm((f) => ({ ...f, email: e.target.value }))
                          }
                        />
                      </Box>

                      {/* Address */}
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: "#3d1a0e",
                            fontFamily: "var(--font-main)",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            mb: 0.7,
                          }}
                        >
                          Address
                        </Typography>
                        <input
                          style={inputSx}
                          placeholder="Enter delivery address"
                          value={bulkForm.address || ""}
                          onChange={(e) =>
                            setBulkForm((f) => ({ ...f, address: e.target.value }))
                          }
                        />
                      </Box>
                    </Box>

                    {/* Product */}
                    <Box>
                      <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "#3d1a0e", fontFamily: "var(--font-main)", letterSpacing: "0.05em", textTransform: "uppercase", mb: 0.7 }}>
                        Product Required
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {bulkProducts.map((p) => (
                          <Box
                            key={p}
                            onClick={() => setBulkForm((f) => ({ ...f, product: p }))}
                            sx={{
                              px: 2,
                              py: 0.8,
                              borderRadius: "999px",
                              border: "1.5px solid",
                              borderColor: bulkForm.product === p ? "#3d1a0e" : "rgba(90,40,20,0.18)",
                              background: bulkForm.product === p ? "#3d1a0e" : "#fafaf8",
                              color: bulkForm.product === p ? "#fdf6ec" : "#7a2e14",
                              fontFamily: "var(--font-main)",
                              fontSize: 12.5,
                              fontWeight: 600,
                              cursor: "pointer",
                              whiteSpace: "nowrap",
                              transition: "all 0.15s",
                              userSelect: "none",
                            }}
                          >
                            {p}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2,
                      }}
                    >
                    {/* Quantity */}
                    <Box>
                      <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "#3d1a0e", fontFamily: "var(--font-main)", letterSpacing: "0.05em", textTransform: "uppercase", mb: 0.7 }}>
                        Quantity (pieces)
                      </Typography>
                      <input
                        style={inputSx}
                        placeholder="Enter quantity (e.g. 100, 500, 1000)"
                        type="number"
                        min="50"
                        value={bulkForm.quantity}
                        onChange={setField("quantity")}
                      />
                    </Box>

                    {/* Delivery Date */}
                    <Box>
                      <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "#3d1a0e", fontFamily: "var(--font-main)", letterSpacing: "0.05em", textTransform: "uppercase", mb: 0.7 }}>
                        Delivery Date
                      </Typography>
                      <input
                        style={inputSx}
                        type="date"
                        value={bulkForm.deliveryDate}
                        onChange={setField("deliveryDate")}
                      />
                    </Box>
                    </Box>
                    {/* Notes */}
                    <Box>
                      <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "#3d1a0e", fontFamily: "var(--font-main)", letterSpacing: "0.05em", textTransform: "uppercase", mb: 0.7 }}>
                        Occasion / Notes
                      </Typography>
                      <textarea
                        style={{ ...inputSx, height: 72, resize: "none", display: "block" }}
                        placeholder="e.g. Office lunch, Wedding, Temple function..."
                        value={bulkForm.notes}
                        onChange={setField("notes")}
                      />
                    </Box>

                    {/* Submit */}
                    <Button
                      onClick={handleBulkSubmit}
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 0.5,
                        py: 1.6,
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #3d1a0e 0%, #7a2e14 100%)",
                        color: "#fdf6ec",
                        fontFamily: "var(--font-main)",
                        fontSize: 14.5,
                        fontWeight: 700,
                        textTransform: "none",
                        letterSpacing: "0.02em",
                        boxShadow: "none",
                        "&:hover": {
                          background: "linear-gradient(135deg, #2c1009 0%, #5e2410 100%)",
                          boxShadow: "0 8px 24px rgba(61,26,14,0.25)",
                        },
                      }}
                      startIcon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                      }
                    >
                      Send Bulk Request
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>

        {/* ══ CERTIFIED QUALITY BANNER ══ */}
{/* ══ CERTIFIED QUALITY BANNER ══ */}
{/* <Box
  sx={{
    width: "100%",
    py: { xs: 3, md: 4 },
    px: { xs: 2, md: 4 },
    background: "#fdf6ec",
    position: "relative",
    overflow: "hidden",
  }}
> */}
  {/* Wheat image pinned bottom-left */}
  {/* <Box
    component="img"
    src="/img/certificates/wheat.png"
    alt=""
    sx={{
      position: "absolute",
      left: 0,
      bottom: 0,
      width: { xs: 100, md: 200 },
      opacity: 0.9,
      pointerEvents: "none",
      zIndex: 0,
    }}
  />

  <Box
    sx={{
      maxWidth: "1000px",
      mx: "auto",
      position: "relative",
      zIndex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2.5,
    }}
  > */}
    {/* ── Top ornament + heading ── */}
    {/* <Box sx={{ textAlign: "center" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, mb: 1 }}>
        <Box sx={{ height: "1px", width: 48, bgcolor: "rgba(90,56,37,0.2)" }} />
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b07050" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22C6.5 11 2 8 2 5a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 3-4.5 6-10 17z" />
        </svg>
        <Box sx={{ height: "1px", width: 48, bgcolor: "rgba(90,56,37,0.2)" }} />
      </Box>

      <Typography
        sx={{
          fontFamily: "var(--font-heading)",
          fontSize: { xs: 22, md: 28 },
          fontWeight: 700,
          color: "var(--primary-maroon-dark)",
          lineHeight: 1.2,
          mb: 0.5,
        }}
      >
        Certified Quality. Trusted by You.
      </Typography>
      <Typography
        sx={{
          fontFamily: "var(--font-main)",
          fontSize: 13,
          color: "#9a6a50",
          lineHeight: 1.6,
        }}
      >
        We follow strict food safety and government standards to ensure the best for you and your family.
      </Typography>
    </Box> */}

    {/* ── Logo row — horizontal pill card ── */}
    {/* <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        background: "#fff",
        border: "1px solid rgba(90,56,37,0.12)",
        borderRadius: "20px",
        overflow: "hidden",
        width: "fit-content",
        boxShadow: "0 2px 12px rgba(61,26,14,0.06)",
      }}
    > */}
      {/* FSSAI */}
      {/* <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: { xs: 3, md: 5 },
          py: 2,
          gap: 0.8,
        }}
      >
        <Box
          component="img"
          src="/img/certificates/fssai.png"
          alt="FSSAI"
          sx={{ height: { xs: 38, md: 48 }, objectFit: "contain" }}
        />
        <Box sx={{ height: "1px", width: "80%", background: "repeating-linear-gradient(90deg, rgba(90,56,37,0.25) 0, rgba(90,56,37,0.25) 4px, transparent 4px, transparent 8px)" }} />
        <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 11, fontWeight: 700, color: "var(--primary-maroon-dark)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          FSSAI Certified
        </Typography>
        <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 10.5, color: "#b07050" }}>
          Food Safety Approved
        </Typography>
      </Box> */}

      {/* Divider */}
      {/* <Box sx={{ width: "1px", height: 70, bgcolor: "rgba(90,56,37,0.12)" }} />

      {/* MSME */}
      {/* <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: { xs: 3, md: 5 },
          py: 2,
          gap: 0.8,
        }}
      >
        <Box
          component="img"
          src="/img/certificates/msme.png"
          alt="MSME"
          sx={{ height: { xs: 38, md: 48 }, objectFit: "contain" }}
        />
        <Box sx={{ height: "1px", width: "80%", background: "repeating-linear-gradient(90deg, rgba(90,56,37,0.25) 0, rgba(90,56,37,0.25) 4px, transparent 4px, transparent 8px)" }} />
        <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 11, fontWeight: 700, color: "var(--primary-maroon-dark)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          MSME Registered
        </Typography>
        <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 10.5, color: "#b07050" }}>
          Govt. Recognized Business
        </Typography>
      </Box>
    </Box> */} 

    {/* ── Badge bar ── */}
    {/* <Box
      sx={{
        width: "100%",
        background: "var(--primary-teal-dark)",
        borderRadius: "14px",
        py: 1.5,
        px: { xs: 2, md: 4 },
        display: "grid",
        gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
        gap: { xs: 1.5, md: 0 },
      }}
    >
      {[
        { icon: <Shield />, label: "Safe & Compliant",    sub: "Strict food safety norms" },
        { icon: <Star />,   label: "Trusted Standards",   sub: "Leading government bodies" },
        { icon: <Heart />,  label: "Quality You Deserve", sub: "Pure & hygienic ingredients" },
        { icon: <Veg />,    label: "Committed to You",    sub: "Your health is our priority" },
      ].map((b, i) => (
        <Box
          key={i}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            px: { xs: 0, md: 2 },
            borderRight: { md: i < 3 ? "1px solid rgba(245,223,192,0.15)" : "none" },
          }}
        >
          <Box sx={{ "& svg": { width: 18, height: 18, fill: "none", stroke: "#f5dfc0", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", flexShrink: 0 } }}>
            {b.icon}
          </Box>
          <Box>
            <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 12, fontWeight: 700, color: "#f5dfc0", lineHeight: 1.2 }}>
              {b.label}
            </Typography>
            <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 10.5, color: "rgba(245,223,192,0.65)", lineHeight: 1.3 }}>
              {b.sub}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>

  </Box>
</Box>
 */}
<CertifiedQualitySection/>
<DeliverySection/>
<CustomerReviewsSection/>

      
      </Box>
    </>
  );
}
