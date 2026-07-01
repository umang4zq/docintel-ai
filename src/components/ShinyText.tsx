"use client";

import { motion, useAnimationFrame } from "framer-motion";
import { useState } from "react";

interface ShinyTextProps {
  text: string;
  baseColor?: string;
  shineColor?: string;
  speed?: number; // in seconds
  className?: string;
}

export function ShinyText({
  text,
  baseColor = "#1D9E75",
  shineColor = "#ffffff",
  speed = 3,
  className = "",
}: ShinyTextProps) {
  const [pos, setPos] = useState(0);

  useAnimationFrame((time) => {
    // time is in ms. We want pos to loop from 0 to 1 over `speed` seconds.
    const progress = (time / (speed * 1000)) % 1;
    setPos(progress);
  });

  const gradientStr = `linear-gradient(100deg, ${baseColor} 0%, ${baseColor} ${(pos * 100) - 15}%, ${shineColor} ${pos * 100}%, ${baseColor} ${(pos * 100) + 15}%, ${baseColor} 100%)`;

  return (
    <motion.span
      className={className}
      style={{
        background: gradientStr,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
        display: "inline-block",
      }}
    >
      {text}
    </motion.span>
  );
}
