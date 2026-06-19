// "use client";

// import { Box, Typography } from "@mui/material";

// /* ─────────────────────────────────────────
//    INLINE SVG ICONS
// ───────────────────────────────────────── */

// const ShieldIcon = () => (
//   <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#f5dfc0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//     <polyline points="9 12 11 14 15 10" />
//   </svg>
// );

// const StarIcon = () => (
//   <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#f5dfc0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//     <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//   </svg>
// );

// const HeartIcon = () => (
//   <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#f5dfc0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
//   </svg>
// );

// const PeopleIcon = () => (
//   <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#f5dfc0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
//     <circle cx="9" cy="7" r="4" />
//     <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
//     <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//   </svg>
// );

// const HeartOrnament = () => (
//   <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#b07050" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
//   </svg>
// );

// /* ─────────────────────────────────────────
//    BADGE DATA
// ───────────────────────────────────────── */
// const badgeBar = [
//   { icon: <ShieldIcon />, label: "Safe & Compliant",    sub: "We adhere to strict food safety norms" },
//   { icon: <StarIcon />,   label: "Trusted Standards",   sub: "Certified by leading government bodies" },
//   { icon: <HeartIcon />,  label: "Quality You Deserve", sub: "Pure ingredients and hygienic preparation" },
//   { icon: <PeopleIcon />, label: "Committed to You",    sub: "Your health & trust are our priority" },
// ];

// /* ═══════════════════════════════════════════
//    COMPONENT
// ═══════════════════════════════════════════ */
// export default function CertifiedQualitySection() {
//   return (
//     <Box
//       sx={{
//         width: "100%",
//         background: "#fdf6ec",
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >
//       {/* ── Wheat stalks — bottom LEFT ── */}
//       <Box
//         component="img"
//         src="/img/certificates/wheat.png"
//         alt=""
//         sx={{
//           position: "absolute",
//           left: 0,
//           bottom: 0,
//           width: { xs: 150, md: 320 },
//           pointerEvents: "none",
//           zIndex: 0,
//         }}
//       />

//       {/* ── Chapathi bowl — RIGHT, vertically centered in cream area ── */}
//       <Box
//         component="img"
//         src="/img/dec_img.png"
//         alt=""
//         sx={{
//           position: "absolute",
//           right: 0,
//           top: "40%",
//           transform: "translateY(-50%)",
//           width: { xs: 0, md: 260 },
//           pointerEvents: "none",
//           zIndex: 0,
//           display: { xs: "none", md: "block" },
//         }}
//       />

//       {/* ══ CREAM TOP AREA — heading + logo card ══ */}
//       <Box
//         sx={{
//           maxWidth: "900px",
//           mx: "auto",
//           position: "relative",
//           zIndex: 1,
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           pt: { xs: 5, md: 7 },
//           pb: { xs: 4, md: 6 },
//           px: { xs: 2, md: 4 },
//           gap: 4,
//         }}
//       >
//         {/* HEADING */}
//         <Box sx={{ textAlign: "center" }}>
//           {/* line — ♡ — line */}
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: 1.5,
//               mb: 2,
//             }}
//           >
//             <Box sx={{ height: "1px", width: 60, bgcolor: "rgba(90,56,37,0.25)" }} />
//             <HeartOrnament />
//             <Box sx={{ height: "1px", width: 60, bgcolor: "rgba(90,56,37,0.25)" }} />
//           </Box>

//           <Typography
//             sx={{
//               fontFamily: "var(--font-heading)",
//               fontSize: { xs: 28, md: 40 },
//               fontWeight: 800,
//               color: "var(--primary-maroon-dark)",
//               lineHeight: 1.15,
//               mb: 1.5,
//             }}
//           >
//             Certified Quality. Trusted by You.
//           </Typography>

//           <Typography
//             sx={{
//               fontFamily: "var(--font-main)",
//               fontSize: 15,
//               color: "#9a6a50",
//               lineHeight: 1.7,
//             }}
//           >
//             We follow strict food safety and government standards
//             <br />
//             to ensure the best for you and your family.
//           </Typography>
//         </Box>

//         {/* LOGO PILL CARD */}
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "stretch",
//             background: "#fff",
//             border: "1px solid rgba(90,56,37,0.12)",
//             borderRadius: "22px",
//             overflow: "hidden",
//             boxShadow: "0 4px 24px rgba(61,26,14,0.07)",
//             width: { xs: "100%", sm: "580px" },
//           }}
//         >
//           {/* FSSAI */}
//           <Box
//             sx={{
//               flex: 1,
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               px: { xs: 3, md: 7 },
//               py: { xs: 3, md: 4 },
//               gap: 1,
//             }}
//           >
//             <Box
//               component="img"
//               src="/img/certificates/fssai.png"
//               alt="FSSAI"
//               sx={{ height: { xs: 44, md: 58 }, objectFit: "contain" }}
//             />
//             <Box
//               sx={{
//                 height: "1px",
//                 width: "70%",
//                 mt: 0.5,
//                 background:
//                   "repeating-linear-gradient(90deg, rgba(90,56,37,0.3) 0, rgba(90,56,37,0.3) 5px, transparent 5px, transparent 10px)",
//               }}
//             />
//             <Typography
//               sx={{
//                 fontFamily: "var(--font-main)",
//                 fontSize: 11,
//                 fontWeight: 800,
//                 color: "var(--primary-maroon-dark)",
//                 letterSpacing: "0.08em",
//                 textTransform: "uppercase",
//                 mt: 0.3,
//               }}
//             >
//               FSSAI Certified
//             </Typography>
//             <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 11.5, color: "#b07050" }}>
//               Food Safety Approved
//             </Typography>
//           </Box>

//           {/* Vertical divider */}
//           <Box sx={{ width: "1px", my: 3, bgcolor: "rgba(90,56,37,0.15)", flexShrink: 0 }} />

//           {/* MSME */}
//           <Box
//             sx={{
//               flex: 1,
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               px: { xs: 3, md: 7 },
//               py: { xs: 3, md: 4 },
//               gap: 1,
//             }}
//           >
//             <Box
//               component="img"
//               src="/img/certificates/msme.png"
//               alt="MSME"
//               sx={{ height: { xs: 44, md: 58 }, objectFit: "contain" }}
//             />
//             <Box
//               sx={{
//                 height: "1px",
//                 width: "70%",
//                 mt: 0.5,
//                 background:
//                   "repeating-linear-gradient(90deg, rgba(90,56,37,0.3) 0, rgba(90,56,37,0.3) 5px, transparent 5px, transparent 10px)",
//               }}
//             />
//             <Typography
//               sx={{
//                 fontFamily: "var(--font-main)",
//                 fontSize: 11,
//                 fontWeight: 800,
//                 color: "var(--primary-maroon-dark)",
//                 letterSpacing: "0.08em",
//                 textTransform: "uppercase",
//                 mt: 0.3,
//               }}
//             >
//               MSME Registered
//             </Typography>
//             <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 11.5, color: "#b07050" }}>
//               Govt. Recognized Business
//             </Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* ══ BADGE BAR — full bleed, outside the centered container ══ */}
//       <Box
//         sx={{
//           width: "100%",
//           background: "var(--primary-teal-dark)",
//           position: "relative",
//           zIndex: 1,
//           py: { xs: 2.5, md: 3 },
//           px: { xs: 3, md: 8 },
//           display: "grid",
//           gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
//           gap: { xs: 2.5, md: 0 },
//         }}
//       >
//         {badgeBar.map((b, i) => (
//           <Box
//             key={i}
//             sx={{
//               display: "flex",
//               alignItems: "flex-start",
//               gap: 1.5,
//               px: { xs: 0.5, md: 4 },
//               borderRight: {
//                 md: i < 3 ? "1px solid rgba(245,223,192,0.15)" : "none",
//               },
//             }}
//           >
//             <Box sx={{ flexShrink: 0, mt: "2px" }}>{b.icon}</Box>
//             <Box>
//               <Typography
//                 sx={{
//                   fontFamily: "var(--font-main)",
//                   fontSize: 13.5,
//                   fontWeight: 700,
//                   color: "#f5dfc0",
//                   lineHeight: 1.3,
//                   mb: 0.4,
//                 }}
//               >
//                 {b.label}
//               </Typography>
//               <Typography
//                 sx={{
//                   fontFamily: "var(--font-main)",
//                   fontSize: 12,
//                   color: "rgba(245,223,192,0.65)",
//                   lineHeight: 1.5,
//                 }}
//               >
//                 {b.sub}
//               </Typography>
//             </Box>
//           </Box>
//         ))}
//       </Box>
//     </Box>
//   );
// }





"use client";

import { Box, Typography } from "@mui/material";

/* ─────────────────────────────────────────
   INLINE SVG ICONS
───────────────────────────────────────── */
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#f5dfc0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#f5dfc0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#f5dfc0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const PeopleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#f5dfc0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const HeartOrnament = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#b07050" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

/* ─────────────────────────────────────────
   BADGE DATA
───────────────────────────────────────── */
const badgeBar = [
  { icon: <ShieldIcon />, label: "Safe & Compliant",    sub: "We adhere to strict food safety norms" },
  { icon: <StarIcon />,   label: "Trusted Standards",   sub: "Certified by leading government bodies" },
  { icon: <HeartIcon />,  label: "Quality You Deserve", sub: "Pure ingredients and hygienic preparation" },
  { icon: <PeopleIcon />, label: "Committed to You",    sub: "Your health & trust are our priority" },
];

/* ═══════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════ */
export default function CertifiedQualitySection() {
  return (
    <Box sx={{ width: "100%", background: "#fdf6ec", position: "relative", overflow: "hidden" }}>

      {/* Wheat — bottom left */}
      <Box
        component="img"
        src="/img/certificates/wheat.webp"
        alt=""
        sx={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: { xs: 100, md: 200 },
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Chapathi bowl — right, vertically centered */}
      <Box
        component="img"
        src="/img/dec_img.webp"
        alt=""
        sx={{
          position: "absolute",
          right: 0,
          top: "42%",
          transform: "translateY(-50%)",
          width: { xs: 0, md: 190 },
          pointerEvents: "none",
          zIndex: 0,
          display: { xs: "none", md: "block" },
        }}
      />

      {/* ══ CREAM AREA ══ */}
      <Box
        sx={{
          maxWidth: "780px",
          mx: "auto",
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 3.5, md: 5 },
          pb: { xs: 3, md: 4.5 },
          px: { xs: 2, md: 4 },
          gap: 3,
        }}
      >
        {/* HEADING */}
        <Box sx={{ textAlign: "center" }}>
          {/* ornament */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, mb: 1.5 }}>
            <Box sx={{ height: "1px", width: 48, bgcolor: "rgba(90,56,37,0.25)" }} />
            <HeartOrnament />
            <Box sx={{ height: "1px", width: 48, bgcolor: "rgba(90,56,37,0.25)" }} />
          </Box>

          <Typography
            sx={{
              fontFamily: "var(--font-heading)",
              fontSize: { xs: 22, md: 30 },
              fontWeight: 800,
              color: "var(--primary-maroon-dark)",
              lineHeight: 1.15,
              mb: 1,
            }}
          >
            Certified Quality. Trusted by You.
          </Typography>

          <Typography
            sx={{
              fontFamily: "var(--font-main)",
              fontSize: 13,
              color: "#9a6a50",
              lineHeight: 1.7,
            }}
          >
            We follow strict food safety and government standards
            <br />
            to ensure the best for you and your family.
          </Typography>
        </Box>

        {/* LOGO PILL CARD */}
        <Box
          sx={{
            display: "flex",
            alignItems: "stretch",
            background: "#fff",
            border: "1px solid rgba(90,56,37,0.12)",
            borderRadius: "18px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(61,26,14,0.07)",
            width: { xs: "100%", sm: "500px" },
          }}
        >
          {/* FSSAI */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              px: { xs: 2.5, md: 5 },
              py: { xs: 2, md: 2.8 },
              gap: 0.7,
            }}
          >
            <Box
              component="img"
              src="/img/certificates/fssai.webp"
              alt="FSSAI"
              sx={{ height: { xs: 34, md: 44 }, objectFit: "contain" }}
            />
            <Box
              sx={{
                height: "1px", width: "70%", mt: 0.4,
                background: "repeating-linear-gradient(90deg, rgba(90,56,37,0.3) 0, rgba(90,56,37,0.3) 5px, transparent 5px, transparent 10px)",
              }}
            />
            <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 10.5, fontWeight: 800, color: "var(--primary-maroon-dark)", letterSpacing: "0.07em", textTransform: "uppercase", mt: 0.2 }}>
              FSSAI Certified
            </Typography>
            <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 10.5, color: "#b07050" }}>
              Food Safety Approved
            </Typography>
          </Box>

          {/* Vertical divider */}
          <Box sx={{ width: "1px", my: 2.5, bgcolor: "rgba(90,56,37,0.15)", flexShrink: 0 }} />

          {/* MSME */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              px: { xs: 2.5, md: 5 },
              py: { xs: 2, md: 2.8 },
              gap: 0.7,
            }}
          >
            <Box
              component="img"
              src="/img/certificates/msme.webp"
              alt="MSME"
              sx={{ height: { xs: 34, md: 44 }, objectFit: "contain" }}
            />
            <Box
              sx={{
                height: "1px", width: "70%", mt: 0.4,
                background: "repeating-linear-gradient(90deg, rgba(90,56,37,0.3) 0, rgba(90,56,37,0.3) 5px, transparent 5px, transparent 10px)",
              }}
            />
            <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 10.5, fontWeight: 800, color: "var(--primary-maroon-dark)", letterSpacing: "0.07em", textTransform: "uppercase", mt: 0.2 }}>
              MSME Registered
            </Typography>
            <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 10.5, color: "#b07050" }}>
              Govt. Recognized Business
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ══ BADGE BAR — full bleed ══ */}
      <Box
        sx={{
          width: "100%",
          background: "var(--primary-teal-dark)",
          position: "relative",
          zIndex: 1,
          py: { xs: 2, md: 2.5 },
          px: { xs: 3, md: 8 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
          gap: { xs: 2, md: 0 },
        }}
      >
        {badgeBar.map((b, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.2,
              px: { xs: 0.5, md: 3 },
              borderRight: { md: i < 3 ? "1px solid rgba(245,223,192,0.15)" : "none" },
            }}
          >
            <Box sx={{ flexShrink: 0, mt: "2px" }}>{b.icon}</Box>
            <Box>
              <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 12.5, fontWeight: 700, color: "#f5dfc0", lineHeight: 1.3, mb: 0.3 }}>
                {b.label}
              </Typography>
              <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 11, color: "rgba(245,223,192,0.65)", lineHeight: 1.4 }}>
                {b.sub}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}


// "use client";

// import {
//   Box,
//   Grid,
//   Typography,
//   TextField,
//   MenuItem,
//   Button,
// } from "@mui/material";
// import { motion } from "framer-motion";
// import WhatsAppIcon from "@mui/icons-material/WhatsApp";

// export default function BulkOrderSection() {
//   return (
//     <Box
//       sx={{
//         mt: 10,
//         px: { xs: 2, md: 6 },
//         py: 6,
//         borderRadius: 1,
//         background:
//           "radial-gradient(ellipse 70% 60% at 90% 50%,rgba(232,114,12,.08) 0%,transparent 70%), linear-gradient(160deg,#FFF8ED,#fff3ec)",
//       }}
//     >
//       <Grid container spacing={12} alignItems="center">

//         {/* LEFT SIDE */}
//         <Grid item xs={12} md={6}>
//         <motion.div
//             initial={{ opacity: 0, x: -40 }}
//             whileInView={{ opacity: 1, x: 0 }}
//         >

//             {/* TAG */}
//             <Typography
//             sx={{
//                 fontSize: 12,
//                 letterSpacing: 2,
//                 fontWeight: 700,
//                 color: "#a45a2a",
//             }}
//             >
//             BULK & CATERING
//             </Typography>

//             {/* TITLE */}
//             <Typography
//             variant="h3"
//             sx={{
//                 fontFamily: "'Playfair Display', serif",
//                 fontWeight: 800,
//                 color: "#3b1f13",
//                 mt: 1,
//             }}
//             >
//             Planning an Event?
//             </Typography>

//             {/* SUBTEXT */}
//             <Typography
//             sx={{
//                 mt: 2,
//                 color: "#6d4c41",
//                 maxWidth: 500,
//                 lineHeight: 1.7,
//             }}
//             >
//             From office lunches to weddings — we deliver fresh, homemade food in large quantities,
//             hot, hygienic, and always on time.
//             </Typography>

//             {/* BENEFITS */}
//             <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2.5 }}>
//             {[
//                 {
//                 icon: "💰",
//                 title: "Bulk Savings",
//                 desc: "Save up to 20% on large orders with automatic discounts.",
//                 },
//                 {
//                 icon: "⏱️",
//                 title: "On-Time Delivery",
//                 desc: "Scheduled delivery so your food arrives exactly when needed.",
//                 },
//                 {
//                 icon: "📦",
//                 title: "Hygienic Packaging",
//                 desc: "Packed in clean, food-safe containers to maintain freshness.",
//                 },
//             ].map((item, i) => (
//                 <motion.div
//                 key={i}
//                 initial={{ opacity: 0, x: -20 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 transition={{ delay: i * 0.2 }}
//                 >
//                 <Box
//                     sx={{
//                     display: "flex",
//                     gap: 2,
//                     p: 2.2,
//                     borderRadius: 3,
//                     bgcolor:"#fff",
//                     // background:
//                     //     "linear-gradient(145deg, #fff8f2, #fff3ec)",
//                     border: "1px solid rgba(136,57,29,0.08)",
//                     boxShadow: "0 8px 20px rgba(136,57,29,0.08)",
//                     transition: "all 0.3s ease",

//                     "&:hover": {
//                         transform: "translateX(6px)",
//                         boxShadow: "0 14px 30px rgba(136,57,29,0.18)",
//                     },
//                     }}
//                 >
//                     {/* ICON BOX */}
//                     <Box
//                     sx={{
//                         width: 44,
//                         height: 44,
//                         borderRadius: 2,
//                         background:
//                         "linear-gradient(135deg, rgba(242,140,40,0.15), rgba(200,155,109,0.25))",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         fontSize: 18,
//                     }}
//                     >
//                     {item.icon}
//                     </Box>

//                     {/* TEXT */}
//                     <Box>
//                     <Typography
//                         sx={{
//                         fontWeight: 700,
//                         color: "#3b1f13",
//                         mb: 0.3,
//                         }}
//                     >
//                         {item.title}
//                     </Typography>

//                     <Typography
//                         sx={{
//                         fontSize: 13,
//                         color: "#7a5c4f",
//                         lineHeight: 1.6,
//                         }}
//                     >
//                         {item.desc}
//                     </Typography>
//                     </Box>
//                 </Box>
//                 </motion.div>
//             ))}
//             </Box>

//         </motion.div>
//         </Grid>

//         <Grid item xs={12} md={6}>
//         <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//         >
//             <Box
//             sx={{
//                 bgcolor: "#fff7f2",
//                 p: { xs: 3, md: 4 },
//                 borderRadius: 5,
//                 boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
//             }}
//             >
//             <Typography sx={{ fontSize: 22, fontWeight: 700, mb: 1 }}>
//                 Get a Quick Quote
//             </Typography>

//             <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 3 }}>
//                 Tell us your requirement — we’ll respond within 2 hours.
//             </Typography>

//             <Grid container spacing={2.2}>

//                 {/* NAME */}
//                 <Grid item xs={6}>
//                 <TextField
//                     fullWidth
//                     size="small"
//                     label="Your Name"
//                     placeholder="e.g. Rajan Kumar"
//                     InputProps={{
//                     sx: {
//                         borderRadius: "12px",
//                         bgcolor: "#fff7f2",
//                         "& fieldset": { border: "1.5px solid rgba(136,57,29,0.15)" },
//                         "&:hover fieldset": { borderColor: "#88391d" },
//                         "&.Mui-focused fieldset": {
//                         borderColor: "#f28c28",
//                         boxShadow: "0 0 0 2px rgba(242,140,40,0.15)",
//                         },
//                     },
//                     }}
//                 />
//                 </Grid>

//                 {/* PHONE */}
//                 <Grid item xs={6}>
//                 <TextField
//                     fullWidth
//                     size="small"
//                     label="Phone Number"
//                     placeholder="+91 98765 43210"
//                     InputProps={{
//                     sx: {
//                         borderRadius: "12px",
//                         bgcolor: "#fff7f2",
//                         "& fieldset": { border: "1.5px solid rgba(136,57,29,0.15)" },
//                         "&:hover fieldset": { borderColor: "#88391d" },
//                         "&.Mui-focused fieldset": {
//                         borderColor: "#f28c28",
//                         boxShadow: "0 0 0 2px rgba(242,140,40,0.15)",
//                         },
//                     },
//                     }}
//                 />
//                 </Grid>

//                 {/* PRODUCT */}
//                 <Grid item xs={12}>
//                 <TextField
//                     select
//                     fullWidth
//                     size="small"
//                     label="Product Required"
//                     InputProps={{
//                     sx: {
//                         borderRadius: "12px",
//                         bgcolor: "#fff7f2",
//                     },
//                     }}
//                 >
//                     <MenuItem>Wheat Chapathi</MenuItem>
//                     <MenuItem>Golden Poori</MenuItem>
//                     <MenuItem>Both – Chapathi & Poori</MenuItem>
//                 </TextField>
//                 </Grid>

//                 {/* QUANTITY */}
//                 <Grid item xs={6}>
//                 <TextField
//                     fullWidth
//                     size="small"
//                     type="number"
//                     label="Quantity"
//                     placeholder="e.g. 100"
//                     InputProps={{
//                     sx: {
//                         borderRadius: "12px",
//                         bgcolor: "#fff7f2",
//                     },
//                     }}
//                 />
//                 </Grid>

//                 {/* DATE */}
//                 <Grid item xs={6}>
//                 <TextField
//                     fullWidth
//                     size="small"
//                     type="date"
//                     label="Delivery Date"
//                     InputLabelProps={{ shrink: true }}
//                     InputProps={{
//                     sx: {
//                         borderRadius: "12px",
//                         bgcolor: "#fff7f2",
//                     },
//                     }}
//                 />
//                 </Grid>

//                 {/* NOTES */}
//                 <Grid item xs={12}>
//                 <TextField
//                     fullWidth
//                     multiline
//                     rows={3}
//                     size="small"
//                     label="Occasion / Notes"
//                     placeholder="e.g. Office lunch for 50 people..."
//                     InputProps={{
//                     sx: {
//                         borderRadius: "14px",
//                         bgcolor: "#fff7f2",
//                     },
//                     }}
//                 />
//                 </Grid>

//                 {/* SUBMIT */}
//                 <Grid item xs={12}>
//                 <Button
//                     fullWidth
//                     sx={{
//                     py: 1.5,
//                     borderRadius: "999px",
//                     fontWeight: 700,
//                     color: "#fff",
//                     background: "linear-gradient(135deg,#f28c28,#ffb36b)",
//                     boxShadow: "0 8px 25px rgba(242,140,40,0.35)",
//                     transition: "0.25s",
//                     "&:hover": {
//                         transform: "translateY(-2px)",
//                         boxShadow: "0 12px 30px rgba(242,140,40,0.45)",
//                     },
//                     }}
//                 >
//                     📩 Send Bulk Request
//                 </Button>
//                 </Grid>

//                 {/* WHATSAPP */}
//                 <Grid item xs={12}>
//                 <Button
//                     fullWidth
//                     startIcon={<WhatsAppIcon />}
//                     href="https://wa.me/91XXXXXXXXXX"
//                     sx={{
//                     py: 1.3,
//                     borderRadius: "999px",
//                     fontWeight: 600,
//                     background: "rgba(37,211,102,0.1)",
//                     color: "#25d366",
//                     border: "1.5px solid rgba(37,211,102,0.4)",
//                     transition: "0.25s",
//                     "&:hover": {
//                         bgcolor: "#25d366",
//                         color: "#fff",
//                         boxShadow: "0 10px 25px rgba(37,211,102,0.4)",
//                     },
//                     }}
//                 >
//                     Chat on WhatsApp
//                 </Button>
//                 </Grid>

//             </Grid>
//             </Box>
//         </motion.div>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }