"use client";

import { useState } from "react";
import {
  Avatar,
  Box,
  Container,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

export default function CustomersPage() {
  const [page, setPage] = useState(1);

  const customers = [
    {
      name: "Priya S.",
      phone: "9876543210",
      totalOrders: 8,
      lastOrder: "Today",
      totalSpent: "₹2,240",
      color: "#FDE8E8",
    },
    {
      name: "Ravi K.",
      phone: "9123456789",
      totalOrders: 15,
      lastOrder: "Yesterday",
      totalSpent: "₹4,800",
      color: "#E8F5E9",
    },
    {
      name: "Meena R.",
      phone: "9001122334",
      totalOrders: 3,
      lastOrder: "3 days ago",
      totalSpent: "₹840",
      color: "#FFF3E0",
    },
    {
      name: "Kumar T.",
      phone: "8765432109",
      totalOrders: 22,
      lastOrder: "Today",
      totalSpent: "₹6,600",
      color: "#E0F2F1",
    },
    {
      name: "Lakshmi V.",
      phone: "9988776655",
      totalOrders: 6,
      lastOrder: "1 week ago",
      totalSpent: "₹1,800",
      color: "#F3E5F5",
    },
  ];

  return (
    <Container
      maxWidth={false}
      sx={{
        py: { xs: 2, md: 4 },
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          pb: { xs: 2, md: 3 },
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <TextField
          placeholder="Search by phone..."
          size="small"
          sx={{
            width: {
              xs: "100%",
              md: 350,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Paper
        sx={{
          borderRadius: 4,
          border: "1px solid #ECECEC",
          boxShadow: "none",
          overflow: "hidden",
        }}
      >
        {/* Table */}
        <TableContainer
          sx={{
            overflowX: "auto",
          }}
        >
          <Table
            sx={{
              minWidth: 900,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ color: "var(--primary-maroon-mid)", fontWeight: 600 }}
                >
                  NAME
                </TableCell>
                <TableCell
                  sx={{ color: "var(--primary-maroon-mid)", fontWeight: 600 }}
                >
                  PHONE
                </TableCell>
                <TableCell
                  sx={{ color: "var(--primary-maroon-mid)", fontWeight: 600 }}
                >
                  TOTAL ORDERS
                </TableCell>
                <TableCell
                  sx={{ color: "var(--primary-maroon-mid)", fontWeight: 600 }}
                >
                  LAST ORDER
                </TableCell>
                <TableCell
                  sx={{ color: "var(--primary-maroon-mid)", fontWeight: 600 }}
                >
                  TOTAL SPENT
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.phone}>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: customer.color,
                          color: "#333",
                          fontWeight: 500,
                        }}
                      >
                        {customer.name.charAt(0)}
                      </Avatar>

                      <Typography fontWeight={500}>{customer.name}</Typography>
                    </Box>
                  </TableCell>

                  <TableCell>{customer.phone}</TableCell>

                  <TableCell>{customer.totalOrders}</TableCell>

                  <TableCell>{customer.lastOrder}</TableCell>

                  <TableCell
                    sx={{
                      color: "var(--primary-teal-mid)",
                      fontWeight: 700,
                    }}
                  >
                    {customer.totalSpent}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
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
          <Typography variant="body2" color="text.secondary">
            Showing 1 to 5 of 25 customers
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
