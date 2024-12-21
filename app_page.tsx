"use client"

import { useEffect, useState, useRef } from "react"
import Calculator from "../calculator"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
}

function BackgroundParticle({ particle, isDarkMode }: { particle: Particle; isDarkMode: boolean }) {
  return (
    <div
      className={`absolute rounded-full ${
        isDarkMode ? "bg-blue-500" : "bg-purple-500"
      } opacity-50 transition-colors duration-500`}
      style={{
        top: `${particle.y}px`,
        left: `${particle.x}px`,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
      }}
    />
  )
}

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const mouseDirection = useRef({ x: 0, y: 0 })
  const animationFrameId = useRef<number>()

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDarkMode(prefersDark)

    // Increase the number of particles to 200
    const newParticles: Particle[] = Array.from({ length: 200 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1, // Slightly reduce the max size for better performance
      speedX: 0,
      speedY: 0,
    }))
    setParticles(newParticles)

    let lastMouseX = 0
    let lastMouseY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseDirection.current = {
        x: e.clientX - lastMouseX,
        y: e.clientY - lastMouseY,
      }
      lastMouseX = e.clientX
      lastMouseY = e.clientY
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [])

  useEffect(() => {
    const animateParticles = () => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
          // Gradually adjust particle speed towards mouse direction
          particle.speedX += (mouseDirection.current.x * 0.03 - particle.speedX) * 0.1
          particle.speedY += (mouseDirection.current.y * 0.03 - particle.speedY) * 0.1

          // Apply some randomness to make the movement more natural
          particle.speedX += (Math.random() - 0.5) * 0.2
          particle.speedY += (Math.random() - 0.5) * 0.2

          // Update particle position
          let newX = particle.x + particle.speedX
          let newY = particle.y + particle.speedY

          // Wrap particles around the screen
          if (newX < 0) newX = window.innerWidth
          if (newX > window.innerWidth) newX = 0
          if (newY < 0) newY = window.innerHeight
          if (newY > window.innerHeight) newY = 0

          return {
            ...particle,
            x: newX,
            y: newY,
          }
        })
      )

      animationFrameId.current = requestAnimationFrame(animateParticles)
    }

    animateParticles()

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden">
      {particles.map((particle, index) => (
        <BackgroundParticle key={index} particle={particle} isDarkMode={isDarkMode} />
      ))}
      <Calculator onThemeChange={setIsDarkMode} />
    </main>
  )
}

