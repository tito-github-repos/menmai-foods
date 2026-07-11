"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
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
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import SendRoundedIcon from "@mui/icons-material/SendRounded";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";

// Used only when an image is uploaded with no message typed — the WhatsApp
// template always needs some body text, so this fills that in automatically
// for a true "image only" send.
const DEFAULT_IMAGE_CAPTION = "Check out what's new at Menmai Foods!";

export default function BroadcastPage() {
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const [broadcasts, setBroadcasts] = useState<any[]>([]);

  // The text that will actually be sent as {{1}} — the admin's message if
  // they typed one, otherwise the default caption if there's an image.
  const effectiveMessage = message.trim() || (imageUrl ? DEFAULT_IMAGE_CAPTION : "");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    e.target.value = ""; // Reset the input value to allow re-uploading the same file

    // show preview immediately
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview); // Revoke the old preview URL
    }

    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/broadcasts/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        URL.revokeObjectURL(objectUrl);
        setImagePreview("");
        setImageUrl("");

        setSnackbar({
          open: true,
          message: data.message || "Image upload failed. Please try again.",
          severity: "error",
        });
        return;
      }

      setImageUrl(data.imageUrl);

      console.log("Cloudinary URL:", data.imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      URL.revokeObjectURL(objectUrl);
      setImagePreview("");
      setImageUrl("");

      setSnackbar({
        open: true,
        message:
          "Something went wrong while uploading the image. Please try again.",
        severity: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const [totalPages, setTotalPages] = useState(1);
  const [totalBroadcasts, setTotalBroadcasts] = useState(0);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBroadcasts = async (pageNumber = page) => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/broadcasts?page=${pageNumber}&limit=5`,
      );

      const data = await response.json();

      if (response.ok) {
        setBroadcasts(data.broadcasts);
        setTotalPages(data.totalPages);
        setTotalBroadcasts(data.total);
      }
    } catch (error) {
      console.error("Failed to fetch broadcasts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBroadcasts();
  }, [page]);

  const handleSendBroadcast = async () => {
    if (!message.trim() && !imageUrl) {
      setSnackbar({
        open: true,
        message: "Please enter a message or upload an image to continue.",
        severity: "error",
      });
      return;
    }

    try {
      setSending(true);

      const response = await fetch("/api/admin/broadcasts/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: effectiveMessage,
          imageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      await fetchBroadcasts(page); // Refresh the broadcast history after sending

      setSnackbar({
        open: true,
        message: "Broadcast sent successfully.",
        severity: "success",
      });

      // Clear form
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      setMessage("");
      setImagePreview("");
      setImageUrl("");
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Broadcast failed. Please try again.",
        severity: "error",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
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
              disabled={sending}
              onChange={(e) => {
                // Strip line breaks the moment they appear in the value —
                // covers desktop/mobile Enter, paste, and voice dictation.
                // Includes \u2028/\u2029 (line/paragraph separators) and \v
                // (vertical tab), which some paste sources (Word, some web
                // exports) use instead of a plain \n.
                setMessage(
                  e.target.value.replace(/[\r\n\v\u2028\u2029]+/g, " "),
                );
              }}
              helperText="Write this as one paragraph — line breaks aren't allowed."
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
                    disabled={uploading || sending}
                    startIcon={<CloudUploadOutlinedIcon />}
                  >
                    {uploading ? "Uploading..." : "Choose Image"}
                  </Button>
                </label>

                <Typography variant="body2" color="text.secondary" mt={1}>
                  JPG, PNG
                </Typography>
              </Box>
            </Box>

            <Button
              fullWidth
              variant="contained"
              startIcon={<SendRoundedIcon />}
              disabled={uploading || sending}
              onClick={handleSendBroadcast}
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
              {uploading
                ? "Uploading Image..."
                : sending
                  ? "Sending Broadcast..."
                  : "Send Broadcast"}
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
                      objectFit: "cover",
                    }}
                  />
                )}

                {message.trim() || imageUrl ? (
                  <>
                    <Typography
                      sx={{
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {"Dear Customer 👋,\n\n"}
                      {effectiveMessage}
                      {"\n\nWarmest Regards,\nMenmai Foods"}
                    </Typography>

                    <Box
                      sx={{
                        mt: 2,
                        pt: 1.5,
                        borderTop: "1px solid rgba(0,0,0,0.12)",
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "var(--primary-teal-mid)",
                          fontWeight: 600,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <LaunchOutlinedIcon sx={{ fontSize: "1rem" }} />
                        Visit website
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ color: "text.disabled", fontStyle: "italic" }}
                  >
                    Type a message or add an image to see the preview.
                  </Typography>
                )}
              </Box>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5 }}>
              This is a preview of the approved WhatsApp template ({imageUrl ? "menmai_broadcast_image" : "menmai_broadcast_text"}). The wrapper text and button are fixed by Meta and cannot be changed here.
            </Typography>
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
                    Image
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
                    Success
                  </TableCell>
                  <TableCell
                    sx={{ color: "var(--primary-maroon-mid)", fontWeight: 600 }}
                  >
                    Failed
                  </TableCell>
                  <TableCell
                    sx={{ color: "var(--primary-maroon-mid)", fontWeight: 600 }}
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress size={18} color="primary" />
                      {" "}Loading broadcasts...
                    </TableCell>
                  </TableRow>
                ) : broadcasts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                      <Typography color="text.secondary">
                        No broadcasts found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  broadcasts.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {new Date(item.createdAt).toLocaleDateString("en-IN")}
                      </TableCell>

                      <TableCell>
                        {item.imageUrl ? (
                          <Button
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={() => {
                              setSelectedImage(item.imageUrl);
                              setPreviewOpen(true);
                            }}
                          >
                            View
                          </Button>
                        ) : (
                          "-"
                        )}
                      </TableCell>

                      <TableCell>{item.message || "-"}</TableCell>

                      <TableCell>{item.totalCount}</TableCell>

                      <TableCell>{item.successCount}</TableCell>

                      <TableCell>{item.failedCount}</TableCell>

                      <TableCell>
                        <Chip
                          label={item.status}
                          color={
                            item.status === "COMPLETED"
                              ? "success"
                              : item.status === "SENDING"
                                ? "warning"
                                : "error"
                          }
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
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
              {totalBroadcasts === 0
                ? "No broadcasts available."
                : `Showing ${broadcasts.length} of ${totalBroadcasts} broadcasts`}
            </Typography>

            <Pagination
              count={totalPages}
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
            © 2026 Menmai Foods. All rights reserved.
          </Typography>

          <Typography variant="body2">
            Made with ❤️ for better food experiences.
          </Typography>
        </Box>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false,
            }))
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={previewOpen}
        onClose={(_, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") return;
          setPreviewOpen(false);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Broadcast Image
          <IconButton
            aria-label="close"
            onClick={() => setPreviewOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box
            component="img"
            src={selectedImage}
            alt="Broadcast"
            sx={{
              width: "100%",
              borderRadius: 2,
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}