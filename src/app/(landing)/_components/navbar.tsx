"use client";

import AnimationContainer from "@/components/globals/animation-container";
import Wrapper from "@/components/globals/wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, useTransform, useScroll, useMotionValueEvent, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Github } from "lucide-react";
import { useState } from "react";

const Navbar = () => {

  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Map scrollY to animation ranges
  const rawY = useTransform(scrollY, [0, 300], [0, 10]);
  const rawWidth = useTransform(scrollY, [0, 300], ["58%", "50%"]);

  // Smooth those values
  const y = useSpring(rawY, { stiffness: 150, damping: 20 });
  const width = useSpring(rawWidth, { stiffness: 150, damping: 20 });

  // Optional state toggle
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  return (
    <header className="top-0 z-50 absolute inset-x-0 w-full">
      <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              width,
              y,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut"
            }}
            className="fixed backdrop-blur bg-opacity inset-x-0 top-0 z-50 mx-auto flex max-w-7xl flex items-center justify-between rounded-full px-3 py-6">
            <Wrapper className="flex justify-between items-center lg:px-4">
        
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.svg" width={28} height={28} alt="Logo" />
              <span className="bg-clip-text bg-gradient-to-r from-white to-neutral-500 font-medium text-transparent text-xl">
                Analytics
              </span>
            </Link>


            <div className="flex items-center gap-x-4">
              <Link
                href="https://github.com/RahulRingane/webAnalytics"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  className="flex items-center gap-2 bg-gradient-to-b from-[#834747] via-[#a05151] to-[#893e3e] px-4 py-1 rounded-md text-white text-sm text-shadow-lg"
                >
                  <Github size={16} />
                  Star us on GitHub
                </button>
              </Link>
              </div>
        </Wrapper>
    </motion.nav>
    </header>
  );
};

export default Navbar;
