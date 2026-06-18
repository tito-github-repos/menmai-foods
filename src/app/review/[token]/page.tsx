"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

type PageState = "loading" | "ready" | "submitted" | "already_reviewed" | "expired" | "error";

type OrderItem = {
  productName: string;
  quantity: number;
  imageUrl: string | null;
};

type OrderInfo = {
  customerName: string;
  items: OrderItem[];
  orderId: number;
};

const productImages: Record<string, string> = {
  chapathi: "/img/products/chapathi_main.png",
  poori: "/img/products/poori_main.png",
};

function getProductImage(name: string, imageUrl: string | null): string {
  const slug = name.toLowerCase();
  return productImages[slug] ?? imageUrl ?? "/img/products/chapathi_main.png";
}

export default function ReviewPage() {
  const { token } = useParams() as { token: string };

  const [state, setState] = useState<PageState>("loading");
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // ── Uncomment for production, remove TEMP block ──
    fetch(`/api/reviews/validate?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) {
          setOrderInfo({ customerName: data.customerName, items: data.items, orderId: data.orderId });
          setState("ready");
        } else if (data.reason === "already_reviewed") {
          setState("already_reviewed");
        } else {
          setState("expired");
        }
      })
      .catch(() => setState("error"));

    // ── TEMP UI TEST ──
    // setOrderInfo({
    //   customerName: "Priya",
    //   orderId: 1,
    //   items: [
    //     { productName: "Chapathi", quantity: 1, imageUrl: null },
    //     { productName: "Poori", quantity: 1, imageUrl: null },
    //   ],
    // });
    setState("ready");
  }, [token]);

  const handleSubmit = async () => {
    if (rating === 0 || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, rating, comment: comment.trim() }),
      });
      if (res.ok) {
        setState("submitted");
      } else {
        const data = await res.json();
        setState(data.reason === "already_reviewed" ? "already_reviewed" : "error");
      }
    } catch {
      setState("error");
    } finally {
      setSubmitting(false);
    }
  };

  const activeRating = hovered || rating;

  /* ── STATE PAGES ── */
  if (state === "loading") {
    return (
      <PageShell>
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress size={32} sx={{ color: "#c8860a" }} />
        </Box>
      </PageShell>
    );
  }

  if (state === "already_reviewed") {
    return (
      <PageShell>
        <StatusCard
          icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="#c8860a"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>}
          iconBg="linear-gradient(135deg, #c8860a, #e8a020)"
          title="Already Submitted"
          desc="You've already shared your feedback for this order. Thank you!"
        />
      </PageShell>
    );
  }

  if (state === "expired") {
    return (
      <PageShell>
        <StatusCard
          icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>}
          iconBg="linear-gradient(135deg, #8a5a30, #b07840)"
          title="Link Expired"
          desc="This review link is no longer valid. It may have already been used or has expired."
        />
      </PageShell>
    );
  }

  if (state === "error") {
    return (
      <PageShell>
        <StatusCard
          icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>}
          iconBg="linear-gradient(135deg, #472112, #743f21)"
          title="Something Went Wrong"
          desc="Please try opening the link again or contact us directly."
        />
      </PageShell>
    );
  }

  if (state === "submitted") {
    return (
      <PageShell>
        <Box sx={{ textAlign: "center", py: { xs: 4, md: 6 } }}>
          <Box sx={{ width: 76, height: 76, borderRadius: "50%", background: "linear-gradient(135deg, #472112, #743f21)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3, boxShadow: "0 8px 24px rgba(71,33,18,0.28)" }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fdf6ec" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </Box>
          <Typography sx={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: { xs: 24, md: 28 }, color: "#2a1205", mb: 1.5 }}>
            Thank You!
          </Typography>
          <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 15, color: "#8a6040", lineHeight: 1.75, maxWidth: 300, mx: "auto", mb: 3 }}>
            Your feedback helps us serve every family better. We appreciate it!
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5, mb: 3 }}>
            {[1,2,3,4,5].map((s) => (
              <svg key={s} width="28" height="28" viewBox="0 0 24 24" fill={s <= rating ? "#c8860a" : "none"} stroke="#c8860a" strokeWidth="1.5" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.7 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#c0392b"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 13, color: "#9a6a50" }}>Thank you for choosing Menmai Foods!</Typography>
          </Box>
        </Box>
      </PageShell>
    );
  }

  /* ══════════════════════════════════════
     MAIN REVIEW FORM
  ══════════════════════════════════════ */
  const itemCount = orderInfo?.items?.length ?? 0;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5efe6", fontFamily: "var(--font-main)" }}>

      {/* ══ DECORATIONS — absolute inside a fixed-height hero zone only ══ */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: { xs: 320, md: 440 },
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {/* Wheat — left */}
        <Box
          component="img"
          src="/img/certificates/wheat.png"
          alt="" aria-hidden="true"
          sx={{
            position: "absolute",
            left: { xs: -20, md: -10 },
            top: { xs: 55, md: 80 },
            width: { xs: 70, md: 160 },
            opacity: { xs: 0.6, md: 0.82 },
            transform: { xs: "rotate(-5deg)", md: "none" },
          }}
        />
        {/* Chapathi bowl — right */}
        <Box
          component="img"
          src="/img/dec_img.png"
          alt="" aria-hidden="true"
          sx={{
            position: "absolute",
            right: { xs: -18, md: -8 },
            top: { xs: 50, md: 70 },
            width: { xs: 85, md: 190 },
            opacity: { xs: 0.65, md: 0.88 },
          }}
        />
      </Box>

      {/* ══ CONTENT ══ */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: 580,
          mx: "auto",
          px: { xs: 3, sm: 3.5, md: 5 },
          pt: { xs: 4, md: 5 },
          pb: { xs: 8, md: 10 },
        }}
      >
        {/* WE VALUE YOUR FEEDBACK */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.7, mb: 1.2 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#c07830">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <Typography sx={{ fontFamily: "var(--font-main)", fontWeight: 700, fontSize: 10.5, color: "#c07830", letterSpacing: "0.13em", textTransform: "uppercase" }}>
            We Value Your Feedback
          </Typography>
        </Box>

        {/* Big heading */}
        <Typography sx={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: { xs: 24, sm: 42, md: 52 }, color: "#2a1205", textAlign: "center", lineHeight: 1.08, mb: 1.5 }}>
          How was your order?
        </Typography>

        {/* Heart divider */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 2.5 }}>
          <Box sx={{ width: 30, height: "1.5px", bgcolor: "rgba(200,160,80,0.35)" }} />
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c8860a" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <Box sx={{ width: 30, height: "1.5px", bgcolor: "rgba(200,160,80,0.35)" }} />
        </Box>

        {/* Hi name */}
        <Typography sx={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: { xs: 18, md: 21 }, color: "#c07830", textAlign: "center", mb: 0.5 }}>
          Hi {orderInfo?.customerName?.split(" ")[0]},
        </Typography>
        <Typography sx={{ fontFamily: "var(--font-main)", fontSize: { xs: 13, md: 14.5 }, color: "#6b4020", textAlign: "center", mb: 4 }}>
          Your honest feedback helps us serve you better every day.
        </Typography>

        {/* ── YOU ORDERED X ITEMS ── */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2, justifyContent: "center" }}>
            <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(200,160,80,0.3)", maxWidth: 55 }} />
            <Typography sx={{ fontFamily: "var(--font-main)", fontWeight: 700, fontSize: 10.5, color: "#8a5a30", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              You Ordered {itemCount} {itemCount === 1 ? "Item" : "Items"}
            </Typography>
            <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(200,160,80,0.3)", maxWidth: 55 }} />
          </Box>

          {/* Product cards — grid, no circle, small square image */}
          <Box sx={{ display: "grid", gridTemplateColumns: itemCount === 1 ? "1fr" : "1fr 1fr", gap: { xs: 1.2, sm: 1.5 } }}>
            {orderInfo?.items?.map((item, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  gap: { xs: 0.8, sm: 1.5 },
                  bgcolor: "rgba(255,255,255,0.85)",
                  border: "1.5px solid #e8d4b8",
                  borderRadius: "14px",
                  px: { xs: 1, sm: 2 },
                  py: { xs: 1.2, sm: 1.5 },
                  textAlign: { xs: "center", sm: "left" },
                  boxShadow: "0 2px 10px rgba(61,26,14,0.06)",
                }}
              >
               <Box
                  component="img"
                  src={getProductImage(item.productName, item.imageUrl)}
                  alt={item.productName}
                  sx={{
                    width: { xs: 48, sm: 56 },
                    height: { xs: 48, sm: 56 },
                    objectFit: "contain",
                    flexShrink: 0,
                    filter: "drop-shadow(0 2px 6px rgba(61,26,14,0.12))",
                  }}
                />
                {/* Name — full, no truncation */}
                <Box>
                  <Typography sx={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: { xs: 14, sm: 16 }, color: "#2a1205", lineHeight: 1.2, mb: 0.2 }}>
                    {item.productName}
                  </Typography>
                  <Typography sx={{ fontFamily: "var(--font-main)", fontSize: { xs: 11.5, sm: 13 }, color: "#9a6a50" }}>
                    {item.quantity} {item.quantity === 1 ? "Pack" : "Packs"}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Divider */}
        <Box sx={{ height: "1.5px", bgcolor: "#e0cdb8", mb: { xs: 3, md: 4 } }} />

        {/* ── YOUR RATING ── */}
        <Box sx={{ mb: { xs: 3, md: 3.5 } }}>
          <Typography sx={{ fontFamily: "var(--font-main)", fontWeight: 700, fontSize: 12, color: "#2a1205", letterSpacing: "0.09em", textTransform: "uppercase", mb: 2 }}>
            Your Rating <Box component="span" sx={{ color: "#c0392b" }}>*</Box>
          </Typography>

          <Box sx={{ display: "flex", gap: { xs: 0.8, sm: 1.2 }, mb: 1.5, alignItems: "center" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Box
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                sx={{ cursor: "pointer", userSelect: "none", transition: "transform 0.15s ease", transform: activeRating >= star ? "scale(1.2)" : "scale(1)", display: "flex" }}
              >
                <svg                 
                  width={34} height={34} viewBox="0 0 24 24"
                  fill={activeRating >= star ? "#c8860a" : "none"}
                  stroke={activeRating >= star ? "#c8860a" : "#c8a050"}
                  strokeWidth="1.4" strokeLinejoin="round"
                  style={{ transition: "all 0.15s ease", filter: activeRating >= star ? "drop-shadow(0 2px 5px rgba(200,134,10,0.38))" : "none" }}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </Box>
            ))}
          </Box>

          <Box sx={{ minHeight: 22 }}>
            {activeRating === 0 ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 13, color: "#9a7050" }}>
                  Tap a star to rate
                </Typography>
              </Box>
            ) : (
              <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 13.5, fontWeight: 700, color: "#c8860a" }}>
                {["", "Poor", "Fair", "Good", "Great", "Excellent!"][activeRating]}
              </Typography>
            )}
          </Box>
        </Box>

        {/* ── WRITE A REVIEW ── */}
        <Box sx={{ mb: { xs: 2.5, md: 3 } }}>
          <Typography sx={{ fontFamily: "var(--font-main)", fontWeight: 700, fontSize: 12, color: "#2a1205", letterSpacing: "0.09em", textTransform: "uppercase", mb: 1.2 }}>
            Write a Review{" "}
            <Box component="span" sx={{ fontWeight: 400, textTransform: "none", fontSize: 12, letterSpacing: 0, color: "#9a6a50" }}>(optional)</Box>
          </Typography>
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.85)",
              border: "1.5px solid #e0cdb8",
              borderRadius: "14px",
              overflow: "hidden",
              transition: "border-color 0.2s, box-shadow 0.2s",
              "&:focus-within": { borderColor: "#c07830", boxShadow: "0 0 0 3px rgba(192,120,48,0.12)" },
            }}
          >
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              placeholder="Tell us about the taste, freshness, softness, packaging..."
              rows={5}
              style={{
                width: "100%", padding: "14px 16px 6px",
                border: "none", outline: "none", resize: "none",
                fontSize: "14px", fontFamily: "var(--font-main)",
                color: "#2a1205", background: "transparent",
                lineHeight: 1.7, boxSizing: "border-box",
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", px: 2, pb: 1 }}>
              <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 11, color: "#b0906a" }}>{comment.length}/500</Typography>
            </Box>
          </Box>
        </Box>

        {/* Privacy note */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: { xs: 3, md: 3.5 } }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c07830" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.75 }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <Typography sx={{ fontFamily: "var(--font-main)", fontSize: { xs: 12, sm: 13 }, color: "#8a6040", lineHeight: 1.55 }}>
            Your feedback is safe and will help other customers make the right choice.
          </Typography>
        </Box>

        {/* Submit */}
        <Button
          fullWidth
          onClick={handleSubmit}
          disabled={rating === 0 || submitting}
          sx={{
            py: { xs: 1.7, md: 2 },
            borderRadius: "14px",
            background: rating === 0 ? "#c8b8a8" : "linear-gradient(135deg, #3d1a0e 0%, #6b2d10 100%)",
            color: "#fdf6ec",
            fontFamily: "var(--font-main)",
            fontSize: { xs: 14.5, md: 15.5 },
            fontWeight: 700,
            textTransform: "none",
            letterSpacing: "0.02em",
            boxShadow: rating > 0 ? "0 6px 24px rgba(61,26,14,0.26)" : "none",
            "&:hover": {
              background: rating > 0 ? "linear-gradient(135deg, #2c1009 0%, #5e2410 100%)" : "#c8b8a8",
              boxShadow: rating > 0 ? "0 10px 32px rgba(61,26,14,0.34)" : "none",
            },
            "&.Mui-disabled": { background: "#c8b8a8", color: "#fdf6ec" },
            transition: "all 0.25s ease",
            mb: { xs: 3, md: 4 },
          }}
          startIcon={
            submitting ? undefined : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )
          }
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </Button>

        {/* Footer */}
        <Box sx={{ textAlign: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.7, mb: 0.4 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#c0392b"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            <Typography sx={{ fontFamily: "var(--font-main)", fontWeight: 700, fontSize: { xs: 12.5, md: 13.5 }, color: "#3d1a0e" }}>
              Thank you for choosing Menmai Foods!
            </Typography>
          </Box>
          <Typography sx={{ fontFamily: "var(--font-main)", fontSize: 12, color: "#9a6a50" }}>
            Made with love in Madurai, Tamil Nadu.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

/* ── Page shell for state screens ── */
function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5efe6", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      {/* Decorations — only at top, inside fixed-height zone */}
      <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 220, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <Box component="img" src="/img/certificates/wheat.png" alt="" aria-hidden="true"
          sx={{ position: "absolute", left: -15, top: 60, width: { xs: 85, md: 120 }, opacity: 0.55, transform: "rotate(-10deg)" }} />
      </Box>
      {/* Centered content */}
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", px: 2, position: "relative", zIndex: 1 }}>
        <Box sx={{ width: "100%", maxWidth: 420 }}>{children}</Box>
      </Box>
    </Box>
  );
}

/* ── Status card ── */
function StatusCard({ icon, iconBg, title, desc }: { icon: React.ReactNode; iconBg: string; title: string; desc: string }) {
  return (
    <Box sx={{ bgcolor: "rgba(255,255,255,0.88)", border: "1.5px solid #e8d4b8", borderRadius: "22px", boxShadow: "0 8px 32px rgba(61,26,14,0.10)", p: { xs: "28px 22px", md: "40px 36px" }, textAlign: "center" }}>
      <Box sx={{ width: 68, height: 68, borderRadius: "50%", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2.5, boxShadow: "0 6px 18px rgba(61,26,14,0.18)" }}>
        {icon}
      </Box>
      <Typography sx={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: { xs: 20, md: 23 }, color: "#2a1205", mb: 1.2 }}>{title}</Typography>
      <Typography sx={{ fontFamily: "var(--font-main)", fontSize: { xs: 13, md: 14.5 }, color: "#8a6040", lineHeight: 1.75 }}>{desc}</Typography>
    </Box>
  );
}