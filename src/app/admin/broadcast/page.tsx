"use client";

import { useState } from "react";
import {
  Box,
  Button,
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
  TextField,
  Typography,
} from "@mui/material";

import SendRoundedIcon from "@mui/icons-material/SendRounded";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

export default function BroadcastPage() {
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState(
    "Hi! Fresh homemade Chapathi & Poori ready for delivery today. Order now from menmaifoods.com",
  );

  const [imagePreview, setImagePreview] = useState("");

  const broadcasts = [
    {
      id: 1,
      date: "01 Jun 2026",
      message: "Festival Offer",
      recipients: 312,
      status: "Sent",
    },
    {
      id: 2,
      date: "28 May 2026",
      message: "New Item Launch",
      recipients: 298,
      status: "Sent",
    },
    {
      id: 3,
      date: "20 May 2026",
      message: "Weekend Special",
      recipients: 270,
      status: "Sent",
    },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        py: 4,
      }}
    >
      {/* Top Section */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 420px",
            lg: "1fr 420px",
          },
          gap: 3,
          mb: 4,
        }}
      >
        {/* Compose */}

        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            boxShadow: "none",
            border: "1px solid #ECECEC",
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            mb={3}
            sx={{ fontFamily: "var(--font-heading)" }}
          >
            Compose Message
          </Typography>

          <TextField
            label="Message"
            multiline
            rows={6}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Box mt={3}>
            <Typography fontWeight={600} mb={1}>
              Upload Image
            </Typography>

            <Box
              sx={{
                border: "2px dashed #D1D5DB",
                borderRadius: 3,
                p: 4,
                textAlign: "center",
              }}
            >
              <input
                hidden
                id="broadcast-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />

              <label htmlFor="broadcast-image">
                <Button
                  component="span"
                  startIcon={<CloudUploadOutlinedIcon />}
                >
                  Choose Image
                </Button>
              </label>

              <Typography variant="body2" color="text.secondary" mt={1}>
                JPG, PNG, WEBP
              </Typography>
            </Box>
          </Box>

          <Button
            fullWidth
            variant="contained"
            startIcon={<SendRoundedIcon />}
            sx={{
              mt: 4,
              py: 1.5,
              borderRadius: 3,
              color: "#fff",
              backgroundColor: "var(--primary-teal-mid)",
              "&:hover": {
                backgroundColor: "var(--primary-teal-dark)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Send Broadcast
          </Button>
        </Paper>

        {/* Preview */}

        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            border: "1px solid #ECECEC",
            boxShadow: "none",
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            mb={3}
            sx={{ fontFamily: "var(--font-heading)" }}
          >
            Preview
          </Typography>

          <Box
            sx={{
              bgcolor: "#F5F5F5",
              borderRadius: 4,
              p: 2,
            }}
          >
            <Box
              sx={{
                bgcolor: "#E8F5E9",
                p: 2,
                borderRadius: 3,
              }}
            >
              <Typography fontWeight={700} mb={1}>
                Menmai Foods
              </Typography>

              {imagePreview && (
                <Box
                  component="img"
                  src={imagePreview}
                  alt="preview"
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    mb: 2,
                    maxHeight: 220,
                    objectFit: "cover",
                  }}
                />
              )}

              <Typography
                sx={{
                  whiteSpace: "pre-wrap",
                }}
              >
                {message}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* History Table */}

      <Paper
        sx={{
          borderRadius: 4,
          border: "1px solid #ECECEC",
          boxShadow: "none",
          overflow: "hidden",
        }}
      >
        <Box p={3}>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ fontFamily: "var(--font-heading)" }}
          >
            Broadcast History
          </Typography>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ color: "var(--primary-maroon-mid)", fontWeight: 600 }}
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{ color: "var(--primary-maroon-mid)", fontWeight: 600 }}
                >
                  Message
                </TableCell>
                <TableCell
                  sx={{ color: "var(--primary-maroon-mid)", fontWeight: 600 }}
                >
                  Recipients
                </TableCell>
                <TableCell
                  sx={{ color: "var(--primary-maroon-mid)", fontWeight: 600 }}
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {broadcasts.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>

                  <TableCell>{item.message}</TableCell>

                  <TableCell>{item.recipients}</TableCell>

                  <TableCell>
                    <Chip label={item.status} color="success" size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            p: 3,
            borderTop: "1px solid #ECECEC",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing 1 to 3 of 12 broadcasts
          </Typography>

          <Pagination
            count={4}
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
                © 2026 Menmai Foods. All rights
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
