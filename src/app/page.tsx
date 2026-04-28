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

import { Box, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const banners: string[] = [
  "/img/herosection/hero1.png",
  "/img/herosection/hero2.png",
  "/img/herosection/hero3.png",
  "/img/herosection/hero4.png",
  "/img/herosection/hero5.png",
  "/img/herosection/hero6.png",
];

export default function HeroSection() {
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        backgroundColor: "#fff",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={banners[current]}
          alt="hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </AnimatePresence>
    </Box>
  );
}