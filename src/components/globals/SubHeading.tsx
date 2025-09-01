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
    return (<div
     className="">
        {children}
    </div>
    )
}