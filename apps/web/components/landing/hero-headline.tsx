"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ROLES = [
  "Executive Assistants",
  "Operations Managers",
  "Virtual Assistants",
  "Operations Assistants",
];

export function HeroHeadline() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % ROLES.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <h1 className="text-balance text-5xl font-extrabold tracking-tight text-navy-900 sm:text-6xl md:text-7xl">
      The AI copilot for
      <br />
      <span className="relative inline-flex h-[1.1em] items-center justify-center align-middle">
        <AnimatePresence mode="wait">
          <motion.span
            key={ROLES[i]}
            initial={{ y: 22, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -22, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent"
          >
            {ROLES[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </h1>
  );
}
