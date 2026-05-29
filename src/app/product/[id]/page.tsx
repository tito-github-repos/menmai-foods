"use client";

import { useParams, notFound } from "next/navigation";
import { Fragment } from "react";
import {
  Box, Typography, Button, Container, Grid, IconButton,
  Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, Rating, Table, TableBody, TableRow, TableCell,
} from "@mui/material";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { CustomerReviewsSection } from "@/app/components/DeliveryandReviews";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/cartSlice";


const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

/* ─── COLOR TOKENS ─── */
const OR     = "var(--or)";        // #E8720C  orange
const GLD    = "var(--glt)";       // #efca97  golden-tan
const BROWN  = "var(--brown)";     // #5C2008
const DBR    = "var(--dbr)";       // #3A1204  deep maroon
const CREAM  = "var(--cream)";     // #FDF8F0
const IVORY  = "var(--ivory)";     // #FFF9F0
const MUTED  = "var(--muted)";     // #8A6040
const TEAL   = "var(--primary-teal-dark)";   // #0c3d47
const MAROON = "var(--primary-maroon-dark)"; // #472112

/* ═══════════════════════════════════════════════════════════
   SECTION-HEADING WHEAT (flanks) — matches screenshots exactly
═══════════════════════════════════════════════════════════ */
const IcoWheatSm = ({ size = 18, color = "#E8720C" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <line x1="14" y1="26" x2="14" y2="9" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    <ellipse cx="14" cy="7.5" rx="3" ry="4.2" fill={color} opacity="0.9"/>
    <ellipse cx="10" cy="11.5" rx="2.6" ry="3.7" fill={color} opacity="0.75" transform="rotate(-28 10 11.5)"/>
    <ellipse cx="18" cy="11.5" rx="2.6" ry="3.7" fill={color} opacity="0.75" transform="rotate(28 18 11.5)"/>
    <ellipse cx="10.5" cy="16" rx="2.1" ry="3.1" fill={color} opacity="0.5" transform="rotate(-28 10.5 16)"/>
    <ellipse cx="17.5" cy="16" rx="2.1" ry="3.1" fill={color} opacity="0.5" transform="rotate(28 17.5 16)"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   HIGHLIGHT STRIP ICONS (30px, dark maroon #3A1204)
   — wheat, crossed-circle, smiley, clock, heart
═══════════════════════════════════════════════════════════ */
const IcoWheat = ({ size = 30, color = "#3A1204" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
    <line x1="15" y1="28" x2="15" y2="10" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    <ellipse cx="15" cy="8.2" rx="3.4" ry="4.8" fill={color} opacity="0.9"/>
    <ellipse cx="10.5" cy="12.5" rx="3" ry="4.3" fill={color} opacity="0.72" transform="rotate(-28 10.5 12.5)"/>
    <ellipse cx="19.5" cy="12.5" rx="3" ry="4.3" fill={color} opacity="0.72" transform="rotate(28 19.5 12.5)"/>
    <ellipse cx="11" cy="17.5" rx="2.5" ry="3.6" fill={color} opacity="0.45" transform="rotate(-28 11 17.5)"/>
    <ellipse cx="19" cy="17.5" rx="2.5" ry="3.6" fill={color} opacity="0.45" transform="rotate(28 19 17.5)"/>
    <line x1="12" y1="27" x2="15" y2="23.5" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="18" y1="27" x2="15" y2="23.5" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const IcoCrossCircle = ({ size = 30, color = "#3A1204" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
    <circle cx="15" cy="15" r="11" stroke={color} strokeWidth="2"/>
    <line x1="7.5" y1="7.5" x2="22.5" y2="22.5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IcoSmiley = ({ size = 30, color = "#3A1204" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
    <circle cx="15" cy="15" r="11" stroke={color} strokeWidth="2"/>
    <circle cx="11" cy="13" r="1.6" fill={color}/>
    <circle cx="19" cy="13" r="1.6" fill={color}/>
    <path d="M10.5 18.5 Q15 23 19.5 18.5" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
  </svg>
);

const IcoClock = ({ size = 30, color = "#3A1204" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
    <circle cx="15" cy="15" r="11" stroke={color} strokeWidth="2"/>
    <line x1="15" y1="8" x2="15" y2="15" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
    <line x1="15" y1="15" x2="20.5" y2="19" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
);

const IcoHeart = ({ size = 30, color = "#3A1204" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
    <path d="M15 24C15 24 4 17.5 4 10.8C4 7.5 6.6 5 9.5 5C11.7 5 13.7 6.4 15 8.5C16.3 6.4 18.3 5 20.5 5C23.4 5 26 7.5 26 10.8C26 17.5 15 24 15 24Z"
      stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   TRUST CHIPS — 14px icons, white bg, brown border pill
   Matching target: fire/flame, crossed-circle, house/roof
═══════════════════════════════════════════════════════════ */
const IcoChipFresh = () => (
  /* flame icon — matches "Fresh Today" chip in screenshot */
  <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <path d="M7 1.5C7 1.5 4 5.5 4 8C4 9.7 5.1 11 6.3 11.5C6.3 9.8 7.5 9 7.5 9C7.5 10.8 9 11.5 9 13C9 13 10.5 12 10.5 10.5C10.5 8 8 5.5 8.5 3C8.5 3 7.5 4 7.5 5.5C7.5 5.5 6 4.5 7 1.5Z"
      fill="#3A1204" opacity="0.82"/>
  </svg>
);

const IcoChipNoPres = () => (
  /* crossed circle — "No Preservatives" */
  <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="5.3" stroke="#3A1204" strokeWidth="1.4"/>
    <line x1="3.2" y1="3.2" x2="10.8" y2="10.8" stroke="#3A1204" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const IcoChipHome = () => (
  /* house / home — "Homemade" */
  <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <path d="M2 7L7 2L12 7" stroke="#3A1204" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="3.8" y="7" width="6.4" height="5.5" rx="0.7" stroke="#3A1204" strokeWidth="1.3" fill="none"/>
    <rect x="5.5" y="9" width="3" height="3.5" rx="0.5" stroke="#3A1204" strokeWidth="1.1" fill="none"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   PACK SELECTOR BOX ICON
═══════════════════════════════════════════════════════════ */
const IcoBox = ({ size = 26, color = "#472112" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <path d="M4 9L14 5L24 9V19L14 23L4 19V9Z" stroke={color} strokeWidth="1.7" fill="none" strokeLinejoin="round"/>
    <line x1="4"  y1="9"  x2="14" y2="13" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="24" y1="9"  x2="14" y2="13" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="14" y1="13" x2="14" y2="23" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="9"  y1="7"  x2="19" y2="11" stroke={color} strokeWidth="1.1" strokeLinecap="round" opacity="0.4"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   FOOTER TRUST STRIP — white icons inside colored circles
   Sizes: 20px viewBox 20x20, white strokes
═══════════════════════════════════════════════════════════ */
/** Flame — Freshly Made */
const IcoTrustFire = () => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <path d="M10 2C10 2 6.5 7 6.5 10.5C6.5 12.5 7.8 14.2 9.5 14.8C9.5 12.8 11 11.8 11 11.8C11 13.8 12.8 14.8 12.8 16.5C12.8 16.5 14.5 15.2 14.5 13.5C14.5 10.5 11.5 7.5 12 5C12 5 10.8 6 10.8 8C10.8 8 9 6.5 10 2Z"
      fill="white" opacity="0.92"/>
  </svg>
);

/** Shield with checkmark — Hygienically Prepared */
const IcoTrustShield = () => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <path d="M10 2L3 5V10C3 14 6.2 17.5 10 18.5C13.8 17.5 17 14 17 10V5L10 2Z"
      stroke="white" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
    <path d="M7.5 10.2L9.2 12L12.5 8.5"
      stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/** Box/package — Secure & Safe Packaging */
const IcoTrustBox = () => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <path d="M3 6.5L10 4L17 6.5V13.5L10 16L3 13.5V6.5Z"
      stroke="white" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
    <line x1="3"  y1="6.5" x2="10" y2="9.5" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="17" y1="6.5" x2="10" y2="9.5" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="10" y1="9.5" x2="10" y2="16"  stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

/** Truck — On-time Delivery */
const IcoTrustTruck = () => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <rect x="1.5" y="7" width="11" height="7.5" rx="1" stroke="white" strokeWidth="1.4" fill="none"/>
    <path d="M12.5 9.5L15.5 9.5L18 13V14.5H12.5V9.5Z"
      stroke="white" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
    <circle cx="5"  cy="15"  r="1.6" stroke="white" strokeWidth="1.3" fill="none"/>
    <circle cx="15" cy="15"  r="1.6" stroke="white" strokeWidth="1.3" fill="none"/>
    <line x1="3" y1="10.5" x2="9" y2="10.5" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.55"/>
  </svg>
);

/** Pin / location — 10 KM Delivery */
const IcoTrustPin = () => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <path d="M10 2C7.2 2 5 4.2 5 7C5 11 10 18 10 18C10 18 15 11 15 7C15 4.2 12.8 2 10 2Z"
      stroke="white" strokeWidth="1.5" fill="none"/>
    <circle cx="10" cy="7" r="2" stroke="white" strokeWidth="1.4" fill="none"/>
  </svg>
);

/** People — Trusted by 1000+ */
const IcoTrustPeople = () => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <circle cx="8" cy="6.5" r="3.2" stroke="white" strokeWidth="1.4" fill="none"/>
    <path d="M2 18C2 14.7 4.7 12 8 12C11.3 12 14 14.7 14 18"
      stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    <circle cx="14.5" cy="6" r="2.4" stroke="white" strokeWidth="1.3" fill="none" opacity="0.7"/>
    <path d="M16.5 18C16.5 15.5 15.2 13.8 13.5 13"
      stroke="white" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.7"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   BULK BANNER BOTTOM ROW — 16px golden icons
═══════════════════════════════════════════════════════════ */
const IcoBulkQty = () => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <rect x="2" y="3.5" width="7.5" height="10" rx="1" stroke="#efca97" strokeWidth="1.2" fill="none"/>
    <path d="M9.5 5.5L14 4V13.5H9.5V5.5Z" stroke="#efca97" strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
    <line x1="4" y1="7.5" x2="7.5" y2="7.5"  stroke="#efca97" strokeWidth="1" strokeLinecap="round"/>
    <line x1="4" y1="10" x2="7.5" y2="10"    stroke="#efca97" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

const IcoBulkTruck = () => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <rect x="1" y="5.5" width="9" height="6" rx="1" stroke="#efca97" strokeWidth="1.2" fill="none"/>
    <path d="M10 7.5L13 7.5L15 10.5V11.5H10V7.5Z" stroke="#efca97" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
    <circle cx="4"  cy="12.2" r="1.4" stroke="#efca97" strokeWidth="1" fill="none"/>
    <circle cx="12" cy="12.2" r="1.4" stroke="#efca97" strokeWidth="1" fill="none"/>
  </svg>
);

const IcoBulkTag = () => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <path d="M2 2H7.8L14 8.2L8.2 14L2 7.8V2Z" stroke="#efca97" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
    <circle cx="5.5" cy="5.5" r="1.4" fill="#efca97"/>
  </svg>
);

const IcoBulkAgent = () => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5.5" r="3.2" stroke="#efca97" strokeWidth="1.2" fill="none"/>
    <path d="M2 15.5C2 12.2 4.7 9.5 8 9.5C11.3 9.5 14 12.2 14 15.5"
      stroke="#efca97" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   PRODUCT DATA
═══════════════════════════════════════════════════════════ */
type DbProduct = {
  id: number;
  name: string;
  slug: string;
  price: number;
  mrp: number | null;
  netWeight: string | null;
  pieces: number | null;
  imageUrl: string | null;
  images: {
    id: number;
    imageUrl: string;
    altText: string | null;
    sortOrder: number;
  }[];
};

const productDetails: Record<string, any> = {
  chapathi: {
    badge: "FRESH & SOFT",
    desc: "Soft homemade chapathi prepared fresh daily with traditional taste and no preservatives. Made with pure ingredients to bring you the comfort of home.",
    packs: [{ label: "Pack of 10 PCS", sublabel: "Perfect for a family meal", price: 40 }],
    nutrition: [
      { label: "Energy",        value: "297 kcal" },
      { label: "Carbohydrates", value: "54.0 g" },
      { label: "Protein",       value: "8.8 g" },
      { label: "Fat",           value: "5.3 g" },
      { label: "Dietary Fiber", value: "6.6 g" },
      { label: "Sugar",         value: "0 g" },
    ],
    cookSteps: [
      { title: "Preheat Pan",    desc: "Heat tawa on medium flame for 2 min.",  img: "/img/procedure/cpan_heat.png" },
      { title: "Place Chapathi", desc: "Lay flat, cook until bubbles form.",      img: "/img/procedure/c_place.png" },
      { title: "Flip & Cook",    desc: "Cook both sides evenly, ~30 sec each.",  img: "/img/procedure/c_flip.png" },
      { title: "Serve Fresh",    desc: "Serve hot with ghee or curry.",           img: "/img/procedure/c_serve.png" },
    ],
    cookTip: "For extra softness, apply a little ghee or butter while serving.",
    highlights: [
      { ico: "wheat", bold: "100%",           soft: "Whole Wheat" },
      { ico: "cross", bold: "Zero Maida",     soft: "Pure & Natural" },
      { ico: "smile", bold: "Soft & Tasty",   soft2: "Every Time" },
      { ico: "clock", bold: "Ready in",       soft: "Just 2 Minutes" },
      { ico: "heart", bold: "Loved by 1000+", soft: "Happy Families" },
    ],
    reviews: [
      { name: "Priya, Madurai",   rating: 5, text: "Chapathi is so soft and fresh. Tastes just like homemade!",  avatar: "/img/reviews/r1.jpg" },
      { name: "Karthik, Madurai", rating: 5, text: "Perfect for our daily meals. Very soft and healthy.",         avatar: "/img/reviews/r2.jpg" },
      { name: "Meena, Madurai",   rating: 5, text: "Very hygienic and convenient. Saves time and tastes great.", avatar: "/img/reviews/r3.jpg" },
    ],
  },
  poori: {
    badge: "CRISPY & GOLDEN",
    desc: "Crispy golden poori, puffed to perfection and made fresh with traditional recipes.",
    packs: [{ label: "Pack of 15 PCS", sublabel: "Perfect for a family meal", price: 45 }],
    nutrition: [
      { label: "Energy",        value: "320 kcal" },
      { label: "Carbohydrates", value: "48.0 g" },
      { label: "Protein",       value: "7.2 g" },
      { label: "Fat",           value: "11.0 g" },
      { label: "Dietary Fiber", value: "3.2 g" },
      { label: "Sugar",         value: "0 g" },
    ],
    cookSteps: [
      { title: "Heat Oil",       desc: "Pour oil in kadai, heat on high flame.", img: "/img/procedure/ppan_heat.png" },
      { title: "Slide In Poori", desc: "Gently slide poori into hot oil.",       img: "/img/procedure/p_place.png" },
      { title: "Press & Puff",   desc: "Press lightly until poori puffs up.",    img: "/img/procedure/p_flip.png" },
      { title: "Drain & Serve",  desc: "Drain oil, serve with masala.",          img: "/img/procedure/p_serve.png" },
    ],
    cookTip: "Use fresh oil for best results and a perfect golden color.",
    highlights: [
      { ico: "wheat", bold: "Pure Wheat",     soft: "Flour" },
      { ico: "cross", bold: "No Artificial",  soft: "Color" },
      { ico: "smile", bold: "Crispy & Light", soft2: "Every Time" },
      { ico: "clock", bold: "Ready in",       soft: "Just 3 Minutes" },
      { ico: "heart", bold: "Loved by 1000+", soft: "Happy Families" },
    ],
    reviews: [
      { name: "Priya, Madurai",   rating: 5, text: "Perfectly puffed every time, just like restaurant quality!", avatar: "/img/reviews/r1.jpg" },
      { name: "Ravi, Madurai",    rating: 5, text: "Great for Sunday breakfast. My kids love it.",               avatar: "/img/reviews/r2.jpg" },
      { name: "Lakshmi, Madurai", rating: 5, text: "Fresh and crispy. Best poori I've had in a long time!",      avatar: "/img/reviews/r3.jpg" },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════ */
export default function ProductPage() {
  const params  = useParams();
  // const id      = params.id as string;
  // const product = products[id];
  const slug = params.id as string;
  const details = productDetails[slug];
  const dispatch = useAppDispatch();

  const [product, setProduct] = useState<DbProduct | null>(null);
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState("");
  const [imgIdx, setImgIdx] = useState(0);
  // const [qty, setQty]               = useState(1);
  // const [img, setImg]               = useState(product.images[0]);
  // const [imgIdx, setImgIdx]         = useState(0);
  const [pincode, setPincode]       = useState("");
  const [pincodeMsg, setPinMsg]     = useState<"valid"|"invalid"|"">("");
  // const [selectedPack]              = useState(product.packs[0]);
  const [bulkOpen, setBulkOpen]     = useState(false);
  const [bulkQty, setBulkQty]       = useState(50);
  const [bulkName, setBulkName]     = useState("");
  const [bulkPhone, setBulkPhone]   = useState("");
  const [bulkNote, setBulkNote]     = useState("");
  const [snackOpen, setSnackOpen]   = useState(false);
  const [cartSnack, setCartSnack]   = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [revIdx, setRevIdx]         = useState(0);

  // const discount = Math.round(((product.mrp - selectedPack.price) / product.mrp) * 100);

  // useEffect(() => {
  //   const t = setInterval(() => setActiveStep(p => (p + 1) % product.cookSteps.length), 2200);
  //   return () => clearInterval(t);
  // }, [product.cookSteps.length]);

  // const prevImg = () => { const i = imgIdx === 0 ? product.images.length - 1 : imgIdx - 1; setImgIdx(i); setImg(product.images[i]); };
  // const nextImg = () => { const i = imgIdx === product.images.length - 1 ? 0 : imgIdx + 1; setImgIdx(i); setImg(product.images[i]); };

    useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data: DbProduct) => {
        setProduct(data);

        const firstImage = data.images?.[0]?.imageUrl || data.imageUrl || "";
        setImg(firstImage);
        setImgIdx(0);
      })
      .catch(() => {
        setProduct(null);
      });
  }, [slug]);

  useEffect(() => {
    if (!details) return;

    const t = setInterval(() => {
      setActiveStep((p) => (p + 1) % details.cookSteps.length);
    }, 2200);

    return () => clearInterval(t);
  }, [details]);

  if (!details) return notFound();

  if (!product) {
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography>Loading product...</Typography>
      </Box>
    );
  }

  const galleryImages =
    product.images.length > 0
      ? product.images.map((image) => image.imageUrl)
      : product.imageUrl
        ? [product.imageUrl]
        : [];

  const selectedPack = {
    label: product.pieces ? `Pack of ${product.pieces} PCS` : "Pack",
    sublabel: product.netWeight ? product.netWeight : "Perfect for a family meal",
    price: product.price,
  };

  const mrp = product.mrp ?? product.price;

  const discount =
    mrp > product.price
      ? Math.round(((mrp - product.price) / mrp) * 100)
      : 0;

  const prevImg = () => {
    if (galleryImages.length === 0) return;

    const i = imgIdx === 0 ? galleryImages.length - 1 : imgIdx - 1;
    setImgIdx(i);
    setImg(galleryImages[i]);
  };

  const nextImg = () => {
    if (galleryImages.length === 0) return;

    const i = imgIdx === galleryImages.length - 1 ? 0 : imgIdx + 1;
    setImgIdx(i);
    setImg(galleryImages[i]);
  };

  /* highlight icon map */
  const hiIcons: Record<string, React.ReactNode> = {
    wheat: <IcoWheat     size={30} color="#3A1204" />,
    cross: <IcoCrossCircle size={30} color="#3A1204" />,
    smile: <IcoSmiley    size={30} color="#3A1204" />,
    clock: <IcoClock     size={30} color="#3A1204" />,
    heart: <IcoHeart     size={30} color="#3A1204" />,
  };

  /* footer trust strip data — EXACTLY matching screenshots */
  const trustItems = [
    { bg: "#E8720C", icon: <IcoTrustFire   />, label: "Freshly Made",     sub: "Every Day"   },
    { bg: "#472112", icon: <IcoTrustShield />, label: "Hygienically",     sub: "Prepared"    },
    { bg: "#0c3d47", icon: <IcoTrustBox    />, label: "Secure & Safe",    sub: "Packaging"   },
    { bg: "#E8720C", icon: <IcoTrustTruck  />, label: "On-time",          sub: "Delivery"    },
    { bg: "#472112", icon: <IcoTrustPin    />, label: "10 KM Delivery",   sub: "in Madurai"  },
    { bg: "#0c3d47", icon: <IcoTrustPeople />, label: "Trusted by 1000+", sub: "Families"    },
  ];

  /* ── Section heading with wheat flanks ── */
  const SectionHead = ({ text, size = 32 }: { text: string; size?: number }) => (
    <Box textAlign="center" mb={1}>
      <Box display="flex" alignItems="center" justifyContent="center" gap={1.5}>
        <Box sx={{ height: 1.5, width: 44, bgcolor: "#d4b9a8" }} />
        {/* <IcoWheatSm size={18} color="#E8720C" /> */}
        <Typography sx={{
          fontFamily: "var(--font-heading)",
          fontSize: { xs: size * 0.72, md: size },
          fontWeight: 900, color: "#3A1204", letterSpacing: "0.05em",
        }}>{text}</Typography>
        {/* <IcoWheatSm size={18} color="#E8720C" /> */}
        <Box sx={{ height: 1.5, width: 44, bgcolor: "#d4b9a8" }} />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff", color: "var(--text)", fontFamily: "var(--font-heading)" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>

        {/* BREADCRUMB */}
        <Box display="flex" alignItems="center" gap={0.5} mb={3}>
          {["Home", "Products", product.name].map((crumb, i, arr) => (
            <Box key={crumb} display="flex" alignItems="center" gap={0.5}>
              <Typography fontSize={13}
                color={i === arr.length - 1 ? "#3A1204" : "#9e7060"}
                fontWeight={i === arr.length - 1 ? 700 : 400}
                sx={{ cursor: i < arr.length - 1 ? "pointer" : "default" }}>
                {crumb}
              </Typography>
              {i < arr.length - 1 && <Typography fontSize={12} color="#ccc">›</Typography>}
            </Box>
          ))}
        </Box>

        {/* MAIN GRID */}
        <Grid container spacing={4} alignItems="flex-start">

          {/* LEFT — Images */}
          <Grid item xs={12} md={5}>
            <Box sx={{
              position: "relative", borderRadius: 3, overflow: "hidden",
              aspectRatio: "1/1", bgcolor: CREAM,
              boxShadow: "0 4px 24px rgba(59,31,14,0.08)",
              "&:hover .navArrow": { opacity: 1 },
            }}>
              <Box component="img" src={img} alt={product.name}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }} />

              {/* 100% Whole Wheat circular badge — top-left, teal bg */}
              <Box sx={{
                position: "absolute", top: 14, left: 14,
                bgcolor: "#0c3d47", color: "#fff",
                borderRadius: "50%", width: 70, height: 70,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                fontSize: 8, fontWeight: 800, textAlign: "center",
                lineHeight: 1.3, letterSpacing: 0.3,
                fontFamily: "'Sora', sans-serif",
                boxShadow: "0 2px 10px rgba(0,0,0,0.24)",
                gap: 0.3,
              }}>
                <IcoWheat size={13} color="#fff" />
                <span>100%<br/>WHOLE<br/>WHEAT</span>
              </Box>

              <IconButton onClick={prevImg} className="navArrow" sx={{
                position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.9)", color: "#3A1204", width: 36, height: 36,
                opacity: 0, transition: "0.25s", boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                "&:hover": { bgcolor: "#fff" },
              }}><ChevronLeftIcon /></IconButton>
              <IconButton onClick={nextImg} className="navArrow" sx={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.9)", color: "#3A1204", width: 36, height: 36,
                opacity: 0, transition: "0.25s", boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                "&:hover": { bgcolor: "#fff" },
              }}><ChevronRightIcon /></IconButton>
            </Box>

            {/* Thumbnails */}
            <Box display="flex" gap={1.5} mt={2}>
              {galleryImages.map((src: string, i: number)  => (
                <Box key={i} component="img" src={src}
                  onClick={() => { setImg(src); setImgIdx(i); }}
                  sx={{
                    width: 80, height: 80, borderRadius: 2, objectFit: "cover",
                    cursor: "pointer",
                    border: img === src ? `2.5px solid #3A1204` : "2px solid #e0cfc4",
                    opacity: img === src ? 1 : 0.65, transition: "0.2s",
                    "&:hover": { opacity: 1 },
                  }}
                />
              ))}
            </Box>
          </Grid>

          {/* CENTER — Product Info */}
          <Grid item xs={12} md={4.5}>
            <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

              {/* Teal badge */}
              <Box sx={{
                display: "inline-block", bgcolor: "#0c3d47", color: "#fff",
                fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
                px: 1.5, py: 0.45, borderRadius: 2, mb: 1.5,
                fontFamily: "var(--primary-heading",
              }}>{details.badge}</Box>

              {/* Product name */}
              {/* <Typography sx={{
                fontFamily: "var(--font-heading)", fontSize: { xs: 38, md: 50 },
                fontWeight: 900, color: "var(--primary-maroon-mid)", lineHeight: 1, letterSpacing: "-0.5px", mb: 1,
              }}>{product.name}</Typography> */}

              <Box
                display="flex"
                alignItems="center"
                gap={1}
                mb={1}
              >
                <Typography
                  sx={{
                    fontFamily: "var(--font-heading)",
                    fontSize: { xs: 38, md: 50 },
                    fontWeight: 900,
                    color: "var(--primary-maroon-mid)",
                    lineHeight: 1,
                    letterSpacing: "-0.5px",
                  }}
                >
                  {product.name}
                </Typography>

                {/* <Box
                  component="img"
                  src="/img/wheat-5.svg"
                  alt="Wheat"
                  sx={{
                    width: 34,
                    height: 34,
                    objectFit: "contain",

                    filter:
                      "brightness(0) saturate(100%) invert(72%) sepia(38%) saturate(707%) hue-rotate(343deg) brightness(92%) contrast(88%)",
                  }}
                /> */}
              </Box>

              {/* Orange divider */}
              {/* <Box display="flex" alignItems="center" gap={0.5} mb={0} sx={{ width: "100%", maxWidth: "fit-content" }}>
                <Box sx={{ height: "1.5px", flex: 1, minWidth: 60, bgcolor: "#e4bf95", borderRadius: 1 }} />
                <Box
                  component="img"
                  src="/img/wheat-1.svg"
                  alt="Wheat Icon"
                  sx={{
                    width: 45,
                    height: 45,
                    transform: "rotate(46deg)",
                    objectFit: "contain",
                   filter:"brightness(0) saturate(100%) invert(72%) sepia(38%) saturate(707%) hue-rotate(343deg) brightness(92%) contrast(88%)"
                  }}
                />
                <Box sx={{ height: "1.5px",flex: 1, minWidth: 60, bgcolor: "#e4bf95", borderRadius: 1 }} />
              </Box> */}

              {/* Rating row */}
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Rating value={4.8} precision={0.1} readOnly size="small" sx={{ color: "#daa56b" }} />
                <Typography fontSize={13} fontWeight={700} color="#daa56b">4.8</Typography>
                <Typography fontSize={13} color="#bbb">(120 reviews)</Typography>
              </Box>

              {/* ── Trust chips: white bg, brown outline, custom SVG ── */}
              <Box display="flex" gap={1} flexWrap="wrap" mb={2.5}>
                {[
                  { ico: <IcoChipFresh  />, label: "Fresh Today"       },
                  { ico: <IcoChipNoPres />, label: "No Preservatives"  },
                  { ico: <IcoChipHome   />, label: "Homemade"          },
                ].map((b) => (
                  <Box key={b.label} sx={{
                    display: "inline-flex", alignItems: "center", gap: 0.7,
                    px: 1.5, py: 0.55,
                    border: "1.5px solid var(--primary-maroon-light)",
                    borderRadius: "20px", bgcolor: "#f7f3f1",
                  }}>
                    {b.ico}
                    <Typography fontSize={12} fontWeight={600} color="var(--primary-maroon-light)"
                      fontFamily="var(--font-heading)">{b.label}</Typography>
                  </Box>
                ))}
              </Box>

              {/* Description */}
              <Typography fontSize={14} color="#7a5140" lineHeight={1.75} mb={2.5}>
                {details.desc}
              </Typography>

              {/* Pack selector */}
              <Box sx={{
                border: `1.5px solid var(--primary-maroon-light)`, borderRadius: "12px",
                p: 1.5, mb: 2.5, bgcolor:"#f7f3f1",
                display: "flex", alignItems: "center", gap: 1.5,
              }}>
                <Box sx={{
                  width: 44, height: 44, borderRadius: "10px",
                  bgcolor: "#f7f3f1", border: `1px solid var(--primary-maroon-light)`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <IcoBox size={26} color="#472112" />
                </Box>
                <Box flex={1}>
                  <Typography fontSize={14} fontWeight={700} color="var(--primary-maroon-light)"
                    fontFamily="var(--font-heading)">{selectedPack.label}</Typography>
                  <Typography fontSize={12} color="#8A6040"
                    fontFamily="var(--font-heading)">{selectedPack.sublabel}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} flexShrink={0}>
                  <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 22, fontWeight: 900, color: "#3A1204" }}>
                    ₹{selectedPack.price}
                  </Typography>
                  <Typography fontSize={14} sx={{ textDecoration: "line-through", color: "#bbb" }}>
                    ₹{mrp}
                  </Typography>
                  <Box sx={{
                    bgcolor: "var(--primary-maroon-mid)", color: "#fff", fontSize: 11, fontWeight: 800,
                    px: 0.8, py: 0.35, borderRadius: 2, fontFamily: "var(--primary-heading)",
                  }}>{discount}% OFF</Box>
                </Box>
              </Box>

              {/* Quantity */}
              <Typography fontSize={11.5} fontWeight={700} color="#3A1204" letterSpacing={1}
                mb={1} fontFamily="var(--primary-heading)">QUANTITY</Typography>
              <Box display="flex" alignItems="center" gap={3} mb={2.5}>
                <Box sx={{
                  display: "flex", alignItems: "center",
                  border: "1.5px solid var(--primary-maroon-mid)", borderRadius: "10px",
                  overflow: "hidden", bgcolor: "#fff",
                }}>
                  <IconButton size="small" onClick={() => setQty(q => q > 1 ? q - 1 : 1)}
                    sx={{ borderRadius: 0, px: 1.5, "&:hover": { bgcolor: CREAM } }}>
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography px={2.5} fontWeight={700} fontSize={16} color="#3A1204">{qty}</Typography>
                  <IconButton size="small" onClick={() => setQty(q => q + 1)}
                    sx={{ borderRadius: 0, px: 1.5, "&:hover": { bgcolor: CREAM } }}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Box>
                  <Typography fontSize={12} color="#aaa" fontFamily="'Sora', sans-serif">Total:</Typography>
                  <Typography fontSize={20} fontWeight={800} color="#3A1204"
                    fontFamily="var(--font-main)">₹{selectedPack.price * qty}</Typography>
                </Box>
              </Box>

              {/* Pincode */}
              <Typography fontSize={11.5} fontWeight={700} color="#3A1204" letterSpacing={1}
                mb={1} fontFamily="'Sora', sans-serif">CHECK DELIVERY</Typography>
              <Box display="flex" gap={1.5} alignItems="center" mb={1}>
                <TextField size="small" placeholder="Enter 6-digit pincode" value={pincode}
                  onChange={e => { setPincode(e.target.value.replace(/\D/, "").slice(0, 6)); setPinMsg(""); }}
                  inputProps={{ maxLength: 6 }}
                  sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px", fontFamily: "'Sora', sans-serif",
                      "& fieldset": { borderColor: "#d4b9a8" },
                      "&:hover fieldset": { borderColor: "#5C2008" },
                      "&.Mui-focused fieldset": { borderColor: "#3A1204" },
                    },
                  }}
                />
                <Button onClick={() => setPinMsg(pincode.length === 6 ? "valid" : "invalid")}
                  variant="contained"
                  sx={{
                    borderRadius: "10px", bgcolor: "var(--primary-maroon-mid)",
                    fontFamily: "'Sora', sans-serif", fontWeight: 700,
                    fontSize: 13, px: 2.5, "&:hover": { bgcolor: "#5C2008" },
                  }}>CHECK</Button>
              </Box>
              {pincodeMsg === "valid" && (
                <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                  <CheckCircleOutlineIcon sx={{ fontSize: 14, color: "#2e7d32" }} />
                  <Typography fontSize={12.5} color="#2e7d32" fontFamily="'Sora', sans-serif">
                    Delivery available in your area!
                  </Typography>
                </Box>
              )}
              {pincodeMsg === "invalid" && (
                <Typography fontSize={12.5} color="red" mb={1} fontFamily="'Sora', sans-serif">
                  Enter a valid 6-digit pincode.
                </Typography>
              )}

                {/* CTA buttons */}
                <Box mt={2.5} display="flex" flexDirection="row" gap={1.5}>
                  {/* Bulk Order — outlined, maroon border */}
                  <Button  variant="outlined"
                    onClick={() => setBulkOpen(true)}
                    startIcon={<LocalShippingOutlinedIcon />}
                    sx={{
                      borderRadius: "12px", borderColor: "var(--primary-marron-d)", borderWidth: 2,
                      color: "#3A1204", fontFamily: "var(--primary-heading)", fontWeight: 700,
                      fontSize: 13.5, py: 1.3,
                      "&:hover": { bgcolor: CREAM, borderWidth: 2 },
                    }}>BULK ORDER</Button>

                  {/* Add to Cart — gradient maroon */}
                  <MotionBox whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
                    <Button variant="contained"
                      startIcon={<ShoppingCartOutlinedIcon />}
                      onClick={() => {
                        dispatch(
                          addToCart({
                            productId: product.id,
                            slug: product.slug,
                            name: product.name,
                            packLabel: selectedPack.label,
                            pieces: product.pieces ?? 0,
                            mrp,
                            price: selectedPack.price,
                            quantity: qty,
                            img: galleryImages[0] ?? product.imageUrl ?? "",
                          })
                        );

                        setCartSnack(true);
                      }}
                      sx={{
                        borderRadius: "12px", py: 1.7,
                        fontFamily: "var(--primary-heading)", fontWeight: 800, fontSize: 15,
                        background: "linear-gradient(135deg, #3A1204 0%, #5C2008 100%)",
                        boxShadow: "0 8px 24px rgba(59,31,14,0.28)",
                        "&:hover": { background: "linear-gradient(135deg, #5C2008 0%, #8b4a25 100%)" },
                      }}>
                      ADD TO CART &nbsp; ₹{selectedPack.price * qty}
                    </Button>
                  </MotionBox>
              </Box>

              {/* Secure checkout line */}
              <Box display="flex" justifyContent="center" alignItems="center"
                gap={0.8} mt={2} flexWrap="wrap">
                <SecurityOutlinedIcon sx={{ fontSize: 13, color: "#2e7d32" }} />
                <Typography fontSize={11.5} color="#7a5140" fontFamily="'Sora', sans-serif">Secure checkout</Typography>
                <Typography fontSize={10} color="#ccc" mx={0.2}>•</Typography>
                <VerifiedOutlinedIcon sx={{ fontSize: 13, color: "#2e7d32" }} />
                <Typography fontSize={11.5} color="#7a5140" fontFamily="'Sora', sans-serif">Easy returns</Typography>
                <Typography fontSize={10} color="#ccc" mx={0.2}>•</Typography>
                <CheckCircleOutlineIcon sx={{ fontSize: 13, color: "#2e7d32" }} />
                <Typography fontSize={11.5} color="#7a5140" fontFamily="'Sora', sans-serif">100% satisfaction guaranteed</Typography>
              </Box>
            </MotionBox>
          </Grid>

          {/* RIGHT — Nutritional Facts */}
          <Grid item xs={12} md={2.5}>
            <MotionPaper
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              elevation={0}
              sx={{ border: "1.5px solid #e8d4c0", borderRadius: 3, p: 2.5, bgcolor: "#fbf8f6", position: "sticky", top: 90 }}
            >
              <Typography sx={{
                fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 14, color: "#3A1204",
                borderBottom: `2px solid #3A1204`, pb: 1, mb: 0.5,
              }}>NUTRITIONAL FACTS</Typography>
              <Typography fontSize={11} color="#9e7060" mb={2} fontFamily="var(--primary-heading)">
                (Per 100g approx.)
              </Typography>
              <Table size="small" sx={{
                "& td": { px: 0, py: 0.65, borderColor: "#f0dfd0", fontFamily: "var(--primary-main)", fontSize: 12 },
              }}>
                <TableBody>
                  {details.nutrition.map((n: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell sx={{ color: "#7a5140" }}>{n.label}</TableCell>
                      <TableCell align="right" sx={{ color: "#3A1204", fontWeight: 700 }}>{n.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box mt={2.5} textAlign="center">
                <Box
                  component="img"
                  src="/img/wheat-4.svg"
                  alt="Wheat Icon"
                  sx={{
                    width: 45,
                    height: 45,
                    // transform: "rotate(46deg)",
                    objectFit: "contain",
                  //  filter:"brightness(0) saturate(100%) invert(72%) sepia(38%) saturate(707%) hue-rotate(343deg) brightness(92%) contrast(88%)"
                  }}
                />
                <Typography fontSize={12} fontWeight={600} color="#7a5140"
                  fontFamily="'Sora', sans-serif" mt={0.8} lineHeight={1.5}>
                  Goodness of whole wheat<br />for a healthy you!
                </Typography>
              </Box>
            </MotionPaper>
          </Grid>
        </Grid>

        {/* ── HIGHLIGHTS STRIP ── */}
        {/* <Box mt={5} sx={{
          display: "flex", justifyContent: "space-around", alignItems: "center",
          bgcolor: "#fcfaf8", borderRadius: 3, py: 3, px: { xs: 2, md: 5 },
          border: "1.5px solid #e8d4c0", flexWrap: "wrap", gap: 3,
        }}>
          {product.highlights.map((h: any, i: number) => (
            <Box key={i} textAlign="center" sx={{ flex: "0 0 auto", minWidth: 90 }}>
              <Box mb={0.8}>{hiIcons[h.ico]}</Box>
              <Typography fontSize={13} fontWeight={700} color="#3A1204"
                fontFamily="'Sora', sans-serif" lineHeight={1.3}>{h.bold}</Typography>
              <Typography fontSize={11.5} color="#8A6040"
                fontFamily="'Sora', sans-serif" lineHeight={1.3}>{h.soft || h.soft2}</Typography>
            </Box>
          ))}
        </Box> */}

        {/* ── HIGHLIGHTS STRIP ── */}
        <Box
          mt={5}
          sx={{
            display: "flex",
            alignItems: "stretch",
            justifyContent: "space-between",
            bgcolor: "#fcfaf8",
            border: "1.5px solid #e8d4c0",
            borderRadius: "22px",
            overflow: "hidden",
            px: { xs: 1, md: 2 },
            py: { xs: 2, md: 2.5 },
            flexWrap: { xs: "wrap", md: "nowrap" },
          }}
        >
          {details.highlights.map(
            (
              h: {
                ico: keyof typeof hiIcons;
                bold: string;
                soft?: string;
                soft2?: string;
              },
              i: number
            ) => (
              <Fragment key={i}>
                
                {/* ITEM */}
                <Box
                  sx={{
                    flex: 1,
                    minWidth: { xs: "50%", md: 0 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.8,
                    px: { xs: 1.5, md: 3 },
                    py: 1.5,
                  }}
                >
                  {/* ICON */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      "& svg": {
                        fontSize: { xs: 38, md: 46 },
                        color: "#5A2410",
                        strokeWidth: 1.6,
                      },
                    }}
                  >
                    {i === 0 ? (
                      <Box
                        component="img"
                        src="/img/wheat-2.svg"
                        alt="Wheat"
                        sx={{
                          width: { xs: 38, md: 46 },
                          height: { xs: 38, md: 46 },
                          objectFit: "contain",

                          filter:
                            "brightness(0) saturate(100%) invert(20%) sepia(35%) saturate(1125%) hue-rotate(10deg) brightness(92%) contrast(95%)",
                        }}
                      />
                    ) : (
                      hiIcons[h.ico]
                    )}
                    </Box>

                  {/* TEXT */}
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "var(--primary-heading)",
                        fontSize: { xs: 13, md: 14 },
                        fontWeight: 700,
                        color: "#3A1204",
                        lineHeight: 1.15,
                        mb: 0.15,
                      }}
                    >
                      {h.bold}
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily: "var(--primary-main)",
                        fontSize: { xs: 10.5, md: 12 },
                        fontWeight: 400,
                        color: "#8A6040",
                        lineHeight: 1.2,
                      }}
                    >
                      {h.soft || h.soft2}
                    </Typography>
                  </Box>
                </Box>

                {/* LIGHT DIVIDER */}
                {i !== details.highlights.length - 1 && (
                  <Box
                    sx={{
                      width: "1px",
                      bgcolor: "#eadfd5",
                      opacity: 0.7,
                      my: 2,
                      display: { xs: "none", md: "block" },
                    }}
                  />
                )}
              </Fragment>
            )
          )}
        </Box>

        {/* ── HOW TO COOK ── */}
        <Box mt={8}>
          <SectionHead text="HOW TO COOK" />
          <Typography fontSize={14} color="#9e7060" fontFamily="var(--primary-heading)"
            textAlign="center" mb={5}>
            From dough to delight in minutes
          </Typography>

          <Box sx={{
            position: "relative", display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between", alignItems: "flex-start",
            gap: { xs: 5, md: 2 }, px: { xs: 2, md: 4 },
          }}>
            {/* Animated dashed connector */}
            <svg viewBox="0 0 1000 160" preserveAspectRatio="none" style={{
              position: "absolute", top: 55, left: "4%",
              width: "74%", height: 120, zIndex: 1, pointerEvents: "none", overflow: "visible",
            }}>
              <motion.path
                d="M20 70 C180 20, 320 20, 460 70 S700 120, 860 70"
                stroke="#E8720C" strokeWidth="2" fill="transparent"
                strokeLinecap="round" strokeDasharray="4 14"
                strokeDashoffset={120}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </svg>

            {details.cookSteps.map((step: any, i: number) => {
              const isActive = activeStep === i;
              return (
                <MotionBox key={i}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                  sx={{ textAlign: "center", flex: "1 1 140px", maxWidth: 170, position: "relative", zIndex: 2 }}
                >
                  <MotionBox
                    animate={{ scale: isActive ? 1.05 : 0.88, opacity: isActive ? 1 : 0.38 }}
                    transition={{ duration: 0.45 }}
                    sx={{
                      width: 118, height: 118, mx: "auto", mb: 1.2,
                      borderRadius: "50%", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      bgcolor: "#fff",
                      border: isActive ? `2px solid #E8720C` : "1.5px solid #e8d4c0",
                      boxShadow: isActive
                        ? `0 0 0 6px rgba(232,114,12,0.08), 0 8px 24px rgba(232,114,12,0.14)`
                        : "0 4px 14px rgba(0,0,0,0.04)",
                      transition: "all 0.45s ease",
                    }}
                  >
                    <Box component="img" src={step.img} alt={step.title}
                      sx={{
                        width: 74, height: 74, objectFit: "contain",
                        filter: isActive ? "drop-shadow(0 4px 10px rgba(232,114,12,0.25))" : "none",
                      }}
                    />
                  </MotionBox>
                  {/* Step number badge */}
                  <Box sx={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: "linear-gradient(135deg, #E8720C, #5C2008)",
                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                    mx: "auto", mb: 0.8, fontWeight: 700, fontSize: 12, fontFamily: "var(--primay-heading)",
                  }}>{i + 1}</Box>
                  <Typography fontWeight={800} fontSize={14}
                    color={isActive ? "#3A1204" : "#9e7060"}
                    fontFamily="var(--primay-heading)" mb={0.3}>{step.title}</Typography>
                  <Typography fontSize={12} color="#9e7060" lineHeight={1.5}
                    fontFamily="var(--primay-main)">{step.desc}</Typography>
                </MotionBox>
              );
            })}

            {/* TIP card */}
            <MotionBox
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.6 }}
              sx={{
                flex: "1 1 140px", maxWidth: 170,
                bgcolor: IVORY, border: `1.5px dashed #E8720C`,
                borderRadius: 3, p: 2.5, textAlign: "center", position: "relative", zIndex: 2,
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="center" gap={0.5} mb={1}>
                <svg width={11} height={11} viewBox="0 0 11 11" fill="none">
                  <path d="M5.5 0.5L6.7 4H10.5L7.4 6.2L8.6 9.8L5.5 7.6L2.4 9.8L3.6 6.2L0.5 4H4.3L5.5 0.5Z"
                    fill="#E8720C" opacity="0.85"/>
                </svg>
                <Typography fontSize={11} fontWeight={700} color="#E8720C" letterSpacing={1.5}
                  fontFamily="var(--primay-heading)">TIP</Typography>
              </Box>
              <Box component="img" src={details.cookSteps[3].img} alt="tip"
                sx={{ width: 55, height: 55, objectFit: "contain", opacity: 0.55, mb: 1 }} />
              <Typography fontSize={12} color="#7a5140" lineHeight={1.6}
                fontFamily="var(--primay-main)">{details.cookTip}</Typography>
            </MotionBox>
          </Box>
        </Box>

        {/* ── BULK ORDER BANNER ── */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} mt={8}
          sx={{
            background: `
              linear-gradient(
                135deg,
                var(--primary-teal-dark) 0%,
                var(--primary-teal-mid) 55%,
                #0b4d5b 100%
              )
            `,
            borderRadius: 4,
            p: { xs: 3, md: 4 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 3,
            overflow: "hidden",
            position: "relative",

            boxShadow: "0 10px 40px rgba(9, 97, 113, 0.25)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
          }}
        >
         

          {/* Box image — use real image, fallback to styled emoji */}
          <Box sx={{ flexShrink: 0, display: { xs: "none", md: "flex" }, alignItems: "center", justifyContent: "center" }}>
            <Box
              component="img"
              src="/img/bulk-box.png"
              alt="Bulk order box"
              onError={(e: any) => { e.target.style.display = "none"; }}
              sx={{ width: 120, height: 120, objectFit: "contain" }}
            />
          </Box>

          <Box flex={1}>
            <Typography sx={{
              fontFamily: "var(--font-heading)", fontWeight: 900,
              fontSize: { xs: 22, md: 30 }, color: "#fff", mb: 0.5, letterSpacing: "0.04em",
            }}>ORDER IN BULK</Typography>
            <Typography fontSize={14} color="rgba(255,255,255,0.72)" mb={2.5}
              fontFamily="var(--primary-main)">
              We cater events, offices, and celebrations.<br/>Freshly made to order, delivered on time.
            </Typography>
            {/* Bottom feature row */}
            <Box display="flex" gap={3} flexWrap="wrap">
              {[
                { ico: <IcoBulkQty  />, label: "Custom Quantity" },
                { ico: <IcoBulkTruck/>, label: "On-time Delivery" },
                { ico: <IcoBulkTag  />, label: "Special Pricing" },
                { ico: <IcoBulkAgent/>, label: "Personal Support" },
                {
                  ico: <IcoWheatSm size={15} color="#efca97" />,
                  label: "Get a quick response on WhatsApp",
                },
              ].map(item => (
                <Box key={item.label} display="flex" alignItems="center" gap={0.6}>
                  {item.ico}
                  <Typography fontSize={12.5} color="rgba(255,255,255,0.78)"
                    fontFamily="var(--primary-main">{item.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* CTA */}
          <Box sx={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: { xs: "stretch", md: "flex-end" }, gap: 1 }}>
            <Button onClick={() => setBulkOpen(true)} startIcon={<WhatsAppIcon />}
              sx={{
                bgcolor: "#fff", color: "#0c3d47",
                fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 14,
                px: 3.5, py: 1.5, borderRadius: "12px", whiteSpace: "nowrap",
                "&:hover": { bgcolor: "#e8f5f3" },
              }}>PLACE BULK ORDER</Button>
          </Box>
        </MotionBox>
        <CustomerReviewsSection />
        </Container>

    {/* ── FOOTER TRUST STRIP ── full width */}
      <Box  sx={{
        display: "flex", justifyContent: "space-around", alignItems: "center",
        bgcolor: "#fcfaf8",
        borderBottom: "1.5px solid #e8d4c0",
        py: 3.5, px: { xs: 4, md: 8 },
        flexWrap: "wrap", gap: 3,
      }}>
        {[
          { src: "/img/freshly.svg",  label: "Freshly Made",     sub: "Every Day"  },
          { src: "/img/hygiene.svg",  label: "Hygienically",     sub: "Prepared"   },
          { src: "/img/pack.svg",     label: "Secure & Safe",    sub: "Packaging"  },
          { src: "/img/delivery.svg", label: "On-time",          sub: "Delivery"   },
          { src: "/img/address.svg",  label: "10 KM Delivery",   sub: "in Madurai" },
          { src: "/img/trust.svg",    label: "Trusted by 1000+", sub: "Families"   },
        ].map(item => (
          <Box
            key={item.label}
            display="flex"
            alignItems="center"
            gap={1.5}
          >
            {/* Dark maroon circle with gold SVG icon */}
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "var(--primary-teal-dark)",          /* #3A1204 deep maroon */
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 3px 12px rgba(58,18,4,0.22)",
            }}>
              <Box
                component="img"
                src={item.src}
                alt={item.label}
                sx={{
                  width: 26,
                  height: 26,
                  objectFit: "contain",
                  filter:
                    "brightness(0) saturate(100%) invert(84%) sepia(28%) saturate(450%) hue-rotate(345deg) brightness(105%) contrast(92%)",
                }}
              />
            </Box>

            {/* Text */}
            <Box>
              <Typography
                fontSize={12.5}
                fontWeight={700}
                color="var(--dbr)"
                fontFamily="'Sora', sans-serif"
                lineHeight={1.25}
              >
                {item.label}
              </Typography>
              <Typography
                fontSize={11.5}
                color="var(--muted)"
                fontFamily="'Sora', sans-serif"
                lineHeight={1.25}
              >
                {item.sub}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* ── BULK ORDER DIALOG ── */}
      <Dialog open={bulkOpen} onClose={() => setBulkOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle sx={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 24, color: "#3A1204", pb: 0 }}>
          Bulk Order Request
        </DialogTitle>
        <DialogContent>
          <Typography fontSize={13} color="#9e7060" mb={3} mt={0.5} fontFamily="'Sora', sans-serif">
            Fill in your details and we'll get back to you within 2 hours.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Your Name" value={bulkName}
                onChange={e => setBulkName(e.target.value)} size="small" sx={dlgField} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Phone Number" value={bulkPhone}
                onChange={e => setBulkPhone(e.target.value.replace(/\D/, "").slice(0, 10))}
                size="small" sx={dlgField} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Product" value={product.name} disabled size="small" sx={dlgField} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Quantity (pieces)" type="number" value={bulkQty}
                onChange={e => setBulkQty(Number(e.target.value))} size="small"
                inputProps={{ min: 20 }} sx={dlgField} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Special Note (optional)" value={bulkNote}
                onChange={e => setBulkNote(e.target.value)} size="small" multiline rows={3}
                placeholder="Delivery date, event type, special requirements..." sx={dlgField} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setBulkOpen(false)}
            sx={{ color: "#999", fontFamily: "'Sora', sans-serif", fontWeight: 600, borderRadius: "12px" }}>
            Cancel
          </Button>
          <Button onClick={() => { setBulkOpen(false); setSnackOpen(true); }}
            variant="contained" disabled={!bulkName || bulkPhone.length < 10}
            sx={{ borderRadius: "12px", bgcolor: "#3A1204", fontFamily: "'Sora', sans-serif", fontWeight: 700, px: 4, py: 1.2, "&:hover": { bgcolor: "#5C2008" } }}>
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackOpen} autoHideDuration={4000} onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" sx={{ borderRadius: 3, fontFamily: "'Sora', sans-serif" }}>
          🎉 Bulk order submitted! We'll call you shortly.
        </Alert>
      </Snackbar>
      <Snackbar open={cartSnack} autoHideDuration={3000} onClose={() => setCartSnack(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" sx={{ borderRadius: 3, fontFamily: "'Sora', sans-serif" }}>
          🛒 Added {qty} × {selectedPack.label} {product.name} to cart!
        </Alert>
      </Snackbar>
    </Box>
  );
}

const dlgField = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px", fontFamily: "'Sora', sans-serif",
    "& fieldset": { borderColor: "#d4b9a8" },
    "&:hover fieldset": { borderColor: "#5C2008" },
    "&.Mui-focused fieldset": { borderColor: "#3A1204" },
  },
  "& .MuiInputLabel-root": { fontFamily: "'Sora', sans-serif" },
};
