"use client";

import { motion } from "framer-motion";
import { useTabStore } from "@/store/store";

type Props = {
  tabs: { id: string; label: string }[];
};

export function AnimatedTabs({ tabs }: Props) {
  const { activeTab, setActiveTab } = useTabStore();

  return (
    <div className="flex space-x-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`${
            activeTab === tab.id ? "" : "hover:text-white/60"
          } relative rounded-[16px] px-3 py-1.5 text-sm font-medium text-white outline-sky-400 transition focus-visible:outline-2`}
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {activeTab === tab.id && (
            <motion.span
              layoutId="bubble"
              className="z-10 absolute inset-0 bg-[#ffffff15]"
              style={{ borderRadius: "10px" }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
}