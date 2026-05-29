"use client";

import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  Chip,
  Paper,
  Divider,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  SelectChangeEvent,
  Skeleton,
} from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

/* ── MUI Icons ─────────────────────────────────────── */
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import GrainOutlinedIcon from "@mui/icons-material/GrainOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import {
  validateBulkOrderForm,
  validateField,
  FormErrors,
} from "@/lib/validations/bulkOrderValidation"; 

/* ════════════════════════════════════════
   ANIMATION HELPERS
════════════════════════════════════════ */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay },
  viewport: { once: true },
});
const fadeRight = (delay = 0) => ({
  initial: { opacity: 0, x: -40 },
  whileInView: { opacity: 1, x: 0 },
  transition: { duration: 0.7, delay },
  viewport: { once: true },
});
const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: 40 },
  whileInView: { opacity: 1, x: 0 },
  transition: { duration: 0.7, delay },
  viewport: { once: true },
});
const zoomIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, delay },
  viewport: { once: true },
});

/* ════════════════════════════════════════
   CONSTANTS
════════════════════════════════════════ */
// Minimum pieces per product for bulk order
const MIN_BULK_QTY = 200;

// Bulk discount tiers — hardcoded business logic, fine to keep here
const getDiscount = (subtotal: number): number => {
  if (subtotal >= 5000) return 0.1;
  if (subtotal >= 2000) return 0.05;
  return 0;
};

/* ════════════════════════════════════════
   STATIC UI DATA — not from DB
════════════════════════════════════════ */
const HERO_BADGES = [
  { icon: <GrainOutlinedIcon sx={{ fontSize: 22 }} />,         label: "Freshly\nPrepared"      },
  { icon: <VerifiedOutlinedIcon sx={{ fontSize: 22 }} />,      label: "Hygienically\nPacked"   },
  { icon: <LocalShippingOutlinedIcon sx={{ fontSize: 22 }} />, label: "On-time\nDelivery"      },
  { icon: <SellOutlinedIcon sx={{ fontSize: 22 }} />,          label: "Best Price\nGuaranteed" },
];

const WHY_CHOOSE = [
  { icon: <SellOutlinedIcon sx={{ fontSize: 30 }} />,       title: "Best Price Guaranteed",     desc: "Competitive pricing for all bulk orders."    },
  { icon: <Inventory2OutlinedIcon sx={{ fontSize: 30 }} />, title: "Hygienic & Safe Packaging",  desc: "Packed with care to maintain freshness."     },
  { icon: <AccessTimeOutlinedIcon sx={{ fontSize: 30 }} />, title: "On-time Delivery",           desc: "Punctual delivery, every single time."       },
  { icon: <VerifiedOutlinedIcon sx={{ fontSize: 30 }} />,   title: "Consistent Quality",         desc: "Same taste and quality in every order."      },
  { icon: <PeopleAltOutlinedIcon sx={{ fontSize: 30 }} />,  title: "Perfect for Every Occasion", desc: "Weddings, corporate events, temples & more." },
];

const WHY_QUOTE_POINTS = [
  "Customized pricing for bulk orders",
  "Special discounts on large quantities",
  "Flexible delivery options",
  "Personalized support",
];

/* ════════════════════════════════════════
   SHARED STYLES
════════════════════════════════════════ */
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#fff",
    fontSize: "0.9rem",
    "& fieldset": { borderColor: "rgba(0,0,0,0.15)" },
    "&:hover fieldset": { borderColor: "var(--primary-teal-dark)" },
    "&.Mui-focused fieldset": { borderColor: "var(--primary-teal-dark)" },
  },
  "& .MuiInputLabel-root": { fontSize: "0.87rem" },
  "& .MuiInputLabel-root.Mui-focused": { color: "inherit" },
  "& .MuiFormHelperText-root": { fontSize: "0.75rem", mx: 0, mt: 0.5 },
  "& .MuiFormHelperText-root.Mui-error": { color: "#c62828" },
};

const tableCellSx = {
  fontSize: "0.82rem",
  color: "var(--text)",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
  py: 1.5,
  px: 1.5,
};

const tableHeadCellSx = {
  fontSize: "0.75rem",
  fontWeight: 700,
  color: "var(--text)",
  opacity: 0.6,
  textTransform: "uppercase" as const,
  letterSpacing: "0.06em",
  borderBottom: "1.5px solid rgba(0,0,0,0.08)",
  py: 1.25,
  px: 1.5,
  backgroundColor: "rgba(0,0,0,0.02)",
};

/* ════════════════════════════════════════
   TYPES
════════════════════════════════════════ */

// Shape of product fetched from /api/products
interface ProductOption {
  id:                number;
  name:              string;
  image:             string;   // from ProductImage (first) or Product.imageUrl
  pieces:            number;   // pieces per retail packet
  bulkPricePerPiece: number;   // from Product.bulkPricePerPiece (DB)
}

// Row in the quantity table
interface ProductRow {
  id:                number;
  name:              string;
  image:             string;
  pieces:            number;
  bulkPricePerPiece: number;
  qty:               string;   // string for controlled input
}

/* ════════════════════════════════════════
   PAGE COMPONENT
════════════════════════════════════════ */
export default function BulkOrderPage() {

  /* ── Products from DB ── */
  const [allProducts, setAllProducts]         = useState<ProductOption[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.map((p: any) => ({
            id:    p.id,
            name:  p.name,
            image: p.imageUrl ?? "",                          // ProductImage first, fallback Product.imageUrl
            pieces: p.pieces ?? 1,                            // pieces per retail packet
            bulkPricePerPiece: p.bulkPricePerPiece ?? 0,     // bulk price per piece from DB
          }))
        );
        setProductsLoading(false);
      })
      .catch(() => setProductsLoading(false));
  }, []);

  /* ── Form state ── */
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [productRows, setProductRows]     = useState<ProductRow[]>([]);
  const [submitted, setSubmitted]         = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    deliveryDate: "", occasion: "", address: "",
  });
  const [bulkOrderSubmitted, setBulkOrderSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});   // ← add this
  /* ── Derived pricing ── */
  const pricing = useMemo(() => {
    const rows = productRows.map((r) => {
      const qty   = parseInt(r.qty) || 0;
      const total = qty * r.bulkPricePerPiece;   // ← pieces × bulk price per piece from DB
      return {
        ...r,
        qtyNum:    qty,
        unitPrice: r.bulkPricePerPiece,           // shown as ₹X / piece in table
        total,
      };
    });
    const subtotal       = rows.reduce((s, r) => s + r.total, 0);
    const discountRate   = getDiscount(subtotal);
    const discountAmt    = subtotal * discountRate;
    const estimatedTotal = subtotal - discountAmt;
    const allFilled      = rows.length > 0 && rows.every((r) => r.qtyNum >= MIN_BULK_QTY);
    return { rows, subtotal, discountRate, discountAmt, estimatedTotal, allFilled };
  }, [productRows]);

  /* ── Handlers ── */
  const handleFieldChange = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleProductSelect = (e: SelectChangeEvent<string[]>) => {
    const val = typeof e.target.value === "string"
      ? e.target.value.split(",")
      : e.target.value;
    setSelectedNames(val);

    setProductRows((prev) =>
      val.map((name) => {
        const existing = prev.find((r) => r.name === name);
        const product  = allProducts.find((p) => p.name === name)!;
        return existing ?? {
          id:                product.id,
          name:              product.name,
          image:             product.image,
          pieces:            product.pieces,
          bulkPricePerPiece: product.bulkPricePerPiece,
          qty:               "",
        };
      })
    );
  };

  const handleQtyChange = (name: string, qty: string) => {
    setProductRows((prev) =>
      prev.map((r) => r.name === name ? { ...r, qty } : r)
    );
  };

  const handleRemoveProduct = (name: string) => {
    setSelectedNames((prev) => prev.filter((n) => n !== name));
    setProductRows((prev) => prev.filter((r) => r.name !== name));
  };

  const handleAddProduct = () => {
    const remaining = allProducts.filter((p) => !selectedNames.includes(p.name));
    if (remaining.length === 0) return;
    const next = remaining[0];
    setSelectedNames((prev) => [...prev, next.name]);
    setProductRows((prev) => [...prev, {
      id:                next.id,
      name:              next.name,
      image:             next.image,
      pieces:            next.pieces,
      bulkPricePerPiece: next.bulkPricePerPiece,
      qty:               "",
    }]);
  };

  const handleReset = () => {
    setSelectedNames([]);
    setProductRows([]);
    setSubmitted(false);
    setBulkOrderSubmitted(false);
    setErrors({});
    setForm({ name: "", phone: "", email: "", deliveryDate: "", occasion: "", address: "" });
  };

  const handleBulkOrderSubmit = () => {
    // TODO: connect to POST /api/bulk-order in next step
    setBulkOrderSubmitted(true);
    setTimeout(() => setBulkOrderSubmitted(false), 2500);
  };

  const fmt = (n: number) =>
    n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  
  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
  return (
    <Box sx={{ pb: 10 }}>

      {/* ════════════════════════════════
    HERO
════════════════════════════════ */}
      <Box sx={{ position: "relative", overflow: "hidden", backgroundColor: "#f7f6f3", minHeight: { xs: "auto", md: 340 } }}>

        <Box component="img" src="/img/bulkorder.png" alt="" aria-hidden="true"
          sx={{ position: "absolute", top: 0, right: 0, width: { xs: "100%", md: "65%" }, height: "100%", objectFit: "cover", objectPosition: "center top", display: "block", zIndex: 0 }}
  />
        <Box sx={{ position: "absolute", top: 0, left: 0, width: { xs: "100%", md: "50%" }, height: "100%", background: { xs: "linear-gradient(to bottom, #f7f6f3 60%, transparent 100%)", md: "linear-gradient(to right, #f7f6f3 45%, rgba(247,246,243,0.85) 65%, rgba(247,246,243,0.3) 82%, transparent 100%)" }, zIndex: 1, pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", top: 0, left: { xs: "0%", md: "30%" }, width: { xs: "0%", md: "20%" }, height: "100%", background: "linear-gradient(to right, #f7f6f3 0%, rgba(247,246,243,0.5) 40%, transparent 100%)", zIndex: 1, pointerEvents: "none", display: { xs: "none", md: "block" } }} />

  {/* Content */}
  <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
    <Grid container alignItems="center">

      {/* Left text */}
      <Grid item xs={12} md={7}>
        <Box sx={{ px: { xs: 3, sm: 4, md: 6 }, py: { xs: 4, md: 5 } }}>

          {/* Eyebrow */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
                  <Typography sx={{ fontSize: ".72rem", fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--primary-teal-dark)", whiteSpace: "nowrap" }}>
              Fresh. Hygienic. Delivered.
            </Typography>
                  <Box sx={{ width: 26, height: 24, backgroundColor: "var(--green)", mask: "url('/plant.png') no-repeat center / contain", WebkitMask: "url('/plant.png') no-repeat center / contain", opacity: 0.7 }} />
          </Box>

          <motion.div {...fadeUp(0)}>
                  <Typography sx={{ fontSize: { xs: "1.9rem", md: "2.6rem" }, fontWeight: 700, fontFamily: "var(--font-heading)", color: "var(--primary-maroon-dark)", lineHeight: 1.15, mb: 1.25 }}>
              Bulk Orders,<br />Made Simple
            </Typography>
          </motion.div>

          <motion.div {...fadeUp(0.05)}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
              <Box sx={{ width: 28, height: 2, backgroundColor: "var(--or)", borderRadius: 1 }} />
                    <Box sx={{ width: 16, height: 16, backgroundColor: "var(--or)", mask: "url('/grain-wheat-icon.svg') no-repeat center / contain", WebkitMask: "url('/grain-wheat-icon.svg') no-repeat center / contain", opacity: 0.75 }} />
              <Box sx={{ width: 28, height: 2, backgroundColor: "var(--or)", borderRadius: 1 }} />
            </Box>
          </motion.div>

          <motion.div {...fadeUp(0.1)}>
                  <Typography sx={{ fontSize: { xs: ".88rem", md: ".95rem" }, color: "var(--text)", lineHeight: 1.65, mb: 2.5, maxWidth: 420 }}>
                    Order fresh Chapathi and Poori in large quantities for weddings, corporate events, temple functions, and catering needs.
            </Typography>
          </motion.div>

          <motion.div {...fadeUp(0.18)}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 2, sm: 2.5 } }}>
              {HERO_BADGES.map((b) => (
                      <Box key={b.label} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5, minWidth: 56 }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "--org2", borderColor: "color-mix(in srgb, var(--primary-teal-dark), transparent 65%)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    {b.icon}
                  </Box>
                        <Typography sx={{ fontSize: ".65rem", fontWeight: 500, color: "var(--text)", textAlign: "center", lineHeight: 1.3, whiteSpace: "pre-line" }}>
                    {b.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </motion.div>

        </Box>
      </Grid>

      {/* Right — empty, image is absolute background */}
      <Grid item xs={12} md={5} />

    </Grid>
  </Container>
</Box>

      {/* ════════════════════════════════
          FORM + ORDER SUMMARY
      ════════════════════════════════ */}
      <Container maxWidth="lg">
        <Box sx={{ pt: 7, pb: 2 }}>
          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="flex-start">

            {/* ═══════════════════════════
                LEFT — Quote Form
            ═══════════════════════════ */}
            <Grid item xs={12} md={7}>
              <motion.div {...fadeRight(0.1)}>
                <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, borderRadius: "20px", border: "1.5px solid rgba(0,0,0,0.08)" }}>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                    <RequestQuoteOutlinedIcon sx={{ color: "var(--primary-teal-dark)", fontSize: 26 }} />
                    <Typography sx={{ fontWeight: 700, fontFamily: "var(--font-heading)", color: "var(--primary-maroon-dark)", fontSize: { xs: "1.1rem", md: "1.25rem" } }}>
                      Request a Bulk Order Quote
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: ".87rem", color: "var(--text)", mb: 3 }}>
                    Fill in the details below and we'll get back to you with the best quote.
                  </Typography>

                  <Grid container spacing={2.5}>

                    {/* Name */}
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Your Name" required placeholder="Enter your name"
                        value={form.name} onChange={handleFieldChange("name")} sx={fieldSx}
                        InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineOutlinedIcon sx={{ color: "var(--primary-teal-dark)", fontSize: 19 }} /></InputAdornment> }}
                        error={!!errors.name}
                        helperText={errors.name}
                        onBlur={() => setErrors(prev => ({ ...prev, name: validateField("name", form.name) }))}
                      />
                    </Grid>

                    {/* Phone */}
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Phone Number" required placeholder="Enter your phone number"
                        value={form.phone} onChange={handleFieldChange("phone")} sx={fieldSx}
                        InputProps={{ startAdornment: <InputAdornment position="start"><PhoneOutlinedIcon sx={{ color: "var(--primary-teal-dark)", fontSize: 19 }} /></InputAdornment> }}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        onBlur={() => setErrors(prev => ({ ...prev, phone: validateField("phone", form.phone) }))}
                      />
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12}>
                      <TextField fullWidth label="Email Address" required placeholder="Enter your email"
                        value={form.email} onChange={handleFieldChange("email")} sx={fieldSx}
                        InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ color: "var(--primary-teal-dark)", fontSize: 19 }} /></InputAdornment> }}
                        error={!!errors.email}
                        helperText={errors.email}
                        onBlur={() => setErrors(prev => ({ ...prev, email: validateField("email", form.email) }))}
                      />
                    </Grid>

                    {/* ── Products multi-select — from DB ── */}
                    <Grid item xs={12}>
                      <FormControl fullWidth required sx={fieldSx} disabled={productsLoading}>
                        <InputLabel>
                          {productsLoading ? "Loading products..." : "Products Required"}
                        </InputLabel>
                        <Select
                          multiple
                          value={selectedNames}
                          onChange={handleProductSelect}
                          label={productsLoading ? "Loading products..." : "Products Required"}
                          startAdornment={
                            <InputAdornment position="start" sx={{ ml: 1 }}>
                              <SearchOutlinedIcon sx={{ color: "var(--primary-teal-dark)", fontSize: 19 }} />
                            </InputAdornment>
                          }
                          renderValue={(selected) => (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                              {(selected as string[]).map((val) => (
                                <Chip key={val} label={val} size="small"
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onDelete={() => handleRemoveProduct(val)}
                                  sx={{ backgroundColor: "color-mix(in srgb, var(--primary-teal-dark), transparent 85%)", color: "var(--primary-teal-dark)", fontWeight: 600, fontSize: "0.74rem" }}
                                />
                              ))}
                            </Box>
                          )}
                        >
                          {/* ← allProducts from DB, not hardcoded */}
                          {allProducts.map((p) => (
                            <MenuItem key={p.name} value={p.name}>
                              <Checkbox checked={selectedNames.includes(p.name)} size="small"
                                sx={{ color: "var(--primary-teal-dark)", "&.Mui-checked": { color: "var(--primary-teal-dark)" } }}
                              />
                              {/* Show product thumbnail in dropdown */}
                              {p.image && (
                                <Box component="img" src={p.image} alt={p.name}
                                  sx={{ width: 28, height: 28, borderRadius: "6px", objectFit: "cover", mr: 1, border: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }}
                                />
                              )}
                              <ListItemText
                                primary={p.name}
                                secondary={`₹ ${p.bulkPricePerPiece.toFixed(2)} / piece`}
                                primaryTypographyProps={{ fontSize: "0.88rem" }}
                                secondaryTypographyProps={{ fontSize: "0.74rem", color: "var(--primary-teal-dark)" }}
                              />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* Loading skeleton */}
                      {productsLoading && (
                        <Skeleton variant="rectangular" height={40} sx={{ borderRadius: "10px", mt: 0.5 }} />
                      )}

                      <Typography sx={{
                        fontSize: "0.74rem", mt: 0.5, ml: 0.5,
                        color: errors.products ? "#c62828" : "var(--text)",
                        opacity: errors.products ? 1 : 0.65,
                      }}>
                        {errors.products
                          ? errors.products
                          : selectedNames.length > 0
                            ? `${selectedNames.length} product${selectedNames.length > 1 ? "s" : ""} selected`
                            : `Minimum ${MIN_BULK_QTY} pieces per product`}
                      </Typography>
                    </Grid>

                    {/* ── Per-product quantity table ── */}
                    {productRows.length > 0 && (
                      <Grid item xs={12}>
                        <Box sx={{ borderRadius: "12px", border: "1.5px solid rgba(0,0,0,0.08)", overflow: "hidden" }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={tableHeadCellSx}>Product</TableCell>
                                <TableCell sx={tableHeadCellSx}>
                                  Qty (Pieces)*
                                  <Typography component="span" sx={{ fontSize: "0.65rem", ml: 0.5, opacity: 0.7, fontWeight: 400 }}>
                                    min {MIN_BULK_QTY}
                                  </Typography>
                                </TableCell>
                                <TableCell sx={tableHeadCellSx} align="right">Price / Piece</TableCell>
                                <TableCell sx={tableHeadCellSx} align="right">Total</TableCell>
                                <TableCell sx={{ ...tableHeadCellSx, width: 40 }} />
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {pricing.rows.map((row) => (
                                <TableRow key={row.name} sx={{ "&:last-child td": { border: 0 } }}>

                                  {/* Product image + name — from DB */}
                                  <TableCell sx={tableCellSx}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                                      {row.image ? (
                                      <Box component="img" src={row.image} alt={row.name}
                                        sx={{ width: 36, height: 36, borderRadius: "8px", objectFit: "cover", border: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }}
                                      />
                                      ) : (
                                        <Box sx={{ width: 36, height: 36, borderRadius: "8px", backgroundColor: "rgba(0,0,0,0.06)", flexShrink: 0 }} />
                                      )}
                                      <Box>
                                      <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary-maroon-dark)" }}>
                                        {row.name}
                                      </Typography>
                                        {/* Packet equivalent helper */}
                                        {row.qtyNum >= MIN_BULK_QTY && (
                                          <Typography sx={{ fontSize: "0.7rem", color: "var(--text)", opacity: 0.55 }}>
                                            = {Math.ceil(row.qtyNum / row.pieces)} packets
                                          </Typography>
                                        )}
                                      </Box>
                                    </Box>
                                  </TableCell>

                                  {/* Qty input */}
                                  <TableCell sx={tableCellSx}>
                                    <TextField
                                      size="small" type="number" placeholder="Enter quantity"
                                      value={row.qty}
                                      onChange={(e) => {
                                        handleQtyChange(row.name, e.target.value);
                                        setErrors(prev => ({
                                          ...prev,
                                          qty: { ...prev.qty, [row.name]: undefined as any }
                                        }));
                                      }}
                                      error={!!errors.qty?.[row.name]}
                                      helperText={errors.qty?.[row.name]}
                                      inputProps={{ min: 1 }}
                                      sx={{
                                        width: 140,
                                        "& .MuiOutlinedInput-root": {
                                          borderRadius: "8px", fontSize: "0.85rem",
                                          "& fieldset": { borderColor: "rgba(0,0,0,0.15)" },
                                          "&:hover fieldset": { borderColor: "var(--primary-teal-dark)" },
                                          "&.Mui-focused fieldset": { borderColor: "var(--primary-teal-dark)" },
                                        },
                                      }}
                                    />
                                  </TableCell>

                                  {/* Unit price — from DB (bulkPricePerPiece) */}
                                  <TableCell sx={tableCellSx} align="right">
                                    <Typography sx={{ fontSize: "0.85rem", color: "var(--text)" }}>
                                      ₹ {row.unitPrice.toFixed(2)}
                                    </Typography>
                                    <Typography sx={{ fontSize: "0.7rem", color: "var(--text)", opacity: 0.5 }}>
                                      per piece
                                    </Typography>
                                  </TableCell>

                                  {/* Total */}
                                  <TableCell sx={tableCellSx} align="right">
                                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary-maroon-dark)" }}>
                                      {row.qtyNum >= MIN_BULK_QTY ? `₹ ${fmt(row.total)}` : "–"}
                                    </Typography>
                                  </TableCell>

                                  {/* Delete */}
                                  <TableCell sx={{ ...tableCellSx, p: 0.5 }}>
                                    <IconButton size="small" onClick={() => handleRemoveProduct(row.name)}
                                      sx={{ color: "rgba(0,0,0,0.35)", "&:hover": { color: "#c62828" } }}
                                    >
                                      <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                  </TableCell>

                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>

                        {/* Add another product — uses allProducts from DB */}
                        {selectedNames.length < allProducts.length && (
                          <Button size="small" startIcon={<AddIcon />} onClick={handleAddProduct}
                            sx={{
                              mt: 1.5, textTransform: "none", fontWeight: 600, fontSize: ".82rem",
                              color: "var(--primary-teal-dark)",
                              border: "1.5px dashed",
                              borderColor: "color-mix(in srgb, var(--primary-teal-dark), transparent 60%)",
                              borderRadius: "8px", px: 2, py: 0.75,
                              "&:hover": { backgroundColor: "color-mix(in srgb, var(--primary-teal-dark), transparent 94%)" },
                            }}
                          >
                            Add Another Product
                          </Button>
                        )}
                      </Grid>
                    )}

                    {/* Delivery Date */}
                    <Grid item xs={12}>
                      <TextField fullWidth label="Delivery Date" required type="date"
                        value={form.deliveryDate} onChange={handleFieldChange("deliveryDate")}
                        InputLabelProps={{ shrink: true }} sx={fieldSx}
                        InputProps={{ startAdornment: <InputAdornment position="start"><CalendarTodayOutlinedIcon sx={{ color: "var(--primary-teal-dark)", fontSize: 17 }} /></InputAdornment> }}
                        error={!!errors.deliveryDate}
                        helperText={errors.deliveryDate}
                        onBlur={() => setErrors(prev => ({ ...prev, deliveryDate: validateField("deliveryDate", form.deliveryDate) }))}
                      />
                    </Grid>

                    {/* Occasion */}
                    <Grid item xs={12}>
                      <TextField fullWidth label="Occasion / Event Details" required
                        placeholder="e.g. Wedding, Corporate Lunch, Temple Function..."
                        value={form.occasion} onChange={handleFieldChange("occasion")} sx={fieldSx}
                        InputProps={{ startAdornment: <InputAdornment position="start"><EventNoteOutlinedIcon sx={{ color: "var(--primary-teal-dark)", fontSize: 19 }} /></InputAdornment> }}
                        error={!!errors.occasion}
                        helperText={errors.occasion}
                        onBlur={() => setErrors(prev => ({ ...prev, occasion: validateField("occasion", form.occasion) }))}
                      />
                    </Grid>

                    {/* Delivery Address */}
                    <Grid item xs={12}>
                      <TextField fullWidth label="Delivery Address" required
                        placeholder="Enter complete delivery address"
                        value={form.address} onChange={handleFieldChange("address")} sx={fieldSx}
                        InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnOutlinedIcon sx={{ color: "var(--primary-teal-dark)", fontSize: 19 }} /></InputAdornment> }}
                        error={!!errors.address}
                        helperText={errors.address}
                        onBlur={() => setErrors(prev => ({ ...prev, address: validateField("address", form.address) }))}
                      />
                    </Grid>

                    {/* Get Quote */}
                    <Grid item xs={12}>
                      <Button fullWidth onClick={() => {
                        const { errors: newErrors, isValid } = validateBulkOrderForm(form, productRows);
                        setErrors(newErrors);
                        if (isValid) setSubmitted(true);
                      }} startIcon={<SendOutlinedIcon />}
                        sx={{
                          backgroundColor: "var(--primary-teal-dark)", color: "#fff",
                          fontWeight: 700, fontSize: "1rem", py: 1.6, borderRadius: "12px",
                          textTransform: "none", boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                          transition: "all 0.25s ease",
                          "&:hover": { backgroundColor: "var(--primary-teal-mid)", transform: "translateY(-2px)", boxShadow: "0 10px 28px rgba(0,0,0,0.18)" },
                        }}
                      >
                        Get Quote
                      </Button>
                    </Grid>

                  </Grid>
                </Paper>

                {/* Need help strip */}
                <Box sx={{ mt: 2, p: "14px 20px", borderRadius: "14px", border: "1.5px solid rgba(0,0,0,0.08)", backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0, backgroundColor: "color-mix(in srgb, var(--primary-teal-dark), transparent 88%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <LocalShippingOutlinedIcon sx={{ color: "var(--primary-teal-dark)", fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: ".88rem", color: "var(--primary-maroon-dark)", lineHeight: 1.3 }}>Need help with your bulk order?</Typography>
                      <Typography sx={{ fontSize: ".78rem", color: "var(--text)" }}>Our team is ready to assist you with custom requirements.</Typography>
                    </Box>
                  </Box>
                  <Button component={Link} href="/contact" variant="outlined" endIcon={<ArrowRightAltOutlinedIcon />}
                    sx={{ textTransform: "none", fontWeight: 600, fontSize: ".82rem", borderRadius: "10px", borderColor: "var(--primary-teal-dark)", color: "var(--primary-teal-dark)", px: 2.5, py: 0.9, whiteSpace: "nowrap", "& .MuiButton-endIcon": { transition: "transform 0.3s ease" }, "&:hover": { backgroundColor: "color-mix(in srgb, var(--primary-teal-dark), transparent 92%)" }, "&:hover .MuiButton-endIcon": { transform: "translateX(5px)" } }}
                  >
                    Contact Us
                  </Button>
                </Box>
              </motion.div>
            </Grid>

            {/* ═══════════════════════════
                RIGHT — Order Summary
            ═══════════════════════════ */}
            <Grid item xs={12} md={5}>
              <motion.div {...fadeLeft(0.2)}>
                <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, borderRadius: "20px", border: "1.5px solid rgba(0,0,0,0.08)", backgroundColor: "#fff", position: { md: "sticky" }, top: { md: 100 } }}>

                  <Typography sx={{ fontWeight: 700, fontFamily: "var(--font-heading)", color: "var(--primary-teal-dark)", mb: 2.5, fontSize: "1.15rem" }}>
                    Order Summary
                  </Typography>

                  {/* Status banner */}
                  {submitted && pricing.allFilled ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: "12px 16px", borderRadius: "10px", backgroundColor: "color-mix(in srgb, var(--primary-teal-dark), transparent 88%)", mb: 2.5 }}>
                      <TaskAltIcon sx={{ color: "var(--primary-teal-dark)", fontSize: 22 }} />
                      <Box>
                        <Typography sx={{ fontSize: ".88rem", fontWeight: 700, color: "var(--primary-teal-dark)" }}>All details are entered!</Typography>
                        <Typography sx={{ fontSize: ".78rem", color: "var(--text)" }}>We're ready to generate your quote.</Typography>
                      </Box>
                    </Box>
                  ) : productRows.length > 0 && !pricing.allFilled ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: "12px 16px", borderRadius: "10px", backgroundColor: "rgba(248,241,230,0.8)", mb: 2.5 }}>
                      <Inventory2OutlinedIcon sx={{ color: "var(--or)", fontSize: 22 }} />
                      <Typography sx={{ fontSize: ".83rem", color: "var(--text)" }}>
                        Add at least {MIN_BULK_QTY} pieces per product to see the estimated quote.
                      </Typography>
                    </Box>
                  ) : null}

                  {/* Product pricing table */}
                  {productRows.length > 0 ? (
                    <Box sx={{ borderRadius: "12px", border: "1.5px solid rgba(0,0,0,0.07)", overflow: "hidden", mb: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={tableHeadCellSx}>Product</TableCell>
                            <TableCell sx={tableHeadCellSx} align="center">Qty (Pieces)</TableCell>
                            <TableCell sx={tableHeadCellSx} align="right">Price/Piece</TableCell>
                            <TableCell sx={tableHeadCellSx} align="right">Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {pricing.rows.map((row) => (
                            <TableRow key={row.name} sx={{ "&:last-child td": { border: 0 } }}>
                              <TableCell sx={tableCellSx}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  {row.image ? (
                                  <Box component="img" src={row.image} alt={row.name}
                                    sx={{ width: 30, height: 30, borderRadius: "6px", objectFit: "cover", border: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }}
                                  />
                                  ) : (
                                    <Box sx={{ width: 30, height: 30, borderRadius: "6px", backgroundColor: "rgba(0,0,0,0.06)", flexShrink: 0 }} />
                                  )}
                                  <Typography sx={{ fontSize: "0.83rem", fontWeight: 600, color: "var(--primary-maroon-dark)" }}>{row.name}</Typography>
                                </Box>
                              </TableCell>
                              <TableCell sx={tableCellSx} align="center">
                                <Typography sx={{ fontSize: "0.83rem", color: "var(--text)" }}>
                                  {row.qtyNum >= MIN_BULK_QTY ? row.qtyNum.toLocaleString("en-IN") : "–"}
                                </Typography>
                              </TableCell>
                              <TableCell sx={tableCellSx} align="right">
                                <Typography sx={{ fontSize: "0.83rem", color: "var(--text)" }}>
                                  ₹ {row.unitPrice.toFixed(2)}
                                </Typography>
                              </TableCell>
                              <TableCell sx={tableCellSx} align="right">
                                <Typography sx={{ fontSize: "0.83rem", fontWeight: 600, color: "var(--primary-maroon-dark)" }}>
                                  {row.qtyNum >= MIN_BULK_QTY ? `₹ ${fmt(row.total)}` : "–"}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {/* Totals */}
                      <Box sx={{ px: 2, py: 1.5, borderTop: "1.5px solid rgba(0,0,0,0.07)", backgroundColor: "rgba(0,0,0,0.015)" }}>
                        {[
                          { label: "Subtotal", value: pricing.subtotal > 0 ? `₹ ${fmt(pricing.subtotal)}` : "–" },
                          { label: `Bulk Discount (${Math.round(pricing.discountRate * 100)}%)`, value: pricing.discountAmt > 0 ? `– ₹ ${fmt(pricing.discountAmt)}` : "–", accent: true },
                        ].map((r) => (
                          <Box key={r.label} sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
                            <Typography sx={{ fontSize: ".82rem", color: "var(--text)", opacity: 0.7 }}>{r.label}</Typography>
                            <Typography sx={{ fontSize: ".82rem", color: r.accent ? "#c62828" : "var(--text)", fontWeight: 500 }}>{r.value}</Typography>
                          </Box>
                        ))}
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography sx={{ fontSize: ".9rem", fontWeight: 700, color: "var(--primary-maroon-dark)" }}>Estimated Total</Typography>
                          <Typography sx={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--primary-maroon-dark)" }}>
                            {pricing.estimatedTotal > 0 ? `₹ ${fmt(pricing.estimatedTotal)}` : "–"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 4, px: 2, mb: 2 }}>
                      <Box sx={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 1.5 }}>
                        <Inventory2OutlinedIcon sx={{ fontSize: 32, color: "rgba(0,0,0,0.2)" }} />
                      </Box>
                      <Typography sx={{ fontWeight: 700, fontSize: ".95rem", color: "var(--primary-maroon-dark)", mb: 0.5, lineHeight: 1.4 }}>
                        Your quote summary<br />will appear here
                      </Typography>
                      <Typography sx={{ fontSize: ".8rem", color: "var(--text)", opacity: 0.7 }}>
                        Select products and enter quantities (min {MIN_BULK_QTY} pieces each).
                      </Typography>
                    </Box>
                  )}

                  {/* Order details after submit */}
                  {submitted && (form.deliveryDate || form.occasion || form.address) && (
                    <Box sx={{ mb: 2 }}>
                      {[
                        { label: "Delivery Date",    value: form.deliveryDate },
                        { label: "Occasion / Event", value: form.occasion     },
                        { label: "Delivery Address", value: form.address      },
                      ].filter((r) => r.value).map((r, i, arr) => (
                        <Box key={r.label}>
                          <Box sx={{ display: "flex", gap: 1.5, py: 1 }}>
                            <Typography sx={{ fontSize: ".82rem", fontWeight: 600, color: "var(--text)", opacity: 0.6, flexShrink: 0, minWidth: 110 }}>{r.label}</Typography>
                            <Typography sx={{ fontSize: ".82rem", color: "var(--primary-maroon-dark)", fontWeight: 500, wordBreak: "break-word" }}>: {r.value}</Typography>
                          </Box>
                          {i < arr.length - 1 && <Divider sx={{ opacity: 0.4 }} />}
                        </Box>
                      ))}
                    </Box>
                  )}

                  {/* Ready to get quote */}
                  {!submitted && pricing.allFilled && (
                    <Box sx={{ p: "12px 14px", borderRadius: "10px", backgroundColor: "rgba(248,241,230,0.7)", display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2 }}>
                      <LocalShippingOutlinedIcon sx={{ color: "var(--primary-teal-dark)", fontSize: 20, mt: 0.2 }} />
                      <Box>
                        <Typography sx={{ fontSize: ".83rem", fontWeight: 700, color: "var(--primary-teal-dark)" }}>Ready to get your quote?</Typography>
                        <Typography sx={{ fontSize: ".78rem", color: "var(--text)" }}>Click 'Get Quote' and we'll send the best price to you.</Typography>
                      </Box>
                    </Box>
                  )}

                  {/* Action buttons after submit */}
                  {submitted && (
                    <Box sx={{ display: "flex", gap: 1.5, mt: 1, flexWrap: "wrap" }}>
                      <Button fullWidth variant="contained"
                        startIcon={bulkOrderSubmitted ? <TaskAltIcon /> : <ShoppingCartOutlinedIcon />}
                        onClick={handleBulkOrderSubmit}
                        disabled={!pricing.allFilled}
                        sx={{
                          backgroundColor: bulkOrderSubmitted ? "var(--primary-teal-dark)" : "var(--primary-maroon-dark)",
                          color: "#fff", fontWeight: 700, fontSize: ".9rem", py: 1.3, borderRadius: "10px",
                          textTransform: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.14)", transition: "all 0.25s ease",
                          "&:hover": { backgroundColor: bulkOrderSubmitted ? "var(--primary-teal-dark)" : "color-mix(in srgb, var(--primary-maroon-dark), black 12%)", transform: "translateY(-1px)", boxShadow: "0 8px 22px rgba(0,0,0,0.18)" },
                          "&.Mui-disabled": { backgroundColor: "rgba(0,0,0,0.1)", color: "rgba(0,0,0,0.35)" },
                        }}
                      >
                        {bulkOrderSubmitted ? "Bulk Order Submitted!" : "Submit Bulk Order"}
                      </Button>
                      <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />}
                        sx={{ flex: 1, textTransform: "none", fontWeight: 600, fontSize: ".82rem", borderRadius: "10px", borderColor: "var(--primary-teal-dark)", color: "var(--primary-teal-dark)", py: 1, "&:hover": { backgroundColor: "color-mix(in srgb, var(--primary-teal-dark), transparent 92%)" } }}
                      >
                        Download Quote (PDF)
                      </Button>
                      <Button variant="outlined" startIcon={<RefreshOutlinedIcon />} onClick={handleReset}
                        sx={{ flex: 1, textTransform: "none", fontWeight: 600, fontSize: ".82rem", borderRadius: "10px", borderColor: "rgba(0,0,0,0.2)", color: "var(--text)", py: 1, "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" } }}
                      >
                        Request Another Quote
                      </Button>
                    </Box>
                  )}

                  {/* Why request a quote */}
                  {!submitted && (
                    <>
                      <Divider sx={{ my: 2.5 }} />
                      <Box sx={{ borderRadius: "12px", backgroundColor: "rgba(248,241,230,0.65)", p: "16px 18px" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                          <CheckCircleOutlineIcon sx={{ color: "var(--primary-teal-dark)", fontSize: 18 }} />
                          <Typography sx={{ fontWeight: 700, fontSize: ".88rem", color: "var(--primary-teal-dark)" }}>Why request a quote?</Typography>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          {WHY_QUOTE_POINTS.map((pt) => (
                            <Box key={pt} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <CheckCircleOutlineIcon sx={{ color: "var(--primary-teal-dark)", fontSize: 16, flexShrink: 0 }} />
                              <Typography sx={{ fontSize: ".82rem", color: "var(--text)" }}>{pt}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </>
                  )}

                </Paper>
              </motion.div>
            </Grid>

          </Grid>
        </Box>

        {/* ════════════════════════════════
            WHY CHOOSE MENMAI
        ════════════════════════════════ */}
        <motion.div {...zoomIn(0.15)}>
          <Box sx={{ pt: 6, pb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, mb: 4 }}>
              <Box sx={{ width: 22, height: 22, backgroundColor: "var(--or)", mask: "url('/grain-wheat-icon.svg') no-repeat center / contain", WebkitMask: "url('/grain-wheat-icon.svg') no-repeat center / contain", opacity: 0.8 }} />
              <Typography sx={{ fontSize: { xs: "1.15rem", md: "1.35rem" }, fontWeight: 700, fontFamily: "var(--font-heading)", color: "var(--primary-maroon-dark)", textAlign: "center" }}>
                Why Choose Menmai for Bulk Orders?
              </Typography>
              <Box sx={{ width: 22, height: 22, backgroundColor: "var(--or)", mask: "url('/grain-wheat-icon.svg') no-repeat center / contain", WebkitMask: "url('/grain-wheat-icon.svg') no-repeat center / contain", opacity: 0.8, transform: "scaleX(-1)" }} />
            </Box>

            <Grid container spacing={2} justifyContent="center">
              {WHY_CHOOSE.map((item, idx) => (
                <Grid item xs={6} sm={4} md={2} key={idx}>
                  <motion.div {...fadeUp(idx * 0.08)}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, p: { xs: 2, md: 2.5 }, borderRadius: "16px", border: "1.5px solid rgba(0,0,0,0.06)", backgroundColor: "#fff", height: "100%", transition: "box-shadow 0.22s ease, transform 0.22s ease", "&:hover": { boxShadow: "0 8px 24px rgba(12,61,71,0.1)", transform: "translateY(-3px)" } }}>
                      <Box sx={{ width: 54, height: 54, borderRadius: "50%", backgroundColor: "color-mix(in srgb, var(--primary-teal-dark), transparent 90%)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary-teal-dark)" }}>
                        {item.icon}
                      </Box>
                      <Typography sx={{ fontWeight: 700, fontSize: ".82rem", color: "var(--primary-maroon-dark)", textAlign: "center", lineHeight: 1.3, fontFamily: "var(--font-heading)" }}>
                        {item.title}
                      </Typography>
                      <Typography sx={{ fontSize: ".74rem", color: "var(--text)", textAlign: "center", lineHeight: 1.5, opacity: 0.7 }}>
                        {item.desc}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>

      </Container>
    </Box>
  );
}
