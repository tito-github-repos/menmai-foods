"use client";

import { useState, useEffect } from "react";
import {
  Box, Typography, Button, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Stack, Tabs, Tab, Switch,
  Divider, Chip, Container,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseIcon from "@mui/icons-material/Close";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

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
  bulkIsActive: boolean;
  color: "teal" | "maroon";
}

const C = {
  maroon:      "var(--primary-maroon-mid)",
  maroonDark:  "var(--primary-maroon-dark)",
  maroonLight: "var(--primary-maroon-light)",
  teal:        "var(--primary-teal-mid)",
  tealDark:    "var(--primary-teal-dark)",
  brown:       "var(--brown)",
  muted:       "var(--muted)",
  fontHeading: "var(--font-heading)",
  fontMain:    "var(--font-main)",
};

const MAROON      = "#61220f";
const MAROON_DARK = "#3d1509";
const TEAL        = "#096171";
const TEAL_DARK   = "#0c3d47";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    background: "#fafaf8",
    fontSize: 13,
    fontFamily: C.fontMain,
    "& fieldset": { borderColor: "rgba(90,40,20,0.15)" },
    "&:hover fieldset": { borderColor: C.maroonLight },
    "&.Mui-focused fieldset": { borderColor: TEAL },
  },
  "& .MuiInputLabel-root": { fontSize: 13, fontFamily: C.fontMain },
  "& .MuiInputLabel-root.Mui-focused": { color: TEAL },
  "& .MuiFormHelperText-root": { fontSize: 11, fontFamily: C.fontMain },
};

function LockedField({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#9a7a58", fontFamily: C.fontMain, letterSpacing: "0.05em", textTransform: "uppercase", mb: 0.6, display: "flex", alignItems: "center", gap: 0.5 }}>
        <LockOutlinedIcon sx={{ fontSize: 12 }} />{label}
      </Typography>
      <Box sx={{ padding: "8px 12px", borderRadius: "10px", background: "rgba(0,0,0,0.03)", border: "1.5px dashed rgba(90,40,20,0.12)", fontSize: 13, fontFamily: C.fontMain, color: "#a08060", fontStyle: "italic" }}>
        {value}
      </Box>
    </Box>
  );
}

function AffectsPills({ items }: { items: string[] }) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
      {items.map((item) => (
        <Chip key={item} label={item} size="small" sx={{ fontSize: 10, height: 18, fontFamily: C.fontMain, bgcolor: "rgba(9,97,113,0.07)", color: TEAL_DARK, "& .MuiChip-label": { px: 1 } }} />
      ))}
    </Box>
  );
}

function InfoNote({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start", p: "10px 12px", background: "rgba(9,97,113,0.06)", borderRadius: "10px", border: "1px solid rgba(9,97,113,0.12)" }}>
      <InfoOutlinedIcon sx={{ fontSize: 15, color: TEAL_DARK, mt: 0.15, flexShrink: 0 }} />
      <Typography sx={{ fontSize: 12, fontFamily: C.fontMain, color: "#4a6070", lineHeight: 1.6 }}>{children}</Typography>
    </Box>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#9a7a58", fontFamily: C.fontMain, letterSpacing: "0.07em", textTransform: "uppercase", mb: 1.2, display: "flex", alignItems: "center", gap: 0.6 }}>
      {children}
    </Typography>
  );
}

interface EditForm {
  price:             number | "";
  mrp:               number | "";
  netWeight:         string;
  pieces:            number | "";
  stockQuantity:     number | "";
  isActive:          boolean;
  bulkPricePerPiece: number | "";
  minBulkQty:        number | "";
  bulkIsActive:      boolean;
}

function ProductModal({ product, onClose, onSave }: {
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
    bulkIsActive:      product.bulkIsActive,
  });

  const set = (key: keyof EditForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value === "" ? "" : e.target.value }));

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
      bulkIsActive:      form.bulkIsActive,
    });
  };

  const isTeal      = product.color === "teal";
  const accentColor = isTeal ? TEAL : MAROON;
  const accentDark  = isTeal ? TEAL_DARK : MAROON_DARK;

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: "20px", boxShadow: "0 24px 64px rgba(70,33,18,.18)", overflow: "hidden" } }}>

      <DialogTitle sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", pb: 0, pt: 2.5, px: 3 }}>
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

      <Box sx={{ px: 3, pt: 1.5 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{
          minHeight: 36,
          "& .MuiTabs-indicator": { backgroundColor: accentColor, height: 2 },
          "& .MuiTab-root": { minHeight: 36, fontSize: 12.5, fontFamily: C.fontMain, fontWeight: 600, textTransform: "none", color: "#9a7a58", px: 2, gap: 0.6, "&.Mui-selected": { color: accentColor } },
        }}>
          <Tab icon={<HomeOutlinedIcon sx={{ fontSize: 15 }} />} iconPosition="start" label="Homepage & product details" />
          <Tab icon={<StorefrontOutlinedIcon sx={{ fontSize: 15 }} />} iconPosition="start" label="Bulk order" />
        </Tabs>
        <Divider />
      </Box>

      <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
        {tab === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box>
              <SectionLabel><LockOutlinedIcon sx={{ fontSize: 13 }} />Read-only</SectionLabel>
              <Grid container spacing={1.5}>
                <Grid item xs={6}><LockedField label="Product name" value={product.name} /></Grid>
                <Grid item xs={6}><LockedField label="Slug" value={product.slug} /></Grid>
              </Grid>
            </Box>
            <Divider sx={{ borderStyle: "dashed", borderColor: "rgba(90,40,20,0.12)" }} />
            <Box>
              <SectionLabel>Pricing &amp; weight</SectionLabel>
              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <TextField label="Selling price (₹)" type="number" fullWidth value={form.price} onChange={set("price")} sx={inputSx} />
                  <AffectsPills items={["Homepage card", "Product page", "Cart"]} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="MRP / strikethrough (₹)" type="number" fullWidth value={form.mrp} onChange={set("mrp")} sx={inputSx} helperText="Used for % OFF calculation" />
                  <AffectsPills items={["Homepage card", "Product page % OFF"]} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Net weight" fullWidth value={form.netWeight} onChange={set("netWeight")} sx={inputSx} placeholder="e.g. 450g" />
                  <AffectsPills items={["Homepage card", "Product page"]} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Pieces per pack" type="number" fullWidth value={form.pieces} onChange={set("pieces")} sx={inputSx} placeholder="e.g. 10" />
                  <AffectsPills items={["Product page label"]} />
                </Grid>
              </Grid>
            </Box>
            <Divider sx={{ borderStyle: "dashed", borderColor: "rgba(90,40,20,0.12)" }} />
            <Box>
              <SectionLabel>Visibility &amp; stock</SectionLabel>
              <Stack spacing={1.5}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: "10px 14px", borderRadius: "12px", border: "1.5px solid", borderColor: form.isActive ? "rgba(9,97,113,0.2)" : "rgba(220,0,0,0.15)", background: form.isActive ? "rgba(9,97,113,0.04)" : "rgba(220,0,0,0.03)" }}>
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, fontFamily: C.fontMain, color: C.maroonDark }}>Active on homepage &amp; product page</Typography>
                    <Typography sx={{ fontSize: 11.5, fontFamily: C.fontMain, color: "#9a7a58", mt: 0.3 }}>If off — product is hidden from all customer-facing pages</Typography>
                  </Box>
                  <Switch checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                    sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: TEAL }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: TEAL } }} />
                </Box>
                <TextField label="Stock quantity" type="number" fullWidth value={form.stockQuantity} onChange={set("stockQuantity")} sx={inputSx} helperText="If 0 — shows 'Out of stock' on homepage & product page" />
                <InfoNote>
                  Changing stock or active state here only affects the <strong>homepage and product details page</strong>. Bulk order has its own independent active setting in the next tab.
                </InfoNote>
              </Stack>
            </Box>
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box>
              <SectionLabel><StorefrontOutlinedIcon sx={{ fontSize: 13 }} />Bulk pricing</SectionLabel>
              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <TextField label="Bulk price per piece (₹)" type="number" fullWidth value={form.bulkPricePerPiece} onChange={set("bulkPricePerPiece")} sx={inputSx} placeholder="e.g. 3.80" />
                  <AffectsPills items={["Bulk order dropdown", "Live price calc", "Order summary"]} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Minimum order qty (pieces)" type="number" fullWidth value={form.minBulkQty} onChange={set("minBulkQty")} sx={inputSx} placeholder="e.g. 200" />
                  <AffectsPills items={["Bulk order page", "Validation message"]} />
                </Grid>
              </Grid>
            </Box>
            <Divider sx={{ borderStyle: "dashed", borderColor: "rgba(90,40,20,0.12)" }} />
            <Box>
              <SectionLabel>Bulk order visibility</SectionLabel>
              <Stack spacing={1.5}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: "10px 14px", borderRadius: "12px", border: "1.5px solid", borderColor: form.bulkIsActive ? "rgba(9,97,113,0.2)" : "rgba(220,0,0,0.15)", background: form.bulkIsActive ? "rgba(9,97,113,0.04)" : "rgba(220,0,0,0.03)" }}>
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, fontFamily: C.fontMain, color: C.maroonDark }}>Active on bulk order page</Typography>
                    <Typography sx={{ fontSize: 11.5, fontFamily: C.fontMain, color: "#9a7a58", mt: 0.3 }}>Completely independent from homepage / product page active state</Typography>
                  </Box>
                  <Switch checked={form.bulkIsActive} onChange={(e) => setForm((f) => ({ ...f, bulkIsActive: e.target.checked }))}
                    sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: TEAL }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: TEAL } }} />
                </Box>
                <InfoNote>
                  Bulk orders are prepared fresh after placement — <strong>no pre-stocked inventory needed</strong>. Only the active toggle controls whether this product shows on the bulk order page.
                </InfoNote>
              </Stack>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid rgba(90,40,20,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ fontSize: 11.5, fontFamily: C.fontMain, color: "#b0998a", fontStyle: "italic" }}>
          Product image is managed in code — not editable here
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button onClick={onClose} sx={{ borderRadius: "10px", border: "1.5px solid rgba(90,40,20,0.15)", color: C.brown, fontFamily: C.fontMain, fontSize: 13, textTransform: "none", px: 2.5, "&:hover": { background: "#faf6f2" } }}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" sx={{ borderRadius: "10px", background: isTeal ? TEAL : MAROON, color: "#fff", fontFamily: C.fontMain, fontSize: 13, fontWeight: 700, textTransform: "none", px: 2.5, boxShadow: "none", "&:hover": { background: accentDark, boxShadow: "none" } }}>
            Save changes
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, onEdit }: { product: Product; onEdit: () => void }) {
  const isOutOfStock = product.stockQuantity === 0;

  return (
    <Box sx={{
      background: "#fff",
      borderRadius: "10px",
      border: "1px solid #ede8e2",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      width: "100%",
      transition: "box-shadow .17s ease",
      opacity: product.isActive ? 1 : 0.55,
      "&:hover": { boxShadow: "0 4px 18px rgba(70,33,18,.11)" },
    }}>

      {/* ── Image — fixed aspect ratio so full image is always visible ── */}
      <Box sx={{
        width: "100%",
        aspectRatio: "3 / 4",   // keeps proportional on all screen sizes
        background: "#f9f6f2",
        position: "relative",
        overflow: "hidden",
      }}>
        {product.imageUrl ? (
          <Box
            component="img"
            src={product.imageUrl}
            alt={product.name}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",      // fills frame without stretching
              objectPosition: "center",
              display: "block",
            }}
          />
        ) : (
          <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography sx={{ fontSize: 48 }}>🍽</Typography>
          </Box>
        )}

        {/* Status badge — INACTIVE takes priority over OUT OF STOCK */}
        {!product.isActive ? (
          <Box sx={{ position: "absolute", top: 8, left: 8, bgcolor: "rgba(160,0,0,0.85)", color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: C.fontMain, px: 1, py: 0.3, borderRadius: "6px", letterSpacing: "0.05em" }}>
            INACTIVE
          </Box>
        ) : isOutOfStock ? (
          <Box sx={{ position: "absolute", top: 8, left: 8, bgcolor: "rgba(180,90,0,0.88)", color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: C.fontMain, px: 1, py: 0.3, borderRadius: "6px", letterSpacing: "0.05em" }}>
            OUT OF STOCK
          </Box>
        ) : null}
      </Box>

      {/* ── Info ── */}
      <Box sx={{ px: 2, pt: 1.5, pb: 0.5, flexGrow: 1 }}>
        <Typography sx={{ fontFamily: C.fontHeading, fontWeight: 700, fontSize: { xs: 14, md: 15 }, color: "#1a0a04", mb: 0.5, lineHeight: 1.2 }}>
          {product.name}
        </Typography>
        <Typography sx={{ fontFamily: C.fontMain, fontSize: 13.5, fontWeight: 700, color: MAROON, mb: 0.4 }}>
          ₹{product.price} / piece
        </Typography>
        <Typography sx={{ fontFamily: C.fontMain, fontSize: 12.5, color: "#777" }}>
          Stock:{" "}
          <Box component="span" sx={{ fontWeight: 700, color: isOutOfStock ? "#c0392b" : TEAL }}>
            {isOutOfStock ? "Out of stock" : `${product.stockQuantity} available`}
          </Box>
        </Typography>
      </Box>

      {/* ── Actions ── */}
      <Box sx={{ px: 2, pt: 1.2, pb: 1.5 }}>
        <Stack direction="row" spacing={0.75}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<VisibilityOutlinedIcon sx={{ fontSize: "13px !important" }} />}
            sx={{ borderColor: "#e0d5c8", color: "#999", borderRadius: "7px", textTransform: "none", fontWeight: 500, fontSize: 12.5, py: 0.6, fontFamily: C.fontMain, "&:hover": { borderColor: "#bbb", background: "transparent" } }}
          >
            View
          </Button>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<EditOutlinedIcon sx={{ fontSize: "13px !important" }} />}
            onClick={onEdit}
            sx={{ borderColor: MAROON, color: MAROON, borderRadius: "7px", textTransform: "none", fontWeight: 600, fontSize: 12.5, py: 0.6, fontFamily: C.fontMain, "&:hover": { background: "rgba(97,34,15,0.04)", borderColor: MAROON_DARK } }}
          >
            Edit
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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
            bulkIsActive: p.bulkIsActive ?? true,
            minBulkQty:   p.minBulkQty   ?? 200,
            color:        i % 2 === 0 ? "teal" : "maroon",
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
    <Container
      maxWidth={false}
      sx={{ py: { xs: 2, md: 4 }, px: { xs: 1.5, sm: 2, md: 3 } }}
    >
      {loading ? (
        <Typography sx={{ fontFamily: C.fontMain, color: C.muted, fontSize: 13 }}>
          Loading…
        </Typography>
      ) : products.length === 0 ? (
        <Typography sx={{ fontFamily: C.fontMain, color: C.muted, fontSize: 13 }}>
          No products found.
        </Typography>
      ) : (
        <Grid container spacing={{ xs: 2, md: 3 }}>
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

      {/* ── Footer ── */}
      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          color: "#777",
          fontSize: 13,
        }}
      >
        <Typography variant="body2">© 2026 Menmai Foods. All rights reserved.</Typography>
        <Typography variant="body2">Made with ❤️ for better food experiences.</Typography>
      </Box>
    </Container>
  );
}
