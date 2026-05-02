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
import src from "@emotion/cache";
import { i } from "framer-motion/client";

const MotionBox = motion(Box);   // for layout (supports sx)
const MotionImg = motion.img;    // for images (supports src)
const MotionPaper = motion(Paper);


const products: Record<string, any> = {
  chapathi: {
    name: "Chapathi",
    desc: "Soft homemade chapathi prepared fresh daily with traditional taste and no preservatives.",
    mrp: 50,
    images: ["/img/products/chapathi1.jpeg", "/img/products/chapathi2.jpeg"],
    packs: [
      { label: "10 PCS", price: 40 },
    ],
    // cookSteps: [
    //   { title: "Preheat Pan", desc: "Heat tawa on medium flame for 2 min." },
    //   { title: "Place Chapathi", desc: "Lay flat, cook until bubbles form." },
    //   { title: "Flip & Cook", desc: "Cook both sides evenly, ~30 sec each." },
    //   { title: "Serve Fresh", desc: "Serve hot with ghee or curry." },
    // ]
    cookSteps: [
      {
        title: "Preheat Pan",
        desc: "Heat tawa on medium flame for 2 min.",
        img: "/img/procedure/cpan_heat.png",
      },
      {
        title: "Place Chapathi",
        desc: "Lay flat, cook until bubbles form.",
        img: "/img/procedure/c_place.png",
      },
      {
        title: "Flip & Cook",
        desc: "Cook both sides evenly, ~30 sec each.",
        img: "/img/procedure/c_flip.png",
      },
      {
        title: "Serve Fresh",
        desc: "Serve hot with ghee or curry.",
        img: "/img/procedure/c_serve.png",
      },
    ],
    highlights: ["100% Whole Wheat", "Zero Maida", "Stone Ground Flour"],
  },
  poori: {
    name: "Poori",
    desc: "Crispy golden poori, puffed to perfection and made fresh with traditional recipes.",
    mrp: 55,
    images: ["/img/products/poori1.jpeg", "/img/products/poori2.jpeg"],
    packs: [
      { label: "15 PCS", price: 45 },
    ],
    // cookSteps: [
    //   { title: "Heat Oil", desc: "Pour oil in kadai, heat on high flame." },
    //   { title: "Slide In Poori", desc: "Gently slide poori into hot oil." },
    //   { title: "Press & Puff", desc: "Press lightly until poori puffs up." },
    //   { title: "Drain & Serve", desc: "Drain oil, serve with masala." },
    // ],
    cookSteps: [
      {
        title: "Heat Oil",
        desc: "Pour oil in kadai, heat on high flame.",
        img: "/img/procedure/ppan_heat.png",
      },
      {
        title: "Slide In Poori",
        desc: "Gently slide poori into hot oil.",
        img: "/img/procedure/p_place.png",
      },
      {
        title: "Press & Puff",
        desc: "Press lightly until poori puffs up.",
        img: "/img/procedure/p_flip.png",
      },
      {
        title: "Drain & Serve",
        desc: "Drain oil, serve with masala.",
        img: "/img/procedure/p_serve.png",
      },
    ],
    highlights: ["Puffed to Perfection", "Traditional Recipe", "No Artificial Color"],
  },
};

const BRAND_DARK = "#3b1f0e";
const BRAND_MID = "#6b3a1f";
const BRAND_ACCENT = "#e07b39";
const BRAND_LIGHT = "#fff7f0";
const BRAND_CHIP_BG = "#fce8d5";

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const product = products[id];
  if (!id || !product) return notFound();
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(product.images[0]);
  const [pincode, setPincode] = useState("");
  const [pincodeMsg, setPincodeMsg] = useState("");
  const [selectedPack, setSelectedPack] = useState(product.packs[0]);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkQty, setBulkQty] = useState(50);
  const [bulkName, setBulkName] = useState("");
  const [bulkPhone, setBulkPhone] = useState("");
  const [bulkNote, setBulkNote] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [cartSnack, setCartSnack] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const discount = Math.round(
    ((product.mrp - selectedPack.price) / product.mrp) * 100
  );

  const handlePincodeCheck = () => {
    if (pincode.length === 6) {
      setPincodeMsg("✅ Delivery available in your area!");
    } else {
      setPincodeMsg("❌ Enter a valid 6-digit pincode.");
    }
  };

  const handleBulkSubmit = () => {
    setBulkOpen(false);
    setSnackOpen(true);
  };
  const MotionImg = motion.img;
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % product.cookSteps.length);
    }, 2200);

    return () => clearInterval(interval);
  }, [product.cookSteps.length]);

  const handlePrev = () => {
    const newIndex =
      imgIndex === 0 ? product.images.length - 1 : imgIndex - 1;

    setImgIndex(newIndex);
    setImg(product.images[newIndex]);
  };

  const handleNext = () => {
    const newIndex =
      imgIndex === product.images.length - 1 ? 0 : imgIndex + 1;

    setImgIndex(newIndex);
    setImg(product.images[newIndex]);
  };
    
  return (
    
    <Box
      sx={{
        minHeight: "100vh",
        // background: `linear-gradient(160deg, ${BRAND_LIGHT} 0%, #f5e6d8 60%, #eddac8 100%)`,
        fontFamily: "'Playfair Display', serif",
      }}
    >

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
        <Grid container spacing={6}>
          {/* IMAGE SECTION */}
          <Grid item xs={12} md={6}>
            <Box>
              {/* MAIN IMAGE */}
              <Box
                sx={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  height: 500,
                  borderRadius: 3,
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
                  position: "relative",
                  "&:hover .navArrow": {
                    opacity: 1,
                  },
              }}
            >
              <img
                src={img}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              {/* LEFT ARROW */}
                <IconButton
                  onClick={handlePrev}
                  className="navArrow"
                  sx={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 34,
                    color: "rgba(255,255,255,0.65)", // minimal white
                    cursor: "pointer",
                    // color: "#fff",
                    opacity: 0,
                    transition: "0.3s",
                    userSelect: "none",
                    textShadow: "0 2px 8px rgba(0,0,0,0.35)",
                    "&:hover": { 
                      color: "#fff",
                      transform: "translateY(-50%) scale(1.1)",
                     },
                  }}
                >
                  ‹
                </IconButton>

                {/* RIGHT ARROW */}
                <IconButton
                  onClick={handleNext}
                  className="navArrow"
                  sx={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 34,
                    color: "rgba(255,255,255,0.65)", 
                    // color: "#fff",
                    cursor: "pointer",
                    opacity: 0,
                    transition: "0.3s",
                    userSelect: "none",
                    "&:hover": { 
                       color: "#fff",
                        transform: "translateY(-50%) scale(1.1)",
                    },
                  }}
                >
                  ›
                </IconButton>
              </Box>

              {/* THUMBNAILS */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  mt: 2,
                  overflowX: "auto",
                  pb: 1,
                }}
              >
                {product.images.map((src:string, i:number) => (
                  <Box
                    key={i}
                    component="img"
                    src={src}
                    onClick={() => setImg(src)}
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: 2,
                      cursor: "pointer",
                      objectFit: "cover",
                      border: img === src
                        ? "2px solid #88391d"
                        : "2px solid transparent",
                      transition: "0.25s",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          {/* ── DETAILS SECTION ── */}
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Name */}
              <Typography
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: { xs: 34, md: 42 },
                  fontWeight: 900,
                  color: BRAND_DARK,
                  lineHeight: 1.1,
                  letterSpacing: "-1px",
                }}
              >
                {product.name}
              </Typography>

              {/* Rating */}
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Rating value={4.8} precision={0.1} readOnly size="small" sx={{ color: BRAND_ACCENT }} />
                <Typography fontSize={13} color={BRAND_ACCENT} fontWeight={700}>
                  4.8
                </Typography>
                <Typography fontSize={13} color="#999">
                  • 120 reviews
                </Typography>
              </Box>

              {/* Trust Badges */}
              <Box display="flex" gap={1} mt={2} flexWrap="wrap">
                {[
                  { icon: <LocalFireDepartmentIcon sx={{ fontSize: 15 }} />, label: "Fresh Today" },
                  { icon: <BlockIcon sx={{ fontSize: 15 }} />, label: "No Preservatives" },
                  { icon: <HomeIcon sx={{ fontSize: 15 }} />, label: "Homemade" },
                ].map((badge) => (
                  <Chip
                    key={badge.label}
                    icon={badge.icon}
                    label={badge.label}
                    size="small"
                    sx={{
                      bgcolor: BRAND_CHIP_BG,
                      color: BRAND_MID,
                      fontWeight: 600,
                      fontSize: 12,
                      fontFamily: "'Playfair Display', serif",
                    }}
                  />
                ))}
              </Box>

              <Typography mt={2.5}  mb={3.5} fontSize={14.5} color="#7a5140" lineHeight={1.7}>
                {product.desc}
              </Typography>

              {/* <Divider sx={{ my: 3, borderColor: "#e8d4c4" }} /> */}

              {/* Pack Selection */}
              <Typography fontSize={13} fontWeight={700} color={BRAND_DARK} letterSpacing={0.5} mb={0.8}>
                SELECT PACK
              </Typography>

              <Box display="flex" gap={1.5} flexWrap="wrap">
                {product.packs.map((p: any) => {
                  const selected = selectedPack.label === p.label;
                  return (
                    <MotionBox
                      key={p.label}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        onClick={() => setSelectedPack(p)}
                        sx={{
                          borderRadius: "14px",
                          px: 3,
                          py: 1.2,
                          fontSize: 13,
                          fontWeight: 700,
                          fontFamily: "'Playfair Display', serif",
                          bgcolor: selected ? BRAND_DARK : "#fff",
                          color: selected ? "#fff" : BRAND_DARK,
                          border: `2px solid ${selected ? BRAND_DARK : "#d4b9a8"}`,
                          boxShadow: selected
                            ? "0 6px 20px rgba(59,31,14,0.25)"
                            : "none",
                          transition: "all 0.2s",
                          "&:hover": {
                            bgcolor: selected ? BRAND_MID : "#faf0e8",
                            borderColor: BRAND_MID,
                          },
                        }}
                      >
                        <Box textAlign="center">
                          <Box>{p.label}</Box>
                          <Box sx={{ fontSize: 11, fontWeight: 600, color: selected ? "#f5c89a" : "#999" }}>
                            ₹{p.price}
                          </Box>
                        </Box>
                      </Button>
                    </MotionBox>
                  );
                })}
              </Box>

              {/* Price */}
              <Box mt={3} display="flex" alignItems="center" gap={1.5}>
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

              <Divider sx={{ my: 3, borderColor: "#e8d4c4" }} />

              {/* Quantity */}
              <Typography fontSize={13} fontWeight={700} color={BRAND_DARK} letterSpacing={0.5} mb={1.5}>
                QUANTITY
              </Typography>

              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: `1.5px solid #d4b9a8`,
                    borderRadius: "14px",
                    overflow: "hidden",
                    bgcolor: "#fff",
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                    sx={{ borderRadius: 0, px: 1.5, "&:hover": { bgcolor: "#faf0e8" } }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography px={2.5} fontWeight={700} fontSize={16} color={BRAND_DARK}>
                    {qty}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setQty(qty + 1)}
                    sx={{ borderRadius: 0, px: 1.5, "&:hover": { bgcolor: "#faf0e8" } }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography fontSize={13} color="#999">
                  Total:{" "}
                  <strong style={{ color: BRAND_DARK }}>₹{selectedPack.price * qty}</strong>
                </Typography>
              </Box>

              {/* Pincode Check */}
              <Box mt={3}>
                <Typography fontSize={13} fontWeight={700} color={BRAND_DARK} letterSpacing={0.5} mb={1.5}>
                  CHECK DELIVERY
                </Typography>
                <Box display="flex" gap={1.5} alignItems="center">
                  <TextField
                    size="small"
                    placeholder="Enter 6-digit pincode"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value.replace(/\D/, "").slice(0, 6));
                      setPincodeMsg("");
                    }}
                    inputProps={{ maxLength: 6 }}
                    sx={{
                      flex: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        fontFamily: "'Sora', sans-serif",
                        "& fieldset": { borderColor: "#d4b9a8" },
                        "&:hover fieldset": { borderColor: BRAND_MID },
                        "&.Mui-focused fieldset": { borderColor: BRAND_DARK },
                      },
                    }}
                  />
                  <Button
                    onClick={handlePincodeCheck}
                    variant="contained"
                    sx={{
                      borderRadius: "12px",
                      bgcolor: BRAND_DARK,
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 700,
                      fontSize: 13,
                      px: 2.5,
                      "&:hover": { bgcolor: BRAND_MID },
                    }}
                  >
                    CHECK
                  </Button>
                </Box>
                {pincodeMsg && (
                  <Typography fontSize={12.5} mt={1} color={pincodeMsg.startsWith("✅") ? "green" : "red"}>
                    {pincodeMsg}
                  </Typography>
                )}
              </Box>

              {/* CTA Buttons */}
              <Box mt={3.5} display="flex" flexDirection="column" gap={1.5}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setBulkOpen(true)}
                  startIcon={<LocalShippingOutlinedIcon />}
                  sx={{
                    borderRadius: "14px",
                    borderColor: BRAND_DARK,
                    color: BRAND_DARK,
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: 14,
                    py: 1.3,
                    letterSpacing: 0.5,
                    borderWidth: 2,
                    "&:hover": {
                      bgcolor: BRAND_CHIP_BG,
                      borderWidth: 2,
                    },
                  }}
                >
                  BULK ORDER
                </Button>

                <MotionBox whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => 
                      setCartSnack(true)}
                    sx={{
                      borderRadius: "14px",
                      py: 1.7,
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 800,
                      fontSize: 15,
                      letterSpacing: 0.5,
                      background: `linear-gradient(135deg, ${BRAND_DARK} 0%, ${BRAND_MID} 100%)`,
                      boxShadow: "0 8px 24px rgba(59,31,14,0.30)",
                      "&:hover": {
                        background: `linear-gradient(135deg, ${BRAND_MID} 0%, #8b4a25 100%)`,
                        boxShadow: "0 12px 28px rgba(59,31,14,0.40)",
                      },
                    }}
                  >
                    ADD TO CART   ₹{selectedPack.price * qty}
                  </Button>
                </MotionBox>
              </Box>
            </MotionBox>
          </Grid>
        </Grid>

        {/* ── HOW TO COOK ── */}
        {/* <Box mt={10}>
          <Box textAlign="center" mb={5}>
            <Typography
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: { xs: 28, md: 36 },
                fontWeight: 900,
                color: BRAND_DARK,
              }}
            >
              How to Cook
            </Typography>
            <Typography fontSize={14} color="#9e7060" mt={1}>
              Ready in under 5 minutes
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {product.cookSteps.map((step: any, i: number) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <MotionPaper
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    textAlign: "center",
                    background: "#fff",
                    border: "1.5px solid #f0dfd0",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: `linear-gradient(90deg, ${BRAND_ACCENT}, ${BRAND_MID})`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${BRAND_ACCENT}, ${BRAND_MID})`,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                      fontWeight: 800,
                      fontSize: 18,
                      fontFamily: "'Playfair Display', serif",
                      boxShadow: "0 4px 12px rgba(224,123,57,0.35)",
                    }}
                  >
                    {i + 1}
                  </Box>
                  <Box
                      component="img"
                      src={step.img}
                      alt={step.title}
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: "contain",
                        mx: "auto",
                        mb: 1.5,
                      }}
                    />
                  <Typography
                    fontWeight={700}
                    fontSize={15}
                    color={BRAND_DARK}
                    fontFamily="'Playfair Display', serif"
                    mb={0.5}
                  >
                    {step.title}
                  </Typography>
                  <Typography fontSize={13} color="#9e7060" lineHeight={1.6}>
                    {step.desc}
                  </Typography>
                </MotionPaper>
              </Grid>
            ))}
          </Grid>
        </Box> */}

        <Box mt={8} position="relative">

          {/* HEADER */}
          <Box textAlign="center" mb={8}>
            <Typography
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: { xs: 30, md: 42 },
                fontWeight: 900,
                color: BRAND_DARK,
              }}
            >
              How to cook
            </Typography>

            <Typography fontSize={14} color="#9e7060" >
              From dough to delight in minutes
            </Typography>
          </Box>

          {/* HEAT FLOW PATH */}
          <svg
            viewBox="0 0 800 200"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              top: 80,
              left: 0,
              width: "100%",
              height: 200,
              zIndex: 0,
            }}
          >
            <motion.path
              d="M50 150 C200 0, 600 300, 750 100"
              stroke={BRAND_ACCENT}
              strokeWidth="3"
              fill="transparent"
              strokeDasharray="4 14"
              strokeLinecap="round"
              // opacity="2"
              transition={{
                duration: 2,
                ease: "easeOut",
              }}
            />
          </svg>

          {/* STEPS */}
          <Box
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: { xs: 2, md: 6 },
              zIndex: 2,
              flexWrap: "wrap",
              gap: 4,
            }}
          >
            {product.cookSteps.map((step: any, i: number) => {
              const isActive = activeStep === i;

              return (
                <MotionBox
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  sx={{ textAlign: "center", maxWidth: 180 }}
                >
                  {/* IMAGE */}
                  <MotionBox
                    animate={{
                      scale: isActive ? 1.12 : 0.9,
                      opacity: isActive ? 1 : 0.4,
                      y: isActive ? [0, -6, 0] : 0,
                    }}
                    transition={{ duration: 0.6 }}
                    sx={{ borderRadius: "50%", display: "inline-block", p: 1 }}
                  >
                    {/* GLOW */}
                    <MotionBox
                      animate={
                        isActive
                          ? {
                              boxShadow: [
                                "0 0 0px rgba(224,123,57,0)",
                                "0 0 30px rgba(224,123,57,0.6)",
                                "0 0 0px rgba(224,123,57,0)",
                              ],
                            }
                          : { boxShadow: "none" }
                      }
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      sx={{ borderRadius: "50%", p: 1 }}
                    >
                      <Box
                        component="img"
                        src={step.img}
                        alt={step.title}
                        sx={{
                          width: 100,
                          height: 100,
                          objectFit: "contain",
                        }}
                      />
                    </MotionBox>
                  </MotionBox>

                  <Box
                    sx={{
                      width: 25,
                      height: 25,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${BRAND_ACCENT}, ${BRAND_MID})`,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                      fontWeight: 500,
                      fontSize: 14,
                      fontFamily: "'Playfair Display', serif",
                      boxShadow: "0 4px 12px rgba(224,123,57,0.35)",
                    }}
                  >
                    {i + 1}
                  </Box>

                  {/* TITLE */}
                  <Typography
                    fontWeight={800}
                    fontSize={15}
                    color={isActive ? BRAND_DARK : "#9e7060"}
                  >
                    {step.title}
                  </Typography>

                  {/* DESC */}
                  <Typography fontSize={12.5} color="#9e7060" lineHeight={1.5}>
                    {step.desc}
                  </Typography>
                </MotionBox>
              );
            })}
          </Box>
        </Box>

                
        {/* ── WHY MENMAI STRIP ── */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          sx={{
            mt: 8,
            p: { xs: 3, md: 5 },
            borderRadius: 5,
            background: `linear-gradient(135deg, ${BRAND_DARK} 0%, ${BRAND_MID} 100%)`,
            color: "#fff",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: { xs: 22, md: 28 },
                fontWeight: 900,
              }}
            >
              Need a large quantity?
            </Typography>
            <Typography fontSize={14} sx={{ opacity: 0.8, mt: 0.5 }}>
              We cater events, offices, and celebrations. Fresh made to order.
            </Typography>
          </Box>
          <Button
            onClick={() => setBulkOpen(true)}
            startIcon={<WhatsAppIcon />}
            sx={{
              bgcolor: "#fff",
              color: BRAND_DARK,
              fontFamily: "'Playfair Display', serif",
              fontWeight: 800,
              fontSize: 14,
              px: 4,
              py: 1.5,
              borderRadius: "14px",
              whiteSpace: "nowrap",
              "&:hover": { bgcolor: "#fce8d5" },
            }}
          >
            Place Bulk Order
          </Button>
        </MotionBox>
      </Container>

      {/* ── BULK ORDER DIALOG ── */}
      <Dialog
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            fontFamily: "'Sora', sans-serif",
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: 24,
            color: BRAND_DARK,
            pb: 0,
          }}
        >
          Bulk Order Request
        </DialogTitle>
        <DialogContent>
          <Typography fontSize={13} color="#9e7060" mb={3} mt={0.5}>
            Fill in your details and we'll get back to you within 2 hours.
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Your Name"
                value={bulkName}
                onChange={(e) => setBulkName(e.target.value)}
                size="small"
                sx={dialogFieldSx}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                value={bulkPhone}
                onChange={(e) => setBulkPhone(e.target.value.replace(/\D/, "").slice(0, 10))}
                size="small"
                sx={dialogFieldSx}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Product"
                value={product.name}
                disabled
                size="small"
                sx={dialogFieldSx}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Quantity (pieces)"
                type="number"
                value={bulkQty}
                onChange={(e) => setBulkQty(Number(e.target.value))}
                size="small"
                inputProps={{ min: 20 }}
                sx={dialogFieldSx}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Special Note (optional)"
                value={bulkNote}
                onChange={(e) => setBulkNote(e.target.value)}
                size="small"
                multiline
                rows={3}
                placeholder="Delivery date, event type, special requirements..."
                sx={dialogFieldSx}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setBulkOpen(false)}
            sx={{
              color: "#999",
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              borderRadius: "12px",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBulkSubmit}
            variant="contained"
            disabled={!bulkName || bulkPhone.length < 10}
            sx={{
              borderRadius: "12px",
              bgcolor: BRAND_DARK,
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              px: 4,
              py: 1.2,
              "&:hover": { bgcolor: BRAND_MID },
            }}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbars */}
      <Snackbar open={snackOpen} autoHideDuration={4000} onClose={() => setSnackOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" sx={{ borderRadius: 3, fontFamily: "'Playfair Display', serif" }}>
          🎉 Bulk order submitted! We'll call you shortly.
        </Alert>
      </Snackbar>

      <Snackbar open={cartSnack} autoHideDuration={3000} onClose={() => setCartSnack(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" sx={{ borderRadius: 3, fontFamily: "'Playfair Display', serif" }}>
          🛒 Added {qty} × {selectedPack.label} {product.name} to cart!
        </Alert>
      </Snackbar>
    </Box>
  );
}

// Shared dialog field styling
const dialogFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    fontFamily: "'Playfair Display', serif",
    "& fieldset": { borderColor: "#d4b9a8" },
    "&:hover fieldset": { borderColor: "#6b3a1f" },
    "&.Mui-focused fieldset": { borderColor: "#3b1f0e" },
  },
  "& .MuiInputLabel-root": { fontFamily: "'Playfair Display', serif" },
};
