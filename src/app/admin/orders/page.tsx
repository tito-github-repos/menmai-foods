"use client";

import { useState, useEffect } from "react";

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
import CheckIcon from "@mui/icons-material/Check";

// ─── Types ────────────────────────────────────────────────────────────────────

type DateFilterValue = "all" | "24h" | "7d" | "30d" | "3m";

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
  { value: "all", label: "All time",       icon: <DateRangeIcon fontSize="small" /> },
  { value: "24h", label: "Last 24 hours",  icon: <AccessTimeIcon fontSize="small" /> },
  { value: "7d",  label: "Last 7 days",    icon: <CalendarViewWeekIcon fontSize="small" /> },
  { value: "30d", label: "Last 30 days",   icon: <CalendarMonthIcon fontSize="small" /> },
  { value: "3m",  label: "Last 3 months",  icon: <CalendarTodayIcon fontSize="small" /> },
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
  const [search,     setSearch]     = useState("");
  const [anchorEl,   setAnchorEl]   = useState<null | HTMLElement>(null);
  const [page,       setPage]       = useState(1);

  const [orders,  setOrders]  = useState<RetailOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const menuOpen      = Boolean(anchorEl);
  const selectedLabel = DATE_FILTER_OPTIONS.find((o) => o.value === dateFilter)?.label ?? "All time";

  // ── Fetch ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/orders/retail?range=${dateFilter}`);
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
  }, [dateFilter]);

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
              onClick={(e) => setAnchorEl(e.currentTarget)}
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
                  minWidth: 200,
                  borderRadius: 3,
                  border: "1px solid #eee",
                  "& .MuiMenuItem-root": { fontSize: 13, borderRadius: 1, mx: 0.5, px: 1.5 },
                },
              }}
            >
              {DATE_FILTER_OPTIONS.map((opt) => (
                <MenuItem
                  key={opt.value}
                  selected={opt.value === dateFilter}
                  onClick={() => { setDateFilter(opt.value); setAnchorEl(null); setPage(1); }}
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
            </Menu>

            {/* Count pill */}
            <Box sx={{ px: 1.5, py: 0.4, borderRadius: 20, bgcolor: "action.hover", border: "1px solid", borderColor: "divider" }}>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {loading ? "Loading…" : `${filtered.length} paid order${filtered.length !== 1 ? "s" : ""}`}
              </Typography>
            </Box>
          </Box>

          {/* Right — search */}
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
