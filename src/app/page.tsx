"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

const banners = [
  "/img/banners/banners1.jpg",
  "/img/banners/banners2.png",
  "/img/banners/banners3.png",
];

export default function Home() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className={styles.container}>

      {/* RUNNING TEXT */}
      <div className={styles.ticker}>
        <p className={styles.marquee}>
        Freshly made chapathi daily | Free delivery above ₹199 | No preservatives
        </p>
      </div>

      {/* HERO */}
      <section className={styles.hero}>
        <img src={banners[current]} className={styles.heroImage} />

        <div className={styles.overlay}>
          {/* <h1 className={styles.title}>
            Fresh Chapathi, Ready in Seconds
          </h1> */}
          <p className={styles.subtitle}>
            Soft • Healthy • Homemade Taste
          </p>
          <button className={styles.primaryBtn}>
            Order Now
          </button>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className={styles.products}>
        <div className={styles.sectionWrapper}>
          <h2 className={styles.sectionTitle}>Our Products</h2>
          </div>

        <div className={styles.productGrid}>
          <div className={styles.card}>
            
            <img src="/img/products/chapthi1.jpeg" className={styles.productImg} />
            <h3>Chapathi</h3>
            <div className={styles.priceBox}>
              <span className={styles.oldPrice}>₹50</span>
              <span className={styles.newPrice}>₹40</span>
            </div>
            <button className={styles.primaryBtn}>Add to Cart</button>
          </div>

          <div className={styles.card}>
            <img src="/img/products/poori1.jpeg" className={styles.productImg} />
            <h3>Poori</h3>

            <div className={styles.priceBox}>
              <span className={styles.oldPrice}>₹55</span>
              <span className={styles.newPrice}>₹45</span>
            </div>

            <button className={styles.primaryBtn}>Add to Cart</button>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className={styles.why}>
        <h2 className={styles.sectionTitle}>Why Choose Us</h2>

        <div className={styles.whyGrid}>
          <p>✅ No Preservatives</p>
          <p>✅ Homemade Taste</p>
          <p>✅ Ready in 30 Seconds</p>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className={styles.sectionTitle}>Order Now</h2>
        <p>Contact us on WhatsApp</p>
        <button className={styles.whatsappBtn}>
          Chat on WhatsApp
        </button>
      </section>

    </main>
  );
}