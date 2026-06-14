"use client";

import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Pagination,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  InputAdornment,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  totalOrders: number;
  lastOrderDate: string | null; // ISO string or null
  totalSpent: number;
  address: string; // primary address
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day:   "2-digit",
    month: "short",
    year:  "numeric",
  });
}

const AVATAR_COLORS = [
  { bg: "#FDE8E8", text: "#7B2D2D" },
  { bg: "#E8F5E9", text: "#1B5E20" },
  { bg: "#FFF3E0", text: "#7B4000" },
  { bg: "#E0F2F1", text: "#00493E" },
  { bg: "#F3E5F5", text: "#4A148C" },
  { bg: "#E3F2FD", text: "#0D47A1" },
  { bg: "#FCE4EC", text: "#880E4F" },
];

function avatarColor(name: string) {
  const code = (name ?? "").charCodeAt(0);
  const idx  = (isNaN(code) ? 0 : code) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx] ?? AVATAR_COLORS[0];
}

const ROWS_PER_PAGE = 10;

// ─── Skeleton rows ────────────────────────────────────────────────────────────

function SkeletonRows({ cols }: { cols: number }) {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton variant="text" width={j === 0 ? 140 : "75%"} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CustomersPage() {
  const theme  = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [search,    setSearch]    = useState("");
  const [page,      setPage]      = useState(1);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchCustomers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/customers");
        if (!res.ok) throw new Error(`Failed to fetch customers (${res.status})`);
        const data: Customer[] = await res.json();
        if (!cancelled) setCustomers(data);
      } catch (err: unknown) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCustomers();
    return () => { cancelled = true; };
  }, []);

  // ── Filter + paginate ──────────────────────────────────────────────────────
  const filtered = customers.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q)  ||
      c.phone.includes(q)               ||
      (c.email ?? "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated  = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);
  const startRow   = Math.min((page - 1) * ROWS_PER_PAGE + 1, filtered.length);
  const endRow     = Math.min(page * ROWS_PER_PAGE, filtered.length);

  const COL_COUNT = 7; // NAME | PHONE | ADDRESS | TOTAL ORDERS | LAST ORDER DATE | TOTAL SPENT

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Container maxWidth={false} sx={{ py: { xs: 2, md: 4 }, px: { xs: 1.5, sm: 2, md: 3 } }}>

      {/* ── Search bar ── */}
      <Box sx={{ pb: { xs: 2, md: 3 }, display: "flex", justifyContent: "flex-end" }}>
        <TextField
          placeholder="Search by name, phone or email…"
          size="small"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          sx={{ width: { xs: "100%", md: 350 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            sx: { borderRadius: 2, fontSize: 13 },
          }}
        />
      </Box>

      {/* ── Error ── */}
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* ── Table card ── */}
      <Paper sx={{ borderRadius: 4, border: "1px solid #ECECEC", boxShadow: "none", overflow: "hidden" }}>

        {/* ── DESKTOP TABLE ── */}
        {!mobile && (
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow>
                  {[
                    "NAME",
                    "PHONE",
                    "ADDRESS",
                    "TOTAL ORDERS",
                    "LAST ORDER DATE",
                    "TOTAL SPENT",
                  ].map((col) => (
                    <TableCell
                      key={col}
                      sx={{ color: "var(--primary-maroon-mid)", fontWeight: 600, whiteSpace: "nowrap" }}
                    >
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
                        No customers found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((customer) => {
                    const color = avatarColor(customer.name);
                    return (
                      <TableRow
                        key={customer.id}
                        sx={{ "&:hover": { bgcolor: "#FAFAFA" }, "&:last-child td": { border: 0 } }}
                      >
                        {/* NAME */}
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Avatar sx={{ bgcolor: color.bg, color: color.text, fontWeight: 600, width: 36, height: 36, fontSize: 14 }}>
                              {customer.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography fontWeight={600} fontSize={13}>
                                {customer.name}
                              </Typography>
                              {customer.email && (
                                <Typography fontSize={11} color="text.secondary">
                                  {customer.email}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>

                        {/* PHONE */}
                        <TableCell>
                          <Typography fontSize={13} whiteSpace="nowrap">{customer.phone}</Typography>
                        </TableCell>

                        {/* ADDRESS */}
                        <TableCell sx={{ maxWidth: 220 }}>
                          <Typography
                            fontSize={12}
                            color="text.secondary"
                            title={customer.address}
                            sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                          >
                            {customer.address || "—"}
                          </Typography>
                        </TableCell>

                        {/* TOTAL ORDERS */}
                        <TableCell>
                          <Typography fontSize={13} fontWeight={600} textAlign="center">
                            {customer.totalOrders}
                          </Typography>
                        </TableCell>

                        {/* LAST ORDER DATE */}
                        <TableCell>
                          <Typography fontSize={13} color="text.secondary" whiteSpace="nowrap">
                            {formatDate(customer.lastOrderDate)}
                          </Typography>
                        </TableCell>

                        {/* TOTAL SPENT */}
                        <TableCell>
                          <Typography fontSize={13} fontWeight={700} color="var(--primary-teal-mid)" whiteSpace="nowrap">
                            ₹{customer.totalSpent.toLocaleString("en-IN")}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* ── MOBILE CARDS ── */}
        {mobile && (
          <Box p={2}>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} sx={{ mb: 2, borderRadius: 3, boxShadow: "none", border: "1px solid #eee" }}>
                  <CardContent>
                    <Skeleton width={120} />
                    <Skeleton width="50%" />
                    <Skeleton width="70%" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              ))
            ) : paginated.length === 0 ? (
              <Typography color="text.secondary" fontSize={14} textAlign="center" py={4}>
                No customers found
              </Typography>
            ) : (
              paginated.map((customer) => {
                const color = avatarColor(customer.name);
                return (
                  <Card key={customer.id} sx={{ mb: 2, borderRadius: 3, boxShadow: "none", border: "1px solid #ECECEC" }}>
                    <CardContent sx={{ pb: "12px !important" }}>

                      {/* Name + avatar */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                        <Avatar sx={{ bgcolor: color.bg, color: color.text, fontWeight: 600, width: 36, height: 36, fontSize: 14 }}>
                          {customer.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={600} fontSize={14}>{customer.name}</Typography>
                          {customer.email && (
                            <Typography fontSize={11} color="text.secondary">{customer.email}</Typography>
                          )}
                        </Box>
                      </Box>

                      <Typography fontSize={13} color="text.secondary" mb={0.5}>{customer.phone}</Typography>

                      {/* Address */}
                      <Typography fontSize={12} color="text.secondary" mb={1}>{customer.address || "—"}</Typography>

                      {/* Stats row */}
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                        <Box>
                          <Typography fontSize={11} color="text.secondary">Orders</Typography>
                          <Typography fontSize={13} fontWeight={600}>{customer.totalOrders}</Typography>
                        </Box>
                        <Box>
                          <Typography fontSize={11} color="text.secondary">Last Order</Typography>
                          <Typography fontSize={13}>{formatDate(customer.lastOrderDate)}</Typography>
                        </Box>
                        <Box textAlign="right">
                          <Typography fontSize={11} color="text.secondary">Total Spent</Typography>
                          <Typography fontSize={14} fontWeight={700} color="var(--primary-teal-mid)">
                            ₹{customer.totalSpent.toLocaleString("en-IN")}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </Box>
        )}

        {/* ── Pagination ── */}
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
          <Typography variant="body2" color="text.secondary" textAlign={{ xs: "center", sm: "left" }}>
            {loading
              ? "Loading…"
              : filtered.length === 0
              ? "No customers to show"
              : `Showing ${startRow} to ${endRow} of ${filtered.length} customers`}
          </Typography>

          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => { setPage(value); }}
            shape="rounded"
            siblingCount={0}
            boundaryCount={1}
            size={mobile ? "small" : "medium"}
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
      <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2, color: "#777", fontSize: 13 }}>
        <Typography variant="body2">© 2024 Menmai Foods. All rights reserved.</Typography>
        <Typography variant="body2">Made with ❤️ for better food experiences.</Typography>
      </Box>
    </Container>
  );
}
