"use client";

import React, { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallIcon from "@mui/icons-material/Call";

const PHONE_NUMBER = "919894777825"; 
const CALL_NUMBER = "+919894777825";

const MESSAGE = "Hi I want to order";

const FloatingContact: React.FC = () => {
  const [hovered, setHovered] = useState<"wa" | "call" | null>(null);

  const whatsappLink = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
    MESSAGE
  )}`;

  const commonBtn = {
    display: "flex",
    alignItems: "center",
    borderRadius: "30px",
    overflow: "hidden",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    cursor: "pointer",
    height: 50, 
  };

  return (
    <Box
      sx={{
        position: "fixed",
        right: 20,
        bottom: 20,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        zIndex: 9999,
      }}
    >
      {/* WhatsApp */}
      <Box
        component="a"
        href={whatsappLink}
        target="_blank"
        onMouseEnter={() => setHovered("wa")}
        onMouseLeave={() => setHovered(null)}
        sx={{
          ...commonBtn,
          backgroundColor: "#25D366",
          width: hovered === "wa" ? 180 : 50 ,
          pl: 0.75,
        }}
      >
        <IconButton
          sx={{
            color: "#fff",
            width: 40,
            height: 40,
            p: 0, 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
           
          }}
        >
          <WhatsAppIcon sx={{ fontSize: 38 ,  transform: "translateX(-1px)"}} />
        </IconButton>

        <Typography
          sx={{
            color: "#fff",
            fontSize: "14px",
            fontWeight: 500,
            whiteSpace: "nowrap",
            ml: 1,
            opacity: hovered === "wa" ? 1 : 0,
            transform:
              hovered === "wa" ? "translateX(0)" : "translateX(-10px)",
            transition: "all 0.25s ease",
          }}
        >
          Chat on WhatsApp
        </Typography>
      </Box>

      {/* Call */}
      <Box
        component="a"
        href={`tel:${CALL_NUMBER}`}
        onMouseEnter={() => setHovered("call")}
        onMouseLeave={() => setHovered(null)}
        sx={{
          ...commonBtn,
          backgroundColor: "var(--primary-teal-mid)",
          width: hovered === "call" ? 150 : 50, 
          pl: 0.75,
        }}
      >
        <IconButton
          sx={{
            color: "#fff",
            width: 40,
            height: 40,
            p: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CallIcon sx={{ fontSize: 26 }} />
        </IconButton>

        <Typography
          sx={{
            color: "#fff",
            fontSize: "13px",
            fontWeight: 500,
            whiteSpace: "nowrap",
            ml: 1,
            opacity: hovered === "call" ? 1 : 0,
            transform:
              hovered === "call" ? "translateX(0)" : "translateX(-10px)",
            transition: "all 0.25s ease",
          }}
        >
          Call Us
        </Typography>
      </Box>
    </Box>
  );
};

export default FloatingContact;