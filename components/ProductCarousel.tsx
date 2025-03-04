"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CarouselProps {
  images: string[]
  altText: string
  autoplay?: boolean
  interval?: number
}

export const Carousel: React.FC<CarouselProps> = ({ images, altText, autoplay = false, interval = 5000 }) => {
  const [current, setCurrent] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const nextImage = () => setCurrent((prev) => (prev + 1) % images.length)
  const prevImage = () => setCurrent((prev) => (prev - 1 + images.length) % images.length)

  // Handle autoplay
  useEffect(() => {
    if (!autoplay) return

    const timer = setInterval(() => {
      nextImage()
    }, interval)

    return () => clearInterval(timer)
  }, [autoplay, interval]) // Removed nextImage from dependencies

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextImage()
    } else if (isRightSwipe) {
      prevImage()
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  // Placeholder images for demo
  const processedImages = images.length > 0 ? images : ["/placeholder.svg"];
  return (
    <div
      className="relative w-full h-full product-image"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {processedImages.map((src, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-500",
            index === current ? "opacity-100 z-10" : "opacity-0 z-0",
          )}
        >
          {isLoading && <div className="absolute inset-0 bg-muted animate-pulse" />}
          <Image
            src={src || "/placeholder.svg"}
            alt={`${altText} - Image ${index + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onLoad={() => setIsLoading(false)}
            priority={index === 0}
          />
        </div>
      ))}

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
            aria-label="Previous Image"
            className="absolute top-1/2 left-2 z-20 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
            aria-label="Next Image"
            className="absolute top-1/2 right-2 z-20 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrent(index)
                }}
                aria-label={`Go to image ${index + 1}`}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  index === current ? "bg-primary w-3" : "bg-background/80 backdrop-blur-sm",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

