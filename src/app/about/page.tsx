"use client";

import Link from "next/link";
import {
  Button,
  Box,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";

interface InfoCardProps {
  title: string;
  description: string;
  quote: string;
  image: string;
  color: {
    main: string;
    quote: string;
    divider: string;
  };
}

const featureItems = [
  {
    label: "Made from Quality wheat",
    icon: (
      <Box
        sx={{
          width: 26,
          height: 28,
          backgroundColor: "var(--glt)",
          mask: "url('/grain-wheat-icon.svg') no-repeat center / contain",
          WebkitMask: "url('/grain-wheat-icon.svg') no-repeat center / contain",
        }}
      />
    ),
  },
  {
    label: "Hygienically Prepared",
    icon: <VerifiedUserOutlinedIcon sx={{ color: "var(--glt)" }} />,
  },
  {
    label: "Ready to Cook",
    icon: (
      <Box
        sx={{
          width: 38,
          height: 38,
          backgroundColor: "var(--glt)",
          mask: "url('/pan.svg') no-repeat center / 92%",
          WebkitMask: "url('/pan.svg') no-repeat center / 92%",
          transform: "scaleX(-1)",
        }}
      />
    ),
  },
  {
    label: "100% Vegetarian",
    icon: (
      <Box
        sx={{
          width: 24,
          height: 24,
          backgroundColor: "var(--glt)",
          mask: "url('/leaf.svg') no-repeat center / contain",
          WebkitMask: "url('/leaf.svg') no-repeat center / contain",
        }}
      />
    ),
  },
  {
    label: "Saves Cooking Time",
    icon: <AccessTimeOutlinedIcon sx={{ color: "var(--glt)" }} />,
  },
];

const storyPoints = [
  {
    icon: <ShieldOutlinedIcon />,
    text: "Established with a commitment to quality, our products are prepared in a hygienic and well-maintained production environment, following high standards in manufacturing and packaging. We focus on delivering safe, reliable, and consistent food products that customers can trust.",
  },
  {
    icon: <BlockOutlinedIcon />,
    text: (
      <>
        At{" "}
        <span
          style={{
            fontWeight: 700,
            color: "var(--primary-maroon-dark)",
          }}
        >
          Menmai Foods
        </span>
        , we use carefully selected natural ingredients without the addition of
        artificial colors or flavors. Our products are made using traditional
        preparation techniques, ensuring authentic taste, softness, and
        freshness in every bite.
      </>
    ),
  },
  {
    icon: <LocalShippingOutlinedIcon />,
    text: (
      <>
        We strive to deliver our products fresh everyday to our customers
        through efficient distribution, catering to households, retail outlets,
        and food service providers across Madurai and nearby areas.
      </>
    ),
  },
  {
    icon: <StorefrontOutlinedIcon />,
    text: (
      <>
        Currently,{" "}
        <span
          style={{
            fontWeight: 700,
            color: "var(--primary-maroon-dark)",
          }}
        >
          Menmai Foods
        </span>{" "}
        focuses on high-quality Semi-Cooked Chapathi and Poori, with plans to
        expand our range by introducing more fresh and convenient food products
        in the future.
      </>
    ),
  },
];

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
      )
    `,
  },
  "& > *": {
    position: "relative",
    zIndex: 1,
  },
};

const InfoCard = ({
  title,
  description,
  quote,
  image,
  color,
}: InfoCardProps) => {
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

        <Divider
          sx={{
            width: "60px",
            my: 1.5,
            borderColor: color.divider,
            borderBottomWidth: "2px",
          }}
        />

        <Typography
          variant="body2"
          sx={{
            fontStyle: "italic",
            color: color.quote,
            fontSize: { xs: ".9rem", md: ".96rem" },
            fontWeight: 500,
            lineHeight: 1.6,
            fontFamily: "var(--font-heading)",
          }}
        >
          {quote}
        </Typography>
      </Box>
    </Box>
  );
};

export default function AboutPage() {
  return (
    <Box sx={{ pb: 8 }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#f9f7f5",
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
                    About Menmai Foods
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
                  Bringing Freshness to Every Home
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
                  From our kitchen to yours — we make everyday meals easier,
                  healthier, and more delicious.
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
                  Explore our Products
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
                  src="/img/about/bg.png"
                  alt="Fresh Food"
                  sx={{
                    width: { xs: "90%", md: "100%" },
                    height: { xs: "100%", md: "80%" },
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
        {/* Our Story */}
        <Box sx={{ py: 8 }}>
          <Grid container spacing={6} alignItems="center">
            {/* IMAGE SIDE */}

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: "28px",
                  overflow: "visible",
                  pr: { xs: 2, md: 4 },
                  pb: { xs: 5, md: 7 },

                  /* Background frame */
                  p: { xs: 1.2, md: 1.8 },
                  background: "color-mix(in srgb, var(--glt), transparent 90%)",
                }}
              >
                {/* IMAGE */}
                <Box
                  component="img"
                  src="/img/about/about.jpeg"
                  alt="Our Story"
                  sx={{
                    width: "100%",
                    display: "block",
                    borderRadius: "24px",
                  }}
                />

                {/* SOFT OVERLAY */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: { xs: 5, md: 8 },
                    borderRadius: "24px",
                    pointerEvents: "none",
                  }}
                />

                {/* QUALITY BADGE */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: { xs: "-50px", md: "-40px" },
                    left: { xs: 24, md: 36 },
                    width: { xs: 100, md: 130 },
                    height: { xs: 100, md: 130 },
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow:
                      "0 14px 34px rgba(0,0,0,0.22), inset 0 0 14px rgba(255,255,255,0.12)",
                    backdropFilter: "blur(6px)",
                    zIndex: 3,
                    backgroundColor: "var(--primary-teal-dark)",
                  }}
                >
                  {/* Inner Circle */}
                  <Box
                    sx={{
                      width: "87%",
                      height: "87%",
                      borderRadius: "50%",
                      border: "1.5px solid var(--glt)",
                      background: "var(--primary-teal-dark)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      px: 1.5,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--glt)",
                        fontSize: { xs: ".68rem", md: "1rem" },
                        lineHeight: 1.35,
                        letterSpacing: ".2px",
                        fontFamily: "var(--font-heading)",
                        fontWeight: 600,
                      }}
                    >
                      Quality <br /> You Can <br /> Trust
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* CONTENT SIDE */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1,
                }}
              >
                {/* TITLE */}
                <Typography
                  sx={{
                    fontSize: { xs: "1.6rem", md: "2rem" },
                    fontWeight: 700,
                    fontFamily: "var(--font-heading)",
                    color: "var(--primary-maroon-dark)",
                    mb: 1,
                  }}
                >
                  Our Story
                </Typography>

                <Box
                  sx={{
                    width: 35,
                    height: 32,
                    backgroundColor: "var(--glt)",
                    mask: "url('/plant.png') no-repeat center / contain",
                    WebkitMask: "url('/plant.png') no-repeat center / contain",
                    opacity: 0.7,
                    zIndex: 100,
                  }}
                />
              </Box>

              {/* SUBTEXT */}
              <Typography
                sx={{
                  fontSize: ".95rem",
                  color: "var(--text)",
                  lineHeight: 1.7,
                  mb: 3,
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    color: "var(--primary-maroon-dark)",
                  }}
                >
                  Menmai Foods
                </span>
                , based in Madurai, specializes in Ready-to-Heat and Eat
                Chapathi and Poori, designed to bring convenience and freshness
                to your everyday meals.
              </Typography>

              {/* POINTS */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
                {storyPoints.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      gap: 1.6,
                      alignItems: "flex-start",
                    }}
                  >
                    {/* ICON CIRCLE */}
                    <Box
                      sx={{
                        minWidth: 38,
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background:
                          "color-mix(in srgb, var(--glt), transparent 80%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--primary-maroon-dark)",
                      }}
                    >
                      {item.icon}
                    </Box>

                    {/* TEXT */}
                    <Typography
                      sx={{
                        fontSize: ".92rem",
                        color: "var(--text)",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Top Feature Section */}
        <Box
          sx={{
            ...patternOverlay,
            background:
              "linear-gradient(130deg, var(--primary-teal-dark) 0%, var(--primary-teal-mid) 100%)",
            px: { xs: 2, md: 3 },
            py: { xs: 2, md: 1.5 },
            boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
            position: "relative",
            overflow: "hidden",
            mb: 8,
            borderRadius: "16px",
          }}
        >
          <Grid container spacing={0} alignItems="stretch">
            {featureItems.map((feat, i) => (
              <Grid
                item
                xs={6}
                sm={4}
                md={true}
                key={i}
                sx={{
                  flexBasis: { md: "20%" },
                  maxWidth: { md: "20%" },
                  display: "flex",
                  justifyContent: "center",
                  borderRight: {
                    xs:
                      i % 2 === 0 && i !== featureItems.length - 1
                        ? "1px solid rgba(255,255,255,0.15)"
                        : "none",

                    sm:
                      i % 3 !== 2 && i !== featureItems.length - 1
                        ? "1px solid rgba(255,255,255,0.15)"
                        : "none",

                    md:
                      i < featureItems.length - 1
                        ? "1px solid rgba(255,255,255,0.15)"
                        : "none",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.5,
                    width: "100%",
                    px: { xs: 1.5, md: 2 },
                    py: { xs: 1.5, md: 1.2 },
                  }}
                >
                  <Box
                    sx={{
                      minWidth: 48,
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      border: "1.5px solid var(--glt)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {feat.icon}
                  </Box>

                  <Typography
                    sx={{
                      fontSize: ".8rem",
                      fontWeight: 500,
                      color: "var(--white)",
                      lineHeight: 1.45,
                      width: { xs: 64, md: 80 },
                    }}
                  >
                    {feat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Vision Mission Section */}
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
                borderLeft: "2px dotted var(--glt)",
                opacity: 0.5,
              }}
            />

            <Box
              sx={{
                width: 24,
                height: 24,
                mt: 1,
                backgroundColor: "var(--glt)",
                mask: "url('/grain-wheat-icon.svg') no-repeat center / contain",
                WebkitMask:
                  "url('/grain-wheat-icon.svg') no-repeat center / contain",
              }}
            />
          </Box>

          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <InfoCard
                title="Our Vision"
                description="To become a trusted household name in ready-to-cook foods across Tamil Nadu and beyond."
                quote='"A name every Tamil home trusts"'
                image="/img/about/vission.png"
                color={{
                  main: "var(--primary-teal-dark)",
                  quote: "var(--primary-teal-dark)",
                  divider:
                    "color-mix(in srgb, var(--primary-teal-dark), transparent 50%)",
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <InfoCard
                title="Our Mission"
                description="To provide fresh, hygienic, and time-saving food solutions that fit seamlessly into everyday life."
                quote='"Fresh food, everyday convenience"'
                image="/img/about/mission.png"
                color={{
                  main: "var(--primary-maroon-mid)",
                  quote: "var(--primary-maroon-mid)",
                  divider:
                    "color-mix(in srgb, var(--primary-maroon-dark), transparent 50%)",
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
