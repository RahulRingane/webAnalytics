// components/DropIn.tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DropInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function DropIn({ children, delay = 0, className }: DropInProps) {
  return (
   <motion.div
  initial={{ opacity: 0, y: -10 }}
  whileInView={{ opacity: 1, y: 0 }} // instead of animate
  transition={{
    type: "spring",
    stiffness: 200,
    damping: 15,
    delay
  }}
  viewport={{ once: false, amount: 0.2 }} // triggers again when 20% visible
  className={className}
>
  {children}
</motion.div>

  );
}
