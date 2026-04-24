"use client";

import {
  Box,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export default function BulkOrderSection() {
  return (
    <Box
      sx={{
        mt: 10,
        px: { xs: 2, md: 6 },
        py: 6,
        borderRadius: 1,
        background:
          "radial-gradient(ellipse 70% 60% at 90% 50%,rgba(232,114,12,.08) 0%,transparent 70%), linear-gradient(160deg,#FFF8ED,#fff3ec)",
      }}
    >
      <Grid container spacing={12} alignItems="center">

        {/* LEFT SIDE */}
        <Grid item xs={12} md={6}>
        <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
        >

            {/* TAG */}
            <Typography
            sx={{
                fontSize: 12,
                letterSpacing: 2,
                fontWeight: 700,
                color: "#a45a2a",
            }}
            >
            BULK & CATERING
            </Typography>

            {/* TITLE */}
            <Typography
            variant="h3"
            sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                color: "#3b1f13",
                mt: 1,
            }}
            >
            Planning an Event?
            </Typography>

            {/* SUBTEXT */}
            <Typography
            sx={{
                mt: 2,
                color: "#6d4c41",
                maxWidth: 500,
                lineHeight: 1.7,
            }}
            >
            From office lunches to weddings — we deliver fresh, homemade food in large quantities,
            hot, hygienic, and always on time.
            </Typography>

            {/* BENEFITS */}
            <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2.5 }}>
            {[
                {
                icon: "💰",
                title: "Bulk Savings",
                desc: "Save up to 20% on large orders with automatic discounts.",
                },
                {
                icon: "⏱️",
                title: "On-Time Delivery",
                desc: "Scheduled delivery so your food arrives exactly when needed.",
                },
                {
                icon: "📦",
                title: "Hygienic Packaging",
                desc: "Packed in clean, food-safe containers to maintain freshness.",
                },
            ].map((item, i) => (
                <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                >
                <Box
                    sx={{
                    display: "flex",
                    gap: 2,
                    p: 2.2,
                    borderRadius: 3,
                    bgcolor:"#fff",
                    // background:
                    //     "linear-gradient(145deg, #fff8f2, #fff3ec)",
                    border: "1px solid rgba(136,57,29,0.08)",
                    boxShadow: "0 8px 20px rgba(136,57,29,0.08)",
                    transition: "all 0.3s ease",

                    "&:hover": {
                        transform: "translateX(6px)",
                        boxShadow: "0 14px 30px rgba(136,57,29,0.18)",
                    },
                    }}
                >
                    {/* ICON BOX */}
                    <Box
                    sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        background:
                        "linear-gradient(135deg, rgba(242,140,40,0.15), rgba(200,155,109,0.25))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                    }}
                    >
                    {item.icon}
                    </Box>

                    {/* TEXT */}
                    <Box>
                    <Typography
                        sx={{
                        fontWeight: 700,
                        color: "#3b1f13",
                        mb: 0.3,
                        }}
                    >
                        {item.title}
                    </Typography>

                    <Typography
                        sx={{
                        fontSize: 13,
                        color: "#7a5c4f",
                        lineHeight: 1.6,
                        }}
                    >
                        {item.desc}
                    </Typography>
                    </Box>
                </Box>
                </motion.div>
            ))}
            </Box>

        </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
        >
            <Box
            sx={{
                bgcolor: "#fff7f2",
                p: { xs: 3, md: 4 },
                borderRadius: 5,
                boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
            }}
            >
            <Typography sx={{ fontSize: 22, fontWeight: 700, mb: 1 }}>
                Get a Quick Quote
            </Typography>

            <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 3 }}>
                Tell us your requirement — we’ll respond within 2 hours.
            </Typography>

            <Grid container spacing={2.2}>

                {/* NAME */}
                <Grid item xs={6}>
                <TextField
                    fullWidth
                    size="small"
                    label="Your Name"
                    placeholder="e.g. Rajan Kumar"
                    InputProps={{
                    sx: {
                        borderRadius: "12px",
                        bgcolor: "#fff7f2",
                        "& fieldset": { border: "1.5px solid rgba(136,57,29,0.15)" },
                        "&:hover fieldset": { borderColor: "#88391d" },
                        "&.Mui-focused fieldset": {
                        borderColor: "#f28c28",
                        boxShadow: "0 0 0 2px rgba(242,140,40,0.15)",
                        },
                    },
                    }}
                />
                </Grid>

                {/* PHONE */}
                <Grid item xs={6}>
                <TextField
                    fullWidth
                    size="small"
                    label="Phone Number"
                    placeholder="+91 98765 43210"
                    InputProps={{
                    sx: {
                        borderRadius: "12px",
                        bgcolor: "#fff7f2",
                        "& fieldset": { border: "1.5px solid rgba(136,57,29,0.15)" },
                        "&:hover fieldset": { borderColor: "#88391d" },
                        "&.Mui-focused fieldset": {
                        borderColor: "#f28c28",
                        boxShadow: "0 0 0 2px rgba(242,140,40,0.15)",
                        },
                    },
                    }}
                />
                </Grid>

                {/* PRODUCT */}
                <Grid item xs={12}>
                <TextField
                    select
                    fullWidth
                    size="small"
                    label="Product Required"
                    InputProps={{
                    sx: {
                        borderRadius: "12px",
                        bgcolor: "#fff7f2",
                    },
                    }}
                >
                    <MenuItem>Wheat Chapathi</MenuItem>
                    <MenuItem>Golden Poori</MenuItem>
                    <MenuItem>Both – Chapathi & Poori</MenuItem>
                </TextField>
                </Grid>

                {/* QUANTITY */}
                <Grid item xs={6}>
                <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Quantity"
                    placeholder="e.g. 100"
                    InputProps={{
                    sx: {
                        borderRadius: "12px",
                        bgcolor: "#fff7f2",
                    },
                    }}
                />
                </Grid>

                {/* DATE */}
                <Grid item xs={6}>
                <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="Delivery Date"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                    sx: {
                        borderRadius: "12px",
                        bgcolor: "#fff7f2",
                    },
                    }}
                />
                </Grid>

                {/* NOTES */}
                <Grid item xs={12}>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    size="small"
                    label="Occasion / Notes"
                    placeholder="e.g. Office lunch for 50 people..."
                    InputProps={{
                    sx: {
                        borderRadius: "14px",
                        bgcolor: "#fff7f2",
                    },
                    }}
                />
                </Grid>

                {/* SUBMIT */}
                <Grid item xs={12}>
                <Button
                    fullWidth
                    sx={{
                    py: 1.5,
                    borderRadius: "999px",
                    fontWeight: 700,
                    color: "#fff",
                    background: "linear-gradient(135deg,#f28c28,#ffb36b)",
                    boxShadow: "0 8px 25px rgba(242,140,40,0.35)",
                    transition: "0.25s",
                    "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 30px rgba(242,140,40,0.45)",
                    },
                    }}
                >
                    📩 Send Bulk Request
                </Button>
                </Grid>

                {/* WHATSAPP */}
                <Grid item xs={12}>
                <Button
                    fullWidth
                    startIcon={<WhatsAppIcon />}
                    href="https://wa.me/91XXXXXXXXXX"
                    sx={{
                    py: 1.3,
                    borderRadius: "999px",
                    fontWeight: 600,
                    background: "rgba(37,211,102,0.1)",
                    color: "#25d366",
                    border: "1.5px solid rgba(37,211,102,0.4)",
                    transition: "0.25s",
                    "&:hover": {
                        bgcolor: "#25d366",
                        color: "#fff",
                        boxShadow: "0 10px 25px rgba(37,211,102,0.4)",
                    },
                    }}
                >
                    Chat on WhatsApp
                </Button>
                </Grid>

            </Grid>
            </Box>
        </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}