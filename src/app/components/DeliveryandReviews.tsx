"use client";

import { Box, Typography, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────
   TESTIMONIALS DATA
───────────────────────────────────────── */
const reviews = [
  {
    name: "Ramesh K.",
    location: "Madurai, 625017",
    quote: "Very soft and fresh chapathis. Tastes just like home made. Delivery was on time!",
    initials: "RK",
    color: "#e8f4f0",
    textColor: "#1a6b52",
  },
  {
    name: "Meena S.",
    location: "Madurai, 625020",
    quote: "Poori is fluffy and perfect. Quality and service is excellent!",
    initials: "MS",
    color: "#f0e8f4",
    textColor: "#6b1a6b",
  },
  {
    name: "Vignesh P.",
    location: "Madurai, 625018",
    quote: "Great packaging and hygienic. Very convenient for busy mornings.",
    initials: "VP",
    color: "#f4ede8",
    textColor: "#6b3a1a",
  },
  {
    name: "Kavitha R.",
    location: "Madurai, 625019",
    quote: "Love the taste and freshness. Highly recommended for families!",
    initials: "KR",
    color: "#e8f0f4",
    textColor: "#1a4a6b",
  },
];

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <Box sx={{ display: "flex", gap: 0.3 }}>
      {[...Array(count)].map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f5a623" stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </Box>
  );
}

/* ═══════════════════════════════════════════
   DELIVERY SECTION
═══════════════════════════════════════════ */
export function DeliverySection() {
  const [pincode, setPincode] = useState("");
  const [checked, setChecked] = useState(false);
  const [available, setAvailable] = useState(false);

  const handleCheck = async () => {
    if (!pincode || pincode.length < 6) return;
    const res = await fetch("/api/check-pincode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pincode }),
    });
    const data = await res.json();
    setAvailable(data.serviceable);
    setChecked(true);
  };

  return (
    <Box
    sx={{
      width: "100%",
      py: { xs: 4, md: 6 },
      px: { xs: 2, md: 4 },
      background: "#fdf6ec",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <Box
  sx={{
    maxWidth: "1100px",
    mx: "auto",
    position: "relative",
    zIndex: 1,
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "1.2fr 1.5fr 1fr" },
    gap: { xs: 3, md: 4 },
    alignItems: "center",
    
  }}
>
  {/* ── LEFT: TEXT ── */}
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.8 }}>
      <Box sx={{ width: 34, height: 34, borderRadius: "50%", bgcolor: "rgba(122,46,20,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#7a2e14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-3" />
          <circle cx="7.5" cy="17.5" r="2.5" />
          <circle cx="17.5" cy="17.5" r="2.5" />
        </svg>
      </Box>
      <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7a2e14", fontFamily: "var(--font-main)" }}>
        Fast, Safe &amp; Reliable
      </Typography>
    </Box>

    <Typography sx={{ fontFamily: "var(--font-heading)", fontSize: { xs: 22, md: 28 }, fontWeight: 800, color: "var(--primary-maroon-dark)", lineHeight: 1.2 }}>
      Delivered Fresh<br />at Your Doorstep
    </Typography>

    <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 14, color: "#7a5c45", lineHeight: 1.8 }}>
      We deliver fresh chapathi and poori within{" "}
      <Box component="span" sx={{ fontWeight: 700, color: "var(--primary-maroon-mid)" }}>
        10 km radius
      </Box>{" "}
      of Madurai.
    </Typography>
  </Box>

  {/* ── MIDDLE: FORM ── */}
  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.8, px: { md: 3 } }}>
    <Typography sx={{ fontFamily: "var(--font-main)", fontWeight: 700, fontSize: 13.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--primary-maroon-dark)" }}>
      Check Delivery Availability
    </Typography>

    <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 13.5, color: "#7a5c45", lineHeight: 1.6 }}>
      Enter your pincode to check if we deliver in your area (within 10 km of Madurai).
    </Typography>

    <Box sx={{ display: "flex", alignItems: "center", border: "1.5px solid rgba(90,40,20,0.18)", borderRadius: "12px", overflow: "hidden", background: "#fafaf8" }}>
      <Box sx={{ pl: 1.5, display: "flex", alignItems: "center", color: "#9a6a50" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
        </svg>
      </Box>
      <input
        style={{ flex: 1, border: "none", outline: "none", padding: "11px 12px", fontSize: 14, fontFamily: "var(--font-main)", color: "#3d1a0e", background: "transparent", width: "100%" }}
        placeholder="Enter your pincode"
        value={pincode}
        maxLength={6}
        onChange={(e) => { setPincode(e.target.value.replace(/\D/g, "")); setChecked(false); }}
        onKeyDown={(e) => e.key === "Enter" && handleCheck()}
      />
    </Box>

    <Button
      onClick={handleCheck}
      variant="contained"
      fullWidth
      sx={{ borderRadius: "10px", py: 1.3, bgcolor: "var(--primary-maroon-dark)", color: "#fdf6ec", fontFamily: "var(--font-main)", fontWeight: 700, fontSize: 14, textTransform: "none", boxShadow: "none", "&:hover": { bgcolor: "#2c1009", boxShadow: "none" } }}
    >
      Check Availability
    </Button>

    {checked && (
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, p: "10px 14px", borderRadius: "10px", bgcolor: available ? "rgba(15,110,86,0.08)" : "rgba(180,30,30,0.07)", border: `1px solid ${available ? "rgba(15,110,86,0.2)" : "rgba(180,30,30,0.15)"}` }}>
        <Box sx={{ flexShrink: 0, mt: 0.1 }}>
          {available ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f6e56" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b41e1e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          )}
        </Box>
        <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 13, color: available ? "#0f6e56" : "#b41e1e", lineHeight: 1.5, fontWeight: 600 }}>
          {available
            ? "We deliver to your area! Timely and hygienic delivery right at your doorstep."
            : "Sorry, we don't deliver to this pincode yet. We currently serve within 10 km of Madurai."}
        </Typography>
      </Box>
    )}

    {!checked && (
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
        <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: "rgba(122,46,20,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, mt: 0.1 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7a2e14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
          </svg>
        </Box>
        <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 13, color: "#7a5c45", lineHeight: 1.5 }}>
          We ensure timely and hygienic delivery of ready-to-heat chapathi and poori right at your doorstep.
        </Typography>
      </Box>
    )}
  </Box>

  {/* ── RIGHT: IMAGE ── */}
  <Box
    component="img"
    src="/img/bg_delivery.webp"
    alt="Madurai 10km delivery map"
    sx={{
      width: "100%",
      maxHeight: "260px",
      objectFit: "contain",
      borderRadius: "10px",
      display: "block",
    }}
  />
</Box>
</Box>
  );
}

/* ═══════════════════════════════════════════
   CUSTOMER REVIEWS SECTION
═══════════════════════════════════════════ */
export function CustomerReviewsSection() {
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const t = setInterval(() => {
      setActive((prev) => (prev + 1) % reviews.length);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  const prev = () => setActive((p) => (p - 1 + reviews.length) % reviews.length);
  const next = () => setActive((p) => (p + 1) % reviews.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <Box sx={{ width: "100%", py: { xs: 4, md: 7 }, px: { xs: 1, md: 4 }, background: "#fff" }}>

      {/* ── Section heading ── */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: { xs: 1, md: 2 }, mb: 4, px: { xs: 1, md: 0 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, flexShrink: 0 }}>
          <Box sx={{ width: { xs: 20, md: 60 }, height: "1.5px", bgcolor: "rgba(90,56,37,0.2)", borderRadius: 1 }} />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#c25a30" stroke="none">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </Box>
        <Typography sx={{
          fontFamily: "var(--font-heading)",
          fontSize: { xs: 20, md: 28 },
          fontWeight: 700, color: "var(--primary-maroon-dark)",
          letterSpacing: "-0.01em",
          whiteSpace: { xs: "normal", md: "nowrap" },
          textAlign: "center",
          lineHeight: 1.2,
        }}>
          Customer Reviews
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#c25a30" stroke="none">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <Box sx={{ width: { xs: 20, md: 60 }, height: "1.5px", bgcolor: "rgba(90,56,37,0.2)", borderRadius: 1 }} />
        </Box>
      </Box>

      {/* ── MOBILE: card with arrows on left and right ── */}
      <Box sx={{ display: { xs: "block", sm: "none" } }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Row: left arrow + card + right arrow */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 0.5 }}>

          {/* Left arrow */}
          <Box onClick={prev} sx={{
            width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
            border: "1px solid rgba(90,56,37,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", bgcolor: "#fff",
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#5a3825" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Box>

          {/* Card */}
          <Box sx={{
            flex: 1,
            background: "#fdf8f0",
            border: "1.5px solid rgba(194,90,48,0.3)",
            borderRadius: "16px", p: "16px",
            display: "flex", flexDirection: "column", gap: 1.2,
            boxShadow: "0 4px 20px rgba(122,46,20,0.08)",
            transition: "all 0.35s ease",
          }}>
            <StarRating />
            <Typography sx={{
              fontFamily: "var(--font-main)", fontSize: 13,
              color: "#5a3825", lineHeight: 1.65, flex: 1,
            }}>
              {reviews[active].quote}
            </Typography>
            <Box sx={{ height: "1px", bgcolor: "rgba(90,56,37,0.08)" }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{
                width: 34, height: 34, borderRadius: "50%",
                background: reviews[active].color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, fontFamily: "var(--font-main)",
                color: reviews[active].textColor, flexShrink: 0,
                border: "1.5px solid rgba(90,56,37,0.1)",
              }}>
                {reviews[active].initials}
              </Box>
              <Box>
                <Typography sx={{ fontFamily: "var(--font-main)", fontWeight: 700, fontSize: 13, color: "var(--primary-maroon-dark)" }}>
                  {reviews[active].name}
                </Typography>
                <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 11, color: "#9a6a50" }}>
                  {reviews[active].location}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right arrow */}
          <Box onClick={next} sx={{
            width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
            border: "1px solid rgba(90,56,37,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", bgcolor: "#fff",
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#5a3825" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Box>
        </Box>

        {/* Dots below */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 0.8, mt: 1.5 }}>
          {reviews.map((_, i) => (
            <Box key={i} onClick={() => setActive(i)} sx={{
              width: i === active ? 20 : 7, height: 7,
              borderRadius: "999px",
              background: i === active ? "#c25a30" : "rgba(90,56,37,0.18)",
              cursor: "pointer", transition: "all 0.3s ease",
            }} />
          ))}
        </Box>
      </Box>

      {/* ── DESKTOP: 4-col grid ── */}
      <Box sx={{
        display: { xs: "none", sm: "grid" },
        maxWidth: "1150px", mx: "auto",
        gridTemplateColumns: { sm: "1fr 1fr", lg: "repeat(4, 1fr)" },
        gap: { sm: 2.5, md: 3 }, mb: 4,
      }}>
        {reviews.map((r, i) => (
          <Box key={i} onClick={() => setActive(i)} sx={{
            background: i === active ? "#fdf8f0" : "#fff",
            border: `1.5px solid ${i === active ? "rgba(194,90,48,0.3)" : "rgba(90,56,37,0.1)"}`,
            borderRadius: "18px", p: "20px",
            display: "flex", flexDirection: "column", gap: 1.5,
            transition: "all 0.35s ease",
            boxShadow: i === active ? "0 8px 28px rgba(122,46,20,0.1)" : "0 2px 8px rgba(0,0,0,0.03)",
            transform: i === active ? "translateY(-4px)" : "none",
            cursor: "pointer",
          }}>
            <StarRating />
            <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 13, color: "#5a3825", lineHeight: 1.65, flex: 1 }}>
              {r.quote}
            </Typography>
            <Box sx={{ height: "1px", bgcolor: "rgba(90,56,37,0.08)" }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <Box sx={{
                width: 38, height: 38, borderRadius: "50%", background: r.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, fontFamily: "var(--font-main)",
                color: r.textColor, flexShrink: 0, border: "1.5px solid rgba(90,56,37,0.1)",
              }}>
                {r.initials}
              </Box>
              <Box>
                <Typography sx={{ fontFamily: "var(--font-main)", fontWeight: 700, fontSize: 13.5, color: "var(--primary-maroon-dark)" }}>
                  {r.name}
                </Typography>
                <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 11.5, color: "#9a6a50" }}>
                  {r.location}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Desktop dots */}
      <Box sx={{ display: { xs: "none", sm: "flex" }, justifyContent: "center", gap: 1 }}>
        {reviews.map((_, i) => (
          <Box key={i} onClick={() => setActive(i)} sx={{
            width: i === active ? 22 : 8, height: 8,
            borderRadius: "999px",
            background: i === active ? "#c25a30" : "rgba(90,56,37,0.18)",
            cursor: "pointer", transition: "all 0.3s ease",
          }} />
        ))}
      </Box>

    </Box>
  );
}
