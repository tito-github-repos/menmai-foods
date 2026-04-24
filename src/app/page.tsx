// "use client";

// import { useEffect, useState } from "react";
// import styles from "./page.module.css";

// const banners = [
//   "/img/banners/banners1.jpg",
//   "/img/banners/banners2.png",
//   "/img/banners/banners3.png",
// ];

// export default function Home() {
//   const [current, setCurrent] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % banners.length);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <main className={styles.container}>

//       {/* RUNNING TEXT */}
//       <div className={styles.ticker}>
//         <p className={styles.marquee}>
//         Freshly made chapathi daily | Free delivery above ₹199 | No preservatives
//         </p>
//       </div>

//       {/* HERO */}
//       <section className={styles.hero}>
//         <img src={banners[current]} className={styles.heroImage} />

//         <div className={styles.overlay}>
//           {/* <h1 className={styles.title}>
//             Fresh Chapathi, Ready in Seconds
//           </h1> */}
//           <p className={styles.subtitle}>
//             Soft • Healthy • Homemade Taste
//           </p>
//           <button className={styles.primaryBtn}>
//             Order Now
//           </button>
//         </div>
//       </section>

//       <section className={styles.products}>
//         <h2 className={styles.sectionTitle}>Our Products</h2>

//         <div className={styles.productGrid}>

//           {/* CARD 1 */}
//           <div className={styles.card}>
//             <img src="/img/products/chapthi1.jpeg" className={styles.productImg} />

//             <div className={styles.cardContent}>
//               <h3>Chapathi</h3>

//               <div className={styles.priceBox}>
//                 <span className={styles.oldPrice}>₹50</span>
//                 <span className={styles.newPrice}>₹40</span>
//               </div>

//               <button className={styles.primaryBtn}>Add to Cart</button>
//             </div>
//           </div>

//           {/* CARD 2 */}
//           <div className={styles.card}>
//             <img src="/img/products/poori1.jpeg" className={styles.productImg} />

//             <div className={styles.cardContent}>
//               <h3>Poori</h3>

//               <div className={styles.priceBox}>
//                 <span className={styles.oldPrice}>₹55</span>
//                 <span className={styles.newPrice}>₹45</span>
//               </div>

//               <button className={styles.primaryBtn}>Add to Cart</button>
//             </div>
//           </div>

//         </div>
//       </section>

//       {/* ABOUT */}
//       <section className={styles.about}>
//         <h2 className={styles.sectionTitle}>About Us</h2>
//         <p className={styles.aboutText}>
//           Menmai Foods provides fresh, hygienic, ready-to-eat chapathi and poori.
//           Our mission is to deliver convenient and healthy food solutions while
//           maintaining traditional taste and quality.
//         </p>
//       </section>

//       {/* DELIVERY */}
//       <section className={styles.delivery}>
//         <h2 className={styles.sectionTitle}>Delivery Area</h2>
//         <div className={styles.deliveryBox}>
//           We currently deliver within <strong>Madurai (10km radius)</strong>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className={styles.cta}>
//         <h2 className={styles.sectionTitle}>Order Now</h2>
//         <p>Contact us on WhatsApp</p>
//         <button className={styles.whatsappBtn}>
//           Chat on WhatsApp
//         </button>
//       </section>

//       {/* FLOAT WHATSAPP */}
//       <a href="https://wa.me/91XXXXXXXXXX" className={styles.whatsappFloat}>
//         💬
//       </a>

//       {/* WHY US */}
//       <section className={styles.why}>
//         <h2 className={styles.sectionTitle}>Why Choose Us</h2>

//         <div className={styles.whyGrid}>
//           <p>✅ No Preservatives</p>
//           <p>✅ Homemade Taste</p>
//           <p>✅ Ready in 30 Seconds</p>
//         </div>
//       </section>

//       {/* CTA */}
//       {/* <section className={styles.cta}>
//         <h2 className={styles.sectionTitle}>Order Now</h2>
//         <p>Contact us on WhatsApp</p>
//         <button className={styles.whatsappBtn}>
//           Chat on WhatsApp
//         </button>
//       </section> */}

//     </main>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import NoFoodIcon from "@mui/icons-material/NoFood";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Container,
  Chip,
  Paper,
} from "@mui/material";
import BulkOrderSection from "./components/BulkOrderSection";

const banners = [
  "/img/banners/banners1.jpg",
  "/img/banners/banners2.png",
  "/img/banners/banners3.png",
];

const features = [
  {
    title: "Freshly Prepared",
    desc: "Cooked fresh daily with traditional homemade taste.",
    icon: <LocalDiningIcon sx={{ fontSize: 40, color: "#88391d" }} />,
  },
  {
    title: "Hygienic Kitchen",
    desc: "Prepared in clean, safe and monitored environment.",
    icon: <CleaningServicesIcon sx={{ fontSize: 40, color: "#88391d" }} />,
  },
  {
    title: "No Preservatives",
    desc: "100% natural food with zero chemicals or additives.",
    icon: <NoFoodIcon sx={{ fontSize: 40, color: "#88391d" }} />,
  },
  {
    title: "Fast Delivery",
    desc: "Hot food delivered within Madurai quickly.",
    icon: <DeliveryDiningIcon sx={{ fontSize: 40, color: "#88391d" }} />,
  },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ bgcolor: "#fffaf5" }}>
      
      {/* TOP STRIP */}
      <Box
        sx={{
          bgcolor: "#5C2008",
          color: "#fff",
          py: 1,
          textAlign: "center",
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        Freshly made chapathi daily • Free delivery above ₹199 • No preservatives
      </Box>

      {/* HERO */}
      <Box sx={{ position: "relative", height: { xs: "55vh", md: "70vh" } }}>
        <Box
          component="img"
          src={banners[current]}
          alt="banner"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ textAlign: "center", px: 2 }}>
            <Typography
              variant="h2"
              sx={{
                color: "#fff",
                fontWeight: 800,
                fontSize: { xs: "32px", md: "52px" },
              }}
            >
              Fresh Homemade Food
            </Typography>

            <Typography sx={{ color: "#eee", mt: 2 }}>
              Soft • Healthy • Ready in Seconds
            </Typography>

            <Button
              variant="contained"
              sx={{
                mt: 4,
                px: 5,
                py: 1.5,
                borderRadius: "999px",
                fontWeight: 600,
                bgcolor: "#5C2008",
                "&:hover": { bgcolor: "#6e2f18" },
                // background: "linear-gradient(135deg,#f28c28,#ffb36b)",
              }}
            >
              Order Now
            </Button>
          </Box>
        </Box>
      </Box>

      <Container maxWidth="xl" disableGutters sx={{ py: 8, px: { xs: 2, md: 8 } }}>
        {/* PRODUCT SECTION */}
        {/* HEADING */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              fontSize: 30,
              fontFamily: "'Playfair Display', serif",
              color: "#4a2a1a",
              position: "relative",
              display: "inline-block",
              pb: 1,

              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "120px",
                height: "4px",
                borderRadius: "50px",
                background:
                  "linear-gradient(to right, transparent, #c89b6d, #8b5e3c, #c89b6d, transparent)",
              },
            }}
          >
            Our Products
          </Typography>
        </Box>
          <Grid container spacing={6} justifyContent="center">
            {/* PRODUCT 1 */}
            <Grid item xs={12} md={6}>
              <Paper
                onDoubleClick={() => router.push("/product/chapathi")}
                sx={{
                  position: "relative",
                  height: 280,
                  display: "flex",
                  borderRadius: 4,
                  overflow: "hidden",
                  bgcolor: "#F5E7D9",
                  boxShadow: "0 18px 50px rgba(0,0,0,0.08)",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
                  },
                }}
              >
              {/* ALWAYS FIXED PACK */}
              <Chip
                label="Pack of 10"
                size="small"
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  bgcolor: "#5C2008",
                  color: "#fff",
                  fontWeight: 600,
                  zIndex: 10,
                }}
              />
                <Box
                  component="img"
                  src="/img/products/chapthi1.jpeg"
                  sx={{
                    width: "45%",
                    objectFit: "cover",
                  }}
                />
                <Box
                  sx={{
                    p: 4,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 10,
                        letterSpacing: 2,
                        color: "#999",
                      }}
                    >
                      BEST SELLER
                    </Typography>

                    <Typography variant="h5" sx={{ fontWeight: 700 , fontSize:18}}>
                      Chapathi
                    </Typography>

                    <Box
                      sx={{
                        width: 50,
                        height: 3,
                        bgcolor: "#5C2008",
                        mt: 1,
                        mb: 2,
                      }}
                    />

                    <Typography sx={{ color: "text.secondary", fontSize: 12,minHeight: 30 }}>
                      Soft homemade chapathi prepared fresh daily with
                      traditional taste and no preservatives.
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 1 }}>
                    <Typography sx={{ fontSize: 14 , fontFamily: "Poppins, sans-serif", }}>  MRP: 
                      <b style={{ color: "#5C2008" }}>  ₹40</b>
                      <s style={{ color: "#999" }}> ₹50</s>{" "}
                    </Typography>

                    <Typography sx={{ fontSize: 14, color: "#5C2008" , fontFamily: "Poppins, sans-serif", }}>
                      Net Wt: 50 g
                    </Typography>
                  
                  <Box
                      sx={{
                        borderBottom: "1px dashed #ddd",
                        my: 1.5
                      }}
                    />
                    
                    <Box sx={{ mt: 2, display: "flex", gap:3 , width: "90%"}}>
                      <Button
                        variant="contained"
                        sx={{
                          flex: 1,
                          bgcolor: "#5C2008",
                          borderRadius: "999px",
                          whiteSpace: "nowrap",
                          fontSize:12,
                          height: 40,   
                          px: 2,
                          "&:hover": { bgcolor: "#6e2f18" },
                        }}
                      >
                        Add to Cart
                      </Button>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation(); // IMPORTANT
                          router.push("/product/chapathi");
                        }}
                        variant="outlined"
                        sx={{
                          flex: 1,
                          borderRadius: "999px",
                          height: 40,             // ✅ same height
                          px: 2,
                          whiteSpace: "nowrap",
                          fontWeight: 400,
                          color: "#5C2008",       // text color
                          borderColor: "#5C2008", // border color
                          borderWidth: 2,
                          fontSize:12,

                          "&:hover": {
                            borderColor: "#6e2f18",
                            backgroundColor: "rgba(136,57,29,0.05)", // light hover
                          },
                        }}
                      >
                        View Product
                      </Button>                     
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* PRODUCT 2 */}
            <Grid item xs={12} md={6}>
              <Paper
                onDoubleClick={() => router.push("/product/poori")}
                sx={{
                  position: "relative",
                  height: 280,
                  display: "flex",
                  borderRadius: 4,
                  overflow: "hidden",
                  bgcolor: "#F5E7D9",
                  boxShadow: "0 18px 50px rgba(0,0,0,0.08)",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
                  },
                }}
              >
              {/* ALWAYS FIXED PACK */}
              <Chip
                label="Pack of 10"
                size="small"
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  bgcolor: "#5C2008",
                  color: "#fff",
                  fontWeight: 600,
                  zIndex: 10,
                }}
              />
                <Box
                  component="img"
                  src="/img/products/poori1.jpeg"
                  sx={{
                    width: "45%",
                    objectFit: "cover",
                  }}
                />
                <Box
                  sx={{
                    p: 4,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 10,
                        letterSpacing: 2,
                        color: "#999",
                      }}
                    >
                      HOME SPECIAL
                    </Typography>

                    <Typography variant="h5" sx={{ fontWeight: 700 , fontSize:18}}>
                      Poori
                    </Typography>

                    <Box
                      sx={{
                        width: 50,
                        height: 3,
                        bgcolor: "#5C2008",
                        mt: 1,
                        mb: 2,
                      }}
                    />

                    <Typography sx={{ color: "text.secondary", fontSize: 12,minHeight: 30 }}>
                      Crispy golden poori, fluffy and fresh,
                      perfect for breakfast or dinner.
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 1 }}>
                    <Typography sx={{ fontSize: 14 , fontFamily: "Poppins, sans-serif", }}>  MRP: 
                      <b style={{ color: "#5C2008" }}>  ₹45</b>
                      <s style={{ color: "#999" }}> ₹55</s>{" "}
                    </Typography>

                    <Typography sx={{ fontSize: 14, color: "#5C2008" , fontFamily: "Poppins, sans-serif", }}>
                      Net Wt: 50 g
                    </Typography>
                  
                  <Box
                      sx={{
                        borderBottom: "1px dashed #ddd",
                        my: 1.5
                      }}
                    />
                    
                    <Box sx={{ mt: 2, display: "flex", gap:3 , width: "90%"}}>
                      <Button
                        variant="contained"
                        sx={{
                          flex: 1,
                          bgcolor: "#5C2008",
                          borderRadius: "999px",
                          whiteSpace: "nowrap",
                          fontSize:12,
                          height: 40,   
                          px: 2,
                          "&:hover": { bgcolor: "#6e2f18" },
                        }}
                      >
                        Add to Cart
                      </Button>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation(); // IMPORTANT
                          router.push("/product/poori");
                        }}
                        variant="outlined"
                        sx={{
                          flex: 1,
                          borderRadius: "999px",
                          height: 40,             // ✅ same height
                          px: 2,
                          whiteSpace: "nowrap",
                          fontWeight: 400,
                          color: "#5C2008",       // text color
                          borderColor: "#5C2008", // border color
                          borderWidth: 2,
                          fontSize:12,

                          "&:hover": {
                            borderColor: "#6e2f18",
                            backgroundColor: "rgba(136,57,29,0.05)", // light hover
                          },
                        }}
                      >
                        View Product
                      </Button>                      
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>

        <Box sx={{ mt:8, textAlign: "center" }}>
      
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              fontSize: 30,
              fontFamily: "'Playfair Display', serif",
              color: "#4a2a1a",
              letterSpacing: 0.5,
              position: "relative",
              display: "inline-block",
              pb: 2,
              mb: 6,

              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "120px",
                height: "4px",
                borderRadius: "50px",
                background:
                  "linear-gradient(to right, transparent, #c89b6d, #8b5e3c, #c89b6d, transparent)",
              },
            }}
          >
            Why Choose Us?
          </Typography>

            <Grid container spacing={4} justifyContent="center">
              {features.map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>

                  <motion.div
                    initial={{ opacity: 0, y: 60, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.08 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        borderRadius: 5,
                        height: "100%",
                        background:
                          "linear-gradient(145deg, #fff, #fff7f2)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                        position: "relative",
                        overflow: "hidden",
                        transition: "0.3s",

                        "&:hover": {
                          boxShadow: "0 20px 50px rgba(136,57,29,0.25)",
                        },

                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: -50,
                          right: -50,
                          width: 120,
                          height: 120,
                          background:
                            "radial-gradient(circle, rgba(136,57,29,0.15), transparent)",
                          borderRadius: "50%",
                        },
                      }}
                    >
                      {/* ICON */}
                      <Box sx={{ mb: 2 }}>{item.icon}</Box>

                      {/* TITLE */}
                      <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
                        {item.title}
                      </Typography>

                      {/* DESCRIPTION */}
                      <Typography
                        sx={{ fontSize: 14, color: "text.secondary", mt: 1 }}
                      >
                        {item.desc}
                      </Typography>
                    </Paper>
                  </motion.div>

                </Grid>
              ))}
            </Grid>
          </Box>

          {/* DELIVERY AREA */}
          <BulkOrderSection />

          <Box sx={{ mt: 8, textAlign: "center" }}>
  
          {/* delivery */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              fontSize: 30,
              fontFamily: "'Playfair Display', serif",
              color: "#4a2a1a",
              mb: 1,
            }}
          >
            Delivery Area
          </Typography>

          <Paper
            elevation={0}
            sx={{
              maxWidth: 700,
              mx: "auto",
              p: 4,
              borderRadius: 4,
              background: "linear-gradient(145deg, #fff, #fff7f2)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
              
              {/* LEFT - IMAGE */}
              <Box
                sx={{
                  width: 250,
                  height: 250,
                  flexShrink: 0,
                  borderRadius: "50%",
                  border: "2px dashed #88391d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  component="img"
                  src="/img/delivery.png"
                  alt="Delivery Area"
                  sx={{
                    width: "85%",
                    height: "85%",
                    objectFit: "contain",
                  }}
                />
              </Box>

              {/* RIGHT - CONTENT */}
              <Box sx={{ flex: 1 }}>

                {/* MAIN HIGHLIGHT */}
                <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                  Delivering across
                </Typography>

                <Typography
                  sx={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#88391d",
                    mb: 1,
                  }}
                >
                  10 km radius of Madurai
                </Typography>

                {/* DESCRIPTION */}
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: 14,
                    mb: 2,
                  }}
                >
                  Fast, fresh, and reliable delivery within city limits.
                  Currently serving customers within 10 km of Madurai city centre.
                  Enter your pincode at checkout to confirm delivery availability.
                </Typography>

                {/* LOCATION */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "right",
                      gap: 1,
                      px: 2,
                      py: 0.8,
                      borderRadius: 999,
                      bgcolor: "#fff3ec",
                      border: "px solid #ffd2b8",
                    }}
                  >
                    <LocationOnIcon sx={{ color: "#88391d", fontSize: 18 }} />

                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: "#5a2a1a",
                      }}
                    >
                      Madurai, Tamil Nadu
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
          </Box> 
        </Container>

      {/* WHATSAPP FLOAT */}
      <Button
        href="https://wa.me/91XXXXXXXXXX"
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          borderRadius: "50%",
          width: 60,
          height: 60,
          bgcolor: "#25d366",
          color: "#fff",
          fontSize: 24,
        }}
      >
        💬
      </Button>
    </Box>
  );
}