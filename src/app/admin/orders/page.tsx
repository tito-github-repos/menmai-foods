"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  Pagination,
  useMediaQuery,
  useTheme,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Alert,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarViewWeekIcon from "@mui/icons-material/CalendarViewWeek";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonthOutlined";
import DateRangeIcon from "@mui/icons-material/DateRange";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import CheckIcon from "@mui/icons-material/Check";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ClearIcon from "@mui/icons-material/Clear";

// ─── Types ────────────────────────────────────────────────────────────────────

type DateFilterValue = "all" | "24h" | "7d" | "30d" | "3m" | "custom";

interface RetailOrder {
  id: string;           // formatted order number, e.g. "#MM-0001"
  customer: string;
  phone: string;
  items: string;
  amount: string;
  paymentId: string;    // razorpayPaymentId or "—"
  address: string;      // fullAddress, area, city, pincode joined
  orderStatus: string;
  paymentStatus: string;
  date: string;         // ISO string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DATE_FILTER_OPTIONS: {
  value: DateFilterValue;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "all",    label: "All time",       icon: <DateRangeIcon fontSize="small" /> },
  { value: "24h",    label: "Last 24 hours",  icon: <AccessTimeIcon fontSize="small" /> },
  { value: "7d",     label: "Last 7 days",    icon: <CalendarViewWeekIcon fontSize="small" /> },
  { value: "30d",    label: "Last 30 days",   icon: <CalendarMonthIcon fontSize="small" /> },
  { value: "3m",     label: "Last 3 months",  icon: <CalendarTodayIcon fontSize="small" /> },
  { value: "custom", label: "Custom range",   icon: <EditCalendarIcon fontSize="small" /> },
];

const ORDER_STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  PENDING:   { label: "Pending",    bg: "#FFF3E0", color: "#EF6C00" },
  CONFIRMED: { label: "Confirmed",  bg: "#E3F2FD", color: "#1565C0" },
  PREPARING: { label: "Preparing",  bg: "#EDE7F6", color: "#4527A0" },
  SHIPPED:   { label: "Shipped",    bg: "#E0F2F1", color: "#00695C" },
  DELIVERED: { label: "Delivered",  bg: "#E8F5E9", color: "#2E7D32" },
  CANCELLED: { label: "Cancelled",  bg: "#FFEBEE", color: "#C62828" },
  EXPIRED:   { label: "Expired",    bg: "#F5F5F5", color: "#616161" },
  ABANDONED: { label: "Abandoned",  bg: "#F5F5F5", color: "#616161" },
};

const ROWS_PER_PAGE = 10;

// ─── Shared styles (mirroring dashboard) ─────────────────────────────────────

const headCellSx = {
  bgcolor: "#F9FAFB",
  color: "#7B3F2E",
  fontWeight: 700,
  fontSize: "0.8rem",
  letterSpacing: 0.5,
  borderBottom: "1px solid #E5E7EB",
  py: 2,
  whiteSpace: "nowrap" as const,
};

const bodyCellSx = {
  py: 2.5,
  verticalAlign: "top",
  borderBottom: "1px solid #F1F5F9",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day:   "2-digit",
    month: "short",
    year:  "numeric",
  });
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

// Turns a plain "YYYY-MM-DD" into a full ISO timestamp at local start-of-day.
function toStartOfDayISO(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toISOString();
}

// Turns a plain "YYYY-MM-DD" into a full ISO timestamp at local end-of-day,
// so the end date is treated INCLUSIVELY (matches orders placed any time that day).
function toEndOfDayISO(dateStr: string): string {
  const d = new Date(`${dateStr}T23:59:59.999`);
  return d.toISOString();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function OrderStatusChip({ status }: { status: string }) {
  const s = ORDER_STATUS_MAP[status] ?? { label: status, bg: "#F5F5F5", color: "#666" };
  return (
    <Chip
      size="small"
      label={s.label}
      sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600, fontSize: 11 }}
    />
  );
}

// Items cell: bold name, muted quantity — mirrors dashboard ItemsCell
function ItemsCell({ items }: { items: string }) {
  return (
    <>
      {items.split(",").map((item, idx) => {
        const parts = item.trim().split(/\s*[×x]\s*/);
        const name  = parts[0]?.trim() ?? item.trim();
        const qty   = parts[1]?.trim();
        return (
          <Typography
            key={idx}
            component="div"
            sx={{ fontSize: "0.9rem", color: "#334155", lineHeight: 1.9 }}
          >
            <Box component="span" sx={{ fontWeight: 700 }}>{name}</Box>
            {qty && (
              <Box component="span" sx={{ fontWeight: 400, color: "#64748B" }}>
                {" "}× {qty}
              </Box>
            )}
          </Typography>
        );
      })}
    </>
  );
}

function SkeletonRows({ cols }: { cols: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <TableCell key={j} sx={bodyCellSx}>
              <Skeleton variant="text" width={j === 0 ? 80 : "80%"} />
              {j === 0 && <Skeleton variant="text" width={60} sx={{ mt: 0.5 }} />}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OrdersPage() {
  const theme  = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  const [dateFilter, setDateFilter] = useState<DateFilterValue>("all");

  // Custom range: draft values live in the menu popover, applied values drive the fetch
  const [customStartDraft, setCustomStartDraft] = useState("");
  const [customEndDraft,   setCustomEndDraft]   = useState("");
  const [customStart,      setCustomStart]      = useState("");
  const [customEnd,        setCustomEnd]        = useState("");
  const [customRangeError, setCustomRangeError] = useState<string | null>(null);

  const [search,     setSearch]     = useState("");
  const [anchorEl,   setAnchorEl]   = useState<null | HTMLElement>(null);
  const [page,       setPage]       = useState(1);

  const [orders,  setOrders]  = useState<RetailOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const menuOpen = Boolean(anchorEl);

  const selectedLabel =
    dateFilter === "custom" && customStart && customEnd
      ? `${formatDate(customStart)} – ${formatDate(customEnd)}`
      : DATE_FILTER_OPTIONS.find((o) => o.value === dateFilter)?.label ?? "All time";

  // ── Fetch ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Don't fetch a half-filled custom range yet
    if (dateFilter === "custom" && (!customStart || !customEnd)) return;

    let cancelled = false;

    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ range: dateFilter });
        if (dateFilter === "custom") {
          params.set("startDate", toStartOfDayISO(customStart));
          params.set("endDate", toEndOfDayISO(customEnd));
        }

        const res = await fetch(`/api/admin/orders/retail?${params.toString()}`);
        if (!res.ok) throw new Error(`Failed to fetch orders (${res.status})`);
        const data: RetailOrder[] = await res.json();
        if (!cancelled) setOrders(data);
      } catch (err: unknown) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchOrders();
    return () => { cancelled = true; };
  }, [dateFilter, customStart, customEnd]);

  // ── Filter: PAID only + search ──────────────────────────────────────────────
  const filtered = orders.filter((o) => {
    if (o.paymentStatus !== "PAID") return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.id.toLowerCase().includes(q)       ||
      o.customer.toLowerCase().includes(q) ||
      o.items.toLowerCase().includes(q)    ||
      o.paymentId.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated  = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  // ORDER ID | CUSTOMER | ITEMS | AMOUNT | PAYMENT ID | ADDRESS | ORDER STATUS
  const COL_COUNT = 7;

  // ── Menu handlers ───────────────────────────────────────────────────────────
  function openMenu(e: React.MouseEvent<HTMLElement>) {
    // seed drafts with whatever is currently applied
    setCustomStartDraft(customStart);
    setCustomEndDraft(customEnd);
    setCustomRangeError(null);
    setAnchorEl(e.currentTarget);
  }

  function selectPreset(value: DateFilterValue) {
    setDateFilter(value);
    setCustomRangeError(null);
    setAnchorEl(null);
    setPage(1);
  }

  function handleStartDraftChange(value: string) {
    setCustomStartDraft(value);
    if (value && customEndDraft && value > customEndDraft) {
      setCustomRangeError("Start date cannot be later than the end date");
    } else {
      setCustomRangeError(null);
    }
  }

  function handleEndDraftChange(value: string) {
    setCustomEndDraft(value);
    if (customStartDraft && value && value < customStartDraft) {
      setCustomRangeError("End date cannot be earlier than the start date");
    } else {
      setCustomRangeError(null);
    }
  }

  function applyCustomRange() {
    if (!customStartDraft || !customEndDraft) {
      setCustomRangeError("Please select both a start and end date");
      return;
    }
    if (customStartDraft > customEndDraft) {
      setCustomRangeError("Start date cannot be later than the end date");
      return;
    }
    if (customEndDraft > todayStr()) {
      setCustomRangeError("End date cannot be in the future");
      return;
    }

    setCustomRangeError(null);
    setCustomStart(customStartDraft);
    setCustomEnd(customEndDraft);
    setDateFilter("custom");
    setAnchorEl(null);
    setPage(1);
  }

  function clearAllFilters() {
    setDateFilter("all");
    setSearch("");
    setCustomStart("");
    setCustomEnd("");
    setCustomStartDraft("");
    setCustomEndDraft("");
    setCustomRangeError(null);
    setAnchorEl(null);
    setPage(1);
  }

  const hasActiveFilters = dateFilter !== "all" || search.trim().length > 0;

  // ── Excel export ────────────────────────────────────────────────────────────
  function handleDownloadReport() {
    if (filtered.length === 0) return;

    const rows = filtered.map((o) => ({
      "Order ID":       o.id,
      "Date":           formatDate(o.date),
      "Customer":       o.customer,
      "Phone":          o.phone,
      "Items":          o.items,
      "Amount":         o.amount,
      "Payment ID":     o.paymentId,
      "Address":        o.address,
      "Order Status":   o.orderStatus,
      "Payment Status": o.paymentStatus,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Reasonable column widths so it's readable straight out of the export
    worksheet["!cols"] = [
      { wch: 12 }, // Order ID
      { wch: 12 }, // Date
      { wch: 18 }, // Customer
      { wch: 14 }, // Phone
      { wch: 30 }, // Items
      { wch: 10 }, // Amount
      { wch: 22 }, // Payment ID
      { wch: 30 }, // Address
      { wch: 14 }, // Order Status
      { wch: 14 }, // Payment Status
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const rangeSuffix =
      dateFilter === "custom" && customStart && customEnd
        ? `${customStart}_to_${customEnd}`
        : dateFilter;

    XLSX.writeFile(workbook, `orders-report-${rangeSuffix}-${todayStr()}.xlsx`);
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box>
      {/* ── ERROR BANNER ── */}
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* ── TABLE CARD ── */}
      <Paper sx={{ borderRadius: 4, border: "1px solid #eee", overflow: "hidden", boxShadow: "none", overflowX: "auto" }}>

        {/* TOP BAR */}
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 2,
            borderBottom: "1px solid #eee",
          }}
        >
          {/* Left — date filter + count */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<CalendarTodayIcon fontSize="small" />}
              endIcon={
                <KeyboardArrowDownIcon
                  fontSize="small"
                  sx={{ transition: "transform 0.2s", transform: menuOpen ? "rotate(180deg)" : "none" }}
                />
              }
              onClick={openMenu}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 500,
                fontSize: 13,
                color: "text.primary",
                borderColor: "divider",
                bgcolor: "background.paper",
                px: 1.5,
                "&:hover": { borderColor: "text.secondary" },
              }}
            >
              {selectedLabel}
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: "left", vertical: "top" }}
              anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
              PaperProps={{
                elevation: 2,
                sx: {
                  mt: 0.5,
                  minWidth: 240,
                  borderRadius: 3,
                  border: "1px solid #eee",
                  "& .MuiMenuItem-root": { fontSize: 13, borderRadius: 1, mx: 0.5, px: 1.5 },
                },
              }}
            >
              {DATE_FILTER_OPTIONS.filter((o) => o.value !== "custom").map((opt) => (
                <MenuItem
                  key={opt.value}
                  selected={opt.value === dateFilter}
                  onClick={() => selectPreset(opt.value)}
                  sx={{
                    "&.Mui-selected": {
                      bgcolor: "#FFF8F5", color: "#4B1E00", fontWeight: 600,
                      "&:hover": { bgcolor: "#FFF0E8" },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32, color: opt.value === dateFilter ? "#4B1E00" : "text.secondary" }}>
                    {opt.icon}
                  </ListItemIcon>
                  <ListItemText primaryTypographyProps={{ fontSize: 13 }}>
                    {opt.label}
                  </ListItemText>
                  {opt.value === dateFilter && (
                    <CheckIcon sx={{ fontSize: 16, color: "#4B1E00", ml: 1 }} />
                  )}
                </MenuItem>
              ))}

              {/* ── Custom range block ── */}
              <Box sx={{ mt: 0.5, pt: 1, px: 1.5, borderTop: "1px solid #F1F5F9" }}>
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                  <EditCalendarIcon sx={{ fontSize: 15 }} /> Custom range
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <TextField
                    type="date"
                    size="small"
                    label="Start date"
                    InputLabelProps={{ shrink: true }}
                    value={customStartDraft}
                    onChange={(e) => handleStartDraftChange(e.target.value)}
                    error={Boolean(customRangeError)}
                    inputProps={{ max: customEndDraft || todayStr() }}
                    fullWidth
                  />
                  <TextField
                    type="date"
                    size="small"
                    label="End date"
                    InputLabelProps={{ shrink: true }}
                    value={customEndDraft}
                    onChange={(e) => handleEndDraftChange(e.target.value)}
                    error={Boolean(customRangeError)}
                    inputProps={{ min: customStartDraft || undefined, max: todayStr() }}
                    fullWidth
                  />

                  {customRangeError && (
                    <Typography variant="caption" color="error" sx={{ mt: -0.5 }}>
                      {customRangeError}
                    </Typography>
                  )}

                  <Button
                    size="small"
                    variant="contained"
                    disabled={!customStartDraft || !customEndDraft || Boolean(customRangeError)}
                    onClick={applyCustomRange}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      fontWeight: 600,
                      bgcolor: "#4B1E00",
                      "&:hover": { bgcolor: "#3A1700" },
                    }}
                  >
                    Apply
                  </Button>
                </Box>
              </Box>
            </Menu>

            {/* Count pill */}
            <Box sx={{ px: 1.5, py: 0.4, borderRadius: 20, bgcolor: "action.hover", border: "1px solid", borderColor: "divider" }}>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {loading ? "Loading…" : `${filtered.length} paid order${filtered.length !== 1 ? "s" : ""}`}
              </Typography>
            </Box>

            {/* Clear filters */}
            {hasActiveFilters && (
              <Button
                size="small"
                startIcon={<ClearIcon fontSize="small" />}
                onClick={clearAllFilters}
                sx={{
                  textTransform: "none",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "text.secondary",
                  "&:hover": { bgcolor: "action.hover", color: "text.primary" },
                }}
              >
                Clear
              </Button>
            )}
          </Box>

          {/* Right — search + report */}
          <Box sx={{ display: "flex", gap: 1.5, width: { xs: "100%", md: "auto" }, flexWrap: "wrap" }}>
            <TextField
              size="small"
              placeholder="Search by order ID, customer, items…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              sx={{ width: { xs: "100%", md: 300 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <TuneIcon fontSize="small" sx={{ cursor: "pointer" }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2, fontSize: 13 },
              }}
            />

            <Button
              variant="outlined"
              size="small"
              startIcon={<FileDownloadOutlinedIcon fontSize="small" />}
              onClick={handleDownloadReport}
              disabled={loading || filtered.length === 0}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 600,
                fontSize: 13,
                color: "#4B1E00",
                borderColor: "#4B1E00",
                px: 2,
                whiteSpace: "nowrap",
                "&:hover": { borderColor: "#3A1700", bgcolor: "#FFF8F5" },
              }}
            >
              Report
            </Button>
          </Box>
        </Box>

        {/* ── DESKTOP TABLE ── */}
        {!mobile && (
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 1100 }}>
              <TableHead>
                <TableRow>
                  {[
                    "ORDER",
                    "CUSTOMER",
                    "ITEMS",
                    "AMOUNT",
                    "PAYMENT ID",
                    "ADDRESS",
                    "ORDER STATUS",
                  ].map((col) => (
                    <TableCell key={col} sx={headCellSx}>
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <SkeletonRows cols={COL_COUNT} />
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={COL_COUNT} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary" fontSize={14}>
                        No paid orders found for this period
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((order) => (
                    <TableRow
                      key={order.id}
                      hover
                      sx={{ "&:hover": { bgcolor: "#FAFAFA" }, "& td": bodyCellSx }}
                    >
                      {/* ORDER ID + DATE stacked */}
                      <TableCell sx={{ minWidth: 160, ...bodyCellSx }}>
                        <Typography
                          fontWeight={700}
                          fontSize="0.95rem"
                          sx={{ color: "var(--primary-teal-mid, #0D9488)" }}
                        >
                          {order.id}
                        </Typography>
                        <Typography fontSize="0.8rem" color="#94A3B8" mt={0.5}>
                          {formatDate(order.date)}
                        </Typography>
                      </TableCell>

                      {/* CUSTOMER: name + phone stacked, no icon */}
                      <TableCell sx={{ minWidth: 180, ...bodyCellSx }}>
                        <Typography fontWeight={700} fontSize="1rem" color="#0F172A">
                          {order.customer}
                        </Typography>
                        <Typography fontSize="0.85rem" color="#64748B" mt={0.5}>
                          {order.phone}
                        </Typography>
                      </TableCell>

                      {/* ITEMS — bold name, muted quantity */}
                      <TableCell sx={{ minWidth: 220, ...bodyCellSx }}>
                        <ItemsCell items={order.items} />
                      </TableCell>

                      {/* AMOUNT */}
                      <TableCell sx={{ minWidth: 110, ...bodyCellSx }}>
                        <Typography fontWeight={700} fontSize="1.1rem" color="#111827">
                          {order.amount}
                        </Typography>
                      </TableCell>

                      {/* PAYMENT ID */}
                      <TableCell sx={{ minWidth: 180, ...bodyCellSx }}>
                        <Typography
                          fontSize={12}
                          fontFamily="monospace"
                          color={order.paymentId === "—" ? "text.disabled" : "text.primary"}
                          sx={{ wordBreak: "break-all" }}
                        >
                          {order.paymentId}
                        </Typography>
                      </TableCell>

                      {/* ADDRESS */}
                      <TableCell sx={{ minWidth: 200, ...bodyCellSx }}>
                        <Typography
                          fontSize="0.9rem"
                          color="#475569"
                          lineHeight={1.6}
                          sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                        >
                          {order.address}
                        </Typography>
                      </TableCell>

                      {/* ORDER STATUS */}
                      <TableCell sx={{ minWidth: 120, ...bodyCellSx }}>
                        <OrderStatusChip status={order.orderStatus} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* ── MOBILE CARDS ── */}
        {mobile && (
          <Box p={2}>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} sx={{ mb: 2, borderRadius: 3, boxShadow: "none", border: "1px solid #eee" }}>
                  <CardContent>
                    <Skeleton width={100} />
                    <Skeleton width="60%" />
                    <Skeleton width="40%" />
                    <Skeleton width="80%" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              ))
            ) : paginated.length === 0 ? (
              <Typography color="text.secondary" fontSize={14} textAlign="center" py={4}>
                No paid orders found for this period
              </Typography>
            ) : (
              paginated.map((order) => (
                <Card key={order.id} sx={{ mb: 2, borderRadius: 3, boxShadow: "none", border: "1px solid #eee" }}>
                  <CardContent sx={{ pb: "12px !important" }}>

                    {/* Row 1: Order ID + Order Status */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
                      <Typography
                        fontWeight={700}
                        fontSize="0.95rem"
                        sx={{ color: "var(--primary-teal-mid, #0D9488)" }}
                      >
                        {order.id}
                      </Typography>
                      <OrderStatusChip status={order.orderStatus} />
                    </Box>

                    {/* Date */}
                    <Typography fontSize="0.8rem" color="#94A3B8" mb={1}>
                      {formatDate(order.date)}
                    </Typography>

                    {/* Customer + phone — no icon */}
                    <Typography fontSize={13} fontWeight={700} color="#0F172A">{order.customer}</Typography>
                    <Typography fontSize={12} color="#64748B" mb={0.5}>{order.phone}</Typography>

                    {/* Items */}
                    <Box mb={0.5}>
                      <ItemsCell items={order.items} />
                    </Box>

                    {/* Address */}
                    <Typography fontSize={12} color="#475569" lineHeight={1.6} mb={1}>
                      {order.address}
                    </Typography>

                    {/* Payment ID */}
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5, mb: 1, flexWrap: "wrap" }}>
                      <Typography fontSize={11} color="text.secondary" fontWeight={600} flexShrink={0}>
                        Payment ID:
                      </Typography>
                      <Typography
                        fontSize={11}
                        fontFamily="monospace"
                        color={order.paymentId === "—" ? "text.disabled" : "text.primary"}
                        sx={{ wordBreak: "break-all" }}
                      >
                        {order.paymentId}
                      </Typography>
                    </Box>

                    {/* Amount + date */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                      <Typography fontSize={14} fontWeight={700} color="#111827">
                        {order.amount}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        )}

        {/* ── PAGINATION ── */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {filtered.length === 0
              ? "No paid orders to show"
              : `Showing ${Math.min((page - 1) * ROWS_PER_PAGE + 1, filtered.length)}–${Math.min(page * ROWS_PER_PAGE, filtered.length)} of ${filtered.length}`}
          </Typography>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, v) => setPage(v)}
            shape="rounded"
            size={mobile ? "small" : "medium"}
            sx={{
              "& .MuiPaginationItem-root": { color: "#4B1E00", borderColor: "#4B1E00" },
              "& .Mui-selected": { backgroundColor: "#4B1E00 !important", color: "#fff" },
            }}
          />
        </Box>
      </Paper>

      {/* ── FOOTER ── */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2, color: "#777", fontSize: 13 }}>
        <Typography variant="body2">© 2026 Menmai Foods. All rights reserved.</Typography>
        <Typography variant="body2">Made with ❤️ for better food experiences.</Typography>
      </Box>
    </Box>
  );
}
