"use client"
import React from "react";
import { motion } from "framer-motion";


export const SubHeading = ({
    as: Tag = "h1",
    children,
}: {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    children: React.ReactNode;
}) => {
    return (<motion.div
    initial={{ opacity: 0, filter: "blur(10px)", y:10}}
    whileInView={{ opacity: 1, filter: "blur(0px)", y: 0}}
    transition={{ delay: 0.3, ease: "easeInOut"}}
    viewport={{ once: true}}
     className="">
        {children}
    </motion.div>
    )
}