"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, ShoppingCart, Star, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Carousel } from "@/components/ProductCarousel"
import type { Product } from "@/lib/store"
import { formatPrice } from "@/lib/utils"
import { useToast } from "@/components/use-toast"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onAddToWishlist: (product: Product) => void
  isInWishlist: boolean
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onAddToWishlist, isInWishlist }) => {
  const [isHovered, setIsHovered] = useState(false)
  const { toast } = useToast()

  const handleAddToCart = () => {
    onAddToCart(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 2000,
    })
  }

  const handleAddToWishlist = () => {
    onAddToWishlist(product)
    if (!isInWishlist) {
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
        duration: 2000,
      })
    }
  }

  return (
    <div
      className="product-card group relative bg-card rounded-xl overflow-hidden border shadow-sm hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
     
     {product.discountPercentage > 0 && (
      <Badge className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground">
        {product.discountPercentage}% OFF
      </Badge>
    )}


      <button
        onClick={handleAddToWishlist}
        className={`absolute top-2 right-2 z-10 p-1.5 rounded-full bg-background/80 backdrop-blur-sm shadow-sm wishlist-heart ${
          isInWishlist ? "active" : ""
        }`}
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`h-4 w-4 ${isInWishlist ? "fill-primary text-primary" : ""}`} />
      </button>

      <div className="product-image-container h-48 sm:h-56 relative">
        <Carousel images={product.images} altText={product.name} />

        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Link href={`/product/${product.id}`}>
            <Button variant="secondary" size="sm" className="mr-2">
              <Eye className="h-4 w-4 mr-1" />
              Quick View
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({product.rating})</span>
          </div>
          {product.stock && product.stock < 10 && (
            <Badge variant="outline" className="text-xs">
              Only {product.stock} left
            </Badge>
          )}
        </div>

        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium line-clamp-1 hover:text-primary transition-colors">{product.name}</h3>
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-2 h-10 mt-1">{product.description}</p>

        <div className="mt-3 flex items-center justify-between">
          <div>
            {product.discountPercentage && product.discountPercentage > 0 ? (
              <div className="flex items-center">
                <span className="text-primary font-semibold">
                  {formatPrice(product.price * (1 - product.discountPercentage / 100))}
                </span>
                <span className="text-muted-foreground text-sm line-through ml-2">{formatPrice(product.price)}</span>
              </div>
            ) : (
              <span className="text-primary font-semibold">{formatPrice(product.price)}</span>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="flex items-center justify-center p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}

