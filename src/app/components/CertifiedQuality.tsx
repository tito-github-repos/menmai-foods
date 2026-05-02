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





// "use client";

// import { Box, Typography } from "@mui/material";

// /* ─────────────────────────────────────────
//    INLINE SVG ICONS
// ───────────────────────────────────────── */
// const ShieldIcon = () => (
//   <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#f5dfc0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//     <polyline points="9 12 11 14 15 10" />
//   </svg>
// );

// const StarIcon = () => (
//   <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#f5dfc0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//     <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//   </svg>
// );

// const HeartIcon = () => (
//   <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#f5dfc0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
//   </svg>
// );

// const PeopleIcon = () => (
//   <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#f5dfc0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
//     <circle cx="9" cy="7" r="4" />
//     <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
//     <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//   </svg>
// );

// const HeartOrnament = () => (
//   <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#b07050" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
//     <Box sx={{ width: "100%", background: "#fdf6ec", position: "relative", overflow: "hidden" }}>

//       {/* Wheat — bottom left */}
//       <Box
//         component="img"
//         src="/img/certificates/wheat.png"
//         alt=""
//         sx={{
//           position: "absolute",
//           left: 0,
//           bottom: 0,
//           width: { xs: 100, md: 200 },
//           pointerEvents: "none",
//           zIndex: 0,
//         }}
//       />

//       {/* Chapathi bowl — right, vertically centered */}
//       <Box
//         component="img"
//         src="/img/dec_img.png"
//         alt=""
//         sx={{
//           position: "absolute",
//           right: 0,
//           top: "42%",
//           transform: "translateY(-50%)",
//           width: { xs: 0, md: 190 },
//           pointerEvents: "none",
//           zIndex: 0,
//           display: { xs: "none", md: "block" },
//         }}
//       />

//       {/* ══ CREAM AREA ══ */}
//       <Box
//         sx={{
//           maxWidth: "780px",
//           mx: "auto",
//           position: "relative",
//           zIndex: 1,
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           pt: { xs: 3.5, md: 5 },
//           pb: { xs: 3, md: 4.5 },
//           px: { xs: 2, md: 4 },
//           gap: 3,
//         }}
//       >
//         {/* HEADING */}
//         <Box sx={{ textAlign: "center" }}>
//           {/* ornament */}
//           <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, mb: 1.5 }}>
//             <Box sx={{ height: "1px", width: 48, bgcolor: "rgba(90,56,37,0.25)" }} />
//             <HeartOrnament />
//             <Box sx={{ height: "1px", width: 48, bgcolor: "rgba(90,56,37,0.25)" }} />
//           </Box>

//           <Typography
//             sx={{
//               fontFamily: "var(--font-heading)",
//               fontSize: { xs: 22, md: 30 },
//               fontWeight: 800,
//               color: "var(--primary-maroon-dark)",
//               lineHeight: 1.15,
//               mb: 1,
//             }}
//           >
//             Certified Quality. Trusted by You.
//           </Typography>

//           <Typography
//             sx={{
//               fontFamily: "var(--font-main)",
//               fontSize: 13,
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
//             borderRadius: "18px",
//             overflow: "hidden",
//             boxShadow: "0 4px 20px rgba(61,26,14,0.07)",
//             width: { xs: "100%", sm: "500px" },
//           }}
//         >
//           {/* FSSAI */}
//           <Box
//             sx={{
//               flex: 1,
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               px: { xs: 2.5, md: 5 },
//               py: { xs: 2, md: 2.8 },
//               gap: 0.7,
//             }}
//           >
//             <Box
//               component="img"
//               src="/img/certificates/fssai.png"
//               alt="FSSAI"
//               sx={{ height: { xs: 34, md: 44 }, objectFit: "contain" }}
//             />
//             <Box
//               sx={{
//                 height: "1px", width: "70%", mt: 0.4,
//                 background: "repeating-linear-gradient(90deg, rgba(90,56,37,0.3) 0, rgba(90,56,37,0.3) 5px, transparent 5px, transparent 10px)",
//               }}
//             />
//             <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 10.5, fontWeight: 800, color: "var(--primary-maroon-dark)", letterSpacing: "0.07em", textTransform: "uppercase", mt: 0.2 }}>
//               FSSAI Certified
//             </Typography>
//             <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 10.5, color: "#b07050" }}>
//               Food Safety Approved
//             </Typography>
//           </Box>

//           {/* Vertical divider */}
//           <Box sx={{ width: "1px", my: 2.5, bgcolor: "rgba(90,56,37,0.15)", flexShrink: 0 }} />

//           {/* MSME */}
//           <Box
//             sx={{
//               flex: 1,
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               px: { xs: 2.5, md: 5 },
//               py: { xs: 2, md: 2.8 },
//               gap: 0.7,
//             }}
//           >
//             <Box
//               component="img"
//               src="/img/certificates/msme.png"
//               alt="MSME"
//               sx={{ height: { xs: 34, md: 44 }, objectFit: "contain" }}
//             />
//             <Box
//               sx={{
//                 height: "1px", width: "70%", mt: 0.4,
//                 background: "repeating-linear-gradient(90deg, rgba(90,56,37,0.3) 0, rgba(90,56,37,0.3) 5px, transparent 5px, transparent 10px)",
//               }}
//             />
//             <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 10.5, fontWeight: 800, color: "var(--primary-maroon-dark)", letterSpacing: "0.07em", textTransform: "uppercase", mt: 0.2 }}>
//               MSME Registered
//             </Typography>
//             <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 10.5, color: "#b07050" }}>
//               Govt. Recognized Business
//             </Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* ══ BADGE BAR — full bleed ══ */}
//       <Box
//         sx={{
//           width: "100%",
//           background: "var(--primary-teal-dark)",
//           position: "relative",
//           zIndex: 1,
//           py: { xs: 2, md: 2.5 },
//           px: { xs: 3, md: 8 },
//           display: "grid",
//           gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
//           gap: { xs: 2, md: 0 },
//         }}
//       >
//         {badgeBar.map((b, i) => (
//           <Box
//             key={i}
//             sx={{
//               display: "flex",
//               alignItems: "flex-start",
//               gap: 1.2,
//               px: { xs: 0.5, md: 3 },
//               borderRight: { md: i < 3 ? "1px solid rgba(245,223,192,0.15)" : "none" },
//             }}
//           >
//             <Box sx={{ flexShrink: 0, mt: "2px" }}>{b.icon}</Box>
//             <Box>
//               <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 12.5, fontWeight: 700, color: "#f5dfc0", lineHeight: 1.3, mb: 0.3 }}>
//                 {b.label}
//               </Typography>
//               <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 11, color: "rgba(245,223,192,0.65)", lineHeight: 1.4 }}>
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

/* ─── ICONS ─── */
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#f5dfc0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#f5dfc0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const HeartIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#f5dfc0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const PeopleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#f5dfc0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

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
    <Box sx={{ width: "100%", background: "#fff", position: "relative",  }}>

      {/* ── Wheat stalks — LEFT, shifted UP so top is visible ── */}
      <Box
        component="img"
        src="/img/certificates/wheat.png"
        alt=""
        sx={{
          position: "absolute",
          left: 0,
          bottom: "10%",       /* pushed up from bottom */
          width: { xs: 90, md: 180 },
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Chapathi bowl — RIGHT, vertically centered ── */}
      <Box
        component="img"
        src="/img/dec_img.png"
        alt=""
        sx={{
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: { md: 200 },
          pointerEvents: "none",
          zIndex: 0,
          display: { xs: "none", md: "block" },
        }}
      />

      {/* ══ MAIN CONTENT — LEFT text / RIGHT logos ══ */}
      <Box
        sx={{
          maxWidth: "1100px",
          mx: "auto",
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          alignItems: "center",
          gap: { xs: 3, md: 6 },
          pt: { xs: 2, md: 2 },
          pb: { xs: 2.5, md: 3.5 },
          px: { xs: 8, md: 11},
        }}
      >
        {/* ── LEFT — Text ── */}
        <Box>
            <Typography
              sx={{
                fontSize: 14,
                letterSpacing: 2,
                color: "#a67c52",
                mb: 1,
              }}
            >
              ♡ QUALITY ASSURANCE
            </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-heading)",
              fontSize: { xs: 20, md: 26 },
              fontWeight: 800,
              color: "var(--primary-teal-dark)",
              lineHeight: 1.2,
              mb: 1.2,
            }}
          >
            Certified Quality.<br />Trusted by You.
          </Typography>

          <Typography
            sx={{
              fontFamily: "var(--font-main)",
              fontSize: { xs: 12.5, md: 13 },
              color: "#9a6a50",
              lineHeight: 1.75,
            }}
          >
            We strictly follow FSSAI food safety guidelines to ensure hygienic
            preparation and safe consumption. As an{" "}
            <Box component="span" sx={{ fontWeight: 700, color: "var(--primary-teal-mid)" }}>
              MSME registered business
            </Box>
            , we operate under recognized government standards — delivering
            consistent quality, trust, and reliability in every order.
          </Typography>
        </Box>

        {/* ── RIGHT — Logos (no white card, transparent bg) ── */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "flex-start", md: "center" },
            gap: 0,
          }}
        >
          {/* FSSAI */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              px: { xs: 2, md: 4 },
              gap: 0.6,
            }}
          >
            <Box
              component="img"
              src="/img/certificates/fssai.png"
              alt="FSSAI"
              sx={{ height: { xs: 32, md: 42 }, objectFit: "contain" }}
            />
            {/* dashed line */}
            <Box
              sx={{
                height: "1px",
                width: "70%",
                mt: 0.3,
                background: "repeating-linear-gradient(90deg, rgba(90,56,37,0.35) 0, rgba(90,56,37,0.35) 4px, transparent 4px, transparent 8px)",
              }}
            />
            <Typography
              sx={{
                fontFamily: "var(--font-main)",
                fontSize: 9.5,
                fontWeight: 800,
                color: "var(--primary-maroon-dark)",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
              }}
            >
              FSSAI Certified
            </Typography>
            <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 9.5, color: "#b07050" }}>
              Food Safety Approved
            </Typography>
          </Box>

          {/* Divider */}
          <Box sx={{ width: "1px", height: 60, bgcolor: "rgba(90,56,37,0.2)", flexShrink: 0 }} />

          {/* MSME */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              px: { xs: 2, md: 4 },
              gap: 0.6,
            }}
          >
            <Box
              component="img"
              src="/img/certificates/msme.png"
              alt="MSME"
              sx={{ height: { xs: 32, md: 42 }, objectFit: "contain" }}
            />
            {/* dashed line */}
            <Box
              sx={{
                height: "1px",
                width: "70%",
                mt: 0.3,
                background: "repeating-linear-gradient(90deg, rgba(90,56,37,0.35) 0, rgba(90,56,37,0.35) 4px, transparent 4px, transparent 8px)",
              }}
            />
            <Typography
              sx={{
                fontFamily: "var(--font-main)",
                fontSize: 9.5,
                fontWeight: 800,
                color: "var(--primary-maroon-dark)",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
              }}
            >
              MSME Registered
            </Typography>
            <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 9.5, color: "#b07050" }}>
              Govt. Recognized Business
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ══ BADGE BAR — full bleed ══ */}
      {/* <Box
        sx={{
          width: "100%",
          background: "var(--primary-teal-dark)",
          position: "relative",
          zIndex: 1,
          py: { xs: 1.5, md: 2 },
          px: { xs: 3, md: 8 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
          gap: { xs: 1.5, md: 0 },
        }}
      >
        {badgeBar.map((b, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: { xs: 0.5, md: 2.5 },
              borderRight: { md: i < 3 ? "1px solid rgba(245,223,192,0.15)" : "none" },
            }}
          >
            <Box sx={{ flexShrink: 0 }}>{b.icon}</Box>
            <Box>
              <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 11.5, fontWeight: 700, color: "#f5dfc0", lineHeight: 1.3, mb: 0.2 }}>
                {b.label}
              </Typography>
              <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 10.5, color: "rgba(245,223,192,0.65)", lineHeight: 1.3 }}>
                {b.sub}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box> */}
    </Box>
  );
}