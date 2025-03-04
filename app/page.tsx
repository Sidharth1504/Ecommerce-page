"use client"

import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"
import { ProductCard } from "@/components/ProductCard"
import { FilterSidebar } from "@/components/FilterSidebar"
import { RecommendedProducts } from "@/components/RecommendedProducts"
import { HeroSection } from "@/components/HeroSection"
import { FeaturedCategories } from "@/components/FeaturedCategories"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFilterStore, useCartStore, useWishlistStore } from "@/lib/store"
import type { Product } from "@/lib/store"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { search, priceRange, categories, sortBy } = useFilterStore()
  const { addItem: addToCart } = useCartStore()
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore()

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true)
      try {
        // In a real app, you would fetch from your API with pagination
        // For this demo, we'll simulate a delay and generate more products
        const res = await fetch("/api/products")
        let data = await res.json()

        // Generate more products for demo purposes
        if (data.length < 20) {
          const extendedProducts = [...data]
          for (let i = 1; i < 5; i++) {
            data.forEach((product: Product) => {
              extendedProducts.push({
                ...product,
                id: product.id + data.length * i,
                name: `${product.name} ${i + 1}`,
                price: product.price * (0.8 + Math.random() * 0.4),
                category: ["Clothing", "Electronics", "Home", "Beauty", "Sports"][Math.floor(Math.random() * 5)],
                discountPercentage: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 5 : 0,
                stock: Math.floor(Math.random() * 50) + 1,
              })
            })
          }
          data = extendedProducts
        }

        setProducts(data)
        setHasMore(data.length > 10)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(search.toLowerCase()))
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesCategory = categories.length === 0 || (product.category && categories.includes(product.category))

      return matchesSearch && matchesPrice && matchesCategory
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

  // Load more products when scrolling to the bottom
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      setPage((prevPage) => prevPage + 1)
    }
  }, [inView, hasMore, isLoading])

  // Calculate which products to show based on current page
  const productsToShow = filteredProducts.slice(0, page * 8)

  // Get recommended products (in a real app, this would be based on user behavior)
  const recommendedProducts = products.filter((product) => product.rating >= 4.5).slice(0, 4)

  return (
    <div className="min-h-screen">
      <HeroSection />

      <div className="container mx-auto px-4 py-8">
        <FeaturedCategories />

        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              Explore Our Collection
            </span>
          </h2>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="w-full max-w-md mx-auto">
              <TabsTrigger value="all" className="flex-1">
                All Products
              </TabsTrigger>
              <TabsTrigger value="new" className="flex-1">
                New Arrivals
              </TabsTrigger>
              <TabsTrigger value="sale" className="flex-1">
                On Sale
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <FilterSidebar />

                <div className="flex-1">
                  {isLoading && products.length === 0 ? (
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
                        Showing {productsToShow.length} of {filteredProducts.length} products
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {productsToShow.map((product, index) => (
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

                      {hasMore && (
                        <div ref={ref} className="flex justify-center items-center py-8">
                          {inView && filteredProducts.length > productsToShow.length && (
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="new" className="mt-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">New Arrivals Coming Soon</h3>
                <p className="text-muted-foreground">Check back later for our latest products</p>
              </div>
            </TabsContent>

            <TabsContent value="sale" className="mt-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Sale Items Coming Soon</h3>
                <p className="text-muted-foreground">Check back later for our special offers</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <RecommendedProducts products={recommendedProducts} />
      </div>
    </div>
  )
}

