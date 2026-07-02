"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Avatar,
  Tooltip,
  Divider,
  TablePagination,
  alpha,
  Alert,
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
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import {
  validateName,
  validatePhone,
  validateEmail,
  validateDeliveryDate,
  validateDeliveryTime,
  validateOccasion,
  validateAddress,
  validatePincode,
  getAvailableTimeSlots,
} from "@/lib/validations/bulkOrderValidation";
import CloseIcon from "@mui/icons-material/Close";

type BulkStatus = "NEW" | "ACCEPTED" | "IN_DISCUSSION" | "REJECTED" | "DELIVERED";
type SourceFilter = "ALL" | "CUSTOMER_FORM" | "ADMIN_MANUAL";
type SortOption = "NEWEST" | "DELIVERY_DATE_ASC" | "DELIVERY_DATE_DESC" | "SLOT_ASC" | "AMOUNT_DESC";

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

type AdminFormErrors = Partial<Record<
  "customerName" | "phone" | "email" | "deliveryDate" | "deliveryTime" |
  "occasion" | "deliveryAddress" | "pincode" | "items",
  string
>>;

const statusOptions: BulkStatus[] = ["NEW", "ACCEPTED", "IN_DISCUSSION", "REJECTED", "DELIVERED"];
const activeStatuses: BulkStatus[] = ["NEW", "ACCEPTED", "IN_DISCUSSION"];

const statusLabel: Record<BulkStatus, string> = {
  NEW: "New",
  ACCEPTED: "Accepted",
  IN_DISCUSSION: "In Discussion",
  REJECTED: "Rejected",
  DELIVERED: "Delivered",
};

const statusColor: Record<BulkStatus, { bg: string; color: string; border: string }> = {
  NEW: { bg: "#fffbeb", color: "#92400e", border: "#fde68a" },
  ACCEPTED: { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" },
  IN_DISCUSSION: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  REJECTED: { bg: "#fff1f2", color: "#9f1239", border: "#fecdd3" },
  DELIVERED: { bg: "#f5f3ff", color: "#6d28d9", border: "#ddd6fe" },
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

const BRAND = "#006d77";
const BRAND_DARK = "#004f58";
const BRAND_LIGHT = "#e0f4f6";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#fff",
    fontSize: 14,
    minHeight: 42,
    "&:hover fieldset": { borderColor: BRAND },
    "&.Mui-focused fieldset": { borderColor: BRAND, borderWidth: 2 },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: BRAND },
};

const headCellSx = {
  fontWeight: 800,
  color: "#64748b",
  fontSize: 12,
  whiteSpace: "nowrap",
  py: 2,
};

const bodyCellSx = {
  py: 2,
  verticalAlign: "middle",
};

const statCards = [
  { key: "total", label: "Total Orders", icon: InventoryRoundedIcon, color: "#64748b", bg: "#f8fafc" },
  { key: "newOrders", label: "New", icon: FiberNewRoundedIcon, color: "#d97706", bg: "#fffbeb" },
  { key: "discussion", label: "In Discussion", icon: ForumRoundedIcon, color: "#2563eb", bg: "#eff6ff" },
  { key: "accepted", label: "Accepted", icon: CheckCircleRoundedIcon, color: "#16a34a", bg: "#f0fdf4" },
  { key: "rejected", label: "Rejected", icon: CancelRoundedIcon, color: "#e11d48", bg: "#fff1f2" },
  { key: "delivered", label: "Delivered", icon: LocalShippingRoundedIcon, color: "#7c3aed", bg: "#f5f3ff" },
];

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

function getSlotHour(slot: string) {
  const match = slot.match(/^(\d{1,2}):?\d*\s*(AM|PM)/i);
  if (!match) return 0;

  let hour = Number(match[1]);
  const period = match[2].toUpperCase();

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return hour;
}

export default function AdminBulkOrdersPage() {
  const [orders, setOrders] = useState<BulkOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | BulkStatus>("ALL");
  const [dateFilter, setDateFilter] = useState("");
  const [slotFilter, setSlotFilter] = useState("ALL");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("ALL");
  const [conflictOnly, setConflictOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("NEWEST");

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"ADD" | "EDIT">("ADD");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState<AdminFormErrors>({});
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [bookedSlotsLoading, setBookedSlotsLoading] = useState(false);
  const [confirmSlotOpen, setConfirmSlotOpen] = useState(false);
  const [pendingSlot, setPendingSlot] = useState<string | null>(null);
  const [originalSlot, setOriginalSlot] = useState<{ date: string; time: string } | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pincodeOutOfZone, setPincodeOutOfZone] = useState(false);
  const [pincodeChecking, setPincodeChecking] = useState(false);
  const [confirmPincodeOpen, setConfirmPincodeOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<BulkOrder | null>(null);
  const [deleting, setDeleting] = useState(false);
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

  useEffect(() => {
    setPage(0);
  }, [search, statusFilter, dateFilter, slotFilter, sourceFilter, conflictOnly, sortBy]);

  useEffect(() => {
    if (!open || !form.deliveryDate) {
      setBookedSlots([]);
      return;
    }

    setBookedSlotsLoading(true);
    fetch(`/api/bulk-orders/booked-slots?date=${form.deliveryDate}`)
      .then((res) => res.json())
      .then((data) => setBookedSlots(data.bookedSlots || []))
      .catch(() => setBookedSlots([]))
      .finally(() => setBookedSlotsLoading(false));
  }, [open, form.deliveryDate]);

  const hasActiveFilters =
    Boolean(search.trim()) ||
    statusFilter !== "ALL" ||
    Boolean(dateFilter) ||
    slotFilter !== "ALL" ||
    sourceFilter !== "ALL" ||
    conflictOnly ||
    sortBy !== "NEWEST";

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setDateFilter("");
    setSlotFilter("ALL");
    setSourceFilter("ALL");
    setConflictOnly(false);
    setSortBy("NEWEST");
  };

  const slotOptions = useMemo(() => {
    const set = new Set<string>();

    orders.forEach((order) => {
      if (order.deliveryTime) set.add(order.deliveryTime);
    });

    return Array.from(set).sort((a, b) => getSlotHour(a) - getSlotHour(b));
  }, [orders]);

  const getSlotOrders = (date: string, slot: string, excludeId?: number) => {
    if (!date || !slot) return [];

    return orders.filter((order) => {
      const orderDate = toDateInput(order.deliveryDate);

      return (
        orderDate === date &&
        order.deliveryTime === slot &&
        order.id !== excludeId &&
        activeStatuses.includes(order.status)
      );
    });
  };

  const getOrderConflicts = (order: BulkOrder) => {
    return getSlotOrders(toDateInput(order.deliveryDate), order.deliveryTime, order.id);
  };

  const selectedSlotConflicts = useMemo(() => {
    return getSlotOrders(form.deliveryDate, form.deliveryTime || pendingSlot || "", form.id);
  }, [orders, form.deliveryDate, form.deliveryTime, pendingSlot, form.id]);

  const isOwnOriginalSlot = (date: string, time: string) =>
    Boolean(originalSlot && originalSlot.date === date && originalSlot.time === time);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();

    const next = orders.filter((order) => {
      const orderDate = toDateInput(order.deliveryDate);
      const conflicts = getOrderConflicts(order);

      const matchesSearch =
        !q ||
        order.orderRef.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.phone.includes(q) ||
        order.pincode.includes(q) ||
        order.deliveryAddress.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
      const matchesDate = !dateFilter || orderDate === dateFilter;
      const matchesSlot = slotFilter === "ALL" || order.deliveryTime === slotFilter;
      const matchesSource = sourceFilter === "ALL" || order.source === sourceFilter;
      const matchesConflict = !conflictOnly || conflicts.length > 0;

      return matchesSearch && matchesStatus && matchesDate && matchesSlot && matchesSource && matchesConflict;
    });
    return next.sort((a, b) => {
      if (sortBy === "NEWEST") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }

      const dateA = new Date(a.deliveryDate).getTime();
      const dateB = new Date(b.deliveryDate).getTime();

      if (sortBy === "DELIVERY_DATE_ASC") return dateA - dateB;
      if (sortBy === "DELIVERY_DATE_DESC") return dateB - dateA;
      if (sortBy === "AMOUNT_DESC") return Number(b.estimatedTotal || 0) - Number(a.estimatedTotal || 0);

      if (sortBy === "SLOT_ASC") {
        if (dateA !== dateB) return dateA - dateB;
        return getSlotHour(a.deliveryTime) - getSlotHour(b.deliveryTime);
      }

      return 0;
    });
  }, [orders, search, statusFilter, dateFilter, slotFilter, sourceFilter, conflictOnly, sortBy]);

  const paginatedOrders = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredOrders.slice(start, start + rowsPerPage);
  }, [filteredOrders, page, rowsPerPage]);

  const stats = useMemo(() => ({
    total: orders.length,
    newOrders: orders.filter((o) => o.status === "NEW").length,
    discussion: orders.filter((o) => o.status === "IN_DISCUSSION").length,
    accepted: orders.filter((o) => o.status === "ACCEPTED").length,
    rejected: orders.filter((o) => o.status === "REJECTED").length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
  }), [orders]);

  const formTotals = useMemo(() => {
    const subtotal = form.items.reduce(
      (sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0),
      0
    );
    const deliveryCharge = Number(form.deliveryCharge || 0);

    return { subtotal, deliveryCharge, estimatedTotal: subtotal + deliveryCharge };
  }, [form.items, form.deliveryCharge]);

  const validateAdminForm = (f: FormState): AdminFormErrors => {
    const next: AdminFormErrors = {
      customerName: validateName(f.customerName),
      phone: validatePhone(f.phone),
      email: validateEmail(f.email),
      deliveryDate: validateDeliveryDate(f.deliveryDate),
      deliveryTime: validateDeliveryTime(f.deliveryTime),
      occasion: validateOccasion(f.occasion),
      deliveryAddress: validateAddress(f.deliveryAddress),
      pincode: validatePincode(f.pincode),
    };

    const validItems = f.items.filter((item) => item.name && Number(item.quantity) > 0);
    if (validItems.length === 0) {
      next.items = "Please add at least one item with a valid quantity.";
    }

    (Object.keys(next) as (keyof AdminFormErrors)[]).forEach((key) => {
      if (!next[key]) delete next[key];
    });

    return next;
  };

  const handleSlotSelect = (value: string) => {
    const isBooked = bookedSlots.includes(value) && !isOwnOriginalSlot(form.deliveryDate, value);
    const conflicts = getSlotOrders(form.deliveryDate, value, form.id);

    if (isBooked || conflicts.length > 0) {
      setPendingSlot(value);
      setConfirmSlotOpen(true);
      return;
    }

    setForm((prev) => ({ ...prev, deliveryTime: value }));
    setErrors((prev) => ({ ...prev, deliveryTime: validateDeliveryTime(value) }));
  };

  const confirmSlotSelection = () => {
    if (pendingSlot) {
      setForm((prev) => ({ ...prev, deliveryTime: pendingSlot }));
      setErrors((prev) => ({ ...prev, deliveryTime: undefined }));
    }

    setConfirmSlotOpen(false);
    setPendingSlot(null);
  };

  const cancelSlotSelection = () => {
    setConfirmSlotOpen(false);
    setPendingSlot(null);
  };

  const checkPincodeZone = async (pincode: string) => {
    if (pincode.length !== 6) {
      setPincodeOutOfZone(false);
      return;
    }

    setPincodeChecking(true);

    try {
      const res = await fetch("/api/check-pincode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode }),
      });

      const data = await res.json();
      setPincodeOutOfZone(!data.serviceable);
    } catch {
      setPincodeOutOfZone(false);
    } finally {
      setPincodeChecking(false);
    }
  };

  const openAdd = () => {
    setMode("ADD");
    setForm(emptyForm);
    setErrors({});
    setOriginalSlot(null);
    setPincodeOutOfZone(false);
    setOpen(true);
  };

  const openEdit = (order: BulkOrder) => {
    const deliveryDate = toDateInput(order.deliveryDate);

    setMode("EDIT");
    setForm({
      id: order.id,
      customerName: order.customerName,
      phone: order.phone,
      email: order.email || "",
      deliveryDate,
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

    setErrors({});
    setOriginalSlot({ date: deliveryDate, time: order.deliveryTime });
    setPincodeOutOfZone(false);
    checkPincodeZone(order.pincode);
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

    if (!res.ok || !data.success) {
      setOrders(oldOrders);
      alert(data.message || "Could not update status.");
    }
  };

  // const handleDeleteOrder = async (order: BulkOrder) => {
  //   const ok = window.confirm(`Delete ${order.orderRef}? This cannot be undone.`);
  //   if (!ok) return;

  //   const oldOrders = orders;
  //   setOrders((prev) => prev.filter((o) => o.id !== order.id));

  //   const res = await fetch(`/api/bulk-orders/${order.id}`, { method: "DELETE" });

  //   if (!res.ok) {
  //     setOrders(oldOrders);
  //     const data = await res.json().catch(() => ({}));
  //     alert(data.message || "Could not delete order.");
  //   }
  // };

  const requestDeleteOrder = (order: BulkOrder) => {
    setOrderToDelete(order);
    setDeleteConfirmOpen(true);
  };

  const cancelDeleteOrder = () => {
    setDeleteConfirmOpen(false);
    setOrderToDelete(null);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;

    const target = orderToDelete;
    const oldOrders = orders;

    setDeleting(true);
    setOrders((prev) => prev.filter((o) => o.id !== target.id));

    try {
      const res = await fetch(`/api/bulk-orders/${target.id}`, { method: "DELETE" });

      if (!res.ok) {
        setOrders(oldOrders);
        const data = await res.json().catch(() => ({}));
        alert(data.message || "Could not delete order.");
      }
    } catch {
      setOrders(oldOrders);
      alert("Network error. Could not delete order — check your connection.");
    } finally {
      setDeleting(false);
      setDeleteConfirmOpen(false);
      setOrderToDelete(null);
    }
  };

  const updateFormItem = (index: number, patch: Partial<FormItem>) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  };

  const handleProductChange = (index: number, productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const rate = Number(
      product.bulkPricePerPiece ??
      (product.pieces ? product.price / product.pieces : product.price) ??
      0
    );

    updateFormItem(index, { productId, name: product.name, unitPrice: String(rate) });
    setErrors((prev) => ({ ...prev, items: undefined }));
  };

  const addItemRow = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { productId: "", name: "", quantity: "", unitPrice: "" }],
    }));
  };

  const removeItemRow = (index: number) => {
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const saveOrder = async () => {
    const validationErrors = validateAdminForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const conflicts = getSlotOrders(form.deliveryDate, form.deliveryTime, form.id);

    if (conflicts.length > 0) {
      setPendingSlot(form.deliveryTime);
      setConfirmSlotOpen(true);
      return;
    }

    if (pincodeOutOfZone) {
      setConfirmPincodeOpen(true);
      return;
    }

    await submitOrder();
  };

  const submitOrder = async () => {
    const validItems = form.items.filter((item) => item.name && Number(item.quantity) > 0);

    setSaving(true);

    const payload = {
      customerName: form.customerName,
      phone: form.phone,
      email: form.email,
      deliveryDate: form.deliveryDate,
      deliveryTime: form.deliveryTime,
      occasion: form.occasion,
      deliveryAddress: form.deliveryAddress,
      pincode: form.pincode,
      subtotal: formTotals.subtotal,
      deliveryCharge: formTotals.deliveryCharge,
      estimatedTotal: formTotals.estimatedTotal,
      status: form.status,
      notes: form.notes,
      source: "ADMIN_MANUAL",
      allowSlotOverride: true,
      items: validItems.map((item) => ({
        productId: item.productId || null,
        name: item.name,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice || 0),
        total: Number(item.quantity || 0) * Number(item.unitPrice || 0),
      })),
    };

    const url = mode === "ADD" ? "/api/bulk-orders" : `/api/bulk-orders/${form.id}`;
    const method = mode === "ADD" ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok || !data.success) {
      alert(data.message || "Could not save bulk order.");
      return;
    }

    await fetchOrders();
    setOpen(false);
  };

  const confirmOutOfZoneSave = async () => {
    setConfirmPincodeOpen(false);
    await submitOrder();
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: "#f1f5f9", minHeight: "100vh" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
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

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map(({ key, label, icon: Icon, color, bg }) => (
          <Grid item xs={6} sm={4} md={2} key={key}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: "14px", border: "1px solid #e2e8f0", background: "#fff" }}>
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

      <Paper elevation={0} sx={{ borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden", background: "#fff" }}>
        <Box sx={{ p: 2, borderBottom: "1px solid #f1f5f9" }}>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            useFlexGap
            flexWrap="wrap"
          >
            <TextField
              size="small"
              placeholder="Search order, name, phone"
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
                width: { xs: "100%", sm: 280, md: 300 },
                "& .MuiOutlinedInput-root": {
                  ...fieldSx["& .MuiOutlinedInput-root"],
                  backgroundColor: "#f8fafc",
                },
              }}
            />

            <TextField
              select
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "ALL" | BulkStatus)}
              sx={{ ...fieldSx, width: 145 }}
            >
              <MenuItem value="ALL">All Status</MenuItem>
              {statusOptions.map((s) => (
                <MenuItem key={s} value={s}>{statusLabel[s]}</MenuItem>
              ))}
            </TextField>

            <TextField
              type="date"
              size="small"
              label="Date"
              InputLabelProps={{ shrink: true }}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              sx={{ ...fieldSx, width: 150 }}
            />

            <TextField
              select
              size="small"
              label="Slot"
              value={slotFilter}
              onChange={(e) => setSlotFilter(e.target.value)}
              sx={{ ...fieldSx, width: 150 }}
            >
              <MenuItem value="ALL">All Slots</MenuItem>
              {slotOptions.map((slot) => (
                <MenuItem key={slot} value={slot}>{slot}</MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              label="Source"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as SourceFilter)}
              sx={{ ...fieldSx, width: 150 }}
            >
              <MenuItem value="ALL">All Source</MenuItem>
              <MenuItem value="CUSTOMER_FORM">Customer</MenuItem>
              <MenuItem value="ADMIN_MANUAL">Admin</MenuItem>
            </TextField>

            <TextField
              select
              size="small"
              label="Sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              sx={{ ...fieldSx, width: 150 }}
            >
              <MenuItem value="NEWEST">Newest</MenuItem>
              <MenuItem value="DELIVERY_DATE_ASC">Date Up</MenuItem>
              <MenuItem value="DELIVERY_DATE_DESC">Date Down</MenuItem>
              <MenuItem value="SLOT_ASC">Slot Time</MenuItem>
              <MenuItem value="AMOUNT_DESC">Amount High</MenuItem>
            </TextField>

            <Button
              variant={conflictOnly ? "contained" : "outlined"}
              startIcon={<WarningAmberRoundedIcon />}
              onClick={() => setConflictOnly((v) => !v)}
              sx={{
                height: 42,
                minWidth: 118,
                px: 1.6,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 800,
                color: conflictOnly ? "#fff" : "#d97706",
                borderColor: "#f59e0b",
                backgroundColor: conflictOnly ? "#d97706" : "#fff",
                "& .MuiButton-startIcon": {
                  mr: 0.7,
                  ml: 0,
                  flexShrink: 0,
                },
                "&:hover": {
                  backgroundColor: conflictOnly ? "#b45309" : "#fffbeb",
                  borderColor: "#d97706",
                },
              }}
            >
              Conflicts
            </Button>

            <Button
              variant="outlined"
              startIcon={<RefreshOutlinedIcon />}
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              sx={{
                height: 42,
                minWidth: 102,
                px: 1.5,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 800,
                borderColor: "#cbd5e1",
                color: "#475569",
                "& .MuiButton-startIcon": {
                  mr: 0.7,
                  ml: 0,
                },
                "&:hover": {
                  borderColor: BRAND,
                  backgroundColor: BRAND_LIGHT,
                  color: BRAND_DARK,
                },
              }}
            >
              Reset
            </Button>
          </Stack>
        </Box>

        <Box sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 1320, tableLayout: "fixed" }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                <TableCell sx={{ ...headCellSx, width: 145 }}>Order</TableCell>
                <TableCell sx={{ ...headCellSx, width: 210 }}>Customer</TableCell>
                <TableCell sx={{ ...headCellSx, width: 150 }}>Delivery</TableCell>
                <TableCell sx={{ ...headCellSx, width: 150 }}>Slot Status</TableCell>
                <TableCell sx={{ ...headCellSx, width: 110 }}>Items</TableCell>
                <TableCell sx={{ ...headCellSx, width: 115 }}>Amount</TableCell>
                <TableCell sx={{ ...headCellSx, width: 110 }}>Source</TableCell>
                <TableCell sx={{ ...headCellSx, width: 145 }}>Status</TableCell>
                <TableCell align="right" sx={{ ...headCellSx, width: 135 }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedOrders.map((order) => {
                const conflicts = getOrderConflicts(order);
                const hasConflict = conflicts.length > 0;
                const itemQty = order.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

                return (
                  <TableRow key={order.id} hover>
                    <TableCell sx={{ ...bodyCellSx, width: 145 }}>
                      <Tooltip title={order.orderRef}>
                        <Typography sx={{ fontWeight: 800, fontSize: 13, color: "#0f172a", lineHeight: 1.4 }}>
                          {order.orderRef}
                        </Typography>
                      </Tooltip>
                      <Typography sx={{ fontSize: 12, color: "#94a3b8", mt: 0.5, whiteSpace: "nowrap" }}>
                        {formatDate(order.createdAt)}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ ...bodyCellSx, width: 210 }}>
                      <Stack direction="row" alignItems="center" spacing={1.2}>
                        <Avatar sx={{ width: 34, height: 34, fontSize: 12, fontWeight: 800, backgroundColor: BRAND_LIGHT, color: BRAND_DARK, flexShrink: 0 }}>
                          {getInitials(order.customerName)}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#0f172a", lineHeight: 1.4 }}>
                            {order.customerName}
                          </Typography>
                          <Typography sx={{ fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}>
                            {order.phone}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell sx={{ ...bodyCellSx, width: 150 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#0f172a", whiteSpace: "nowrap" }}>
                        {formatDate(order.deliveryDate)}
                      </Typography>
                      <Typography sx={{ fontSize: 12.5, color: "#64748b", mt: 0.5, lineHeight: 1.45 }}>
                        {order.deliveryTime}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ ...bodyCellSx, width: 150 }}>
                      {hasConflict ? (
                        <Tooltip title={`Also booked: ${conflicts.map((c) => `${c.orderRef} - ${c.customerName}`).join(", ")}`}>
                          <Chip
                            icon={<WarningAmberRoundedIcon />}
                            label={`${conflicts.length + 1} orders`}
                            size="small"
                            sx={{
                              maxWidth: 130,
                              backgroundColor: "#fff1f2",
                              color: "#9f1239",
                              border: "1px solid #fecdd3",
                              fontWeight: 800,
                            }}
                          />
                        </Tooltip>
                      ) : (
                        <Chip
                          label="Available"
                          size="small"
                          sx={{
                            maxWidth: 130,
                            backgroundColor: "#f0fdf4",
                            color: "#166534",
                            border: "1px solid #bbf7d0",
                            fontWeight: 800,
                          }}
                        />
                      )}
                    </TableCell>

                    <TableCell sx={{ ...bodyCellSx, width: 110 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#0f172a", whiteSpace: "nowrap" }}>
                        {order.items.length} item(s)
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: "#64748b", mt: 0.5, whiteSpace: "nowrap" }}>
                        {itemQty.toLocaleString("en-IN")} pcs
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ ...bodyCellSx, width: 115 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#0f172a", whiteSpace: "nowrap" }}>
                        {formatMoney(order.estimatedTotal)}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ ...bodyCellSx, width: 110 }}>
                      <Chip
                        label={order.source === "CUSTOMER_FORM" ? "Customer" : "Admin"}
                        size="small"
                        sx={{
                          maxWidth: 95,
                          fontWeight: 700,
                          backgroundColor: order.source === "CUSTOMER_FORM" ? "#eff6ff" : "#f8fafc",
                          color: order.source === "CUSTOMER_FORM" ? "#1d4ed8" : "#475569",
                          border: "1px solid #e2e8f0",
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ ...bodyCellSx, width: 145 }}>
                      <Select
                        size="small"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as BulkStatus)}
                        sx={{
                          width: 112,
                          height: 32,
                          fontSize: 13,
                          fontWeight: 800,
                          borderRadius: "999px",
                          backgroundColor: statusColor[order.status].bg,
                          color: statusColor[order.status].color,
                          "& fieldset": { borderColor: statusColor[order.status].border },
                          "&:hover fieldset": { borderColor: statusColor[order.status].border },
                          "&.Mui-focused fieldset": { borderColor: statusColor[order.status].border, borderWidth: 1 },
                          "& .MuiSelect-select": {
                            py: 0.45,
                            pl: 1.8,
                            pr: "26px !important",
                          },
                          "& .MuiSelect-icon": {
                            right: 7,
                            color: statusColor[order.status].color,
                          },
                        }}
                      >
                        {statusOptions.map((s) => <MenuItem key={s} value={s}>{statusLabel[s]}</MenuItem>)}
                      </Select>
                    </TableCell>

                    <TableCell align="right" sx={{ ...bodyCellSx, width: 135}}>
                      <Stack direction="row" spacing={0.7} justifyContent="flex-end" sx={{ flexWrap: "nowrap", minWidth: 110 }}>
                        <Tooltip title="Download Quote PDF">
                          <IconButton component="a" href={`/api/bulk-orders/quote-pdf/${order.orderRef}`} target="_blank" size="small" sx={{ color: "#64748b", "&:hover": { backgroundColor: BRAND_LIGHT, color: BRAND } }}>
                            <DownloadOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit Order">
                          <IconButton size="small" onClick={() => openEdit(order)} sx={{ color: "#64748b", "&:hover": { backgroundColor: BRAND_LIGHT, color: BRAND } }}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Order">
                          <IconButton size="small" onClick={() => requestDeleteOrder(order)} sx={{ color: "#ef4444", "&:hover": { backgroundColor: "#fff1f2" } }}>
                            <DeleteOutlineIcon fontSize="small" />
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
                    <Typography sx={{ color: "#94a3b8", fontSize: 14, fontWeight: 600 }}>No bulk orders found</Typography>
                    <Typography sx={{ color: "#cbd5e1", fontSize: 13, mt: 0.5 }}>Try adjusting your search or filter</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

        {/* {filteredOrders.length > 0 && (
          <Box sx={{ px: 2.5, py: 1.5, borderTop: "1px solid #f1f5f9" }}>
            <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>
              Showing {filteredOrders.length} of {orders.length} orders
            </Typography>
          </Box>
        )} */}

        {filteredOrders.length > 0 && (
          <TablePagination
            component="div"
            count={filteredOrders.length}
            page={page}
            onPageChange={(_e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50, 100]}
            sx={{
              borderTop: "1px solid #f1f5f9",
              "& .MuiTablePagination-toolbar": { px: 2, minHeight: 52 },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                fontSize: 12.5,
                color: "#64748b",
              },
            }}
          />
        )}
      </Paper>

      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") return;
          setOpen(false);
        }}
        maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: "16px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" } }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: 18, color: "#0f172a", pb: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            {mode === "ADD" ? "New Bulk Order" : "Edit Bulk Order"}
            <Typography sx={{ fontSize: 13, color: "#64748b", fontWeight: 400, mt: 0.25 }}>
              {mode === "ADD" ? "Fill in the details to create a new bulk order." : "Update the order details below."}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: "#94a3b8" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3, backgroundColor: "#f8fafc" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", mb: 1 }}>
                Customer Info
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Customer Name" size="small" value={form.customerName} onChange={(e) => {
                const value = e.target.value;
                setForm({ ...form, customerName: value });
                setErrors((prev) => ({ ...prev, customerName: validateName(value) }));
              }} error={!!errors.customerName} helperText={errors.customerName} sx={fieldSx} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Phone" size="small" value={form.phone} onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setForm({ ...form, phone: value });
                setErrors((prev) => ({ ...prev, phone: validatePhone(value) }));
              }} 
              inputProps={{ maxLength: 10, inputMode: "numeric" }}
              error={!!errors.phone} helperText={errors.phone} sx={fieldSx}
            />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Email" size="small" value={form.email} onChange={(e) => {
                const value = e.target.value;
                setForm({ ...form, email: value });
                setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
              }} error={!!errors.email} helperText={errors.email} sx={fieldSx} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Occasion / Event" size="small" value={form.occasion} onChange={(e) => {
                const value = e.target.value;
                setForm({ ...form, occasion: value });
                setErrors((prev) => ({ ...prev, occasion: validateOccasion(value) }));
              }} error={!!errors.occasion} helperText={errors.occasion} sx={fieldSx} />
            </Grid>

            <Grid item xs={12} sx={{ mt: 1 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", mb: 1 }}>
                Delivery Details
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth type="date" label="Delivery Date" size="small" InputLabelProps={{ shrink: true }} value={form.deliveryDate} onChange={(e) => {
                const value = e.target.value;
                setForm({ ...form, deliveryDate: value, deliveryTime: "" });
                setErrors((prev) => ({ ...prev, deliveryDate: validateDeliveryDate(value), deliveryTime: undefined }));
              }} error={!!errors.deliveryDate} helperText={errors.deliveryDate} sx={fieldSx} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Delivery Slot"
                size="small"
                value={form.deliveryTime}
                onChange={(e) => handleSlotSelect(e.target.value)}
                error={!!errors.deliveryTime}
                disabled={!form.deliveryDate || !!errors.deliveryDate}
                helperText={
                  errors.deliveryTime ||
                  (bookedSlotsLoading ? "Checking booked slots..." : !form.deliveryDate ? "Pick a delivery date first" : "")
                }
                sx={fieldSx}
              >
                {getAvailableTimeSlots(form.deliveryDate).map((slot) => {
                  const conflicts = getSlotOrders(form.deliveryDate, slot, form.id);
                  const isBooked = (bookedSlots.includes(slot) || conflicts.length > 0) && !isOwnOriginalSlot(form.deliveryDate, slot);

                  return (
                    <MenuItem key={slot} value={slot}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%" }}>
                        <span>{slot}</span>
                        {isBooked && (
                          <Chip label={`${conflicts.length || 1} booked`} size="small" sx={{ height: 18, fontSize: 10, fontWeight: 700, ml: 1.5, backgroundColor: "#fff1f2", color: "#9f1239" }} />
                        )}
                      </Stack>
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>

            {form.deliveryDate && form.deliveryTime && selectedSlotConflicts.length > 0 && (
              <Grid item xs={12}>
                <Alert severity="warning" icon={<WarningAmberRoundedIcon />} sx={{ borderRadius: "10px", border: "1px solid #fde68a" }}>
                  This slot already has {selectedSlotConflicts.length} active order(s). Admin can still continue if delivery team can manage both.
                </Alert>
              </Grid>
            )}

            <Grid item xs={12} md={8}>
              <TextField fullWidth label="Delivery Address" size="small" value={form.deliveryAddress} onChange={(e) => {
                const value = e.target.value;
                setForm({ ...form, deliveryAddress: value });
                setErrors((prev) => ({ ...prev, deliveryAddress: validateAddress(value) }));
              }} error={!!errors.deliveryAddress} helperText={errors.deliveryAddress} sx={fieldSx} />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Pincode" size="small" value={form.pincode} onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setForm({ ...form, pincode: value });
                setErrors((prev) => ({ ...prev, pincode: validatePincode(value) }));
                setPincodeOutOfZone(false);
              }} onBlur={() => checkPincodeZone(form.pincode)} error={!!errors.pincode} helperText={
                errors.pincode ? errors.pincode : pincodeChecking ? "Checking delivery zone..." : pincodeOutOfZone ? "Outside usual Madurai delivery zone" : ""
              } FormHelperTextProps={{ sx: pincodeOutOfZone ? { color: "#d97706 !important", fontWeight: 600 } : undefined }} sx={fieldSx} />
            </Grid>

            <Grid item xs={12} sx={{ mt: 1 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", mb: 1 }}>
                Order Items
              </Typography>
            </Grid>

            {errors.items && (
              <Grid item xs={12}>
                <Typography sx={{ fontSize: 12.5, color: "#e11d48", fontWeight: 600 }}>{errors.items}</Typography>
              </Grid>
            )}

            {form.items.map((item, index) => (
              <Grid item xs={12} key={index}>
                <Paper elevation={0} sx={{ p: 1.5, borderRadius: "10px", border: "1px solid #e2e8f0", backgroundColor: "#fff" }}>
                  <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems="center">
                    <TextField select size="small" label="Product" value={item.productId} onChange={(e) => handleProductChange(index, Number(e.target.value))} sx={{ ...fieldSx, flex: 2 }}>
                      {products.map((product) => <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>)}
                    </TextField>

                    <TextField size="small" label="Qty" value={item.quantity} onChange={(e) => {
                      updateFormItem(index, { quantity: e.target.value });
                      setErrors((prev) => ({ ...prev, items: undefined }));
                    }} sx={{ ...fieldSx, flex: 1 }} />

                    <TextField size="small" label="Rate (₹)" value={item.unitPrice} onChange={(e) => updateFormItem(index, { unitPrice: e.target.value })} sx={{ ...fieldSx, flex: 1 }} />

                    <TextField size="small" disabled label="Total" value={`₹${(Number(item.quantity || 0) * Number(item.unitPrice || 0)).toLocaleString("en-IN")}`} sx={{ ...fieldSx, flex: 1 }} />

                    <IconButton onClick={() => removeItemRow(index)} disabled={form.items.length === 1} sx={{ color: "#ef4444", "&:hover": { backgroundColor: "#fff1f2" }, flexShrink: 0 }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Paper>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button onClick={addItemRow} startIcon={<AddIcon />} sx={{ textTransform: "none", color: BRAND, fontWeight: 700, fontSize: 13, "&:hover": { backgroundColor: BRAND_LIGHT } }}>
                Add another item
              </Button>
            </Grid>

            <Grid item xs={12} sx={{ mt: 0.5 }}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: "10px", border: "1px solid #e2e8f0", backgroundColor: "#fff" }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth size="small" disabled label="Subtotal" value={`₹${formTotals.subtotal.toLocaleString("en-IN")}`} sx={fieldSx} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth size="small" label="Delivery Charge (₹)" value={form.deliveryCharge} onChange={(e) => setForm({ ...form, deliveryCharge: e.target.value })} sx={fieldSx} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth size="small" disabled label="Estimated Total" value={`₹${formTotals.estimatedTotal.toLocaleString("en-IN")}`} sx={{
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

            <Grid item xs={12} md={4}>
              <TextField select fullWidth size="small" label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as BulkStatus })} sx={fieldSx}>
                {statusOptions.map((s) => <MenuItem key={s} value={s}>{statusLabel[s]}</MenuItem>)}
              </TextField>
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField fullWidth multiline minRows={2} size="small" label="Admin Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} sx={fieldSx} />
            </Grid>
          </Grid>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2, gap: 1, backgroundColor: "#f8fafc" }}>
          <Button onClick={() => setOpen(false)} sx={{ textTransform: "none", color: "#64748b", fontWeight: 600, borderRadius: "10px", px: 2.5 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={saveOrder} disabled={saving} sx={{
            textTransform: "none",
            backgroundColor: BRAND,
            fontWeight: 800,
            borderRadius: "10px",
            px: 3,
            boxShadow: `0 4px 12px ${alpha(BRAND, 0.3)}`,
            "&:hover": { backgroundColor: BRAND_DARK },
          }}>
            {saving ? "Saving..." : mode === "ADD" ? "Create Order" : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmSlotOpen} onClose={cancelSlotSelection} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 800, fontSize: 16 }}>
          <WarningAmberRoundedIcon sx={{ color: "#d97706" }} />
          Slot already booked
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ fontSize: 14, color: "#475569", mb: 2 }}>
            Another active order already has the <b>{pendingSlot || form.deliveryTime}</b> slot
            {form.deliveryDate ? ` on ${formatDate(form.deliveryDate)}` : ""}. Admin can continue only if the team can manage both orders.
          </Typography>

          {selectedSlotConflicts.length > 0 && (
            <Stack spacing={1}>
              {selectedSlotConflicts.map((order) => (
                <Paper key={order.id} elevation={0} sx={{ p: 1.5, borderRadius: "10px", border: "1px solid #fde68a", backgroundColor: "#fffbeb" }}>
                  <Stack direction="row" justifyContent="space-between" spacing={2}>
                    <Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#92400e" }}>{order.orderRef} - {order.customerName}</Typography>
                      <Typography sx={{ fontSize: 12, color: "#92400e" }}>{order.phone} | {statusLabel[order.status]}</Typography>
                    </Box>
                    <Button size="small" onClick={() => {
                      const confirmed = window.confirm(
                        "Switching to edit this conflicting order will discard the details you've entered in the current form. Continue?"
                      );
                      if (!confirmed) return;

                      setConfirmSlotOpen(false);
                      setPendingSlot(null);
                      openEdit(order);
                    }} sx={{ textTransform: "none", color: BRAND, fontWeight: 800 }}>
                      Edit
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={cancelSlotSelection} sx={{ textTransform: "none", color: "#64748b", fontWeight: 600 }}>
            Choose another slot
          </Button>
          <Button variant="contained" onClick={confirmSlotSelection} sx={{ textTransform: "none", backgroundColor: BRAND, fontWeight: 700, "&:hover": { backgroundColor: BRAND_DARK } }}>
            Continue anyway
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmPincodeOpen} onClose={() => setConfirmPincodeOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 800, fontSize: 16 }}>
          <WarningAmberRoundedIcon sx={{ color: "#d97706" }} />
          Pincode outside delivery zone
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 14, color: "#475569" }}>
            Pincode <b>{form.pincode}</b> is outside our usual Madurai delivery zone. Are you sure you want to deliver this order to this address?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setConfirmPincodeOpen(false)} sx={{ textTransform: "none", color: "#64748b", fontWeight: 600 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={confirmOutOfZoneSave} sx={{ textTransform: "none", backgroundColor: BRAND, fontWeight: 700, "&:hover": { backgroundColor: BRAND_DARK } }}>
            Yes, continue
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteConfirmOpen}
        onClose={(event, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") return;
          cancelDeleteOrder();
        }}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
          <WarningAmberRoundedIcon sx={{ color: "#ef4444" }} />
          Delete this order?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 14, color: "#475569" }}>
            Delete <b>{orderToDelete?.orderRef}</b> for <b>{orderToDelete?.customerName}</b>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={cancelDeleteOrder} disabled={deleting} sx={{ textTransform: "none", color: "#64748b", fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmDeleteOrder}
            disabled={deleting}
            sx={{
              textTransform: "none",
              backgroundColor: "#ef4444",
              fontWeight: 700,
              "&:hover": { backgroundColor: "#dc2626" },
            }}
          >
            {deleting ? "Deleting..." : "Delete Order"}
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