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
        <Box sx={{ mb: 5 }}>
          <Grid container spacing={5} sx={{ mb: 6, alignItems: "center" }}>
            <Grid item xs={12} md={6}>
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

            <Grid item xs={12} md={6}>
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

          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "var(--brown)",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
                mb: 4,
              }}
            >
              Our Mission &amp; Vision
            </Typography>

            <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    background: "#fff",
                    borderRadius: "16px",
                    p: { xs: 3, md: 4 },
                    boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2.5,
                    textAlign: "left",
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      right: -20,
                      bottom: -20,
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      background: "rgba(224,122,47,0.06)",
                    },
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "rgba(224,122,47,0.10)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
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

                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.05rem",
                        color: "var(--brown)",
                        mb: 0.5,
                      }}
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

              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    background: "var(--white)",
                    borderRadius: "16px",
                    p: { xs: 3, md: 4 },
                    boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2.5,
                    textAlign: "left",
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      right: -20,
                      bottom: -20,
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      background: "rgba(58,107,53,0.06)",
                    },
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "rgba(58,107,53,0.10)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--green)"
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
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.05rem",
                        color: "var(--green)",
                        mb: 0.5,
                      }}
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
        </Box>
      </Container>
    </Box>
  );
}
