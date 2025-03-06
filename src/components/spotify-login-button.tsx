"use client"

import { Button } from "@/components/ui/button"
import { Music } from "lucide-react"

interface SpotifyLoginButtonProps {
  size?: "default" | "sm" | "lg"
}

export function SpotifyLoginButton({ size = "default" }: SpotifyLoginButtonProps) {
  return (
    <Button className="bg-[#1DB954] hover:bg-[#1DB954]/90 text-white w-full sm:w-auto rounded-none px-8" size={size}>
      <Music className="mr-2 h-4 w-4" />
      Connect with Spotify
    </Button>
  )
}

