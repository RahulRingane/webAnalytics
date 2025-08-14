"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroImage() {
  return (
    <motion.div
      initial={{ x: -200, opacity: 0 }} // start off-screen left
      whileInView={{ x: 0, opacity: 1 }} // slide to normal position
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 8,
        mass: 0.8,
      }}
      viewport={{ once: false }}
      className="relative flex flex-col justify-start items-start w-full h-min overflow-visible"
    >
      <div className="relative w-full lg:w-[1024px]">
        {/* Overlay on large screens */}
        <div className="hidden lg:block right-0 z-50 absolute inset-y-0 bg-gradient-to-l from-black w-[60%] h-full pointer-events-none"></div>

        {/* Image (no absolute positioning) */}
        <Image
          src="/bg/hero-1.png"
          alt="hero"
          sizes="1000px"
          width={1024}
          height={1024}
          className="rounded-xl lg:rounded-2xl w-full h-auto object-contain"
        />
      </div>
    </motion.div>
  );
}
