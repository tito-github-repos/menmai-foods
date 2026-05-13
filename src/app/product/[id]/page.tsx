"use client";

import { useParams, notFound } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Chip,
  Divider,
  IconButton,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Rating,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import HomeIcon from "@mui/icons-material/Home";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import GrainIcon from "@mui/icons-material/Grain";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const products: Record<string, any> = {
  chapathi: {
    name: "Chapathi",
    badge: "FRESH & SOFT",
    desc: "Soft homemade chapathi prepared fresh daily with traditional taste and no preservatives. Made with pure ingredients to bring you the comfort of home.",
    mrp: 50,
    images: ["/img/products/chapathi1.jpeg", "/img/products/chapathi2.jpeg", "/img/products/chapathi3.jpeg"],
    packs: [
      { label: "Pack of 10 PCS", sublabel: "Perfect for a family meal", price: 40 },
    ],
    nutrition: [
      { label: "Energy", value: "297 kcal" },
      { label: "Carbohydrates", value: "54.0 g" },
      { label: "Protein", value: "8.8 g" },
      { label: "Fat", value: "5.3 g" },
      { label: "Dietary Fiber", value: "6.6 g" },
      { label: "Sugar", value: "0 g" },
    ],
    cookSteps: [
      { title: "Preheat Pan", desc: "Heat tawa on medium flame for 2 min.", img: "/img/procedure/cpan_heat.png" },
      { title: "Place Chapathi", desc: "Lay flat, cook until bubbles form.", img: "/img/procedure/c_place.png" },
      { title: "Flip & Cook", desc: "Cook both sides evenly, ~30 sec each.", img: "/img/procedure/c_flip.png" },
      { title: "Serve Fresh", desc: "Serve hot with ghee or curry.", img: "/img/procedure/c_serve.png" },
    ],
    cookTip: "For extra softness, apply a little ghee or butter while serving.",
    highlights: [
      { icon: "grain", label: "100%\nWhole Wheat" },
      { icon: "block", label: "Zero Maida\nPure & Natural" },
      { icon: "smile", label: "Soft & Tasty\nEvery Time" },
      { icon: "time", label: "Ready in\nJust 2 Minutes" },
      { icon: "heart", label: "Loved by 1000+\nHappy Families" },
    ],
    reviews: [
      { name: "Priya, Madurai", rating: 5, text: "Chapathi is so soft and fresh. Tastes just like homemade!" },
      { name: "Karthik, Madurai", rating: 5, text: "Perfect for our daily meals. Very soft and healthy." },
      { name: "Meena, Madurai", rating: 5, text: "Very hygienic and convenient. Saves time and tastes great." },
    ],
  },
  poori: {
    name: "Poori",
    badge: "CRISPY & GOLDEN",
    desc: "Crispy golden poori, puffed to perfection and made fresh with traditional recipes.",
    mrp: 55,
    images: ["/img/products/poori1.jpeg", "/img/products/poori2.jpeg"],
    packs: [
      { label: "Pack of 15 PCS", sublabel: "Perfect for a family meal", price: 45 },
    ],
    nutrition: [
      { label: "Energy", value: "320 kcal" },
      { label: "Carbohydrates", value: "48.0 g" },
      { label: "Protein", value: "7.2 g" },
      { label: "Fat", value: "11.0 g" },
      { label: "Dietary Fiber", value: "3.2 g" },
      { label: "Sugar", value: "0 g" },
    ],
    cookSteps: [
      { title: "Heat Oil", desc: "Pour oil in kadai, heat on high flame.", img: "/img/procedure/ppan_heat.png" },
      { title: "Slide In Poori", desc: "Gently slide poori into hot oil.", img: "/img/procedure/p_place.png" },
      { title: "Press & Puff", desc: "Press lightly until poori puffs up.", img: "/img/procedure/p_flip.png" },
      { title: "Drain & Serve", desc: "Drain oil, serve with masala.", img: "/img/procedure/p_serve.png" },
    ],
    cookTip: "Use fresh oil for best results and a perfect golden color.",
    highlights: [
      { icon: "grain", label: "Pure Wheat\nFlour" },
      { icon: "block", label: "No Artificial\nColor" },
      { icon: "smile", label: "Crispy & Light\nEvery Time" },
      { icon: "time", label: "Ready in\nJust 3 Minutes" },
      { icon: "heart", label: "Loved by 1000+\nHappy Families" },
    ],
    reviews: [
      { name: "Priya, Madurai", rating: 5, text: "Perfectly puffed every time, just like restaurant quality!" },
      { name: "Ravi, Madurai", rating: 5, text: "Great for Sunday breakfast. My kids love it." },
      { name: "Lakshmi, Madurai", rating: 5, text: "Fresh and crispy. Best poori I've had in a long time!" },
    ],
  },
};

const BRAND_DARK = "var(--dbr)";
const BRAND_MID = "var(--brown)";
const BRAND_ACCENT = "var(--or)";
const BRAND_LIGHT = "var(--cream)";
const BRAND_CHIP_BG = "var(--glt)";
const BRAND_TEAL = "var(--primary-teal-dark)";

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const product = products[id];
  if (!id || !product) return notFound();

  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(product.images[0]);
  const [imgIndex, setImgIndex] = useState(0);
  const [pincode, setPincode] = useState("");
  const [pincodeMsg, setPincodeMsg] = useState<"valid" | "invalid" | "">("");
  const [selectedPack, setSelectedPack] = useState(product.packs[0]);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkQty, setBulkQty] = useState(50);
  const [bulkName, setBulkName] = useState("");
  const [bulkPhone, setBulkPhone] = useState("");
  const [bulkNote, setBulkNote] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [cartSnack, setCartSnack] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);

  const discount = Math.round(((product.mrp - selectedPack.price) / product.mrp) * 100);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % product.cookSteps.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [product.cookSteps.length]);

  const handlePincodeCheck = () => {
    setPincodeMsg(pincode.length === 6 ? "valid" : "invalid");
  };

  const handlePrev = () => {
    const newIndex = imgIndex === 0 ? product.images.length - 1 : imgIndex - 1;
    setImgIndex(newIndex);
    setImg(product.images[newIndex]);
  };

  const handleNext = () => {
    const newIndex = imgIndex === product.images.length - 1 ? 0 : imgIndex + 1;
    setImgIndex(newIndex);
    setImg(product.images[newIndex]);
  };

  const highlightIcons: Record<string, React.ReactNode> = {
    grain: <GrainIcon sx={{ fontSize: 28, color: BRAND_ACCENT }} />,
    block: <BlockIcon sx={{ fontSize: 28, color: BRAND_ACCENT }} />,
    smile: <span style={{ fontSize: 26 }}>🙂</span>,
    time: <AccessTimeOutlinedIcon sx={{ fontSize: 28, color: BRAND_ACCENT }} />,
    heart: <FavoriteBorderOutlinedIcon sx={{ fontSize: 28, color: BRAND_ACCENT }} />,
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#fff",
        color: "var(--text)",
        fontFamily: "var(--font-heading)",
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>

        {/* BREADCRUMB */}
        <Box display="flex" alignItems="center" gap={0.5} mb={3}>
          {["Home", "Products", product.name].map((crumb, i, arr) => (
            <Box key={crumb} display="flex" alignItems="center" gap={0.5}>
              <Typography
                fontSize={13}
                color={i === arr.length - 1 ? BRAND_DARK : "#9e7060"}
                fontWeight={i === arr.length - 1 ? 700 : 400}
                sx={{ cursor: i < arr.length - 1 ? "pointer" : "default" }}
              >
                {crumb}
              </Typography>
              {i < arr.length - 1 && <Typography fontSize={12} color="#ccc">›</Typography>}
            </Box>
          ))}
        </Box>

        {/* MAIN PRODUCT SECTION */}
        <Grid container spacing={4} alignItems="flex-start">

          {/* LEFT: Images */}
          <Grid item xs={12} md={5}>
            {/* Main Image */}
            <Box
              sx={{
                position: "relative",
                borderRadius: 4,
                overflow: "hidden",
                aspectRatio: "1/1",
                bgcolor: "#f5ede4",
                boxShadow: "0 8px 32px rgba(59,31,14,0.10)",
                "&:hover .navArrow": { opacity: 1 },
              }}
            >
              <Box
                component="img"
                src={img}
                alt={product.name}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <IconButton
                onClick={handlePrev}
                className="navArrow"
                sx={{
                  position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                  bgcolor: "rgba(255,255,255,0.85)", color: BRAND_DARK, opacity: 0, transition: "0.25s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)", fontSize: 20, fontWeight: 700,
                  "&:hover": { bgcolor: "#fff" },
                }}
              >‹</IconButton>
              <IconButton
                onClick={handleNext}
                className="navArrow"
                sx={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  bgcolor: "rgba(255,255,255,0.85)", color: BRAND_DARK, opacity: 0, transition: "0.25s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)", fontSize: 20, fontWeight: 700,
                  "&:hover": { bgcolor: "#fff" },
                }}
              >›</IconButton>
            </Box>

            {/* Thumbnails */}
            <Box display="flex" gap={1.5} mt={2}>
              {product.images.map((src: string, i: number) => (
                <Box
                  key={i}
                  component="img"
                  src={src}
                  onClick={() => { setImg(src); setImgIndex(i); }}
                  sx={{
                    width: 72, height: 72, borderRadius: 2, objectFit: "cover", cursor: "pointer",
                    border: img === src ? `2.5px solid ${BRAND_DARK}` : "2.5px solid transparent",
                    opacity: img === src ? 1 : 0.65,
                    transition: "0.2s", "&:hover": { opacity: 1 },
                  }}
                />
              ))}
            </Box>
          </Grid>

          {/* CENTER: Product Info */}
          <Grid item xs={12} md={4.5}>
            <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

              {/* Badge */}
              <Box
                sx={{
                  display: "inline-block",
                  bgcolor: BRAND_TEAL,
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  px: 1.5,
                  py: 0.4,
                  borderRadius: 1,
                  mb: 1.5,
                  fontFamily: "var(--font-main)",
                }}
              >
                {product.badge}
              </Box>

              {/* Name */}
              <Typography
                sx={{
                  fontFamily: "var(--font-heading)",
                  fontSize: { xs: 36, md: 48 },
                  fontWeight: 900,
                  color: BRAND_DARK,
                  lineHeight: 1,
                  letterSpacing: "-1px",
                  mb: 0.5,
                }}
              >
                {product.name}
              </Typography>

                <Box
                sx={{
                  display:"inline-flex",
                  alignItems:"center",
                  width:"fit-content",
                  gap: 1,
                  mb:1.5,
                }}>
                  <Box
                    sx={{
                      height: 2,
                      flex:1,
                      minwidth: 70,
                      bgcolor: BRAND_ACCENT,
                      borderRadius: 1,
                    }}
                  />

                  <Box
                    component="img"
                    src="/img/dec_wheat.svg"
                    alt="wheat"
                    sx={{
                      width: 22,
                      height: 22,
                      objectFit: "contain",

                      // convert vertical svg to horizontal
                      transform: "rotate(90deg)",

                      opacity: 0.9,
                    }}
                  />

                  <Box
                    sx={{
                      height: 2,
                      flex:1,
                      minwidth: 70,
                      bgcolor: BRAND_ACCENT,
                      borderRadius: 1,
                    }}
                  />
                </Box>
              {/* Rating */}
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Rating value={4.8} precision={0.1} readOnly size="small" sx={{ color: "#f5a623" }} />
                <Typography fontSize={13} fontWeight={700} color="#f5a623">4.8</Typography>
                <Typography fontSize={13} color="#bbb">(120 reviews)</Typography>
              </Box>

              {/* Trust chips */}
              <Box display="flex" gap={1} flexWrap="wrap" mb={2.5}>
                {[
                  { icon: <LocalFireDepartmentIcon sx={{ fontSize: 14 }} />, label: "Fresh Today" },
                  { icon: <BlockIcon sx={{ fontSize: 14 }} />, label: "No Preservatives" },
                  { icon: <HomeIcon sx={{ fontSize: 14 }} />, label: "Homemade" },
                ].map((b) => (
                  <Chip
                    key={b.label}
                    icon={b.icon}
                    label={b.label}
                    size="small"
                    sx={{
                      bgcolor: BRAND_CHIP_BG, color: BRAND_MID, fontWeight: 600,
                      fontSize: 11.5, fontFamily: "'Sora', sans-serif",
                      border: `1px solid #f0d8c4`,
                    }}
                  />
                ))}
              </Box>

              {/* Description */}
              <Typography fontSize={14} color="#7a5140" lineHeight={1.75} mb={3}>
                {product.desc}
              </Typography>

               
              {/* Price */}
              <Box mt={3} display="flex" alignItems="center" gap={1.5} mb={1.5}>
                <Typography
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 40,
                    fontWeight: 900,
                    color: BRAND_DARK,
                    lineHeight: 1,
                  }}
                >
                  ₹{selectedPack.price * qty}
                </Typography>
                <Typography
                  fontSize={16}
                  sx={{ textDecoration: "line-through", color: "#bbb", mt: 0.5 }}
                >
                  ₹{product.mrp}
                </Typography>
                <Chip
                  label={`${discount}% OFF`}
                  size="small"
                  sx={{
                    bgcolor: "#fde8c8",
                    color: "#c05e00",
                    fontWeight: 800,
                    fontSize: 12,
                    fontFamily: "'Playfair Display', serif",
                  }}
                />
              </Box>

              {/* Quantity */}
              <Typography fontSize={11.5} fontWeight={700} color={BRAND_DARK} letterSpacing={1} mb={1} fontFamily="var(--primary-heading)" gap={1.5}>
                QUANTITY
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Box
                  sx={{
                    display: "flex", alignItems: "center",
                    border: `1.5px solid #d4b9a8`, borderRadius: "12px", overflow: "hidden", bgcolor: "#fff",
                  }}
                >
                  <IconButton size="small" onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                    sx={{ borderRadius: 0, px: 1.5, "&:hover": { bgcolor: "#faf0e8" } }}>
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography px={2.5} fontWeight={700} fontSize={16} color={BRAND_DARK}>{qty}</Typography>
                  <IconButton size="small" onClick={() => setQty(qty + 1)}
                    sx={{ borderRadius: 0, px: 1.5, "&:hover": { bgcolor: "#faf0e8" } }}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography fontSize={13} color="#999">
                  Total: <strong style={{ color: BRAND_DARK, fontSize: 16 }}>₹{selectedPack.price * qty}</strong>
                </Typography>
              </Box>

              {/* Pincode */}
              <Typography fontSize={11.5} fontWeight={700} color={BRAND_DARK} letterSpacing={1} mb={1} fontFamily="'Sora', sans-serif">
                CHECK DELIVERY
              </Typography>
              <Box display="flex" gap={1.5} alignItems="center" mb={1}>
                <TextField
                  size="small"
                  placeholder="Enter 6-digit pincode"
                  value={pincode}
                  onChange={(e) => { setPincode(e.target.value.replace(/\D/, "").slice(0, 6)); setPincodeMsg(""); }}
                  inputProps={{ maxLength: 6 }}
                  sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px", fontFamily: "'Sora', sans-serif",
                      "& fieldset": { borderColor: "#d4b9a8" },
                      "&:hover fieldset": { borderColor: BRAND_MID },
                      "&.Mui-focused fieldset": { borderColor: BRAND_DARK },
                    },
                  }}
                />
                <Button onClick={handlePincodeCheck} variant="contained"
                  sx={{
                    borderRadius: "10px", bgcolor: BRAND_DARK, fontFamily: "'Sora', sans-serif",
                    fontWeight: 700, fontSize: 13, px: 2.5, "&:hover": { bgcolor: BRAND_MID },
                  }}>
                  CHECK
                </Button>
              </Box>
              {pincodeMsg === "valid" && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <CheckCircleOutlineIcon sx={{ fontSize: 15, color: "green" }} />
                  <Typography fontSize={12.5} color="green">Delivery available in your area!</Typography>
                </Box>
              )}
              {pincodeMsg === "invalid" && (
                <Typography fontSize={12.5} color="red">❌ Enter a valid 6-digit pincode.</Typography>
              )}

              {/* CTA Buttons */}
              <Box mt={3} display="flex" flexDirection="column" gap={1.5}>
                <Button
                  fullWidth variant="outlined"
                  onClick={() => setBulkOpen(true)}
                  startIcon={<LocalShippingOutlinedIcon />}
                  sx={{
                    borderRadius: "12px", borderColor: BRAND_DARK, borderWidth: 2,
                    color: BRAND_DARK, fontFamily: "'Sora', sans-serif", fontWeight: 700,
                    fontSize: 13.5, py: 1.3, letterSpacing: 0.5,
                    "&:hover": { bgcolor: BRAND_CHIP_BG, borderWidth: 2 },
                  }}
                >
                  BULK ORDER
                </Button>
                <MotionBox whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    fullWidth variant="contained"
                    startIcon={<ShoppingCartOutlinedIcon />}
                    onClick={() => setCartSnack(true)}
                    sx={{
                      borderRadius: "12px", py: 1.7,
                      fontFamily: "'Sora', sans-serif", fontWeight: 800,
                      fontSize: 15, letterSpacing: 0.5,
                      background: `linear-gradient(135deg, ${BRAND_DARK} 0%, ${BRAND_MID} 100%)`,
                      boxShadow: "0 8px 24px rgba(59,31,14,0.28)",
                      "&:hover": { background: `linear-gradient(135deg, ${BRAND_MID} 0%, #8b4a25 100%)` },
                    }}
                  >
                    ADD TO CART &nbsp; ₹{selectedPack.price * qty}
                  </Button>
                </MotionBox>
              </Box>

              {/* Secure Checkout Strip */}
              <Box
                display="flex" justifyContent="center" alignItems="center" gap={2} mt={2}
                sx={{
                  bgcolor: "#f5ede4", borderRadius: 2, py: 1, px: 2,
                  border: "1px solid #e8d4c0",
                }}
              >
                {[
                  { icon: <SecurityOutlinedIcon sx={{ fontSize: 14, color: BRAND_ACCENT }} />, label: "Secure checkout" },
                  { icon: <VerifiedOutlinedIcon sx={{ fontSize: 14, color: BRAND_ACCENT }} />, label: "Easy returns" },
                  { icon: <CheckCircleOutlineIcon sx={{ fontSize: 14, color: BRAND_ACCENT }} />, label: "100% satisfaction guaranteed" },
                ].map((item) => (
                  <Box key={item.label} display="flex" alignItems="center" gap={0.4}>
                    {item.icon}
                    <Typography fontSize={11} color="#7a5140" fontFamily="'Sora', sans-serif">{item.label}</Typography>
                  </Box>
                ))}
              </Box>
            </MotionBox>
          </Grid>

          {/* RIGHT: Nutritional Facts */}
          <Grid item xs={12} md={2.5}>
            <MotionPaper
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              elevation={0}
              sx={{
                border: "2px solid #e8d4c0", borderRadius: 4, p: 2.5,
                bgcolor: "#fff", position: "sticky", top: 90,
              }}
            >
              <Typography
                sx={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 900, fontSize: 15, color: BRAND_DARK,
                  borderBottom: `2px solid ${BRAND_DARK}`, pb: 1, mb: 0.5,
                }}
              >
                NUTRITIONAL FACTS
              </Typography>
              <Typography fontSize={11} color="#9e7060" mb={2} fontFamily="'Sora', sans-serif">
                (Per 100g approx.)
              </Typography>
              <Table size="small" sx={{ "& td": { px: 0, py: 0.6, borderColor: "#f0dfd0", fontFamily: "'Sora', sans-serif", fontSize: 12 } }}>
                <TableBody>
                  {product.nutrition.map((n: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell sx={{ color: "#7a5140" }}>{n.label}</TableCell>
                      <TableCell align="right" sx={{ color: BRAND_DARK, fontWeight: 700 }}>{n.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box
                mt={2.5}
                sx={{
                  bgcolor: "#fce8d5", borderRadius: 3, p: 1.5, textAlign: "center",
                }}
              >
                <span style={{ fontSize: 22 }}>🌾</span>
                <Typography fontSize={12} fontWeight={700} color={BRAND_DARK} fontFamily="'Sora', sans-serif" mt={0.5}>
                  Goodness of whole wheat for a healthy you!
                </Typography>
              </Box>
            </MotionPaper>
          </Grid>
        </Grid>

        {/* HIGHLIGHTS STRIP */}
        <Box
          mt={6}
          sx={{
            display: "flex", justifyContent: "space-around", alignItems: "center",
            bgcolor: "#fff", borderRadius: 4, py: 3, px: { xs: 2, md: 4 },
            border: "1.5px solid #f0dfd0", flexWrap: "wrap", gap: 3,
          }}
        >
          {product.highlights.map((h: any, i: number) => (
            <Box key={i} textAlign="center" sx={{ flex: "0 0 auto" }}>
              <Box mb={0.5}>{highlightIcons[h.icon]}</Box>
              {h.label.split("\n").map((line: string, j: number) => (
                <Typography key={j} fontSize={j === 0 ? 13 : 11.5} fontWeight={j === 0 ? 700 : 400}
                  color={j === 0 ? BRAND_DARK : "#9e7060"} fontFamily="'Sora', sans-serif" lineHeight={1.4}>
                  {line}
                </Typography>
              ))}
            </Box>
          ))}
        </Box>

        {/* HOW TO COOK */}
        <Box mt={8}>
          <Box textAlign="center" mb={6}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={1}>
              <Box sx={{ height: 1, width: 50, bgcolor: "#d4b9a8" }} />
              <span style={{ fontSize: 18, color: BRAND_ACCENT }}>🌾</span>
              <Typography
                sx={{ fontFamily: "var(--font-heading)", fontSize: { xs: 28, md: 36 }, fontWeight: 900, color: BRAND_DARK }}
              >
                HOW TO COOK
              </Typography>
              <span style={{ fontSize: 18, color: BRAND_ACCENT }}>🌾</span>
              <Box sx={{ height: 1, width: 50, bgcolor: "#d4b9a8" }} />
            </Box>
            <Typography fontSize={14} color="#9e7060" fontFamily="'Sora', sans-serif">
              From dough to delight in minutes
            </Typography>
          </Box>

          <Box sx={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start",flexWrap: { xs: "nowrap", md: "nowrap" },
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 5, md: 2 },
          px: { xs: 2, md: 4 }, }}>
            {/* Dashed path */}
            {/* Dotted Path */}
              {/* <svg
                viewBox="0 0 1000 120"
                preserveAspectRatio="none"
                style={{
                  position: "absolute",
                  top: 52,
                  left: 0,
                  width: "92%", // prevent touching TIP card
                  height: 120,
                  zIndex: 1,
                  pointerEvents: "none",
                  overflow: "visible",
                }}
              > */}
                {/* Soft Glow */}
                {/* <motion.path
                  d="M50 150 C200 0, 600 300, 750 100"
                  fill="none"
                  stroke="rgba(224,123,57,0.12)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="0.1 14"
                  filter="blur(6px)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2 }}
                /> */}

                {/* REAL DOTTED LINE */}
                {/* <motion.path
                  d="
                    M20 65
                    C140 25, 220 25, 300 65
                    S460 105, 560 60
                    S700 20, 840 55
                  "
                  fill="none"
                  stroke={BRAND_ACCENT}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="5 12"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                  }}
                />
              </svg> */}
            <svg
              viewBox="0 0 1000 160"
              preserveAspectRatio="none"
              style={{
                position: "absolute",
                top: 55,
                left: "4%",
                width: "74%",
                height: 120,
                zIndex: 1,
                pointerEvents: "none",
                overflow: "visible",
              }}
            >
              <motion.path
                d="
                  M20 70
                  C180 20, 320 20, 460 70
                  S700 120, 860 70
                "
                stroke={BRAND_ACCENT}
                strokeWidth="3"
                fill="transparent"
                strokeLinecap="round"

                /* DASH STYLE */
                strokeDasharray="4 16"

                /* INITIAL OFFSET */
                strokeDashoffset="120"

                /* ANIMATION */
                animate={{
                  strokeDashoffset: 0,
                }}

                transition={{
                  duration: 2,
                  ease: "easeOut",
                }}
              />
                          </svg>
            {product.cookSteps.map((step: any, i: number) => {
              const isActive = activeStep === i;
              return (
                <MotionBox
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  sx={{ textAlign: "center", flex: "1 1 140px", maxWidth: 180, position: "relative", zIndex: 2 }}
                >
                  <MotionBox
                    animate={{
                      scale: isActive ? 1.04 : 0.9,
                      opacity: isActive ? 1 : 0.38,
                    }}
                    transition={{ duration: 0.45 }}
                    sx={{
                      width: 120,
                      height: 120,
                      mx: "auto",
                      mb: 1.2,
                      borderRadius: "50%",
                      overflow: "visible",
                      position: "relative",

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      bgcolor: "#fff",

                      border: isActive
                        ? `1.5px solid ${BRAND_ACCENT}`
                        : "1px solid rgba(224,123,57,0.08)",

                      boxShadow: isActive
                        ? `
                          0 0 0 1px rgba(224,123,57,0.10),
                          0 0 18px rgba(224,123,57,0.22),
                          0 8px 24px rgba(224,123,57,0.12)
                        `
                        : "0 4px 14px rgba(0,0,0,0.03)",

                      transition: "all 0.45s ease",
                      zIndex: 3,

                      "&::before": isActive
                        ? {
                            content: '""',
                            position: "absolute",
                            inset: -10,
                            borderRadius: "50%",
                            background:
                              "radial-gradient(circle, rgba(255,166,77,0.22) 0%, rgba(255,166,77,0.08) 45%, transparent 75%)",
                            zIndex: -1,
                            filter: "blur(8px)",
                          }
                        : {},
                    }}
                  >
                    <Box
                      component="img"
                      src={step.img}
                      alt={step.title}
                      sx={{
                        width: 76,
                        height: 76,
                        objectFit: "contain",
                        filter: isActive
                          ? "drop-shadow(0 4px 10px rgba(224,123,57,0.28))"
                          : "none",
                      }}
                    />
                  </MotionBox>

                  <Box
                    sx={{
                      width: 24, height: 24, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${BRAND_ACCENT}, ${BRAND_MID})`,
                      color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                      mx: "auto", mb: 1, fontWeight: 700, fontSize: 12,
                      fontFamily: "'Sora', sans-serif",
                    }}
                  >{i + 1}</Box>

                  <Typography fontWeight={800} fontSize={14} color={isActive ? BRAND_DARK : "#9e7060"}
                    fontFamily="'Playfair Display', serif" mb={0.3}>
                    {step.title}
                  </Typography>
                  <Typography fontSize={12} color="#9e7060" lineHeight={1.5} fontFamily="'Sora', sans-serif">
                    {step.desc}
                  </Typography>
                </MotionBox>
              );
            })}

            {/* Tip card */}
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              sx={{
                flex: "1 1 140px", maxWidth: 180,
                bgcolor: "#fff8f2", border: `1.5px dashed ${BRAND_ACCENT}`,
                borderRadius: 4, p: 2.5, textAlign: "center", position: "relative", zIndex: 2,
              }}
            >
              <Typography fontSize={11} fontWeight={700} color={BRAND_ACCENT} letterSpacing={1.5}
                mb={1} fontFamily="'Sora', sans-serif">TIP</Typography>
              <Box component="img" src="/img/procedure/c_serve.png" alt="tip"
                sx={{ width: 55, height: 55, objectFit: "contain", opacity: 0.6, mb: 1 }} />
              <Typography fontSize={12} color="#7a5140" lineHeight={1.6} fontFamily="'Sora', sans-serif">
                {product.cookTip}
              </Typography>
            </MotionBox>
          </Box>
        </Box>

        {/* BULK ORDER BANNER */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          mt={8}
          sx={{
            background: `linear-gradient(135deg, ${BRAND_TEAL} 0%, #0f2e2b 100%)`,
            borderRadius: 5, p: { xs: 3, md: 4.5 },
            display: "flex", flexDirection: { xs: "column", md: "row" },
            alignItems: "center", gap: 3,
          }}
        >
          <Box sx={{ flexShrink: 0, display: { xs: "none", md: "block" } }}>
            <Box
              sx={{
                width: 80, height: 80, borderRadius: 3,
                bgcolor: "rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 40,
              }}
            >📦</Box>
          </Box>

          <Box flex={1}>
            <Typography
              sx={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: { xs: 22, md: 28 }, color: "#fff", mb: 0.5 }}>
              ORDER IN BULK
            </Typography>
            <Typography fontSize={14} sx={{ color: "rgba(255,255,255,0.75)", mb: 2 }} fontFamily="'Sora', sans-serif">
              We cater events, offices, and celebrations. Freshly made to order, delivered on time.
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap">
              {[
                { icon: "📦", label: "Custom Quantity" },
                { icon: "🚚", label: "On-time Delivery" },
                { icon: "🏷️", label: "Special Pricing" },
                { icon: "👤", label: "Personal Support" },
              ].map((item) => (
                <Box key={item.label} display="flex" alignItems="center" gap={0.6}>
                  <span style={{ fontSize: 15 }}>{item.icon}</span>
                  <Typography fontSize={12.5} color="rgba(255,255,255,0.8)" fontFamily="'Sora', sans-serif">
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: { xs: "stretch", md: "flex-end" }, gap: 1.5 }}>
            <Button
              onClick={() => setBulkOpen(true)}
              startIcon={<WhatsAppIcon />}
              sx={{
                bgcolor: "#fff", color: BRAND_TEAL,
                fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 14,
                px: 3.5, py: 1.5, borderRadius: "12px", whiteSpace: "nowrap",
                "&:hover": { bgcolor: "#e8f5f3" },
              }}
            >
              PLACE BULK ORDER
            </Button>
            <Typography fontSize={11.5} color="rgba(255,255,255,0.6)" textAlign="center" fontFamily="'Sora', sans-serif">
              Get a quick response on WhatsApp
            </Typography>
          </Box>
        </MotionBox>

        {/* CUSTOMER REVIEWS */}
        <Box mt={8}>
          <Box textAlign="center" mb={5}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={1}>
              <Box sx={{ height: 1, width: 50, bgcolor: "#d4b9a8" }} />
              <span style={{ fontSize: 18, color: BRAND_ACCENT }}>🌾</span>
              <Typography sx={{ fontFamily: "var(--font-heading", fontSize: { xs: 24, md: 32 }, fontWeight: 900, color: BRAND_DARK }}>
                WHAT OUR CUSTOMERS SAY
              </Typography>
              <span style={{ fontSize: 18, color: BRAND_ACCENT }}>🌾</span>
              <Box sx={{ height: 1, width: 50, bgcolor: "#d4b9a8" }} />
            </Box>
          </Box>

          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={() => setReviewIndex(reviewIndex === 0 ? product.reviews.length - 1 : reviewIndex - 1)}
              sx={{
                position: "absolute", left: -16, top: "50%", transform: "translateY(-50%)",
                bgcolor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.1)", zIndex: 2,
                "&:hover": { bgcolor: "#faf0e8" },
              }}
            >‹</IconButton>

            <Grid container spacing={3} justifyContent="center">
              {product.reviews.map((r: any, i: number) => {
                const offset = (i - reviewIndex + product.reviews.length) % product.reviews.length;
                const isCenter = offset === 0;
                return (
                  <Grid item xs={12} sm={4} key={i}>
                    <MotionPaper
                      elevation={0}
                      sx={{
                        p: 3, borderRadius: 4, textAlign: "center",
                        border: isCenter ? `2px solid ${BRAND_ACCENT}` : "1.5px solid #f0dfd0",
                        bgcolor: isCenter ? "#fff8f2" : "#fff",
                        transition: "0.3s",
                      }}
                    >
                      <Box
                        sx={{
                          width: 52, height: 52, borderRadius: "50%",
                          bgcolor: BRAND_CHIP_BG, mx: "auto", mb: 1.5,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 22,
                        }}
                      >
                        👤
                      </Box>
                      <Rating value={r.rating} readOnly size="small" sx={{ color: "#f5a623", mb: 1 }} />
                      <Typography fontSize={13.5} color="#5a3920" lineHeight={1.65} mb={1.5}
                        fontFamily="'Playfair Display', serif" fontStyle="italic">
                        "{r.text}"
                      </Typography>
                      <Typography fontSize={12.5} fontWeight={700} color={BRAND_ACCENT}
                        fontFamily="'Sora', sans-serif">
                        – {r.name}
                      </Typography>
                    </MotionPaper>
                  </Grid>
                );
              })}
            </Grid>

            <IconButton
              onClick={() => setReviewIndex((reviewIndex + 1) % product.reviews.length)}
              sx={{
                position: "absolute", right: -16, top: "50%", transform: "translateY(-50%)",
                bgcolor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.1)", zIndex: 2,
                "&:hover": { bgcolor: "#faf0e8" },
              }}
            >›</IconButton>
          </Box>

          {/* Dots */}
          <Box display="flex" justifyContent="center" gap={1} mt={3}>
            {product.reviews.map((_: any, i: number) => (
              <Box
                key={i}
                onClick={() => setReviewIndex(i)}
                sx={{
                  width: i === reviewIndex ? 20 : 8, height: 8, borderRadius: 4,
                  bgcolor: i === reviewIndex ? BRAND_ACCENT : "#d4b9a8",
                  cursor: "pointer", transition: "0.3s",
                }}
              />
            ))}
          </Box>
        </Box>

        {/* FOOTER TRUST STRIP */}
        <Box
          mt={6}
          sx={{
            display: "flex", justifyContent: "space-around", alignItems: "center",
            bgcolor: "#fff", borderRadius: 4, py: 3, px: { xs: 2, md: 4 },
            border: "1.5px solid #f0dfd0", flexWrap: "wrap", gap: 3,
          }}
        >
          {[
            { icon: "🔥", label: "Freshly Made", sub: "Every Day" },
            { icon: "🧼", label: "Hygienically", sub: "Prepared" },
            { icon: "📦", label: "Secure & Safe", sub: "Packaging" },
            { icon: "🚚", label: "On-time", sub: "Delivery" },
            { icon: "📍", label: "10 KM Delivery", sub: "in Madurai" },
            { icon: "🏠", label: "Trusted by 1000+", sub: "Families" },
          ].map((item) => (
            <Box key={item.label} textAlign="center">
              <Typography fontSize={24} mb={0.3}>{item.icon}</Typography>
              <Typography fontSize={12.5} fontWeight={700} color={BRAND_DARK} fontFamily="'Sora', sans-serif">{item.label}</Typography>
              <Typography fontSize={11.5} color="#9e7060" fontFamily="'Sora', sans-serif">{item.sub}</Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* BULK ORDER DIALOG */}
      <Dialog open={bulkOpen} onClose={() => setBulkOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle sx={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 24, color: BRAND_DARK, pb: 0 }}>
          Bulk Order Request
        </DialogTitle>
        <DialogContent>
          <Typography fontSize={13} color="#9e7060" mb={3} mt={0.5} fontFamily="'Sora', sans-serif">
            Fill in your details and we'll get back to you within 2 hours.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Your Name" value={bulkName} onChange={(e) => setBulkName(e.target.value)} size="small" sx={dialogFieldSx} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Phone Number" value={bulkPhone}
                onChange={(e) => setBulkPhone(e.target.value.replace(/\D/, "").slice(0, 10))} size="small" sx={dialogFieldSx} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Product" value={product.name} disabled size="small" sx={dialogFieldSx} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Quantity (pieces)" type="number" value={bulkQty}
                onChange={(e) => setBulkQty(Number(e.target.value))} size="small" inputProps={{ min: 20 }} sx={dialogFieldSx} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Special Note (optional)" value={bulkNote}
                onChange={(e) => setBulkNote(e.target.value)} size="small" multiline rows={3}
                placeholder="Delivery date, event type, special requirements..." sx={dialogFieldSx} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setBulkOpen(false)}
            sx={{ color: "#999", fontFamily: "'Sora', sans-serif", fontWeight: 600, borderRadius: "12px" }}>
            Cancel
          </Button>
          <Button onClick={() => { setBulkOpen(false); setSnackOpen(true); }} variant="contained"
            disabled={!bulkName || bulkPhone.length < 10}
            sx={{ borderRadius: "12px", bgcolor: BRAND_DARK, fontFamily: "'Sora', sans-serif", fontWeight: 700, px: 4, py: 1.2, "&:hover": { bgcolor: BRAND_MID } }}>
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackOpen} autoHideDuration={4000} onClose={() => setSnackOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" sx={{ borderRadius: 3, fontFamily: "'Sora', sans-serif" }}>
          🎉 Bulk order submitted! We'll call you shortly.
        </Alert>
      </Snackbar>
      <Snackbar open={cartSnack} autoHideDuration={3000} onClose={() => setCartSnack(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" sx={{ borderRadius: 3, fontFamily: "'Sora', sans-serif" }}>
          🛒 Added {qty} × {selectedPack.label} {product.name} to cart!
        </Alert>
      </Snackbar>
    </Box>
  );
}

const dialogFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px", fontFamily: "'Sora', sans-serif",
    "& fieldset": { borderColor: "#d4b9a8" },
    "&:hover fieldset": { borderColor: "#6b3a1f" },
    "&.Mui-focused fieldset": { borderColor: "#3b1f0e" },
  },
  "& .MuiInputLabel-root": { fontFamily: "'Sora', sans-serif" },
};
