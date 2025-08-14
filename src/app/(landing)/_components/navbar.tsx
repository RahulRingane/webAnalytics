"use client";

import AnimationContainer from "@/components/globals/animation-container";
import Wrapper from "@/components/globals/wrapper";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DropIn from "@/components/globals/Animation-variants";


const Navbar = () => {
  return (
    <header className="fixed top-0 z-50 absolute inset-x-0 w-full">
      <DropIn delay={0}>
      <div
        className={cn(
          "flex bg-transparent backdrop-blur-lg self-start items-center justify-between py-4 md: py-6 rounded-2xl border border-[#1E1E1E] relative z-[50] w-full md: max-w-6xl mx-auto mt-2",
        )}
      >
        <Wrapper className="flex justify-between items-center lg:px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 200, // controls the speed
              damping: 20,    // lower value = more bounce
              duration: 0.3   // optional, usually spring ignores duration
            }}
          >
            <Link href="/" className="flex items-center gap-2">
              <Image src="/fina-logo.png" width={28} height={28} alt="Logo" />
              <span className="text-lg md:text-2xl font-bold tracking-tight text-[#f9fafb] md:block">
                Weblytics
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 200, // controls the speed
              damping: 10,    // lower value = more bounce
              duration: 0.4   // optional, usually spring ignores duration
            }}
          >
            <div className="flex items-center gap-x-4">
              <Link
                href="https://github.com/Mihir2423/analytics"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="flex items-center gap-2 bg-[#f9fafb] hover:bg-[#f9fafb]/90 px-8 py-1 rounded-md text-primary text-sm text-shadow-md font-medium h-10 cursor-pointer">
                  Login
                </button>
              </Link>
            </div>
          </motion.div>
        </Wrapper>
      </div>
      </DropIn>
    </header>
  );
};

export default Navbar;