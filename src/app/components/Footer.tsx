// "use client";

// import { Box, Container, Typography, Grid, Link as MuiLink } from "@mui/material";
// import Link from "next/link";

// const BRAND = "#88391d";

// const FOOTER_LINKS = [
//   { label: "Home", href: "/" },
//   { label: "About", href: "/about" },
//   { label: "Contact", href: "/contact" },
// ];

// export default function Footer() {
//   return (
//     <Box
//       component="footer"
//       sx={{
//         backgroundColor: "#fff7f2",
//         borderTop: "1px solid rgba(136,57,29,0.15)",
//         mt: 8,
//         pt: 6,
//         pb: 3,
//       }}
//     >
//       <Container maxWidth="lg">
//         <Grid container spacing={4}>

//           {/* BRAND SECTION */}
//           <Grid item xs={12} md={4}>
//             <Typography
//               variant="h6"
//               sx={{ color: BRAND, fontWeight: 600, mb: 1 }}
//             >
//               Menmai Foods
//             </Typography>

//             <Typography variant="body2" sx={{ color: "#5a3a2d", lineHeight: 1.7 }}>
//               Homemade-style food products delivered fresh. Simple, healthy, and tasty.
//             </Typography>
//           </Grid>

//           {/* LINKS */}
//           <Grid item xs={12} md={4}>
//             <Typography
//               variant="subtitle1"
//               sx={{ fontWeight: 600, mb: 1, color: "#3a2015" }}
//             >
//               Quick Links
//             </Typography>

//             <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
//               {FOOTER_LINKS.map((link) => (
//                 <MuiLink
//                   key={link.href}
//                   component={Link}
//                   href={link.href}
//                   underline="none"
//                   sx={{
//                     color: "#5a3a2d",
//                     fontSize: 14,
//                     transition: "0.2s",
//                     "&:hover": {
//                       color: BRAND,
//                       transform: "translateX(4px)",
//                     },
//                   }}
//                 >
//                   {link.label}
//                 </MuiLink>
//               ))}
//             </Box>
//           </Grid>

//           {/* CONTACT */}
//           <Grid item xs={12} md={4}>
//             <Typography
//               variant="subtitle1"
//               sx={{ fontWeight: 600, mb: 1, color: "#3a2015" }}
//             >
//               Contact
//             </Typography>

//             <Typography variant="body2" sx={{ color: "#5a3a2d", mb: 1 }}>
//               📍 Tamil Nadu, India
//             </Typography>

//             <Typography variant="body2" sx={{ color: "#5a3a2d", mb: 1 }}>
//               📞 +91 98765 43210
//             </Typography>

//             <Typography variant="body2" sx={{ color: "#5a3a2d" }}>
//               ✉️ support@menmaifoods.com
//             </Typography>
//           </Grid>
//         </Grid>

//         {/* BOTTOM BAR */}
//         <Box
//           sx={{
//             mt: 5,
//             pt: 2,
//             borderTop: "1px solid rgba(136,57,29,0.15)",
//             textAlign: "center",
//           }}
//         >
//           <Typography variant="caption" sx={{ color: "#6a4a3a" }}>
//             © {new Date().getFullYear()} <span style={{ color: BRAND , fontWeight: 600 }}>Menmai</span>. All rights reserved.
//           </Typography>
//         </Box>
//       </Container>
//     </Box>
//   );
// }

"use client";

import {
  Box,
  Container,
  Typography,
  Grid,
  Link as MuiLink,
  IconButton,
  Stack,
} from "@mui/material";

import Image from "next/image";
import Link from "next/link";

import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

const BRAND = "#88391d";

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#fff7f2",
        borderTop: "1px solid rgba(136,57,29,0.15)",
        mt: 8,
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* BRAND SECTION */}
          <Grid item xs={12} md={4}>
            {/* LOGO */}
            <Box sx={{ mb: 1 }}>
              <Image
                src="/logo3.jpeg"
                alt="Menmai Foods"
                width={180}
                height={80}
                priority
                style={{
                  height: "65px",
                  width: "auto",
                  objectFit: "contain",
                  marginLeft: "-5px",
                }}
              />
            </Box>

            <Typography
              variant="body2"
              sx={{ color: "#5a3a2d", lineHeight: 1.7 }}
            >
              Homemade-style food products delivered fresh. Simple, healthy, and
              tasty.
            </Typography>

            {/* SOCIAL ICONS */}
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <IconButton
                sx={{
                  color: BRAND,
                  border: "1px solid rgba(136,57,29,0.2)",
                }}
              >
                <InstagramIcon fontSize="small" />
              </IconButton>

              <IconButton
                sx={{
                  color: BRAND,
                  border: "1px solid rgba(136,57,29,0.2)",
                }}
              >
                <WhatsAppIcon fontSize="small" />
              </IconButton>

              <IconButton
                sx={{
                  color: BRAND,
                  border: "1px solid rgba(136,57,29,0.2)",
                }}
              >
                <EmailOutlinedIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>

          {/* LINKS */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 1, color: "#3a2015" }}
            >
              Quick Links
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {FOOTER_LINKS.map((link) => (
                <MuiLink
                  key={link.href}
                  component={Link}
                  href={link.href}
                  underline="none"
                  sx={{
                    color: "#5a3a2d",
                    fontSize: 14,
                    transition: "0.2s",
                    "&:hover": {
                      color: BRAND,
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          {/* CONTACT */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 1, color: "#3a2015" }}
            >
              Contact
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOnIcon sx={{ fontSize: 18, color: BRAND }} />
                <Typography variant="body2" sx={{ color: "#5a3a2d" }}>
                  Tamil Nadu, India
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon sx={{ fontSize: 18, color: BRAND }} />
                <Typography variant="body2" sx={{ color: "#5a3a2d" }}>
                  +91 98765 43210
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon sx={{ fontSize: 18, color: BRAND }} />
                <Typography variant="body2" sx={{ color: "#5a3a2d" }}>
                  support@menmaifoods.com
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* BOTTOM BAR */}
        <Box
          sx={{
            mt: 5,
            pt: 2,
            borderTop: "1px solid rgba(136,57,29,0.15)",
            textAlign: "center",
          }}
        >
          <Typography variant="caption" sx={{ color: "#6a4a3a" }}>
            © {new Date().getFullYear()}{" "}
            <span style={{ color: BRAND, fontWeight: 600 }}>Menmai Foods</span>.
            All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
