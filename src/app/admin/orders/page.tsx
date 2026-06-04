"use client";

import { useState } from "react";

import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
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
  Grid,
  Card,
  CardContent,
  Pagination,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import TwoWheelerOutlinedIcon from "@mui/icons-material/TwoWheelerOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

export default function OrdersPage() {
  const [tab, setTab] = useState(0);

  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  const orders = [
    {
      id: "#MM-2401",
      customer: "Priya S.",
      phone: "98765 43210",
      items: "Chapathi × 10",
      amount: "₹280",
      status: "Pending",
    },
    {
      id: "#MM-2400",
      customer: "Ravi K.",
      phone: "91234 56789",
      items: "Poori × 6, Chapathi × 4",
      amount: "₹340",
      status: "Delivered",
    },
    {
      id: "#MM-2399",
      customer: "Meena R.",
      phone: "90011 22334",
      items: "Chapathi × 20",
      amount: "₹520",
      status: "Processing",
    },
    {
      id: "#MM-2398",
      customer: "Kumar T.",
      phone: "87654 32109",
      items: "Poori × 12",
      amount: "₹360",
      status: "Delivered",
    },
    {
      id: "#MM-2397",
      customer: "Lakshmi V.",
      phone: "99887 76655",
      items: "Bulk Order × 50",
      amount: "₹1200",
      status: "Cancelled",
    },
  ];

  const getStatusChip = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <Chip
            size="small"
            label="Pending"
            sx={{
              bgcolor: "#FFF3E0",
              color: "#EF6C00",
              fontWeight: 600,
            }}
          />
        );

      case "Delivered":
        return (
          <Chip
            size="small"
            label="Delivered"
            sx={{
              bgcolor: "#E8F5E9",
              color: "#2E7D32",
              fontWeight: 600,
            }}
          />
        );

      case "Processing":
        return (
          <Chip
            size="small"
            label="Processing"
            sx={{
              bgcolor: "#E3F2FD",
              color: "#1565C0",
              fontWeight: 600,
            }}
          />
        );

      default:
        return (
          <Chip
            size="small"
            label="Cancelled"
            sx={{
              bgcolor: "#FFEBEE",
              color: "#C62828",
              fontWeight: 600,
            }}
          />
        );
    }
  };

  return (
    <Box>
      {/* PAGE TITLE */}

      {/* <Typography
        sx={{
          fontSize: {
            xs: "28px",
            md: "40px",
          },
          fontWeight: 700,
          color: "#4B1E00",
          mb: 3,
        }}
      >
        Orders
      </Typography> */}

      {/* STATS */}
<Grid container spacing={3} mt={1} >
  <Grid item xs={12} sm={6} lg={3}mb={4}>
    <Card sx={{ borderRadius: 4 }}>
      <CardContent>
        <ShoppingBagOutlinedIcon />
        <Typography color="text.secondary">
          Total Orders
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          1,248
        </Typography>
        <Typography color="success.main" fontSize={14}>
          ↑ 12.5% this week
        </Typography>
      </CardContent>
    </Card>
  </Grid>

  <Grid item xs={12} sm={6} lg={3}>
    <Card sx={{ borderRadius: 4 }}>
      <CardContent>
        <LocalShippingOutlinedIcon />  {/* ← changed */}
        <Typography color="text.secondary">
          Delivered Orders          {/* ← changed */}
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          980
        </Typography>
        <Typography color="success.main" fontSize={14}>
          ↑ 15.2% this week
        </Typography>
      </CardContent>
    </Card>
  </Grid>

  <Grid item xs={12} sm={6} lg={3}>
    <Card sx={{ borderRadius: 4 }}>
      <CardContent>
        <TwoWheelerOutlinedIcon />   {/* ← changed */}
        <Typography color="text.secondary">
          Out for Delivery           {/* ← changed */}
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          43
        </Typography>
        <Typography color="warning.main" fontSize={14}>
          ↑ 5.1% this week
        </Typography>
      </CardContent>
    </Card>
  </Grid>

  <Grid item xs={12} sm={6} lg={3}>
    <Card sx={{ borderRadius: 4 }}>
      <CardContent>
        <RestaurantOutlinedIcon />   {/* ← changed */}
        <Typography color="text.secondary">
          Prepared Orders            {/* ← changed */}
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          67
        </Typography>
        <Typography color="info.main" fontSize={14}>
          ↑ 9.4% this week
        </Typography>
      </CardContent>
    </Card>
  </Grid>
</Grid>

      {/* TABLE CARD */}

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
            p: 3,
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Tabs
            value={tab}
            onChange={(e, value) => setTab(value)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All Orders" />
            <Tab label="Pending (7)" />
            <Tab label="Processing" />
            <Tab label="Delivered" />
          </Tabs>

          <TextField
            size="small"
            placeholder="Search order..."
            sx={{
              width: {
                xs: "100%",
                md: 300,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <TuneIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* DESKTOP TABLE */}

        {!mobile && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ORDER ID</TableCell>
                  <TableCell>CUSTOMER</TableCell>
                  <TableCell>PHONE</TableCell>
                  <TableCell>ITEMS</TableCell>
                  <TableCell>AMOUNT</TableCell>
                  <TableCell>STATUS</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <b>{order.id}</b>
                    </TableCell>

                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 34,
                            height: 34,
                            bgcolor: "#FCE4EC",
                            color: "#5D4037",
                          }}
                        >
                          {order.customer.charAt(0)}
                        </Avatar>

                        {order.customer}
                      </Box>
                    </TableCell>

                    <TableCell>{order.phone}</TableCell>

                    <TableCell>{order.items}</TableCell>

                    <TableCell>
                      {order.amount}
                    </TableCell>

                    <TableCell>
                      {getStatusChip(order.status)}
                    </TableCell>

                    <TableCell>
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* MOBILE CARDS */}

        {mobile && (
          <Box p={2}>
            {orders.map((order) => (
              <Card
                key={order.id}
                sx={{
                  mb: 2,
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Typography
                    fontWeight={700}
                  >
                    {order.id}
                  </Typography>

                  <Typography>
                    {order.customer}
                  </Typography>

                  <Typography
                    color="text.secondary"
                  >
                    {order.phone}
                  </Typography>

                  <Typography
                    sx={{ mt: 1 }}
                  >
                    {order.items}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1,
                      fontWeight: 700,
                    }}
                  >
                    {order.amount}
                  </Typography>

                  <Box mt={1}>
                    {getStatusChip(
                      order.status
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* PAGINATION */}

        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #eee",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination
            count={5}
            shape="rounded"
            color="primary"
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
    </Box>
  );
}