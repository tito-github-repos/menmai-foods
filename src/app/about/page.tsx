"use client";

import { Box, Container, Typography, Grid, Divider } from "@mui/material";

export default function AboutPage() {
  return (
    <Box
      sx={{
        py: 8,
        background:
          "linear-gradient(135deg, var(--ivory) 0%, var(--cream) 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontSize: ".74rem",
              fontWeight: 500,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "var(--or)",
            }}
          >
            About Menmai Foods
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "var(--brown)",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.9rem, 3vw, 2.7rem)",
              lineHeight: 1.15,
              margin: "8px 0 12px",
            }}
          >
            Bringing Freshness to Every Home
          </Typography>
        </Box>

        <Box sx={{ mb: 5 }}>
          <Grid container spacing={5} sx={{ mb: 6, alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 260, md: 380 },
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow: "var(--shadow)",
                }}
              >
                <img
                  src="/about.png"
                  alt="Menmai Foods"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "var(--muted)",
                  lineHeight: 1.85,
                  fontSize: "0.94rem",
                  marginBottom: "14px",
                }}
              >
                <span style={{ fontWeight: 700, color: "var(--dbr)" }}>
                  Menmai Foods
                </span>
                , based in Madurai, specializes in Ready-to-Heat and Eat
                Chapathi and Poori, designed to bring convenience and freshness
                to your everyday meals.
                <br />
                Established with a commitment to quality, our products are
                prepared in a hygienic and well-maintained production
                environment, following high standards in manufacturing and
                packaging. We focus on delivering safe, reliable, and consistent
                food products that customers can trust.
                <br />
                At{" "}
                <span style={{ fontWeight: 700, color: "var(--dbr)" }}>
                  Menmai Foods
                </span>
                , we use carefully selected natural ingredients without the
                addition of artificial colors or flavors. Our products are made
                using traditional preparation techniques, ensuring authentic
                taste, softness, and freshness in every bite.
                <br />
                We strive to deliver our products fresh everyday to our
                customers through efficient distribution, catering to
                households, retail outlets, and food service providers across
                Madurai and nearby areas.
                <br />
                Currently,{" "}
                <span style={{ fontWeight: 700, color: "var(--dbr)" }}>
                  Menmai Foods
                </span>{" "}
                focuses on high-quality Semi-Cooked Chapathi and Poori, with
                plans to expand our range by introducing more fresh and
                convenient food products in the future.
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  p: 3,
                  borderRadius: "16px",
                  background: "var(--white)",
                  borderLeft: "4px solid var(--brown)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                  },
                }}
              >
                <Box
                  sx={{
                    minWidth: 50,
                    height: 50,
                    borderRadius: "12px",
                    background: "rgba(180, 80, 40, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--brown)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18h6" />
                    <path d="M10 22h4" />
                    <path d="M12 2a7 7 0 0 0-4 12c.5.5 1 1.5 1 2h6c0-.5.5-1.5 1-2a7 7 0 0 0-4-12z" />
                  </svg>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "var(--brown)", mb: 0.5 }}
                  >
                    Our Vision
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: "var(--muted)", lineHeight: 1.8 }}
                  >
                    To become a trusted household name in ready-to-cook foods
                    across Tamil Nadu and beyond.
                  </Typography>

                  <Box sx={{ flexGrow: 1 }} />

                  <Divider
                    sx={{
                      borderColor: "var(--brown)",
                      opacity: 0.5,
                      mt: 2,
                    }}
                  />

                  {/* Tagline */}
                  <Typography
                    sx={{
                      fontStyle: "italic",
                      fontSize: "1rem",
                      color: "var(--brown)",
                      fontFamily: "'Cormorant Garamond', serif",
                      mt: 2,
                    }}
                  >
                    "A name every Tamil home trusts"
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  p: 3,
                  borderRadius: "16px",
                  background: "var(--white)",
                  borderLeft: "4px solid var(--brown)",
                  boxShadow: "var(--shadow)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                  },
                }}
              >
                <Box
                  sx={{
                    minWidth: 50,
                    height: 50,
                    borderRadius: "12px",
                    background: "rgba(180, 80, 40, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    color: "var(--brown)",
                  }}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--brown)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "var(--brown)", mb: 0.5 }}
                  >
                    Our Mission
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: "var(--muted)", lineHeight: 1.8 }}
                  >
                    To provide fresh, hygienic, and time-saving food solutions
                    that fit seamlessly into everyday life.
                  </Typography>

                  <Box sx={{ flexGrow: 1 }} />

                  <Divider
                    sx={{
                      borderColor: "var(--brown)",
                      opacity: 0.5,
                      mt: 2,
                    }}
                  />

                  <Typography
                    sx={{
                      fontStyle: "italic",
                      fontSize: "1rem",
                      color: "var(--brown)",
                      fontFamily: "'Cormorant Garamond', serif",
                      mt: 2,
                    }}
                  >
                    "Fresh food, everyday convenience"
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
