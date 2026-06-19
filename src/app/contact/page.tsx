"use client";

import { Box, Container, Grid, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import "./contact.css";
import Image from "next/image";

import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

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

const InfoCard = ({ title, description, image, color }: InfoCardProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: { xs: 2, sm: 2.5, md: 3.5 },
      }}
    >
      {/* Image */}
      <Box
        component="img"
        src={image}
        alt={title}
        loading="lazy"
        sx={{
          width: { xs: 90, sm: 130, md: 150 },
          height: { xs: 90, sm: 130, md: 150 },
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
            fontSize: { xs: "1.15rem", sm: "1.35rem", md: "1.55rem" },
            fontFamily: "var(--font-heading)",
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="var(--text)"
          sx={{
            fontSize: { xs: ".85rem", sm: ".92rem", md: "1rem" },
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
        <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
          {/* MOBILE IMAGE */}
          <Box
            sx={{
              display: { xs: "block", md: "none" },
              position: "absolute",
              inset: 0,
            }}
          >
            <Image
              src="/img/contact/bg.webp"
              alt="mobile bg"
              fill
              priority
              style={{ objectFit: "cover" }}
            />
          </Box>

          {/* DESKTOP IMAGE */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              inset: 0,
            }}
          >
            <Image
              src="/img/contact/bg-desk.webp"
              alt="desktop bg"
              fill
              priority
              style={{ objectFit: "cover" }}
            />
          </Box>

          {/* MOBILE ONLY OVERLAY */}
          <Box
            sx={{
              display: { xs: "block", md: "none" },
              position: "absolute",
              inset: 0,
              zIndex: 1,
              background:
                "linear-gradient(rgba(247,246,243,0.90), rgba(247,246,243,0.90))",
            }}
          />
        </Box>

        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box
                sx={{
                  position: "relative",
                  zIndex: 2,
                  py: { xs: 6, sm: 8, md: 6 },
                  pl: { md: 2 },
                  pr: { md: 4 },
                }}
              >
                <motion.div {...fadeUp(0.1)}>
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
                        mask: "url('/plant.webp') no-repeat center / contain",
                        WebkitMask:
                          "url('/plant.webp') no-repeat center / contain",
                        opacity: 0.7,
                        zIndex: 100,
                      }}
                    />
                  </Box>

                  <Typography
                    sx={{
                      /* Smaller on xs to prevent overflow */
                      fontSize: { xs: "1.55rem", sm: "1.9rem", md: "2.6rem" },
                      fontWeight: 700,
                      fontFamily: "var(--font-heading)",
                      color: "var(--primary-maroon-dark)",
                      lineHeight: 1.25,
                      mb: 1.5,
                    }}
                  >
                    We would{" "}
                    <Box component="span" sx={{ color: "var(--or)" }}>
                      Love
                    </Box>{" "}
                    to Hear From{" "}
                    <Box component="span" sx={{ color: "var(--green)" }}>
                      You!
                    </Box>{" "}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 2,
                        backgroundColor: "var(--or)",
                        borderRadius: 1,
                      }}
                    />
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        backgroundColor: "var(--or)",
                        mask: "url('/grain-wheat-icon.svg') no-repeat center / contain",
                        WebkitMask:
                          "url('/grain-wheat-icon.svg') no-repeat center / contain",
                        opacity: 0.75,
                      }}
                    />
                    <Box
                      sx={{
                        width: 28,
                        height: 2,
                        backgroundColor: "var(--or)",
                        borderRadius: 1,
                      }}
                    />
                  </Box>

                  <Typography
                    sx={{
                      fontSize: { xs: ".9rem", sm: "1rem" },
                      color: "var(--text)",
                      lineHeight: 1.7,
                      mb: 3,
                      maxWidth: 520,
                    }}
                  >
                    Your opinion counts! Write to us with your feedback at{" "}
                    <Box
                      component="span"
                      sx={{
                        color: "var(--primary-maroon-dark)",
                        fontWeight: 600,
                      }}
                    >
                      menmaifoodsmdu@gmail.com
                    </Box>
                    . We will be happy to address all your queries and
                    suggestions.
                    <br />
                    Want to know more about us and didn't know whom to ask? Call
                    us on{" "}
                    <Box
                      component="span"
                      sx={{
                        color: "var(--primary-maroon-dark)",
                        fontWeight: 600,
                      }}
                    >
                      +91 9894777825
                    </Box>{" "}
                    to connect with Menmai Foods.
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      /* Stack buttons on very small screens */
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: { xs: "stretch", sm: "flex-start" },
                      flexWrap: "wrap",
                      gap: 2,
                      mt: 2,
                      /* Constrain width on mobile so buttons don't stretch full-width */
                      maxWidth: { xs: 320, sm: "none" },
                    }}
                  >
                    {/* EMAIL BUTTON */}
                    <Button
                      component="a"
                      href="mailto:menmaifoodsmdu@gmail.com"
                      variant="contained"
                      sx={{
                        textTransform: "none",
                        fontWeight: 500,
                        px: { xs: 2.5, sm: 3 },
                        py: 1.2,
                        borderRadius: "16px",
                        background: "var(--primary-teal-dark)",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.12)",

                        "& .arrow-icon": {
                          ml: 0,
                          opacity: 0,
                          width: 0,
                          overflow: "hidden",
                          transition: "all 0.3s ease",
                          transform: "translateX(-6px)",
                        },

                        "&:hover": {
                          background: "var(--primary-teal-mid)",
                        },

                        "&:hover .arrow-icon": {
                          ml: 1,
                          opacity: 1,
                          width: "24px",
                          transform: "translateX(0)",
                        },
                      }}
                    >
                      <EmailOutlinedIcon sx={{ fontSize: "18px", mr: 1 }} />
                      Send Us a Mail
                      <ArrowRightAltOutlinedIcon className="arrow-icon" />
                    </Button>

                    {/* CALL BUTTON */}
                    <Button
                      component="a"
                      href="tel:+919894777825"
                      variant="outlined"
                      sx={{
                        textTransform: "none",
                        fontWeight: 500,
                        px: { xs: 2.5, sm: 3 },
                        py: 1.2,
                        borderRadius: "16px",
                        color: "var(--primary-teal-dark)",
                        borderColor: "var(--primary-teal-dark)",

                        "&:hover": {
                          background: "var(--primary-teal-mid)",
                          color: "var(--white)",
                          borderColor: "var(--primary-teal-mid)",
                        },

                        "& .arrow-icon": {
                          ml: 0,
                          opacity: 0,
                          width: 0,
                          overflow: "hidden",
                          transition: "all 0.3s ease",
                          transform: "translateX(-6px)",
                        },

                        "&:hover .arrow-icon": {
                          ml: 1,
                          opacity: 1,
                          width: "24px",
                          transform: "translateX(0)",
                        },
                      }}
                    >
                      <LocalPhoneOutlinedIcon
                        sx={{ fontSize: "18px", mr: 1 }}
                      />
                      Call Us Now
                      <ArrowRightAltOutlinedIcon className="arrow-icon" />
                    </Button>
                  </Box>
                </motion.div>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Box sx={{ pt: { xs: 5, md: 8 }, pb: 4 }}>
          {/* Contact and Map */}
          <Grid container spacing={{ xs: 3, md: 4 }}>
            <Grid item xs={12} md={5}>
              <Box className="method-cards">
                <div className="method-card">
                  <Box className="contact_icon">
                    <LocationOnOutlinedIcon />
                  </Box>

                  <div className="mc-body">
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "var(--primary-teal-dark)",
                          fontWeight: 600,
                          mb: 0.5,
                          fontFamily: "var(--font-heading)",
                        }}
                      >
                        Our Location
                      </Typography>

                      <Typography variant="body2" sx={{ color: "var(--text)" }}>
                        4/417, Vadivel Nagar, Nagamalai Pudukottai, Madurai,
                        Tamil Nadu - 625019
                      </Typography>
                    </Box>
                  </div>
                </div>

                <div className="method-card">
                  <Box className="contact_icon">
                    <LocalPhoneOutlinedIcon />
                  </Box>

                  <div className="mc-body">
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "var(--primary-teal-dark)",
                          fontWeight: 600,
                          mb: 0.5,
                          fontFamily: "var(--font-heading)",
                        }}
                      >
                        Phone
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: "var(--text)" }}
                        >
                          +91 9894777825
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ color: "var(--text)" }}
                        >
                          +91 9443214888
                        </Typography>
                      </Box>
                    </Box>
                  </div>
                </div>

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
                          color: "var(--primary-teal-dark)",
                          fontWeight: 600,
                          mb: 0.5,
                          fontFamily: "var(--font-heading)",
                        }}
                      >
                        Email
                      </Typography>

                      <Typography variant="body2" sx={{ color: "var(--text)" }}>
                        menmaifoodsmdu@gmail.com
                      </Typography>
                    </Box>
                  </div>

                  <span className="mc-arrow">→</span>
                </a>

                <div className="method-card">
                  <Box className="contact_icon">
                    <AccessTimeOutlinedIcon />
                  </Box>

                  <div className="mc-body">
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "var(--primary-teal-dark)",
                          fontWeight: 600,
                          mb: 0.5,
                          fontFamily: "var(--font-heading)",
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
              </Box>
            </Grid>

            <Grid item xs={12} md={7}>
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 280, sm: 300, md: 490 },
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow: "var(--shadow)",
                  border:
                    "1.5px solid color-mix(in srgb, var(--primary-teal-mid), transparent 70%)",
                }}
              >
                <iframe
                  src="https://www.google.com/maps?q=Menmai+Foods+4/417+Vadivel+Nagar+Nagamalai+Pudukottai+625019&z=17&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  title="Menmai Foods location map"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Bulk Order */}
        <Box
          sx={{
            my: 4,
            p: { xs: "20px 16px", sm: 4, md: "28px 32px" },
            borderRadius: "18px",
            background: "rgba(248, 241, 230)",
            color: "var(--primary-teal-dark)",
            display: "flex",
            flexDirection: { xs: "column", sm: "row", md: "row" },
            alignItems: { xs: "center", sm: "center" },
            textAlign: { xs: "center", sm: "left" },
            gap: { xs: 2.5, md: 3 },
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Circle icon */}
          <Box
            sx={{
              width: { xs: 72, sm: 90, md: 100 },
              height: { xs: 72, sm: 90, md: 100 },
              borderRadius: "50%",
              background: "var(--primary-teal-dark)",
              outline:
                "5px solid color-mix(in srgb, var(--primary-teal-dark), transparent 70%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              alignSelf: { xs: "center", sm: "flex-start", md: "flex-start" },
              mx: { xs: "auto", sm: 0 },
              mt: { md: 1 },
            }}
          >
            <Box
              sx={{
                width: { xs: 40, sm: 54, md: 60 },
                height: { xs: 40, sm: 54, md: 60 },
                backgroundColor: "var(--glt)",
                mask: "url('/product-icon.svg') no-repeat center / contain",
                WebkitMask:
                  "url('/product-icon.svg') no-repeat center / contain",
              }}
            />
          </Box>

          <Box
            sx={{
              flex: 1,
              width: "100%",
              display: "flex",
              flexDirection: { xs: "column", md: "column", lg: "row" },
              alignItems: {
                xs: "center",
                sm: "flex-start",
                lg: "center",
              },
              justifyContent: "space-between",
              gap: { xs: 2, md: 2.5, lg: 3 },
            }}
          >
            {/* Text Content */}
            <Box
              sx={{
                flex: 1,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", sm: "flex-start" },
              }}
            >
              <Typography
                sx={{
                  fontFamily: "var(--font-heading)",
                  fontSize: { xs: "1.15rem", sm: "1.5rem", md: "1.9rem" },
                  fontWeight: 700,
                  lineHeight: 1.25,
                  mb: 1,
                }}
              >
                Need a Large Quantity?
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: ".82rem", sm: ".9rem", md: ".88rem" },
                  opacity: 0.85,
                  lineHeight: 1.7,
                  mb: 1.5,
                  color: "var(--text)",
                }}
              >
                We cater for events, offices, functions, and celebrations with
                fresh, hygienically prepared Chapathi and Poori.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: { xs: 0.8, sm: 1.5, md: 2 },
                  justifyContent: { xs: "center", sm: "flex-start" },
                }}
              >
                {/* Custom Quantity */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    px: { xs: 1.2, sm: 1.5 },
                    py: { xs: 0.8, sm: 1 },
                    borderRadius: "10px",
                    background:
                      "color-mix(in srgb, var(--primary-teal-dark), transparent 92%)",
                  }}
                >
                  <Inventory2OutlinedIcon
                    sx={{
                      fontSize: "16px",
                      color: "var(--primary-teal-dark)",
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: { xs: ".75rem", sm: ".82rem" },
                      fontWeight: 600,
                      color: "var(--primary-teal-dark)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Custom Quantity
                  </Typography>
                </Box>

                {/* On-time Delivery */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    px: { xs: 1.2, sm: 1.5 },
                    py: { xs: 0.8, sm: 1 },
                    borderRadius: "10px",
                    background:
                      "color-mix(in srgb, var(--primary-teal-dark), transparent 92%)",
                  }}
                >
                  <AccessTimeOutlinedIcon
                    sx={{
                      fontSize: "16px",
                      color: "var(--primary-teal-dark)",
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: { xs: ".75rem", sm: ".82rem" },
                      fontWeight: 600,
                      color: "var(--primary-teal-dark)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    On-time Delivery
                  </Typography>
                </Box>

                {/* Special Pricing */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    px: { xs: 1.2, sm: 1.5 },
                    py: { xs: 0.8, sm: 1 },
                    borderRadius: "10px",
                    background:
                      "color-mix(in srgb, var(--primary-teal-dark), transparent 92%)",
                  }}
                >
                  <LocalOfferOutlinedIcon
                    sx={{
                      fontSize: "16px",
                      color: "var(--primary-teal-dark)",
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: { xs: ".75rem", sm: ".82rem" },
                      fontWeight: 600,
                      color: "var(--primary-teal-dark)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Special Pricing
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Button */}
            <Button
              href="/bulkorder"
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
                mx: { xs: "auto", sm: 0 },
                alignSelf: { md: "flex-start", lg: "center" },

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
        </Box>

        <Box sx={{ position: "relative", pt: { xs: 2, md: 2 } }}>
          {/* Vertical Divider — desktop only */}
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

          <Grid container spacing={{ xs: 4, md: 6 }}>
            <Grid item xs={12} md={6}>
              <InfoCard
                title="Quick Support"
                description="We're here to provide fast, helpful assistance for your orders, product enquiries, and delivery needs whenever you need us."
                image="/img/contact/helpicon.webp"
                color={{ main: "var(--primary-teal-dark)" }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <InfoCard
                title="Reliable Service"
                description="From fresh preparation to on-time delivery, we are committed to offering dependable service and trusted quality every time."
                image="/img/contact/handsakeicon.webp"
                color={{ main: "var(--primary-teal-dark)" }}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
