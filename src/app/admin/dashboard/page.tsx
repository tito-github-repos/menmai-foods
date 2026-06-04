"use client";

import { useState } from "react";
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
} from "@mui/material";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

export default function DashboardPage() {
  const [page, setPage] = useState(1);

  const stats = [
    {
      title: "Today's Orders",
      value: "24",
      icon: <Inventory2OutlinedIcon />,
      iconBg: "var(--primary-maroon-mid)",
    },
    {
      title: "Today's Revenue",
      value: "₹4,320",
      icon: <CurrencyRupeeOutlinedIcon />,
      iconBg: "var(--primary-teal-mid)",
    },
    {
      title: "Pending Orders",
      value: "7",
      icon: <AccessTimeOutlinedIcon />,
      iconBg: "var(--primary-maroon-mid)",
    },
    {
      title: "Total Customers",
      value: "312",
      icon: <GroupsOutlinedIcon />,
      iconBg: "var(--primary-teal-mid)",
    },
  ];

  const recentOrders = [
    {
      id: "#MM-2401",
      customer: "Priya S.",
      items: "Chapathi × 10",
      amount: "₹280",
      status: "Pending",
      time: "10:32 AM",
    },
    {
      id: "#MM-2400",
      customer: "Ravi K.",
      items: "Poori × 6, Chapathi × 4",
      amount: "₹340",
      status: "Delivered",
      time: "9:15 AM",
    },
    {
      id: "#MM-2399",
      customer: "Meena R.",
      items: "Chapathi × 20",
      amount: "₹520",
      status: "Processing",
      time: "8:50 AM",
    },
    {
      id: "#MM-2398",
      customer: "Kumar T.",
      items: "Poori × 12",
      amount: "₹360",
      status: "Delivered",
      time: "8:20 AM",
    },
    {
      id: "#MM-2397",
      customer: "Lakshmi V.",
      items: "Bulk Order × 50",
      amount: "₹1,200",
      status: "Pending",
      time: "7:45 AM",
    },
  ];

  const getStatusChip = (status: string) => {
    switch (status) {
      case "Delivered":
        return (
          <Chip
            label={status}
            size="small"
            sx={{
              bgcolor: "#DCFCE7",
              color: "#166534",
              fontWeight: 600,
            }}
          />
        );

      case "Pending":
        return (
          <Chip
            label={status}
            size="small"
            sx={{
              bgcolor: "#FEF3C7",
              color: "#B45309",
              fontWeight: 600,
            }}
          />
        );

      default:
        return (
          <Chip
            label={status}
            size="small"
            sx={{
              bgcolor: "#DBEAFE",
              color: "#1D4ED8",
              fontWeight: 600,
            }}
          />
        );
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        py: { xs: 2, md: 4 },
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      {/* Stats Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: { xs: 2, md: 3 },
          mb: 4,
        }}
      >
        {stats.map((item) => (
          <Card
            key={item.title}
            sx={{
              p: 2,
              borderRadius: 4,
              border: "1px solid #ECECEC",
              boxShadow: "none",
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              sx={{ height: "100%" }}
            >
              <Box
                sx={{
                  width: { xs: 50, md: 50 },
                  height: { xs: 50, md:50 },
                  borderRadius: 3,
                  bgcolor: item.iconBg,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  alignSelf: "flex-start",
                }}
              >
                {item.icon}
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: {
                      xs: "0.9rem",
                      md: "0.9rem",
                    },
                    color: "#6B7280",
                    fontWeight: 500,
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: {
                      xs: "1.8rem",
                      sm: "2rem",
                      md: "2rem",
                    },
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

      {/* Recent Orders Table */}
      <Paper
        sx={{
          borderRadius: 4,
          border: "1px solid #ECECEC",
          overflow: "hidden",
          boxShadow: "none",
        }}
      >
        <Box
          sx={{
            p: { xs: 2, md: 3 },
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 2,
            justifyContent: "space-between",
            alignItems: {
              xs: "stretch",
              sm: "center",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "1.2rem",
                md: "1.5rem",
              },
              fontWeight: 700,
              fontFamily: "var(--font-heading)",
              color: "var(--text)",
            }}
          >
            Today&apos;s Orders
          </Typography>
        </Box>

        <TableContainer
          sx={{
            overflowX: "auto",
          }}
        >
          <Table
            sx={{
              minWidth: 850,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ color: "var(--primary-maroon-mid)", fontWeight: 600 }}
                >
                  ORDER ID
                </TableCell>
                <TableCell
                  sx={{ color: "var(--primary-maroon-mid)", fontWeight: 600 }}
                >
                  CUSTOMER
                </TableCell>
                <TableCell
                  sx={{ color: "var(--primary-maroon-mid)", fontWeight: 600 }}
                >
                  ITEMS
                </TableCell>
                <TableCell
                  sx={{ color: "var(--primary-maroon-mid)", fontWeight: 600 }}
                >
                  AMOUNT
                </TableCell>
                <TableCell
                  sx={{ color: "var(--primary-maroon-mid)", fontWeight: 600 }}
                >
                  STATUS
                </TableCell>
                <TableCell
                  sx={{ color: "var(--primary-maroon-mid)", fontWeight: 600 }}
                >
                  TIME
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell sx={{ fontWeight: 600 }}>{order.id}</TableCell>

                  <TableCell>{order.customer}</TableCell>

                  <TableCell>{order.items}</TableCell>

                  <TableCell sx={{ fontWeight: 600 }}>{order.amount}</TableCell>

                  <TableCell>{getStatusChip(order.status)}</TableCell>

                  <TableCell>{order.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            p: { xs: 2, md: 3 },
            borderTop: "1px solid #ECECEC",
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
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
            Showing 1 to 5 of 25 orders
          </Typography>

          <Pagination
            count={5}
            page={page}
            onChange={(_, value) => setPage(value)}
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
        {/* FOOTER */}
      
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
                © 2024 Menmai Foods. All rights
                reserved.
              </Typography>
      
              <Typography variant="body2">
                Made with ❤️ for better food
                experiences.
              </Typography>
            </Box>
    </Container>
  );
}
