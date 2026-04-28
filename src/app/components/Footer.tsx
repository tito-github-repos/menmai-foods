"use client";

import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import "./Footer.css";
import Link from "next/link";
import Image from "next/image";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function Footer() {
  return (
    <Box sx={{ backgroundColor: "var(--primary-maroon-dark)" }}>
      <Container sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Image src="/logo.jpeg" alt="Logo" width={100} height={70} />
            </Box>

            <Typography variant="body2" sx={{ color: "var(--gray)" }}>
              Fresh chapathi and poori delivered to your door — made daily with
              premium ingredients and traditional care in Madurai, Tamil Nadu.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <Link
                href="https://facebook.com"
                target="_blank"
                className="contact-card"
              >
                <FacebookIcon sx={{ color: "var(--glt)" }} />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                className="contact-card"
              >
                <InstagramIcon sx={{ color: "var(--glt)" }} />
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="body1" sx={{ mb: 2, color: "var(--glt)" }}>
              Quick Links
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <MuiLink
                component={Link}
                href="/"
                underline="none"
                variant="body2"
                sx={{
                  color: "var(--ivory)",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  "& .icon": {
                    transition: "transform 0.3s ease",
                  },
                  "&:hover": {
                    color: "var(--glt)",
                  },
                  "&:hover .icon": {
                    transform: "translateX(5px)",
                  },
                }}
              >
                <ChevronRightIcon className="icon" sx={{ fontSize: 18 }} />
                Home
              </MuiLink>
              <MuiLink
                component={Link}
                href="/about"
                underline="none"
                variant="body2"
                sx={{
                  color: "var(--ivory)",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  "& .icon": {
                    transition: "transform 0.3s ease",
                  },
                  "&:hover": {
                    color: "var(--glt)",
                  },
                  "&:hover .icon": {
                    transform: "translateX(5px)",
                  },
                }}
              >
                <ChevronRightIcon className="icon" sx={{ fontSize: 18 }} />
                About
              </MuiLink>
              <MuiLink
                component={Link}
                href="/contact"
                underline="none"
                variant="body2"
                sx={{
                  color: "var(--ivory)",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  "& .icon": {
                    transition: "transform 0.3s ease",
                  },
                  "&:hover": {
                    color: "var(--glt)",
                  },
                  "&:hover .icon": {
                    transform: "translateX(5px)",
                  },
                }}
              >
                <ChevronRightIcon className="icon" sx={{ fontSize: 18 }} />
                Contact
              </MuiLink>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="body1" sx={{ mb: 2, color: "var(--glt)" }}>
              Contact
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <Box className="icon-container">
                  <LocationOnOutlinedIcon
                    sx={{ fontSize: 18, color: "var(--glt)" }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: "var(--ivory)" }}>
                  4/417, Vadivel Nagar, Nagamalai Pudukottai, Madurai, Tamil
                  Nadu - 625019
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  component="a"
                  href="tel:9894777825"
                  className="icon-container"
                >
                  <LocalPhoneOutlinedIcon
                    sx={{ fontSize: 18, color: "var(--glt)" }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: "var(--ivory)" }}>
                  +91 9894777825
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  component="a"
                  href="mailto:menmaifoodsmdu@gmail.com"
                  className="icon-container"
                >
                  <EmailOutlinedIcon
                    sx={{ fontSize: 18, color: "var(--glt)" }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: "var(--ivory)" }}>
                  menmaifoodsmdu@gmail.com
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Container
        sx={{
          py: 2,
          position: "relative",

          // 🔥 Gopuram ABOVE border
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-135px",
            left: 0,
            width: "100%",
            height: "170px",
            backgroundImage: "url('/footer.png')",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "bottom",
            backgroundSize: "contain",
            opacity: 0.35,
            pointerEvents: "none",
          },
        }}
      >
        <Box
          sx={{
            maxWidth: "lg",
            mx: "auto",
            px: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: "var(--gray)" }}>
            © {new Date().getFullYear()} Menmai Foods. All rights reserved.
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography variant="body2" sx={{ color: "var(--glt)" }}>
              Privacy Policy
            </Typography>
            <Typography variant="body2" sx={{ color: "var(--glt)" }}>
              Terms & Conditions
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
