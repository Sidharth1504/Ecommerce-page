"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

const slides = [
  {
    id: 1,
    title: "Summer Collection",
    subtitle: "Discover the latest trends for the season",
    cta: "Shop Now",
    image: "/summer.jpg",
    link: "/shop",
    color: "from-pink-500 to-orange-500",
  },
  {
    id: 2,
    title: "Premium Electronics",
    subtitle: "Cutting-edge technology at your fingertips",
    cta: "Explore",
    image: "/electronics.jpg",
    link: "/categories/electronics",
    color: "from-blue-500 to-purple-500",
  },
  {
    id: 3,
    title: "Home Essentials",
    subtitle: "Transform your space with our curated collection",
    cta: "Discover",
    image: "/home.jpg",
    link: "/categories/home",
    color: "from-green-500 to-teal-500",
  },
]

export function HeroSection() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden">
      <AnimatePresence mode="wait">
        {slides.map(
          (slide, index) =>
            index === current && (
              <motion.div
                key={slide.id}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r bg-opacity-70 dark:bg-opacity-80 z-10" />
                <Image
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r dark:from-background/90 dark:to-background/60 from-background/80 to-transparent z-20" />

                <div className="relative h-full container mx-auto px-4 z-30 flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="max-w-xl"
                  >
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                      <span className={`bg-clip-text text-transparent bg-gradient-to-r ${slide.color}`}>
                        {slide.title}
                      </span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground mb-6">{slide.subtitle}</p>
                    <Link href={slide.link}>
                      <Button size="lg" className="rounded-full group">
                        {slide.cta}
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ),
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-all ${index === current ? "bg-primary w-6" : "bg-primary/30"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

