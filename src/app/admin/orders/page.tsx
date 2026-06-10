"use client";

import { useState, useEffect } from "react";

import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
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
  ToggleButtonGroup,
  ToggleButton,
  Skeleton,
  Alert,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarViewWeekIcon from "@mui/icons-material/CalendarViewWeek";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import CheckIcon from "@mui/icons-material/Check";

// ─── Types ────────────────────────────────────────────────────────────────────

type DateFilterValue = "all" | "24h" | "7d" | "30d" | "3m";

// Matches exactly what the API returns
interface RetailOrder {
  id: string;
  customer: string;
  phone: string;
  items: string;
  amount: string;
  status: string;
  date: string; // ISO string from API
}

interface BulkOrder {
  id: string;
  customer: string;
  phone: string;
  items: string;
  quantity: string;
  amount: string;
  status: string;
  date: string; // ISO string from API
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DATE_FILTER_OPTIONS: {
  value: DateFilterValue;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "all", label: "All time", icon: <DateRangeIcon fontSize="small" /> },
  {
    value: "24h",
    label: "Last 24 hours",
    icon: <AccessTimeIcon fontSize="small" />,
  },
  {
    value: "7d",
    label: "Last 7 days",
    icon: <CalendarViewWeekIcon fontSize="small" />,
  },
  {
    value: "30d",
    label: "Last 30 days",
    icon: <CalendarMonthIcon fontSize="small" />,
  },
  {
    value: "3m",
    label: "Last 3 months",
    icon: <CalendarTodayIcon fontSize="small" />,
  },
];

// DB enum → display label + chip color
const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> =
  {
    // Retail order statuses (Order_orderStatus)
    PENDING: { label: "Pending", bg: "#FFF3E0", color: "#EF6C00" },
    CONFIRMED: { label: "Processing", bg: "#E3F2FD", color: "#1565C0" },
    PREPARING: { label: "Processing", bg: "#E3F2FD", color: "#1565C0" },
    SHIPPED: { label: "Processing", bg: "#E3F2FD", color: "#1565C0" },
    DELIVERED: { label: "Delivered", bg: "#E8F5E9", color: "#2E7D32" },
    CANCELLED: { label: "Cancelled", bg: "#FFEBEE", color: "#C62828" },
    // Bulk order statuses (BulkOrder_status)
    QUOTED: { label: "Quoted", bg: "#E3F2FD", color: "#1565C0" },
  };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffH = Math.floor((now.getTime() - d.getTime()) / 3600000);
  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}d ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

// ─── Status chip ─────────────────────────────────────────────────────────────

function StatusChip({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? {
    label: status,
    bg: "#F5F5F5",
    color: "#666",
  };
  return (
    <Chip
      size="small"
      label={s.label}
      sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600, fontSize: 12 }}
    />
  );
}

// ─── Loading skeleton rows ────────────────────────────────────────────────────

function SkeletonRows({ cols }: { cols: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton
                variant="text"
                width={j === 0 ? 80 : j === cols - 1 ? 60 : "80%"}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OrdersPage() {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  const [view, setView] = useState<"retail" | "bulk">("retail");
  const [dateFilter, setDateFilter] = useState<DateFilterValue>("all");
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [page, setPage] = useState(1);

  // API state
  const [retailOrders, setRetailOrders] = useState<RetailOrder[]>([]);
  const [bulkOrders, setBulkOrders] = useState<BulkOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const menuOpen = Boolean(anchorEl);
  const selectedLabel =
    DATE_FILTER_OPTIONS.find((o) => o.value === dateFilter)?.label ??
    "All time";
  const ROWS_PER_PAGE = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoint =
          view === "retail"
            ? `/api/admin/orders/retail?range=${dateFilter}`
            : `/api/admin/orders/bulk?range=${dateFilter}`;

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`Failed to fetch orders (${res.status})`);

        const data = await res.json();

        if (view === "retail") setRetailOrders(data);
        else setBulkOrders(data);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [view, dateFilter]); // ← directly depend on view and dateFilter
  // ── Filter + paginate ───────────────────────────────────────────────────────

  const allOrders = view === "retail" ? retailOrders : bulkOrders;

  const filtered = allOrders.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customer.toLowerCase().includes(q) ||
      o.items.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE,
  );
  const colCount = view === "bulk" ? 9 : 8;

  return (
    <Box>
      {/* ── VIEW TOGGLE ── */}
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={(_, v) => {
          if (v) {
            setView(v);
            setSearch("");
            setDateFilter("all");
            setPage(1);
          }
        }}
        sx={{
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
          "& .MuiToggleButton-root": {
            px: 3,
            py: 1.2,
            gap: 1,
            textTransform: "none",
            fontWeight: 500,
            fontSize: 14,
            border: "none",
            borderRadius: 0,
            color: "text.secondary",
            "&:not(:last-child)": {
              borderRight: "1px solid",
              borderColor: "divider",
            },
            "&.Mui-selected": {
              bgcolor: "#4B1E00",
              color: "#fff",
              "&:hover": { bgcolor: "#3a1700" },
            },
          },
        }}
      >
        <ToggleButton value="retail">
          <ShoppingBagOutlinedIcon fontSize="small" />
          Retail orders
          <Chip
            label={retailOrders.length || "—"}
            size="small"
            sx={{
              ml: 0.5,
              height: 20,
              fontSize: 11,
              fontWeight: 600,
              bgcolor:
                view === "retail" ? "rgba(255,255,255,0.2)" : "action.hover",
              color: view === "retail" ? "#fff" : "text.secondary",
            }}
          />
        </ToggleButton>

        <ToggleButton value="bulk">
          <WarehouseOutlinedIcon fontSize="small" />
          Bulk orders
          <Chip
            label={bulkOrders.length || "—"}
            size="small"
            sx={{
              ml: 0.5,
              height: 20,
              fontSize: 11,
              fontWeight: 600,
              bgcolor:
                view === "bulk" ? "rgba(255,255,255,0.2)" : "action.hover",
              color: view === "bulk" ? "#fff" : "text.secondary",
            }}
          />
        </ToggleButton>
      </ToggleButtonGroup>

      {/* ── ERROR BANNER ── */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: 3 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* ── TABLE CARD ── */}
      <Paper
        sx={{
          borderRadius: 4,
          border: "1px solid #eee",
          overflow: "hidden",
          boxShadow: "none",
        }}
      >
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
          {/* Left — date filter dropdown + result count */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<CalendarTodayIcon fontSize="small" />}
              endIcon={
                <KeyboardArrowDownIcon
                  fontSize="small"
                  sx={{
                    transition: "transform 0.2s",
                    transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
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
                  "& .MuiMenuItem-root": {
                    fontSize: 13,
                    borderRadius: 1,
                    mx: 0.5,
                    px: 1.5,
                  },
                },
              }}
            >
              {DATE_FILTER_OPTIONS.map((opt) => (
                <MenuItem
                  key={opt.value}
                  selected={opt.value === dateFilter}
                  onClick={() => {
                    setDateFilter(opt.value);
                    setAnchorEl(null);
                    setPage(1);
                  }}
                  sx={{
                    "&.Mui-selected": {
                      bgcolor: "#FFF8F5",
                      color: "#4B1E00",
                      fontWeight: 600,
                      "&:hover": { bgcolor: "#FFF0E8" },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 32,
                      color:
                        opt.value === dateFilter ? "#4B1E00" : "text.secondary",
                    }}
                  >
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

            {/* Result count pill */}
            <Box
              sx={{
                px: 1.5,
                py: 0.4,
                borderRadius: 20,
                bgcolor: "action.hover",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
              >
                {loading
                  ? "Loading…"
                  : `${filtered.length} order${filtered.length !== 1 ? "s" : ""}`}
              </Typography>
            </Box>
          </Box>

          {/* Right — search */}
          <TextField
            size="small"
            placeholder="Search order..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            sx={{ width: { xs: "100%", md: 280 } }}
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
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#FAFAFA" }}>
                  <TableCell
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      color: "text.secondary",
                    }}
                  >
                    ORDER ID
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      color: "text.secondary",
                    }}
                  >
                    {view === "bulk" ? "BUSINESS" : "CUSTOMER"}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      color: "text.secondary",
                    }}
                  >
                    PHONE
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      color: "text.secondary",
                    }}
                  >
                    ITEMS
                  </TableCell>
                  {view === "bulk" && (
                    <TableCell
                      sx={{
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: 0.5,
                        color: "text.secondary",
                      }}
                    >
                      QTY
                    </TableCell>
                  )}
                  <TableCell
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      color: "text.secondary",
                    }}
                  >
                    AMOUNT
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      color: "text.secondary",
                    }}
                  >
                    DATE
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      color: "text.secondary",
                    }}
                  >
                    STATUS
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <SkeletonRows cols={colCount} />
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={colCount} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary" fontSize={14}>
                        No orders found for this period
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((order) => (
                    <TableRow
                      key={order.id}
                      sx={{
                        "&:hover": { bgcolor: "#FAFAFA" },
                        "&:last-child td": { border: 0 },
                      }}
                    >
                      <TableCell>
                        <Typography fontWeight={700} fontSize={13}>
                          {order.id}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              fontSize: 13,
                              fontWeight: 600,
                              bgcolor: view === "bulk" ? "#EDE7F6" : "#FCE4EC",
                              color: view === "bulk" ? "#4527A0" : "#5D4037",
                            }}
                          >
                            {order.customer.charAt(0)}
                          </Avatar>
                          <Typography fontSize={13}>
                            {order.customer}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography fontSize={13} color="text.secondary">
                          {order.phone}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography fontSize={13}>{order.items}</Typography>
                      </TableCell>

                      {view === "bulk" && (
                        <TableCell>
                          <Chip
                            size="small"
                            label={(order as BulkOrder).quantity}
                            sx={{
                              bgcolor: "#EDE7F6",
                              color: "#4527A0",
                              fontWeight: 600,
                              fontSize: 12,
                            }}
                          />
                        </TableCell>
                      )}

                      <TableCell>
                        <Typography fontSize={13} fontWeight={600}>
                          {order.amount}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography fontSize={12} color="text.secondary">
                          {formatDate(order.date)}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <StatusChip status={order.status} />
                      </TableCell>

                      <TableCell>
                        {/* <IconButton size="small">
                          <MoreVertIcon fontSize="small" />
                        </IconButton> */}
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
                <Card
                  key={i}
                  sx={{
                    mb: 2,
                    borderRadius: 3,
                    boxShadow: "none",
                    border: "1px solid #eee",
                  }}
                >
                  <CardContent>
                    <Skeleton width={100} />
                    <Skeleton width="60%" />
                    <Skeleton width="40%" />
                    <Skeleton width="80%" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              ))
            ) : paginated.length === 0 ? (
              <Typography
                color="text.secondary"
                fontSize={14}
                textAlign="center"
                py={4}
              >
                No orders found for this period
              </Typography>
            ) : (
              paginated.map((order) => (
                <Card
                  key={order.id}
                  sx={{
                    mb: 2,
                    borderRadius: 3,
                    boxShadow: "none",
                    border: "1px solid #eee",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography fontWeight={700} fontSize={14}>
                        {order.id}
                      </Typography>
                      <StatusChip status={order.status} />
                    </Box>

                    <Typography fontSize={13} fontWeight={500}>
                      {order.customer}
                    </Typography>
                    <Typography fontSize={12} color="text.secondary">
                      {order.phone}
                    </Typography>
                    <Typography fontSize={13} sx={{ mt: 1 }}>
                      {order.items}
                    </Typography>

                    {view === "bulk" && (
                      <Chip
                        size="small"
                        label={(order as BulkOrder).quantity}
                        sx={{
                          mt: 0.5,
                          bgcolor: "#EDE7F6",
                          color: "#4527A0",
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      />
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 1.5,
                      }}
                    >
                      <Typography fontSize={14} fontWeight={700}>
                        {order.amount}
                      </Typography>
                      <Typography fontSize={12} color="text.secondary">
                        {formatDate(order.date)}
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
            justifyContent: "center",
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, v) => setPage(v)}
            shape="rounded"
            color="primary"
          />
        </Box>
      </Paper>

      {/* ── FOOTER ── */}
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
        <Typography variant="body2">
          © 2024 Menmai Foods. All rights reserved.
        </Typography>
        <Typography variant="body2">
          Made with ❤️ for better food experiences.
        </Typography>
      </Box>
    </Box>
  );
}
