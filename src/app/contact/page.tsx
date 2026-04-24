"use client";

import { Box, Container, Grid, Typography } from "@mui/material";
import "./contact.css";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

export default function ContactPage() {
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
            Get in Touch
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
            We'd Love to Hear From You
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "var(--muted)",
              fontSize: ".95rem",
              lineHeight: 1.8,
            }}
          >
            For enquiries about orders or delivery, feel free to contact us
            anytime.
          </Typography>
        </Box>

        <Grid container spacing={4}>
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
                      sx={{ color: "var(--brown)", fontWeight: 600, mb: 0.5 }}
                    >
                      Our Location
                    </Typography>

                    <Typography variant="body2" sx={{ color: "var(--muted)" }}>
                      4/417, Vadivel Nagar, Nagamalai Pudukottai, Madurai, Tamil
                      Nadu - 625019
                    </Typography>
                  </Box>
                </div>
              </div>

              <a className="method-card" href="tel:+919894777825">
                <Box className="contact_icon">
                  <LocalPhoneOutlinedIcon />
                </Box>

                <div className="mc-body">
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ color: "var(--brown)", fontWeight: 600, mb: 0.5 }}
                    >
                      Phone
                    </Typography>

                    <Typography variant="body2" sx={{ color: "var(--muted)" }}>
                      +91 9894777825
                    </Typography>
                  </Box>
                </div>

                <span className="mc-arrow">→</span>
              </a>

              <a className="method-card" href="mailto:menmaifoodsmdu@gmail.com">
                <Box className="contact_icon">
                  <EmailOutlinedIcon />
                </Box>

                <div className="mc-body">
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ color: "var(--brown)", fontWeight: 600, mb: 0.5 }}
                    >
                      Email
                    </Typography>

                    <Typography variant="body2" sx={{ color: "var(--muted)" }}>
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
                      sx={{ color: "var(--brown)", fontWeight: 600, mb: 0.5 }}
                    >
                      Order Timings
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ color: "var(--muted)", lineHeight: 1.6 }}
                    >
                      Morning: 6:00 AM – 10:00 AM <br />
                      Evening: 5:00 PM – 9:00 PM
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
                height: { xs: 300, md: 465 },
                borderRadius: "18px",
                overflow: "hidden",
                boxShadow: "var(--shadow)",
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
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
