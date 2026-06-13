"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Grid, IconButton, InputAdornment, MenuItem, Paper, Select, Stack,
  Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography,
  Avatar, Tooltip, Divider, alpha,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import FiberNewRoundedIcon from "@mui/icons-material/FiberNewRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";

type BulkStatus = "NEW" | "ACCEPTED" | "IN_DISCUSSION" | "REJECTED" | "DELIVERED";

type Product = {
  id: number;
  name: string;
  price: number;
  pieces: number | null;
  bulkPricePerPiece: number | null;
};

type BulkOrderItem = {
  id: number;
  productId?: number | null;
  productName: string;
  quantity: number;
  unitPrice: number | null;
  totalPrice: number | null;
};

type BulkOrder = {
  id: number;
  orderRef: string;
  customerName: string;
  phone: string;
  email: string | null;
  deliveryDate: string;
  deliveryTime: string;
  occasion: string;
  deliveryAddress: string;
  pincode: string;
  subtotal: number;
  deliveryCharge: number;
  estimatedTotal: number;
  status: BulkStatus;
  source: "CUSTOMER_FORM" | "ADMIN_MANUAL";
  notes: string | null;
  createdAt: string;
  items: BulkOrderItem[];
};

type FormItem = {
  productId: number | "";
  name: string;
  quantity: string;
  unitPrice: string;
};

type FormState = {
  id?: number;
  customerName: string;
  phone: string;
  email: string;
  deliveryDate: string;
  deliveryTime: string;
  occasion: string;
  deliveryAddress: string;
  pincode: string;
  deliveryCharge: string;
  status: BulkStatus;
  notes: string;
  items: FormItem[];
};

const statusOptions: BulkStatus[] = ["NEW", "ACCEPTED", "IN_DISCUSSION", "REJECTED", "DELIVERED"];

const statusLabel: Record<BulkStatus, string> = {
  NEW: "New",
  ACCEPTED: "Accepted",
  IN_DISCUSSION: "In Discussion",
  REJECTED: "Rejected",
  DELIVERED: "Delivered",
};

const statusColor: Record<BulkStatus, { bg: string; color: string; border: string }> = {
  NEW:          { bg: "#fffbeb", color: "#92400e", border: "#fde68a" },
  ACCEPTED:     { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" },
  IN_DISCUSSION:{ bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  REJECTED:     { bg: "#fff1f2", color: "#9f1239", border: "#fecdd3" },
  DELIVERED:    { bg: "#f5f3ff", color: "#6d28d9", border: "#ddd6fe" },
};

const emptyForm: FormState = {
  customerName: "",
  phone: "",
  email: "",
  deliveryDate: "",
  deliveryTime: "",
  occasion: "",
  deliveryAddress: "",
  pincode: "",
  deliveryCharge: "0",
  status: "NEW",
  notes: "",
  items: [{ productId: "", name: "", quantity: "", unitPrice: "" }],
};

function formatMoney(value: number | null | undefined) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function toDateInput(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const BRAND = "#006d77";
const BRAND_DARK = "#004f58";
const BRAND_LIGHT = "#e0f4f6";

const statCards = [
  { key: "total",      label: "Total Orders",   icon: InventoryRoundedIcon,       color: "#64748b", bg: "#f8fafc" },
  { key: "newOrders",  label: "New",             icon: FiberNewRoundedIcon,        color: "#d97706", bg: "#fffbeb" },
  { key: "discussion", label: "In Discussion",   icon: ForumRoundedIcon,           color: "#2563eb", bg: "#eff6ff" },
  { key: "accepted",   label: "Accepted",        icon: CheckCircleRoundedIcon,     color: "#16a34a", bg: "#f0fdf4" },
  { key: "rejected",   label: "Rejected",        icon: CancelRoundedIcon,          color: "#e11d48", bg: "#fff1f2" },
  { key: "delivered",  label: "Delivered",       icon: LocalShippingRoundedIcon,   color: "#7c3aed", bg: "#f5f3ff" },
];

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#fff",
    fontSize: 14,
    "&:hover fieldset": { borderColor: BRAND },
    "&.Mui-focused fieldset": { borderColor: BRAND, borderWidth: 2 },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: BRAND },
};

export default function AdminBulkOrdersPage() {
  const [orders, setOrders] = useState<BulkOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | BulkStatus>("ALL");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"ADD" | "EDIT">("ADD");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchOrders = async () => {
    const res = await fetch("/api/bulk-orders");
    const data = await res.json();
    setOrders(data.orders || []);
  };

  useEffect(() => {
    fetchOrders();
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data || []));
  }, []);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesSearch =
        !q ||
        order.orderRef.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.phone.includes(q) ||
        order.pincode.includes(q) ||
        order.deliveryAddress.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const stats = useMemo(() => ({
    total:      orders.length,
    newOrders:  orders.filter((o) => o.status === "NEW").length,
    discussion: orders.filter((o) => o.status === "IN_DISCUSSION").length,
    accepted:   orders.filter((o) => o.status === "ACCEPTED").length,
    rejected:   orders.filter((o) => o.status === "REJECTED").length,
    delivered:  orders.filter((o) => o.status === "DELIVERED").length,
  }), [orders]);

  const formTotals = useMemo(() => {
    const subtotal = form.items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0), 0);
    const deliveryCharge = Number(form.deliveryCharge || 0);
    return { subtotal, deliveryCharge, estimatedTotal: subtotal + deliveryCharge };
  }, [form.items, form.deliveryCharge]);

  const openAdd = () => { setMode("ADD"); setForm(emptyForm); setOpen(true); };

  const openEdit = (order: BulkOrder) => {
    setMode("EDIT");
    setForm({
      id: order.id,
      customerName: order.customerName,
      phone: order.phone,
      email: order.email || "",
      deliveryDate: toDateInput(order.deliveryDate),
      deliveryTime: order.deliveryTime,
      occasion: order.occasion,
      deliveryAddress: order.deliveryAddress,
      pincode: order.pincode,
      deliveryCharge: String(order.deliveryCharge || 0),
      status: order.status,
      notes: order.notes || "",
      items: order.items.map((item) => ({
        productId: item.productId || "",
        name: item.productName,
        quantity: String(item.quantity),
        unitPrice: String(item.unitPrice || 0),
      })),
    });
    setOpen(true);
  };

  const handleStatusChange = async (orderId: number, status: BulkStatus) => {
    const oldOrders = orders;
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    const res = await fetch(`/api/bulk-orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) { setOrders(oldOrders); alert(data.message || "Could not update status."); }
  };

  const updateFormItem = (index: number, patch: Partial<FormItem>) => {
    setForm((prev) => ({ ...prev, items: prev.items.map((item, i) => (i === index ? { ...item, ...patch } : item)) }));
  };

  const handleProductChange = (index: number, productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const rate = Number(product.bulkPricePerPiece ?? (product.pieces ? product.price / product.pieces : product.price) ?? 0);
    updateFormItem(index, { productId, name: product.name, unitPrice: String(rate) });
  };

  const addItemRow = () => {
    setForm((prev) => ({ ...prev, items: [...prev.items, { productId: "", name: "", quantity: "", unitPrice: "" }] }));
  };

  const removeItemRow = (index: number) => {
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const saveOrder = async () => {
    if (!form.customerName || !form.phone || !form.deliveryDate || !form.deliveryTime) {
      alert("Please fill customer name, phone, delivery date and delivery slot.");
      return;
    }
    const validItems = form.items.filter((item) => item.name && Number(item.quantity) > 0);
    if (validItems.length === 0) { alert("Please add at least one item."); return; }

    setSaving(true);
    const payload = {
      customerName: form.customerName, phone: form.phone, email: form.email,
      deliveryDate: form.deliveryDate, deliveryTime: form.deliveryTime,
      occasion: form.occasion, deliveryAddress: form.deliveryAddress, pincode: form.pincode,
      subtotal: formTotals.subtotal, deliveryCharge: formTotals.deliveryCharge,
      estimatedTotal: formTotals.estimatedTotal, status: form.status, notes: form.notes,
      source: "ADMIN_MANUAL",
      items: validItems.map((item) => ({
        productId: item.productId || null, name: item.name,
        quantity: Number(item.quantity), unitPrice: Number(item.unitPrice || 0),
        total: Number(item.quantity || 0) * Number(item.unitPrice || 0),
      })),
    };

    const url = mode === "ADD" ? "/api/bulk-orders" : `/api/bulk-orders/${form.id}`;
    const method = mode === "ADD" ? "POST" : "PATCH";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    setSaving(false);

    if (!res.ok || !data.success) { alert(data.message || "Could not save bulk order."); return; }
    await fetchOrders();
    setOpen(false);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: "#f1f5f9", minHeight: "100vh" }}>

      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.3px" }}>
            Bulk Orders
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#64748b", mt: 0.25 }}>
            Manage and track all bulk order requests
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAdd}
          sx={{
            textTransform: "none",
            borderRadius: "10px",
            backgroundColor: BRAND,
            fontWeight: 700,
            fontSize: 14,
            px: 2.5,
            py: 1.2,
            boxShadow: `0 4px 14px ${alpha(BRAND, 0.35)}`,
            "&:hover": { backgroundColor: BRAND_DARK },
          }}
        >
          Add Bulk Order
        </Button>
      </Stack>

      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map(({ key, label, icon: Icon, color, bg }) => (
          <Grid item xs={6} sm={4} md={2} key={key}>
            <Paper
              elevation={0}
              sx={{
                p: 2, borderRadius: "14px",
                border: "1px solid #e2e8f0",
                background: "#fff",
                transition: "box-shadow 0.2s",
                "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.08)" },
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {label}
                </Typography>
                <Box sx={{ p: 0.8, borderRadius: "8px", backgroundColor: bg }}>
                  <Icon sx={{ fontSize: 16, color }} />
                </Box>
              </Stack>
              <Typography sx={{ fontSize: 28, fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>
                {(stats as any)[key]}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Table Card */}
      <Paper elevation={0} sx={{ borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden", background: "#fff" }}>

        {/* Toolbar */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ md: "center" }}
          sx={{ p: 2, borderBottom: "1px solid #f1f5f9" }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search by quote, name, mobile, pincode or address…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              ...fieldSx,
              "& .MuiOutlinedInput-root": {
                ...fieldSx["& .MuiOutlinedInput-root"],
                backgroundColor: "#f8fafc",
              },
            }}
          />
          <Select
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "ALL" | BulkStatus)}
            sx={{
              minWidth: 175,
              borderRadius: "10px",
              fontSize: 14,
              backgroundColor: "#f8fafc",
              "& fieldset": { borderColor: "#e2e8f0" },
              "&:hover fieldset": { borderColor: BRAND },
              "&.Mui-focused fieldset": { borderColor: BRAND },
            }}
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            {statusOptions.map((s) => (
              <MenuItem key={s} value={s}>{statusLabel[s]}</MenuItem>
            ))}
          </Select>
        </Stack>

        {/* Table */}
        <Box sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 1050 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                {["Quote Ref", "Customer", "Delivery", "Address", "Items", "Total", "Status", "Source", ""].map((h) => (
                  <TableCell
                    key={h}
                    align={h === "" ? "right" : "left"}
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                      py: 1.5,
                      borderBottom: "1px solid #f1f5f9",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredOrders.map((order) => {
                const sc = statusColor[order.status];
                return (
                  <TableRow
                    key={order.id}
                    sx={{
                      "&:hover": { backgroundColor: "#fafcff" },
                      "& td": { borderBottom: "1px solid #f1f5f9", py: 2 },
                    }}
                  >
                    {/* Quote */}
                    <TableCell sx={{ minWidth: 130 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: 13, color: BRAND, fontFamily: "monospace" }}>
                        {order.orderRef}
                      </Typography>
                      <Typography sx={{ fontSize: 11, color: "#94a3b8", mt: 0.25 }}>
                        {formatDate(order.createdAt)}
                      </Typography>
                    </TableCell>

                    {/* Customer */}
                    <TableCell sx={{ minWidth: 185 }}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar
                          sx={{
                            width: 34, height: 34, fontSize: 12, fontWeight: 800,
                            backgroundColor: BRAND_LIGHT, color: BRAND_DARK,
                          }}
                        >
                          {getInitials(order.customerName)}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>
                            {order.customerName}
                          </Typography>
                          <Typography sx={{ fontSize: 12, color: "#64748b" }}>{order.phone}</Typography>
                          {order.email && (
                            <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>{order.email}</Typography>
                          )}
                        </Box>
                      </Stack>
                    </TableCell>

                    {/* Delivery */}
                    <TableCell sx={{ minWidth: 130 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>
                        {formatDate(order.deliveryDate)}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: "#64748b" }}>{order.deliveryTime}</Typography>
                      {order.occasion && (
                        <Chip
                          label={order.occasion}
                          size="small"
                          sx={{ mt: 0.5, height: 18, fontSize: 10, fontWeight: 600, backgroundColor: BRAND_LIGHT, color: BRAND_DARK }}
                        />
                      )}
                    </TableCell>

                    {/* Address */}
                    <TableCell sx={{ minWidth: 180, maxWidth: 220 }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{order.pincode}</Typography>
                      <Typography sx={{ fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>{order.deliveryAddress}</Typography>
                    </TableCell>

                    {/* Items */}
                    <TableCell sx={{ minWidth: 200 }}>
                      <Stack spacing={0.4}>
                        {order.items.map((item) => (
                          <Stack key={item.id} direction="row" alignItems="center" spacing={0.5}>
                            <Typography sx={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>
                              {item.productName}
                            </Typography>
                            <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>
                              × {item.quantity} = {formatMoney(item.totalPrice)}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </TableCell>

                    {/* Total */}
                    <TableCell sx={{ minWidth: 120 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>
                        {formatMoney(order.estimatedTotal)}
                      </Typography>
                      {order.deliveryCharge > 0 && (
                        <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>
                          +{formatMoney(order.deliveryCharge)} delivery
                        </Typography>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell sx={{ minWidth: 155 }}>
                      <Select
                        size="small"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as BulkStatus)}
                        sx={{
                          minWidth: 140,
                          height: 30,
                          borderRadius: "20px",
                          fontSize: 12,
                          fontWeight: 700,
                          backgroundColor: sc.bg,
                          color: sc.color,
                          "& fieldset": { border: `1.5px solid ${sc.border}` },
                          "&:hover fieldset": { border: `1.5px solid ${sc.color}` },
                          "& .MuiSelect-icon": { color: sc.color },
                        }}
                      >
                        {statusOptions.map((s) => (
                          <MenuItem key={s} value={s} sx={{ fontSize: 13 }}>{statusLabel[s]}</MenuItem>
                        ))}
                      </Select>
                    </TableCell>

                    {/* Source */}
                    <TableCell sx={{ minWidth: 90 }}>
                      <Chip
                        size="small"
                        label={order.source === "ADMIN_MANUAL" ? "Admin" : "Website"}
                        sx={{
                          fontWeight: 700,
                          fontSize: 11,
                          height: 22,
                          backgroundColor: order.source === "ADMIN_MANUAL" ? "#fef3c7" : "#dbeafe",
                          color: order.source === "ADMIN_MANUAL" ? "#92400e" : "#1e40af",
                          border: `1px solid ${order.source === "ADMIN_MANUAL" ? "#fde68a" : "#bfdbfe"}`,
                        }}
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right" sx={{ minWidth: 90 }}>
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="Download Quote PDF">
                          <IconButton
                            component="a"
                            href={`/api/bulk-orders/quote-pdf/${order.orderRef}`}
                            target="_blank"
                            size="small"
                            sx={{
                              color: "#64748b",
                              "&:hover": { backgroundColor: BRAND_LIGHT, color: BRAND },
                            }}
                          >
                            <DownloadOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Order">
                          <IconButton
                            size="small"
                            onClick={() => openEdit(order)}
                            sx={{
                              color: "#64748b",
                              "&:hover": { backgroundColor: BRAND_LIGHT, color: BRAND },
                            }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}

              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                    <InventoryRoundedIcon sx={{ fontSize: 40, color: "#cbd5e1", mb: 1 }} />
                    <Typography sx={{ color: "#94a3b8", fontSize: 14, fontWeight: 600 }}>
                      No bulk orders found
                    </Typography>
                    <Typography sx={{ color: "#cbd5e1", fontSize: 13, mt: 0.5 }}>
                      Try adjusting your search or filter
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

        {/* Footer count */}
        {filteredOrders.length > 0 && (
          <Box sx={{ px: 2.5, py: 1.5, borderTop: "1px solid #f1f5f9" }}>
            <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>
              Showing {filteredOrders.length} of {orders.length} orders
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Add / Edit Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: 18, color: "#0f172a", pb: 1 }}>
          {mode === "ADD" ? "New Bulk Order" : "Edit Bulk Order"}
          <Typography sx={{ fontSize: 13, color: "#64748b", fontWeight: 400, mt: 0.25 }}>
            {mode === "ADD" ? "Fill in the details to create a new bulk order." : "Update the order details below."}
          </Typography>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3, backgroundColor: "#f8fafc" }}>
          <Grid container spacing={2}>

            {/* Section: Customer */}
            <Grid item xs={12}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", mb: 1 }}>
                Customer Info
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Customer Name" size="small" value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })} sx={fieldSx} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Phone" size="small" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} sx={fieldSx} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Email" size="small" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} sx={fieldSx} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Occasion / Event" size="small" value={form.occasion}
                onChange={(e) => setForm({ ...form, occasion: e.target.value })} sx={fieldSx} />
            </Grid>

            {/* Section: Delivery */}
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", mb: 1 }}>
                Delivery Details
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth type="date" label="Delivery Date" size="small" InputLabelProps={{ shrink: true }}
                value={form.deliveryDate} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} sx={fieldSx} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Delivery Slot" size="small" value={form.deliveryTime} placeholder="e.g. 9:00 am – 10:00 am"
                onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })} sx={fieldSx} />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField fullWidth label="Delivery Address" size="small" value={form.deliveryAddress}
                onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })} sx={fieldSx} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Pincode" size="small" value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })} sx={fieldSx} />
            </Grid>

            {/* Section: Items */}
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", mb: 1 }}>
                Order Items
              </Typography>
            </Grid>

            {form.items.map((item, index) => (
              <Grid item xs={12} key={index}>
                <Paper elevation={0} sx={{ p: 1.5, borderRadius: "10px", border: "1px solid #e2e8f0", backgroundColor: "#fff" }}>
                  <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems="center">
                    <TextField
                      select size="small" label="Product" value={item.productId}
                      onChange={(e) => handleProductChange(index, Number(e.target.value))}
                      sx={{ ...fieldSx, flex: 2 }}
                    >
                      {products.map((product) => (
                        <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>
                      ))}
                    </TextField>
                    <TextField size="small" label="Qty" value={item.quantity}
                      onChange={(e) => updateFormItem(index, { quantity: e.target.value })}
                      sx={{ ...fieldSx, flex: 1 }} />
                    <TextField size="small" label="Rate (₹)" value={item.unitPrice}
                      onChange={(e) => updateFormItem(index, { unitPrice: e.target.value })}
                      sx={{ ...fieldSx, flex: 1 }} />
                    <TextField size="small" disabled label="Total"
                      value={`₹${(Number(item.quantity || 0) * Number(item.unitPrice || 0)).toLocaleString("en-IN")}`}
                      sx={{ ...fieldSx, flex: 1 }} />
                    <IconButton
                      onClick={() => removeItemRow(index)}
                      disabled={form.items.length === 1}
                      sx={{ color: "#ef4444", "&:hover": { backgroundColor: "#fff1f2" }, flexShrink: 0 }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Paper>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button onClick={addItemRow} startIcon={<AddIcon />}
                sx={{ textTransform: "none", color: BRAND, fontWeight: 700, fontSize: 13, "&:hover": { backgroundColor: BRAND_LIGHT } }}>
                Add another item
              </Button>
            </Grid>

            {/* Totals */}
            <Grid item xs={12} sx={{ mt: 0.5 }}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: "10px", border: "1px solid #e2e8f0", backgroundColor: "#fff" }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth size="small" disabled label="Subtotal"
                      value={`₹${formTotals.subtotal.toLocaleString("en-IN")}`} sx={fieldSx} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth size="small" label="Delivery Charge (₹)" value={form.deliveryCharge}
                      onChange={(e) => setForm({ ...form, deliveryCharge: e.target.value })} sx={fieldSx} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth size="small" disabled label="Estimated Total"
                      value={`₹${formTotals.estimatedTotal.toLocaleString("en-IN")}`}
                      sx={{
                        ...fieldSx,
                        "& .MuiOutlinedInput-root": {
                          ...fieldSx["& .MuiOutlinedInput-root"],
                          backgroundColor: BRAND_LIGHT,
                          "& input": { fontWeight: 800, color: BRAND_DARK },
                        },
                      }} />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Status & Notes */}
            <Grid item xs={12} md={4}>
              <TextField select fullWidth size="small" label="Status" value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as BulkStatus })} sx={fieldSx}>
                {statusOptions.map((s) => (
                  <MenuItem key={s} value={s}>{statusLabel[s]}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField fullWidth multiline minRows={2} size="small" label="Admin Notes" value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })} sx={fieldSx} />
            </Grid>
          </Grid>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2, gap: 1, backgroundColor: "#f8fafc" }}>
          <Button onClick={() => setOpen(false)}
            sx={{ textTransform: "none", color: "#64748b", fontWeight: 600, borderRadius: "10px", px: 2.5 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={saveOrder} disabled={saving}
            sx={{
              textTransform: "none",
              backgroundColor: BRAND,
              fontWeight: 800,
              borderRadius: "10px",
              px: 3,
              boxShadow: `0 4px 12px ${alpha(BRAND, 0.3)}`,
              "&:hover": { backgroundColor: BRAND_DARK },
            }}>
            {saving ? "Saving…" : mode === "ADD" ? "Create Order" : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import {
//   Box,
//   Button,
//   Chip,
//   Divider,
//   Grid,
//   IconButton,
//   InputAdornment,
//   MenuItem,
//   Paper,
//   Select,
//   Stack,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   TextField,
//   Typography,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
// import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
// import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
// import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
// import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";

// type BulkStatus =
//   | "NEW"
//   | "ACCEPTED"
//   | "IN_DISCUSSION"
//   | "REJECTED"
//   | "DELIVERED";

// type BulkOrderItem = {
//   id: number;
//   productName: string;
//   quantity: number;
//   unitPrice: number | null;
//   totalPrice: number | null;
// };

// type BulkOrder = {
//   id: number;
//   orderRef: string;
//   customerName: string;
//   phone: string;
//   email: string | null;
//   deliveryDate: string;
//   deliveryTime: string;
//   occasion: string;
//   deliveryAddress: string;
//   pincode: string;
//   subtotal: number;
//   deliveryCharge: number;
//   estimatedTotal: number;
//   status: BulkStatus;
//   source: "CUSTOMER_FORM" | "ADMIN_MANUAL";
//   notes: string | null;
//   createdAt: string;
//   items: BulkOrderItem[];
// };

// const statusOptions: BulkStatus[] = [
//   "NEW",
//   "ACCEPTED",
//   "IN_DISCUSSION",
//   "REJECTED",
//   "DELIVERED",
// ];

// const statusLabel: Record<BulkStatus, string> = {
//   NEW: "New",
//   ACCEPTED: "Accepted",
//   IN_DISCUSSION: "In Discussion",
//   REJECTED: "Rejected",
//   DELIVERED: "Delivered",
// };

// const statusColor: Record<BulkStatus, { bg: string; color: string }> = {
//   NEW: { bg: "#fff4d6", color: "#a86400" },
//   ACCEPTED: { bg: "#d9f8e7", color: "#087443" },
//   IN_DISCUSSION: { bg: "#dbeafe", color: "#0758c7" },
//   REJECTED: { bg: "#ffe2e2", color: "#b42318" },
//   DELIVERED: { bg: "#ede9fe", color: "#5b21b6" },
// };

// function formatMoney(value: number | null | undefined) {
//   return `₹${Number(value || 0).toLocaleString("en-IN")}`;
// }

// function formatDate(value: string) {
//   return new Intl.DateTimeFormat("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   }).format(new Date(value));
// }

// function formatDateTime(value: string) {
//   return new Intl.DateTimeFormat("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "numeric",
//     minute: "2-digit",
//   }).format(new Date(value));
// }

// export default function AdminBulkOrdersPage() {
//   const [orders, setOrders] = useState<BulkOrder[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedId, setSelectedId] = useState<number | null>(null);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<"ALL" | BulkStatus>("ALL");

//   useEffect(() => {
//     fetch("/api/bulk-orders")
//       .then((res) => res.json())
//       .then((data) => {
//         const list = data.orders || [];
//         setOrders(list);
//         setSelectedId(list[0]?.id ?? null);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const filteredOrders = useMemo(() => {
//     const q = search.trim().toLowerCase();

//     return orders.filter((order) => {
//       const matchesSearch =
//         !q ||
//         order.orderRef.toLowerCase().includes(q) ||
//         order.customerName.toLowerCase().includes(q) ||
//         order.phone.includes(q);

//       const matchesStatus =
//         statusFilter === "ALL" || order.status === statusFilter;

//       return matchesSearch && matchesStatus;
//     });
//   }, [orders, search, statusFilter]);

//   const selectedOrder =
//     orders.find((order) => order.id === selectedId) || filteredOrders[0];

//   const stats = useMemo(() => {
//     return {
//       total: orders.length,
//       newOrders: orders.filter((order) => order.status === "NEW").length,
//       discussion: orders.filter((order) => order.status === "IN_DISCUSSION").length,
//       accepted: orders.filter((order) => order.status === "ACCEPTED").length,
//       rejected: orders.filter((order) => order.status === "REJECTED").length,
//       delivered: orders.filter((order) => order.status === "DELIVERED").length,
//     };
//   }, [orders]);

//   const handleStatusChange = async (orderId: number, status: BulkStatus) => {
//     const previousOrders = orders;

//     setOrders((prev) =>
//       prev.map((order) =>
//         order.id === orderId ? { ...order, status } : order
//       )
//     );

//     const res = await fetch(`/api/bulk-orders/${orderId}/status`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ status }),
//     });

//     const data = await res.json();

//     if (!res.ok || !data.success) {
//       setOrders(previousOrders);
//       alert(data.message || "Could not update status.");
//     }
//   };

//   return (
//     <Box sx={{ p: 3, backgroundColor: "#f7f8fa", minHeight: "100vh" }}>
//       <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>     
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           sx={{
//             textTransform: "none",
//             borderRadius: "8px",
//             backgroundColor: "#006d77",
//             fontWeight: 700,
//             px: 2.5,
//             py: 1.1,
//           }}
//         >
//           Add Bulk Order
//         </Button>
//       </Stack>

//       <Grid container spacing={2} sx={{ mb: 3 }}>
//         {[
//           { label: "Total Bulk Orders", value: stats.total, hint: "All Time", icon: <Inventory2OutlinedIcon /> },
//           { label: "New", value: stats.newOrders, hint: "Needs Attention", icon: <EventNoteOutlinedIcon /> },
//           { label: "Pending Discussion", value: stats.discussion, hint: "In Discussion", icon: <PersonOutlineOutlinedIcon /> },
//           { label: "Accepted", value: stats.accepted, hint: "Confirmed", icon: <CurrencyRupeeOutlinedIcon /> },
//           { label: "Rejected", value: stats.rejected, hint: "Declined", icon: <MoreVertIcon /> },
//           { label: "Delivered", value: stats.delivered, hint: "Completed", icon: <DownloadOutlinedIcon /> },
//         ].map((card) => (
//           <Grid item xs={12} sm={6} md={2} key={card.label}>
//             <Paper 
//               elevation={0} 
//                 sx={{ 
//                   p: 2, 
//                   borderRadius: "8px", 
//                   border: "1px solid #e5e7eb",
//                   minHeight: 112,
//                   height: "100%",
//                   display: "flex",
//                   alignItems: "center",
//                 }}>
//               <Stack direction="row" alignItems="center" spacing={1.5}>
//                 <Box
//                   sx={{
//                     width: 42,
//                     height: 42,
//                     borderRadius: "50%",
//                     display: "grid",
//                     placeItems: "center",
//                     backgroundColor: "#e6f7f4",
//                     color: "#006d77",
//                   }}
//                 >
//                   {card.icon}
//                 </Box>
//                 <Box>
//                   <Typography sx={{ fontSize: 12, color: "#667085" }}>{card.label}</Typography>
//                   <Typography sx={{ fontSize: 24, fontWeight: 800 }}>{card.value}</Typography>
//                   <Typography sx={{ fontSize: 12, color: "#667085" }}>{card.hint}</Typography>
//                 </Box>
//               </Stack>
//             </Paper>
//           </Grid>
//         ))}
//       </Grid>

//       <Grid container spacing={3}>
//         <Grid item xs={12} lg={9}>
//           <Paper elevation={0} sx={{ borderRadius: "8px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
//             <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ p: 2 }}>
//               <TextField
//                 fullWidth
//                 placeholder="Search by Quote No., Name or Mobile..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchOutlinedIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//               />

//               <Select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value as "ALL" | BulkStatus)}
//                 sx={{ minWidth: 180 }}
//               >
//                 <MenuItem value="ALL">All Status</MenuItem>
//                 {statusOptions.map((status) => (
//                   <MenuItem key={status} value={status}>
//                     {statusLabel[status]}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </Stack>

//             <Table>
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: "#fafafa" }}>
//                   <TableCell>Quote No.</TableCell>
//                   <TableCell>Customer</TableCell>
//                   <TableCell>Event Date</TableCell>
//                   <TableCell>Slot</TableCell>
//                   <TableCell>Amount</TableCell>
//                   <TableCell>Status</TableCell>
//                   <TableCell>Created At</TableCell>
//                   <TableCell align="right">Actions</TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {filteredOrders.map((order) => (
//                   <TableRow
//                     key={order.id}
//                     hover
//                     selected={selectedOrder?.id === order.id}
//                     onClick={() => setSelectedId(order.id)}
//                     sx={{ cursor: "pointer" }}
//                   >
//                     <TableCell sx={{ color: "#006d77", fontWeight: 800 }}>
//                       {order.orderRef}
//                     </TableCell>
//                     <TableCell>
//                       <Typography sx={{ fontWeight: 700 }}>{order.customerName}</Typography>
//                       <Typography sx={{ fontSize: 12, color: "#667085" }}>{order.phone}</Typography>
//                     </TableCell>
//                     <TableCell>{formatDate(order.deliveryDate)}</TableCell>
//                     <TableCell>{order.deliveryTime}</TableCell>
//                     <TableCell sx={{ fontWeight: 800 }}>{formatMoney(order.estimatedTotal)}</TableCell>
//                     <TableCell onClick={(e) => e.stopPropagation()}>
//                       <Select
//                         size="small"
//                         value={order.status}
//                         onChange={(e) =>
//                           handleStatusChange(order.id, e.target.value as BulkStatus)
//                         }
//                         sx={{
//                           minWidth: 145,
//                           height: 34,
//                           borderRadius: "8px",
//                           fontSize: 13,
//                           fontWeight: 700,
//                           backgroundColor: statusColor[order.status].bg,
//                           color: statusColor[order.status].color,
//                           "& fieldset": { border: "none" },
//                         }}
//                       >
//                         {statusOptions.map((status) => (
//                           <MenuItem key={status} value={status}>
//                             {statusLabel[status]}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </TableCell>
//                     <TableCell>{formatDateTime(order.createdAt)}</TableCell>
//                     <TableCell align="right">
//                       <IconButton size="small" onClick={() => setSelectedId(order.id)}>
//                         <VisibilityOutlinedIcon fontSize="small" />
//                       </IconButton>
//                       <IconButton size="small">
//                         <MoreVertIcon fontSize="small" />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}

//                 {!loading && filteredOrders.length === 0 && (
//                   <TableRow>
//                     <TableCell colSpan={8} align="center" sx={{ py: 5, color: "#667085" }}>
//                       No bulk orders found.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </Paper>
//         </Grid>

//         <Grid item xs={12} lg={3}>
//           <Paper elevation={0} sx={{ borderRadius: "8px", border: "1px solid #e5e7eb", p: 2, position: "sticky", top: 20 }}>
//             {selectedOrder ? (
//               <>
//                 <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
//                   <Typography sx={{ fontSize: 20, fontWeight: 800 }}>Bulk Order Details</Typography>
//                 </Stack>

//                 <Stack direction="row" alignItems="center" justifyContent="space-between">
//                   <Typography>
//                     Quote No: <strong>{selectedOrder.orderRef}</strong>
//                   </Typography>
//                   {/* <Chip
//                     label={statusLabel[selectedOrder.status]}
//                     size="small"
//                     sx={{
//                       backgroundColor: statusColor[selectedOrder.status].bg,
//                       color: statusColor[selectedOrder.status].color,
//                       fontWeight: 700,
//                     }}
//                   /> */}
//                   <Select
//                     size="small"
//                     value={selectedOrder.status}
//                     onChange={(e) =>
//                       handleStatusChange(selectedOrder.id, e.target.value as BulkStatus)
//                     }
//                     sx={{
//                       minWidth: 135,
//                       height: 34,
//                       borderRadius: "8px",
//                       fontSize: 13,
//                       fontWeight: 700,
//                       backgroundColor: statusColor[selectedOrder.status].bg,
//                       color: statusColor[selectedOrder.status].color,
//                       "& fieldset": { border: "none" },
//                     }}
//                   >
//                     {statusOptions.map((status) => (
//                       <MenuItem key={status} value={status}>
//                         {statusLabel[status]}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </Stack>

//                 <Divider sx={{ my: 2 }} />

//                 <Typography sx={{ fontWeight: 800, mb: 1 }}>Customer Details</Typography>
//                 <Detail label="Name" value={selectedOrder.customerName} />
//                 <Detail label="Mobile" value={selectedOrder.phone} />
//                 <Detail label="Email" value={selectedOrder.email || "-"} />
//                 <Detail label="Event Type" value={selectedOrder.occasion} />

//                 <Divider sx={{ my: 2 }} />

//                 <Typography sx={{ fontWeight: 800, mb: 1 }}>Event & Delivery Details</Typography>
//                 <Detail label="Event Date" value={formatDate(selectedOrder.deliveryDate)} />
//                 <Detail label="Delivery Slot" value={selectedOrder.deliveryTime} />
//                 <Detail label="Address" value={`${selectedOrder.deliveryAddress}, ${selectedOrder.pincode}`} />

//                 <Divider sx={{ my: 2 }} />

//                 <Typography sx={{ fontWeight: 800, mb: 1 }}>Order Items</Typography>
//                 {selectedOrder.items.map((item) => (
//                   <Stack key={item.id} direction="row" justifyContent="space-between" sx={{ py: 0.7 }}>
//                     <Typography sx={{ fontSize: 13 }}>{item.productName}</Typography>
//                     <Typography sx={{ fontSize: 13 }}>{item.quantity}</Typography>
//                     <Typography sx={{ fontSize: 13 }}>{formatMoney(item.totalPrice)}</Typography>
//                   </Stack>
//                 ))}

//                 <Divider sx={{ my: 2 }} />

//                 <Typography sx={{ fontWeight: 800, mb: 1 }}>Price Summary</Typography>
//                 <Detail label="Sub Total" value={formatMoney(selectedOrder.subtotal)} />
//                 <Detail label="Delivery Charge" value={formatMoney(selectedOrder.deliveryCharge)} />
//                 <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
//                   <Typography sx={{ fontWeight: 800 }}>Grand Total</Typography>
//                   <Typography sx={{ fontWeight: 900, color: "#006d77" }}>
//                     {formatMoney(selectedOrder.estimatedTotal)}
//                   </Typography>
//                 </Stack>

//                 <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
//                   <Button
//                     fullWidth
//                     variant="outlined"
//                     startIcon={<DownloadOutlinedIcon />}
//                     href={`/api/bulk-orders/${selectedOrder.orderRef}/quote-pdf`}
//                     target="_blank"
//                     sx={{ textTransform: "none", borderRadius: "8px" }}
//                   >
//                     Quote
//                   </Button>
//                   <Button
//                     fullWidth
//                     variant="contained"
//                     startIcon={<EditOutlinedIcon />}
//                     sx={{ textTransform: "none", borderRadius: "8px", backgroundColor: "#006d77" }}
//                   >
//                     Edit
//                   </Button>
//                 </Stack>
//               </>
//             ) : (
//               <Typography sx={{ color: "#667085" }}>Select a bulk order to view details.</Typography>
//             )}
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }

// function Detail({ label, value }: { label: string; value: string }) {
//   return (
//     <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ py: 0.7 }}>
//       <Typography sx={{ fontSize: 13, color: "#667085" }}>{label}</Typography>
//       <Typography sx={{ fontSize: 13, fontWeight: 600, textAlign: "right" }}>{value}</Typography>
//     </Stack>
//   );
// }