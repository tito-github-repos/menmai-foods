"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Chip,
  Container,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from "@mui/material";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardStats {
  todayBulkOrders: number;
  todayRetailOrders: number;
  todayRevenue: number;
  totalCustomers: number;
}

interface RetailOrder {
  id: number;
  orderNumber: string;
  customer: {
    fullName: string;
    phone: string;
  };
  items: string; // e.g. "Chapathi × 10, Poori × 6"
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  address: string;
  orderedAt: string;
}

interface BulkOrder {
  orderRef: string;
  id: number;
  fullName: string;
  phone: string;
  items: string; // e.g. "Custom Bulk × 50"
  totalAmount: number;
  status: string;
  address: string;
  deliveryDate: string;
  createdAt: string;
}

type OrderType = "retail" | "bulk";

const ROWS_PER_PAGE = 5;

// ─── Status chip helper ───────────────────────────────────────────────────────

const statusStyles: Record<string, { bg: string; text: string }> = {
  DELIVERED: { bg: "#DCFCE7", text: "#166534" },
  CONFIRMED: { bg: "#DCFCE7", text: "#166534" },
  PENDING: { bg: "#FEF3C7", text: "#B45309" },
  QUOTED: { bg: "#FEF3C7", text: "#B45309" },
  PROCESSING: { bg: "#DBEAFE", text: "#1D4ED8" },
  PREPARING: { bg: "#DBEAFE", text: "#1D4ED8" },
  SHIPPED: { bg: "#EDE9FE", text: "#6D28D9" },
  CANCELLED: { bg: "#FEE2E2", text: "#991B1B" },
};

function StatusChip({ status }: { status: string }) {
  const style = statusStyles[status.toUpperCase()] ?? {
    bg: "#F3F4F6",
    text: "#374151",
  };
  return (
    <Chip
      label={status.charAt(0) + status.slice(1).toLowerCase()}
      size="small"
      sx={{
        bgcolor: style.bg,
        color: style.text,
        fontWeight: 600,
        fontSize: "0.75rem",
      }}
    />
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ orderType }: { orderType: OrderType }) {
  const colSpan = orderType === "retail" ? 8 : 7;
  return (
    <TableRow>
      <TableCell colSpan={colSpan} sx={{ textAlign: "center", py: 6 }}>
        <Typography sx={{ color: "#9CA3AF", fontSize: "0.95rem" }}>
          No {orderType === "retail" ? "retail" : "bulk"} orders placed today
          yet.
        </Typography>
      </TableCell>
    </TableRow>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [orderType, setOrderType] = useState<OrderType>("retail");
  const [retailPage, setRetailPage] = useState(1);
  const [bulkPage, setBulkPage] = useState(1);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [retailOrders, setRetailOrders] = useState<RetailOrder[]>([]);
  const [bulkOrders, setBulkOrders] = useState<BulkOrder[]>([]);
  const [retailTotal, setRetailTotal] = useState(0);
  const [bulkTotal, setBulkTotal] = useState(0);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // ── Fetch summary stats ──────────────────────────────────────────────────
  useEffect(() => {
    async function fetchStats() {
      setLoadingStats(true);
      try {
        const res = await fetch("/api/admin/dashboard/stats");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data: DashboardStats = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStats(false);
      }
    }
    fetchStats();
  }, []);

  // ── Fetch paginated orders ───────────────────────────────────────────────
  // Primitive deps only — avoids the useCallback → useEffect cascade render warning.
  useEffect(() => {
    let cancelled = false;

    async function fetchOrders() {
      setLoadingOrders(true);
      try {
        if (orderType === "retail") {
          const res = await fetch(
            `/api/admin/dashboard/retail-orders?page=${retailPage}&limit=${ROWS_PER_PAGE}`,
          );
          if (!res.ok) throw new Error("Failed to fetch retail orders");
          const data: { orders: RetailOrder[]; total: number } =
            await res.json();
          if (!cancelled) {
            setRetailOrders(data.orders);
            setRetailTotal(data.total);
          }
        } else {
          const res = await fetch(
            `/api/admin/dashboard/bulk-orders?page=${bulkPage}&limit=${ROWS_PER_PAGE}`,
          );
          if (!res.ok) throw new Error("Failed to fetch bulk orders");
          const data: { orders: BulkOrder[]; total: number } = await res.json();
          if (!cancelled) {
            setBulkOrders(data.orders);
            setBulkTotal(data.total);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoadingOrders(false);
      }
    }

    fetchOrders();
    return () => {
      cancelled = true;
    };
  }, [orderType, retailPage, bulkPage]);

  // ── Summary card data ────────────────────────────────────────────────────
  const summaryCards = [
    {
      title: "Today's Bulk Orders",
      value: loadingStats ? "—" : String(stats?.todayBulkOrders ?? 0),
      icon: <Inventory2OutlinedIcon />,
      iconBg: "var(--primary-maroon-mid)",
    },
    {
      title: "Today's Retail Orders",
      value: loadingStats ? "—" : String(stats?.todayRetailOrders ?? 0),
      icon: <ShoppingCartOutlinedIcon />,
      iconBg: "var(--primary-teal-mid)",
    },
    {
      title: "Today's Revenue",
      value: loadingStats
        ? "—"
        : `₹${(stats?.todayRevenue ?? 0).toLocaleString("en-IN")}`,
      icon: <CurrencyRupeeOutlinedIcon />,
      iconBg: "var(--primary-maroon-mid)",
    },
    {
      title: "Total Customers",
      value: loadingStats ? "—" : String(stats?.totalCustomers ?? 0),
      icon: <GroupsOutlinedIcon />,
      iconBg: "var(--primary-teal-mid)",
    },
  ];

  // ── Pagination ───────────────────────────────────────────────────────────
  const activePage = orderType === "retail" ? retailPage : bulkPage;
  const activeTotal = orderType === "retail" ? retailTotal : bulkTotal;
  const pageCount = Math.max(1, Math.ceil(activeTotal / ROWS_PER_PAGE));
  const startRow = (activePage - 1) * ROWS_PER_PAGE + 1;
  const endRow = Math.min(activePage * ROWS_PER_PAGE, activeTotal);

  function handlePageChange(_: React.ChangeEvent<unknown>, value: number) {
    if (orderType === "retail") setRetailPage(value);
    else setBulkPage(value);
  }

  function handleToggle(
    _: React.MouseEvent<HTMLElement>,
    value: OrderType | null,
  ) {
    if (value) setOrderType(value);
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Container
      maxWidth={false}
      sx={{ py: { xs: 2, md: 4 }, px: { xs: 1.5, sm: 2, md: 3 } }}
    >
      {/* ── Summary Cards ── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr 1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: { xs: 1.5, md: 3 },
          mb: 4,
        }}
      >
        {summaryCards.map((item) => (
          <Card
            key={item.title}
            sx={{
              p: { xs: 1.5, md: 2 },
              borderRadius: 4,
              border: "1px solid #ECECEC",
              boxShadow: "none",
            }}
          >
            <Stack
              direction="row"
              spacing={{ xs: 1.5, md: 2 }}
              alignItems="flex-start"
            >
              <Box
                sx={{
                  width: { xs: 42, md: 50 },
                  height: { xs: 42, md: 50 },
                  borderRadius: 3,
                  bgcolor: item.iconBg,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  "& .MuiSvgIcon-root": {
                    fontSize: { xs: "1.2rem", md: "1.5rem" },
                  },
                }}
              >
                {item.icon}
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: { xs: "0.72rem", sm: "0.82rem", md: "0.9rem" },
                    color: "#6B7280",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "1.4rem", sm: "1.7rem", md: "2rem" },
                    fontWeight: 700,
                    color: "#111827",
                    lineHeight: 1.1,
                    mt: 0.5,
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
            </Stack>
          </Card>
        ))}
      </Box>

      {/* ── Orders Table ── */}
      <Paper
        sx={{
          borderRadius: 4,
          border: "1px solid #ECECEC",
          overflow: "hidden",
          boxShadow: "none",
        }}
      >
        {/* Table header row */}
        <Box
          sx={{
            p: { xs: 2, md: 3 },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "1.1rem", md: "1.5rem" },
              fontWeight: 700,
              fontFamily: "var(--font-heading)",
              color: "var(--text)",
              whiteSpace: "nowrap",
            }}
          >
            Today&apos;s Orders
          </Typography>

          {/* Toggle */}
          <ToggleButtonGroup
            value={orderType}
            exclusive
            onChange={handleToggle}
            size="small"
            sx={{
              border: "1px solid #E5E7EB",
              borderRadius: "10px !important",
              overflow: "hidden",
              "& .MuiToggleButton-root": {
                border: "none",
                borderRadius: "0 !important",
                px: { xs: 1.5, sm: 2.5 },
                py: 0.75,
                fontSize: { xs: "0.78rem", sm: "0.85rem" },
                fontWeight: 600,
                color: "#6B7280",
                textTransform: "none",
                transition: "all 0.18s ease",
                "&.Mui-selected": {
                  bgcolor: "var(--primary-teal-mid)",
                  color: "#fff",
                  "&:hover": { bgcolor: "var(--primary-teal-mid)" },
                },
                "&:hover": { bgcolor: "#F3F4F6" },
              },
            }}
          >
            <ToggleButton value="retail">Retail Orders</ToggleButton>
            <ToggleButton value="bulk">Bulk Orders</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Table */}
        <TableContainer
          sx={{ overflowX: "auto", position: "relative", minHeight: 120 }}
        >
          {loadingOrders && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(255,255,255,0.7)",
                zIndex: 2,
              }}
            >
              <CircularProgress
                size={32}
                sx={{ color: "var(--primary-teal-mid)" }}
              />
            </Box>
          )}

          {orderType === "retail" ? (
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow>
                  {[
                    "ORDER ID",
                    "CUSTOMER NAME",
                    "MOBILE",
                    "ITEMS",
                    "AMOUNT",
                    "ADDRESS",
                    "STATUS",
                    "TIME",
                  ].map((col) => (
                    <TableCell
                      key={col}
                      sx={{
                        color: "var(--primary-maroon-mid)",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {retailOrders.length === 0 && !loadingOrders ? (
                  <EmptyState orderType="retail" />
                ) : (
                  retailOrders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                        {order.orderNumber}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {order.customer.fullName}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {order.customer.phone}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        {order.items}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell
                        sx={{
                          maxWidth: 180,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={order.address}
                      >
                        {order.address}
                      </TableCell>
                      <TableCell>
                        <StatusChip status={order.orderStatus} />
                      </TableCell>
                      <TableCell
                        sx={{ whiteSpace: "nowrap", color: "#6B7280" }}
                      >
                        {new Date(order.orderedAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          ) : (
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow>
                  {[
                    "ORDER ID",
                    "CUSTOMER NAME",
                    "MOBILE",
                    "ITEMS",
                    "AMOUNT",
                    "STATUS",
                    "DELIVERY DATE",
                  ].map((col) => (
                    <TableCell
                      key={col}
                      sx={{
                        color: "var(--primary-maroon-mid)",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {bulkOrders.length === 0 && !loadingOrders ? (
                  <EmptyState orderType="bulk" />
                ) : (
                  bulkOrders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                        {order.orderRef}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {order.fullName}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {order.phone}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        {order.items}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </TableCell>
                      {/* ADDRESS column hidden — uncomment the TableCell below when ready
                      <TableCell
                        sx={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        title={order.address}
                      >
                        {order.address}
                      </TableCell>
                      */}
                      <TableCell>
                        <StatusChip status={order.status} />
                      </TableCell>
                      <TableCell
                        sx={{ whiteSpace: "nowrap", color: "#6B7280" }}
                      >
                        {new Date(order.deliveryDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {/* Pagination row */}
        <Box
          sx={{
            p: { xs: 2, md: 3 },
            borderTop: "1px solid #ECECEC",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign={{ xs: "center", sm: "left" }}
          >
            {activeTotal === 0
              ? "No orders to show"
              : `Showing ${startRow} to ${endRow} of ${activeTotal} orders`}
          </Typography>

          <Pagination
            count={pageCount}
            page={activePage}
            onChange={handlePageChange}
            shape="rounded"
            siblingCount={0}
            boundaryCount={1}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "var(--primary-teal-mid)",
                borderColor: "var(--primary-teal-mid)",
              },
              "& .Mui-selected": {
                backgroundColor: "var(--primary-teal-mid) !important",
                color: "#fff",
              },
            }}
          />
        </Box>
      </Paper>

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
        <Typography variant="body2">
          © 2024 Menmai Foods. All rights reserved.
        </Typography>
        <Typography variant="body2">
          Made with ❤️ for better food experiences.
        </Typography>
      </Box>
    </Container>
  );
}
