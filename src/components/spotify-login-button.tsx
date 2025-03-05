"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Music } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SpotifyLoginButtonProps {
  size?: "default" | "lg";
}

export function SpotifyLoginButton({
  size = "default",
}: SpotifyLoginButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleLogin = async () => {
    // This would be replaced with your actual Spotify login logic
    console.log("Initiating Spotify login");
    // window.location.href = "/api/auth/spotify"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Button
        onClick={handleLogin}
        className={`relative overflow-hidden bg-[#1DB954] hover:bg-[#1AA34A] text-white font-medium ${
          size === "lg" ? "text-lg py-6 px-8" : ""
        }`}
      >
        <div className="relative z-10 flex items-center gap-2">
          <Music className="h-5 w-5" />
          Connect with Spotify
        </div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#1DB954]/80 to-[#1DB954]"
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "0%" : "-100%" }}
          transition={{ duration: 0.4 }}
        />
      </Button>
    </motion.div>
  );
}
