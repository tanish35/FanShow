"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        onClick={toggleTheme}
        variant="outline"
        size="lg"
        className="relative overflow-hidden rounded-full h-14 w-14 p-0 border border-purple-200 bg-white"
      >
        <div className="relative z-10">
          {theme === "dark" ? (
            <Sun className="h-6 w-6 text-yellow-500" />
          ) : (
            <Moon className="h-6 w-6 text-purple-700" />
          )}
        </div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-br"
          initial={false}
          animate={{
            background:
              theme === "dark"
                ? "linear-gradient(to bottom right, rgba(250, 204, 21, 0.2), rgba(234, 179, 8, 0.1))"
                : "linear-gradient(to bottom right, rgba(124, 58, 237, 0.1), rgba(139, 92, 246, 0.05))",
          }}
          transition={{ duration: 0.5 }}
        />
      </Button>
    </motion.div>
  );
}
