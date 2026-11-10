"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

export default function PageTransition({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  if (pathname.startsWith("/admin")) {
    return children;
  }

  return (
    <motion.div
      key={pathname}
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.28, ease: "easeOut" }
      }
    >
      {children}
    </motion.div>
  );
}
