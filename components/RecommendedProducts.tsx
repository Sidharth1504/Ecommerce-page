"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ProductCard"
import type { Product } from "@/lib/store"
import { useCartStore, useWishlistStore } from "@/lib/store"

interface RecommendedProductsProps {
  products: Product[]
}

export function RecommendedProducts({ products }: RecommendedProductsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { addItem: addToCart } = useCartStore()
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore()

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const scrollAmount = container.clientWidth * 0.8

    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  if (products.length === 0) return null

  return (
    <section className="mt-16 py-8 border-t">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Recommended For You</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={() => scroll("left")} aria-label="Scroll left">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scroll("right")} aria-label="Scroll right">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide snap-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            className="min-w-[280px] snap-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <ProductCard
              product={product}
              onAddToCart={() => addToCart(product)}
              onAddToWishlist={() => addToWishlist(product)}
              isInWishlist={isInWishlist(product.id)}
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

