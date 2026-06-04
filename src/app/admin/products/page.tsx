"use client";

import { useState, useEffect } from "react";
import {
  Box, Typography, Button, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Stack, Tabs, Tab, Switch,
  FormControlLabel, Divider, Chip, Tooltip,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseIcon from "@mui/icons-material/Close";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  mrp: number | null;
  netWeight: string | null;
  pieces: number | null;
  imageUrl: string | null;
  stockQuantity: number;
  isActive: boolean;
  bulkPricePerPiece: number | null;
  minBulkQty: number | null;
  bulkStockQuantity: number;
  bulkIsActive: boolean;
  color: "teal" | "maroon";
}

/* ─────────────────────────────────────────
   THEME / STYLE CONSTANTS
───────────────────────────────────────── */
const THEME = {
  teal:   { btn: "#096171", btnHover: "#0c3d47", light: "#e6f4f6" },
  maroon: { btn: "#61220f", btnHover: "#472112", light: "#f7ede8" },
};

const C = {
  maroon:      "var(--primary-maroon-mid)",
  maroonDark:  "var(--primary-maroon-dark)",
  maroonLight: "var(--primary-maroon-light)",
  teal:        "var(--primary-teal-mid)",
  tealDark:    "var(--primary-teal-dark)",
  ivory:       "var(--ivory)",
  brown:       "var(--brown)",
  muted:       "var(--muted)",
  fontHeading: "var(--font-heading)",
  fontMain:    "var(--font-main)",
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    background: "#fafaf8",
    fontSize: 13,
    fontFamily: C.fontMain,
    "& fieldset": { borderColor: "rgba(90,40,20,0.15)" },
    "&:hover fieldset": { borderColor: C.maroonLight },
    "&.Mui-focused fieldset": { borderColor: C.teal },
  },
  "& .MuiInputLabel-root": { fontSize: 13, fontFamily: C.fontMain },
  "& .MuiInputLabel-root.Mui-focused": { color: C.teal },
  "& .MuiFormHelperText-root": { fontSize: 11, fontFamily: C.fontMain },
};

/* ─────────────────────────────────────────
   LOCKED FIELD
───────────────────────────────────────── */
function LockedField({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#9a7a58", fontFamily: C.fontMain, letterSpacing: "0.05em", textTransform: "uppercase", mb: 0.6, display: "flex", alignItems: "center", gap: 0.5 }}>
        <LockOutlinedIcon sx={{ fontSize: 12 }} />
        {label}
      </Typography>
      <Box sx={{ padding: "8px 12px", borderRadius: "10px", background: "rgba(0,0,0,0.03)", border: "1.5px dashed rgba(90,40,20,0.12)", fontSize: 13, fontFamily: C.fontMain, color: "#a08060", fontStyle: "italic" }}>
        {value}
      </Box>
    </Box>
  );
}

/* ─────────────────────────────────────────
   AFFECTS PILLS
───────────────────────────────────────── */
function AffectsPills({ items }: { items: string[] }) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
      {items.map((item) => (
        <Chip key={item} label={item} size="small" sx={{ fontSize: 10, height: 18, fontFamily: C.fontMain, bgcolor: "rgba(9,97,113,0.07)", color: C.tealDark, "& .MuiChip-label": { px: 1 } }} />
      ))}
    </Box>
  );
}

/* ─────────────────────────────────────────
   INFO NOTE
───────────────────────────────────────── */
function InfoNote({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start", p: "10px 12px", background: "rgba(9,97,113,0.06)", borderRadius: "10px", border: "1px solid rgba(9,97,113,0.12)" }}>
      <InfoOutlinedIcon sx={{ fontSize: 15, color: C.tealDark, mt: 0.15, flexShrink: 0 }} />
      <Typography sx={{ fontSize: 12, fontFamily: C.fontMain, color: "#4a6070", lineHeight: 1.6 }}>
        {children}
      </Typography>
    </Box>
  );
}

/* ─────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#9a7a58", fontFamily: C.fontMain, letterSpacing: "0.07em", textTransform: "uppercase", mb: 1.2, display: "flex", alignItems: "center", gap: 0.6 }}>
      {children}
    </Typography>
  );
}

/* ─────────────────────────────────────────
   EDIT MODAL
───────────────────────────────────────── */
interface EditForm {
  price:             number | "";
  mrp:               number | "";
  netWeight:         string;
  pieces:            number | "";
  stockQuantity:     number | "";
  isActive:          boolean;
  bulkPricePerPiece: number | "";
  minBulkQty:        number | "";
  bulkStockQuantity: number | "";
  bulkIsActive:      boolean;
}

function ProductModal({
  product,
  onClose,
  onSave,
}: {
  product: Product;
  onClose: () => void;
  onSave: (updated: Product) => void;
}) {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState<EditForm>({
    price:             product.price,
    mrp:               product.mrp ?? "",
    netWeight:         product.netWeight ?? "",
    pieces:            product.pieces ?? "",
    stockQuantity:     product.stockQuantity,
    isActive:          product.isActive,
    bulkPricePerPiece: product.bulkPricePerPiece ?? "",
    minBulkQty:        product.minBulkQty ?? 200,
    bulkStockQuantity: product.bulkStockQuantity,
    bulkIsActive:      product.bulkIsActive,
  });

  const set = (key: keyof EditForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setForm((prev) => ({ ...prev, [key]: v === "" ? "" : isNaN(Number(v)) ? v : v }));
    };

  const handleSave = () => {
    onSave({
      ...product,
      price:             Number(form.price) || product.price,
      mrp:               form.mrp === "" ? null : Number(form.mrp),
      netWeight:         form.netWeight || null,
      pieces:            form.pieces === "" ? null : Number(form.pieces),
      stockQuantity:     Number(form.stockQuantity) || 0,
      isActive:          form.isActive,
      bulkPricePerPiece: form.bulkPricePerPiece === "" ? null : Number(form.bulkPricePerPiece),
      minBulkQty:        form.minBulkQty === "" ? null : Number(form.minBulkQty),
      bulkStockQuantity: Number(form.bulkStockQuantity) || 0,
      bulkIsActive:      form.bulkIsActive,
    });
  };

  const isTeal = product.color === "teal";
  const accentColor = isTeal ? C.teal : C.maroon;

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          boxShadow: "0 24px 64px rgba(70,33,18,.18)",
          overflow: "hidden",
        },
      }}
    >
      {/* ── Header ── */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          pb: 0,
          pt: 2.5,
          px: 3,
        }}
      >
        <Box>
          <Typography sx={{ fontFamily: C.fontHeading, fontWeight: 700, fontSize: 18, color: C.maroonDark, lineHeight: 1.2 }}>
            Edit product
          </Typography>
          <Typography sx={{ fontFamily: C.fontMain, fontSize: 12.5, color: "#9a7a58", mt: 0.3 }}>
            {product.name}
            <Box component="span" sx={{ mx: 0.8, opacity: 0.4 }}>·</Box>
            <Box component="span" sx={{ fontStyle: "italic" }}>/{product.slug}</Box>
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: C.muted, mt: 0.3 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* ── Tabs ── */}
      <Box sx={{ px: 3, pt: 1.5 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            minHeight: 36,
            "& .MuiTabs-indicator": { backgroundColor: accentColor, height: 2 },
            "& .MuiTab-root": {
              minHeight: 36, fontSize: 12.5, fontFamily: C.fontMain, fontWeight: 600,
              textTransform: "none", color: "#9a7a58", px: 2, gap: 0.6,
              "&.Mui-selected": { color: accentColor },
            },
          }}
        >
          <Tab icon={<HomeOutlinedIcon sx={{ fontSize: 15 }} />} iconPosition="start" label="Homepage & product details" />
          <Tab icon={<StorefrontOutlinedIcon sx={{ fontSize: 15 }} />} iconPosition="start" label="Bulk order" />
        </Tabs>
        <Divider />
      </Box>

      {/* ── Body ── */}
      <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>

        {/* ══ TAB 0 — Homepage & Product Details ══ */}
        {tab === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

            {/* Locked fields */}
            <Box>
              <SectionLabel>
                <LockOutlinedIcon sx={{ fontSize: 13 }} />
                Read-only
              </SectionLabel>
              <Grid container spacing={1.5}>
                <Grid item xs={6}><LockedField label="Product name" value={product.name} /></Grid>
                <Grid item xs={6}><LockedField label="Slug" value={product.slug} /></Grid>
              </Grid>
            </Box>

            <Divider sx={{ borderStyle: "dashed", borderColor: "rgba(90,40,20,0.12)" }} />

            {/* Pricing & weight */}
            <Box>
              <SectionLabel>Pricing &amp; weight</SectionLabel>
              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <TextField
                    label="Selling price (₹)" type="number" fullWidth
                    value={form.price} onChange={set("price")} sx={inputSx}
                  />
                  <AffectsPills items={["Homepage card", "Product page", "Cart"]} />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="MRP / strikethrough (₹)" type="number" fullWidth
                    value={form.mrp} onChange={set("mrp")} sx={inputSx}
                    helperText="Used for % OFF calculation"
                  />
                  <AffectsPills items={["Homepage card", "Product page % OFF"]} />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Net weight" fullWidth
                    value={form.netWeight} onChange={set("netWeight")} sx={inputSx}
                    placeholder="e.g. 450g"
                  />
                  <AffectsPills items={["Homepage card", "Product page"]} />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Pieces per pack" type="number" fullWidth
                    value={form.pieces} onChange={set("pieces")} sx={inputSx}
                    placeholder="e.g. 10"
                  />
                  <AffectsPills items={["Product page label"]} />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ borderStyle: "dashed", borderColor: "rgba(90,40,20,0.12)" }} />

            {/* Visibility & stock */}
            <Box>
              <SectionLabel>Visibility &amp; stock</SectionLabel>
              <Stack spacing={1.5}>

                {/* isActive toggle */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: "10px 14px", borderRadius: "12px", border: "1.5px solid", borderColor: form.isActive ? "rgba(9,97,113,0.2)" : "rgba(220,0,0,0.15)", background: form.isActive ? "rgba(9,97,113,0.04)" : "rgba(220,0,0,0.03)" }}>
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, fontFamily: C.fontMain, color: C.maroonDark }}>
                      Active on homepage &amp; product page
                    </Typography>
                    <Typography sx={{ fontSize: 11.5, fontFamily: C.fontMain, color: "#9a7a58", mt: 0.3 }}>
                      If off — product is hidden from all customer-facing pages
                    </Typography>
                  </Box>
                  <Switch
                    checked={form.isActive}
                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": { color: C.teal },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: C.teal },
                    }}
                  />
                </Box>

                {/* Stock qty */}
                <Box>
                  <TextField
                    label="Stock quantity" type="number" fullWidth
                    value={form.stockQuantity} onChange={set("stockQuantity")} sx={inputSx}
                    helperText="If 0 — shows 'Out of stock' badge on homepage & product page"
                  />
                </Box>

                <InfoNote>
                  Setting stock to 0 or toggling active off here only affects the <strong>homepage and product details page</strong>. Bulk order has its own independent stock and active settings in the next tab.
                </InfoNote>
              </Stack>
            </Box>
          </Box>
        )}

        {/* ══ TAB 1 — Bulk Order ══ */}
        {tab === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

            {/* Bulk pricing */}
            <Box>
              <SectionLabel>
                <StorefrontOutlinedIcon sx={{ fontSize: 13 }} />
                Bulk pricing
              </SectionLabel>
              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <TextField
                    label="Bulk price per piece (₹)" type="number" fullWidth
                    value={form.bulkPricePerPiece} onChange={set("bulkPricePerPiece")} sx={inputSx}
                    placeholder="e.g. 3.80"
                  />
                  <AffectsPills items={["Bulk order dropdown", "Live price calc", "Order summary"]} />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Minimum order qty (pieces)" type="number" fullWidth
                    value={form.minBulkQty} onChange={set("minBulkQty")} sx={inputSx}
                    placeholder="e.g. 200"
                  />
                  <AffectsPills items={["Bulk order page", "Validation message"]} />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ borderStyle: "dashed", borderColor: "rgba(90,40,20,0.12)" }} />

            {/* Bulk visibility & stock */}
            <Box>
              <SectionLabel>Bulk order visibility &amp; stock</SectionLabel>
              <Stack spacing={1.5}>

                {/* bulkIsActive toggle */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: "10px 14px", borderRadius: "12px", border: "1.5px solid", borderColor: form.bulkIsActive ? "rgba(9,97,113,0.2)" : "rgba(220,0,0,0.15)", background: form.bulkIsActive ? "rgba(9,97,113,0.04)" : "rgba(220,0,0,0.03)" }}>
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, fontFamily: C.fontMain, color: C.maroonDark }}>
                      Active on bulk order page
                    </Typography>
                    <Typography sx={{ fontSize: 11.5, fontFamily: C.fontMain, color: "#9a7a58", mt: 0.3 }}>
                      Completely independent from homepage / product page active state
                    </Typography>
                  </Box>
                  <Switch
                    checked={form.bulkIsActive}
                    onChange={(e) => setForm((f) => ({ ...f, bulkIsActive: e.target.checked }))}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": { color: C.teal },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: C.teal },
                    }}
                  />
                </Box>

                {/* Bulk stock qty */}
                <Box>
                  <TextField
                    label="Bulk stock quantity" type="number" fullWidth
                    value={form.bulkStockQuantity} onChange={set("bulkStockQuantity")} sx={inputSx}
                    helperText="If 0 — shows 'Out of stock for bulk orders' on the bulk order page"
                  />
                </Box>

                <InfoNote>
                  This stock and active state are <strong>separate from retail</strong>. A product can be out of stock at retail but still available for bulk orders, or vice versa.
                </InfoNote>
              </Stack>
            </Box>
          </Box>
        )}
      </DialogContent>

      {/* ── Footer ── */}
      <DialogActions
        sx={{
          px: 3, py: 2,
          borderTop: "1px solid rgba(90,40,20,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: 11.5, fontFamily: C.fontMain, color: "#b0998a", fontStyle: "italic" }}>
          Product image is managed in code — not editable here
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            onClick={onClose}
            sx={{ borderRadius: "10px", border: "1.5px solid rgba(90,40,20,0.15)", color: C.brown, fontFamily: C.fontMain, fontSize: 13, textTransform: "none", px: 2.5, "&:hover": { background: "#faf6f2" } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ borderRadius: "10px", background: isTeal ? C.teal : C.maroon, color: "#fff", fontFamily: C.fontMain, fontSize: 13, fontWeight: 700, textTransform: "none", px: 2.5, boxShadow: "none", "&:hover": { background: isTeal ? C.tealDark : C.maroonDark, boxShadow: "none" } }}
          >
            Save changes
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

/* ─────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────── */
function ProductCard({ product, onEdit }: { product: Product; onEdit: () => void }) {
  const t = THEME[product.color];
  const isOutOfStock = product.stockQuantity === 0;
  const isBulkOutOfStock = product.bulkStockQuantity === 0;

  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: "14px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        boxShadow: "0 2px 16px rgba(70,33,18,.10)",
        transition: "transform .17s ease, box-shadow .17s ease",
        opacity: product.isActive ? 1 : 0.6,
        "&:hover": { transform: "translateY(-2px)", boxShadow: "0 8px 28px rgba(70,33,18,.15)" },
      }}
    >
      {/* Image */}
      <Box sx={{ position: "relative", width: "100%", height: 185, overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box component="img" src={product.imageUrl ?? ""} alt={product.name}
          sx={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", p: "12px 16px 4px" }}
        />
        {/* isActive badge */}
        {!product.isActive && (
          <Box sx={{ position: "absolute", top: 8, left: 8, bgcolor: "rgba(180,0,0,0.85)", color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: C.fontMain, px: 1, py: 0.3, borderRadius: "6px", letterSpacing: "0.04em" }}>
            INACTIVE
          </Box>
        )}
        {isOutOfStock && product.isActive && (
          <Box sx={{ position: "absolute", top: 8, left: 8, bgcolor: "rgba(200,120,0,0.85)", color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: C.fontMain, px: 1, py: 0.3, borderRadius: "6px", letterSpacing: "0.04em" }}>
            OUT OF STOCK
          </Box>
        )}
      </Box>

      {/* Info */}
      <Box sx={{ px: 2, pt: 1.2, pb: 0 }}>
        <Typography sx={{ fontFamily: C.fontHeading, fontWeight: 700, fontSize: 15, color: "#1a0a04", mb: 0.5, lineHeight: 1.25 }}>
          {product.name}
        </Typography>

        {/* Price row */}
        <Stack direction="row" alignItems="baseline" spacing={0.8} mb={0.6}>
          <Typography sx={{ fontWeight: 800, fontSize: 20, color: "#1a0a04", lineHeight: 1, fontFamily: C.fontMain }}>₹{product.price}</Typography>
          {product.mrp && (
            <>
              <Typography sx={{ fontSize: 13, color: "#bbb", textDecoration: "line-through", fontFamily: C.fontMain }}>₹{product.mrp}</Typography>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#2e9e60", fontFamily: C.fontMain }}>
                {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
              </Typography>
            </>
          )}
        </Stack>

        {/* Weight */}
        {product.netWeight && (
          <Typography sx={{ fontSize: 11.5, color: "#9a7a58", fontFamily: C.fontMain, mb: 0.8 }}>
            {product.pieces ? `Pack of ${product.pieces} pcs` : ""}{product.pieces && product.netWeight ? " · " : ""}{product.netWeight}
          </Typography>
        )}

        {/* Status pills row */}
        <Stack direction="row" spacing={0.8} flexWrap="wrap" mb={1.4}>
          {/* Retail stock */}
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, bgcolor: isOutOfStock ? "#fff3e0" : "#edfaf4", border: "1px solid", borderColor: isOutOfStock ? "#ffcc80" : "#b2e8d0", borderRadius: "20px", px: 1, py: 0.25 }}>
            <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: isOutOfStock ? "#f57c00" : "#22c87a", flexShrink: 0 }} />
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: isOutOfStock ? "#e65100" : "#17a062", fontFamily: C.fontMain }}>
              {isOutOfStock ? "Out of stock" : `${product.stockQuantity} retail`}
            </Typography>
          </Box>
          {/* Bulk stock */}
          <Tooltip title="Bulk order stock (independent)" arrow>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, bgcolor: isBulkOutOfStock ? "#fce4ec" : "#e8f4fd", border: "1px solid", borderColor: isBulkOutOfStock ? "#f48fb1" : "#90caf9", borderRadius: "20px", px: 1, py: 0.25, cursor: "default" }}>
              <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: isBulkOutOfStock ? "#c2185b" : "#1976d2", flexShrink: 0 }} />
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: isBulkOutOfStock ? "#ad1457" : "#1565c0", fontFamily: C.fontMain }}>
                {isBulkOutOfStock ? "Bulk out" : `${product.bulkStockQuantity} bulk`}
              </Typography>
            </Box>
          </Tooltip>
        </Stack>
      </Box>

      {/* Divider */}
      <Box sx={{ height: "1px", background: "#f0ece6", mx: 2, mb: 1.4 }} />

      {/* Buttons */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined" fullWidth
            startIcon={<VisibilityOutlinedIcon sx={{ fontSize: "14px !important" }} />}
            sx={{ borderColor: "#e0d5c8", color: "#666", borderRadius: "8px", textTransform: "none", fontWeight: 500, fontSize: 12.5, py: 0.75, fontFamily: C.fontMain, "&:hover": { borderColor: "#bbb", background: "transparent" } }}
          >
            View
          </Button>
          <Button
            variant="contained" fullWidth
            startIcon={<EditOutlinedIcon sx={{ fontSize: "14px !important" }} />}
            onClick={onEdit}
            sx={{ background: t.btn, color: "#fff", borderRadius: "8px", textTransform: "none", fontWeight: 600, fontSize: 12.5, py: 0.75, fontFamily: C.fontMain, boxShadow: "none", "&:hover": { background: t.btnHover, boxShadow: "none" } }}
          >
            Edit product
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function ProductsPage() {
  const [products, setProducts]       = useState<Product[]>([]);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.map((p: any, i: number) => ({
            ...p,
            bulkStockQuantity: p.bulkStockQuantity ?? 0,
            bulkIsActive:      p.bulkIsActive      ?? true,
            minBulkQty:        p.minBulkQty        ?? 200,
            color:             i % 2 === 0 ? "teal" : "maroon",
          }))
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (updated: Product) => {
    try {
      await fetch(`/api/admin/products/${updated.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price:             updated.price,
          mrp:               updated.mrp,
          netWeight:         updated.netWeight,
          pieces:            updated.pieces,
          stockQuantity:     updated.stockQuantity,
          isActive:          updated.isActive,
          bulkPricePerPiece: updated.bulkPricePerPiece,
          minBulkQty:        updated.minBulkQty,
          bulkStockQuantity: updated.bulkStockQuantity,
          bulkIsActive:      updated.bulkIsActive,
        }),
      });
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      console.error("Save failed", err);
    }
    setEditProduct(null);
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#f5f0eb", p: { xs: 2, sm: 3 }, display: "flex", flexDirection: "column" }}>
      <Typography variant="h5" sx={{ fontFamily: C.fontHeading, fontWeight: 700, color: "#1a0a04", letterSpacing: "-0.3px", mb: 0.5 }}>
        Products
      </Typography>
      <Typography sx={{ fontFamily: C.fontMain, fontSize: 13, color: C.muted, mb: 3 }}>
        Edit pricing, stock, visibility and bulk settings. Image and slug are read-only.
      </Typography>

      {loading ? (
        <Typography sx={{ fontFamily: C.fontMain, color: C.muted }}>Loading…</Typography>
      ) : (
        <Grid container spacing={2}>
          {products.map((p) => (
            <Grid item key={p.id} xs={12} sm={6} md={4} lg={3} sx={{ display: "flex" }}>
              <ProductCard product={p} onEdit={() => setEditProduct(p)} />
            </Grid>
          ))}
        </Grid>
      )}

      {editProduct && (
        <ProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSave={handleSave}
        />
      )}
    </Box>
    
  );
  
}