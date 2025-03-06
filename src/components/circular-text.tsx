"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function CircularText() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 120
    canvas.height = 120

    // Text to be displayed in a circle
    const text = "FANQUEUE • MUSIC • FESTIVAL • PRIORITY • "

    // Function to draw text in a circle
    const drawCircularText = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set text properties
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"

      // Calculate center of canvas
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Radius for the text circle
      const radius = 50

      // Draw the text in a circle
      ctx.save()
      ctx.translate(centerX, centerY)

      // Draw each character of the text
      const angleStep = (Math.PI * 2) / text.length
      for (let i = 0; i < text.length; i++) {
        const angle = i * angleStep

        ctx.save()
        ctx.rotate(angle)
        ctx.translate(0, -radius)
        ctx.rotate(Math.PI / 2)
        ctx.fillText(text[i], 0, 0)
        ctx.restore()
      }

      ctx.restore()

      // Draw a small circle in the center
      ctx.beginPath()
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2)
      ctx.fillStyle = "white"
      ctx.fill()
    }

    drawCircularText()

    // Rotate the canvas for animation
    let rotation = 0
    const animate = () => {
      rotation += 0.005
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate(rotation)
      ctx.translate(-canvas.width / 2, -canvas.height / 2)

      drawCircularText()

      ctx.restore()

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <canvas ref={canvasRef} width="120" height="120" />
    </motion.div>
  )
}

