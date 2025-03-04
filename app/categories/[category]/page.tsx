"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ProductCard"
import { FilterSidebar } from "@/components/FilterSidebar"
import { useCartStore, useWishlistStore, useFilterStore } from "@/lib/store"
import type { Product } from "@/lib/store"

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { search, priceRange, categories, sortBy } = useFilterStore()
  const { addItem: addToCart } = useCartStore()
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore()

  const categoryName = params.category as string
  const formattedCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1)

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true)
      try {
        const res = await fetch("/api/products")
        const data = await res.json()

        // Filter products by category
        const categoryProducts = data.filter(
          (product: Product) => product.category && product.category.toLowerCase() === categoryName.toLowerCase(),
        )

        setProducts(categoryProducts)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [categoryName])

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(search.toLowerCase()))
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

      return matchesSearch && matchesPrice
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low-high":
          return a.price - b.price
        case "price-high-low":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        default:
          return 0 // featured
      }
    })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" className="mr-4" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">{formattedCategoryName}</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <FilterSidebar />

        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
              <Button onClick={() => useFilterStore.getState().resetFilters()}>Reset Filters</Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Showing {filteredProducts.length} products in {formattedCategoryName}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: Math.min(index * 0.1, 0.8),
                    }}
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}

