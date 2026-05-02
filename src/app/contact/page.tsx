"use client";

import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import "./contact.css";
import Link from "next/link";

import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";

interface InfoCardProps {
  title: string;
  description: string;
  image: string;
  color: {
    main: string;
  };
}

/* ---------------- ANIMATION VARIANTS ---------------- */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay },
  viewport: { once: true },
});

const fadeRight = (delay = 0) => ({
  initial: { opacity: 0, x: -40 },
  whileInView: { opacity: 1, x: 0 },
  transition: { duration: 0.7, delay },
  viewport: { once: true },
});

const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: 40 },
  whileInView: { opacity: 1, x: 0 },
  transition: { duration: 0.7, delay },
  viewport: { once: true },
});

const zoomIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, delay },
  viewport: { once: true },
});

const patternOverlay = {
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
    opacity: 0.18,
    backgroundImage: `
        repeating-linear-gradient(
          22.5deg,
          transparent,
          transparent 2px,
          rgba(255,255,255,0.12) 2px,
          rgba(255,255,255,0.12) 3px,
          transparent 3px,
          transparent 8px
        ),
        repeating-linear-gradient(
          67.5deg,
          transparent,
          transparent 2px,
          rgba(255,255,255,0.08) 2px,
          rgba(255,255,255,0.08) 3px,
          transparent 3px,
          transparent 8px
        ),
        repeating-linear-gradient(
          112.5deg,
          transparent,
          transparent 2px,
          rgba(255,255,255,0.06) 2px,
          rgba(255,255,255,0.06) 3px,
          transparent 3px,
          transparent 8px
        ),
        repeating-linear-gradient(
          157.5deg,
          transparent,
          transparent 2px,
          rgba(255,255,255,0.05) 2px,
          rgba(255,255,255,0.05) 3px,
          transparent 3px,
          transparent 8px
        )
      `,
  },

  "& > *": {
    position: "relative",
    zIndex: 1,
  },
};

const InfoCard = ({ title, description, image, color }: InfoCardProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 2.5, md: 3.5 },
      }}
    >
      {/* Image */}
      <Box
        component="img"
        src={image}
        alt={title}
        sx={{
          width: { xs: 110, sm: 130, md: 150 },
          height: { xs: 110, sm: 130, md: 150 },
          objectFit: "cover",
          flexShrink: 0,
        }}
      />

      {/* Content */}
      <Box>
        <Typography
          variant="h5"
          fontWeight={700}
          color={color.main}
          mb={1}
          sx={{
            fontSize: { xs: "1.3rem", md: "1.55rem" },
            fontFamily: "var(--font-heading)",
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="var(--text)"
          sx={{
            fontSize: { xs: ".92rem", md: "1rem" },
            lineHeight: 1.7,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default function ContactPage() {
  return (
    <Box sx={{ pb: 8 }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#f7f6f3",
        }}
      >
        <Container maxWidth="lg" disableGutters sx={{ mr: 0, pr: 0 }}>
          <Grid container spacing={6} alignItems="center">
            {/* LEFT CONTENT */}
            <Grid item xs={12} md={6}>
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontSize: ".74rem",
                      fontWeight: 500,
                      letterSpacing: ".14em",
                      textTransform: "uppercase",
                      color: "var(--primary-teal-dark)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Get in Touch
                  </Typography>
                  <Box
                    sx={{
                      width: 35,
                      height: 32,
                      backgroundColor: "var(--green)",
                      mask: "url('/plant.png') no-repeat center / contain",
                      WebkitMask:
                        "url('/plant.png') no-repeat center / contain",
                      opacity: 0.7,
                      zIndex: 100,
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    fontSize: { xs: "1.9rem", md: "2.5rem" },
                    fontWeight: 700,
                    fontFamily: "var(--font-heading)",
                    color: "var(--primary-maroon-dark)",
                    lineHeight: 1.25,
                    mb: 2,
                  }}
                >
                  We would Love to Hear From You
                </Typography>

                <Typography
                  sx={{
                    fontSize: "1rem",
                    color: "var(--text)",
                    lineHeight: 1.7,
                    mb: 3,
                    maxWidth: 480,
                  }}
                >
                  For enquiries about orders, bulk orders, or delivery, feel
                  free to contact us anytime.
                </Typography>

                <Button
                  component={Link}
                  href="/"
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    px: 3,
                    py: 1.2,
                    borderRadius: "16px",
                    background: "var(--primary-teal-dark)",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                    "& .arrow-icon": {
                      ml: 1,
                      transition: "transform 0.3s ease",
                    },
                    "&:hover": {
                      background: "var(--primary-teal-mid)",
                    },
                    "&:hover .arrow-icon": {
                      transform: "translateX(6px)",
                    },
                  }}
                >
                  Send Us a Message
                  <ArrowRightAltOutlinedIcon className="arrow-icon" />
                </Button>
              </Box>
            </Grid>

            {/* RIGHT IMAGE */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-end" },
                alignItems: "stretch",
                pr: 0,
                mt: 0,
                mb: 0,
                maxHeight: "420px",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-end" },
                  alignItems: "stretch",
                  m: 0,
                  p: 0,
                }}
              >
                <Box
                  component="img"
                  src="/img/contact/bg2.png"
                  alt="Fresh Food"
                  sx={{
                    maxHeight: "355px",
                    width: { xs: "90%", md: "100%" },
                    height: { xs: "100%", md: "100%" },
                    objectFit: "cover",
                    display: "block",
                    m: 0,
                    p: 0,
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Box sx={{ pt: 8, pb: 4 }}>
          {/* Contact and Map */}
          <Grid container spacing={{ xs: 3, md: 4 }}>
            <Grid item xs={12} md={5}>
              <Box className="method-cards">
                <motion.div {...fadeRight(0.1)}>
                  <div className="method-card">
                    <Box className="contact_icon">
                      <LocationOnOutlinedIcon />
                    </Box>

                    <div className="mc-body">
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "var(--primary-teal-mid)",
                            fontWeight: 600,
                            mb: 0.5,
                          }}
                        >
                          Our Location
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ color: "var(--text)" }}
                        >
                          4/417, Vadivel Nagar, Nagamalai Pudukottai, Madurai,
                          Tamil Nadu - 625019
                        </Typography>
                      </Box>
                    </div>
                  </div>
                </motion.div>

                <motion.div {...fadeRight(0.1)}>
                  <div className="method-card">
                    <Box className="contact_icon">
                      <LocalPhoneOutlinedIcon />
                    </Box>

                    <div className="mc-body">
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "var(--primary-teal-mid)",
                            fontWeight: 600,
                            mb: 0.5,
                          }}
                        >
                          Phone
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ color: "var(--text)" }}
                        >
                          +91 9894777825
                        </Typography>
                      </Box>
                    </div>
                  </div>
                </motion.div>

                <motion.div {...fadeRight(0.1)}>
                  <a
                    className="method-card"
                    href="mailto:menmaifoodsmdu@gmail.com"
                  >
                    <Box className="contact_icon">
                      <EmailOutlinedIcon />
                    </Box>

                    <div className="mc-body">
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "var(--primary-teal-mid)",
                            fontWeight: 600,
                            mb: 0.5,
                          }}
                        >
                          Email
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ color: "var(--text)" }}
                        >
                          menmaifoodsmdu@gmail.com
                        </Typography>
                      </Box>
                    </div>

                    <span className="mc-arrow">→</span>
                  </a>
                </motion.div>

                <motion.div {...fadeRight(0.1)}>
                  <div className="method-card">
                    <Box className="contact_icon">
                      <AccessTimeOutlinedIcon />
                    </Box>

                    <div className="mc-body">
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "var(--primary-teal-mid)",
                            fontWeight: 600,
                            mb: 0.5,
                          }}
                        >
                          Order Timings
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ color: "var(--text)", lineHeight: 1.6 }}
                        >
                          6:00 AM – 7:00 PM <br />
                          (Monday – Saturday)
                        </Typography>
                      </Box>
                    </div>
                  </div>
                </motion.div>
              </Box>
            </Grid>

            <Grid item xs={12} md={7}>
              <motion.div {...fadeLeft(0.3)}>
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: 300, sm: 300, md: 465 },
                    borderRadius: "18px",
                    overflow: "hidden",
                    boxShadow: "var(--shadow)",
                    border:
                      "1.5px solid color-mix(in srgb, var(--primary-teal-mid), transparent 70%)",
                  }}
                >
                  <iframe
                    src="https://www.google.com/maps?q=Vadivel+Nagar,Nagamalai+Pudukottai,Madurai,625019&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    title="Menmai Foods location map"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        {/* Bulk Order */}
        <motion.div {...zoomIn(0.2)}>
          <Box
            sx={{
              ...patternOverlay,
              my: 4,
              p: { xs: 3, sm: 4, md: "28px 32px" },
              borderRadius: "18px",
              background: "rgba(248, 241, 230)",
              color: "var(--primary-teal-dark)",
              display: "flex",
              flexDirection: { xs: "column", sm: "column", md: "row" },
              alignItems: { xs: "center", md: "center" },
              textAlign: { xs: "center", md: "left" },
              gap: { xs: 3, md: 3 },
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Circle icon */}
            <Box
              sx={{
                width: 77,
                height: 77,
                borderRadius: "50%",
                background: "var(--primary-teal-dark)",
                outline:
                  "5px solid color-mix(in srgb, var(--primary-teal-dark), transparent 70%)",
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                mx: { xs: "auto", md: 0 },
              }}
            >
              <Box
                sx={{
                  width: 45,
                  height: 45,
                  backgroundColor: "var(--glt)",
                  mask: "url('/product-icon.svg') no-repeat center / contain",
                  WebkitMask:
                    "url('/product-icon.svg') no-repeat center / contain",
                }}
              />
            </Box>

            {/* Content */}
            <Box
              sx={{
                flex: 1,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "flex-start" },
              }}
            >
              <Typography
                sx={{
                  fontFamily: "var(--font-heading)",
                  fontSize: { xs: "1.35rem", sm: "1.5rem", md: "1.9rem" },
                  fontWeight: 700,
                  lineHeight: 1.25,
                  mb: 1,
                }}
              >
                Need a Large Quantity ?
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: ".85rem", sm: ".9rem", md: ".88rem" },
                  opacity: 0.85,
                  lineHeight: 1.7,
                  maxWidth: { xs: "100%", md: "420px" },
                  color: "var(--text)",
                }}
              >
                We cater for events, offices, functions, and celebrations with
                fresh, hygienically prepared Chapathi and Poori.
              </Typography>
            </Box>

            {/* Button */}
            <Button
              href="https://wa.me/919894777825"
              target="_blank"
              sx={{
                backgroundColor: "var(--primary-teal-dark)",
                color: "var(--white)",
                fontWeight: 700,
                fontSize: { xs: ".82rem", sm: ".88rem" },
                px: { xs: 3, sm: 3.5 },
                py: 1.5,
                borderRadius: "12px",
                textTransform: "none",
                whiteSpace: "nowrap",
                width: { xs: "100%", sm: "auto" },
                maxWidth: { xs: "260px", sm: "none" },
                mx: { xs: "auto", md: 0 },
                "&:hover": {
                  backgroundColor: "var(--primary-teal-mid)",
                  color: "var(--white)",
                  transform: "translateY(-2px)",
                },
                "& .arrow-icon": {
                  ml: 1,
                  transition: "transform 0.3s ease",
                },

                "&:hover .arrow-icon": {
                  transform: "translateX(6px)",
                },
              }}
            >
              Place Bulk Order
              <ArrowRightAltOutlinedIcon className="arrow-icon" />
            </Button>
          </Box>
        </motion.div>

        <Box sx={{ position: "relative", pt: { xs: 2, md: 2 } }}>
          {/* Vertical Divider */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                flex: 1,
                borderLeft: "2px dotted var(--primary-teal-dark)",
                opacity: 0.5,
              }}
            />

            <Box
              sx={{
                width: 24,
                height: 24,
                mt: 1,
                backgroundColor: "var(--primary-teal-dark)",
                mask: "url('/grain-wheat-icon.svg') no-repeat center / contain",
                WebkitMask:
                  "url('/grain-wheat-icon.svg') no-repeat center / contain",
              }}
            />
          </Box>

          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <InfoCard
                title="Quick Support"
                description="We’re here to provide fast, helpful assistance for your orders, product enquiries, and delivery needs whenever you need us."
                image="/img/contact/helpicon.png"
                color={{
                  main: "var(--primary-teal-dark)",
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <InfoCard
                title="Reliable Service"
                description="From fresh preparation to on-time delivery, we are committed to offering dependable service and trusted quality every time."
                image="/img/contact/handsakeicon.png"
                color={{
                  main: "var(--primary-teal-dark)",
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
