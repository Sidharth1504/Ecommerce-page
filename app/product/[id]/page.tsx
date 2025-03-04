"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import {
  Heart,
  ShoppingCart,
  Share2,
  ChevronLeft,
  Star,
  Truck,
  ShieldCheck,
  RefreshCw,
  Minus,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RecommendedProducts } from "@/components/RecommendedProducts"
import { useCartStore, useWishlistStore } from "@/lib/store"
import { formatPrice } from "@/lib/utils"
import { useToast } from "@/components/use-toast"
import type { Product } from "@/lib/store"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  const { addItem: addToCart } = useCartStore()
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlistStore()

  // Fetch product data
  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true)
      try {
        const res = await fetch("/api/products")
        const products = await res.json()

        const productId = Number(params.id)
        const foundProduct = products.find((p: Product) => p.id === productId)

        if (foundProduct) {
          setProduct(foundProduct)

          // Get related products (same category)
          const related = products
            .filter((p: Product) => p.id !== productId && p.category === foundProduct.category)
            .slice(0, 4)

          setRelatedProducts(related)
        } else {
          // Product not found, redirect to home
          router.push("/")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.id, router])

  const handleAddToCart = () => {
    if (!product) return

    // Add product to cart multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }

    toast({
      title: "Added to cart",
      description: `${product.name} (${quantity}) has been added to your cart.`,
      duration: 2000,
    })
  }

  const handleWishlist = () => {
    if (!product) return

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
        duration: 2000,
      })
    } else {
      addToWishlist(product)
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
        duration: 2000,
      })
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name || "Check out this product",
        text: product?.description || "I found this amazing product",
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard",
        duration: 2000,
      })
    }
  }

  if (isLoading || !product) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-pulse space-y-8 w-full max-w-4xl">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 h-96 bg-muted rounded-xl" />
            <div className="w-full md:w-1/2 space-y-4">
              <div className="h-8 bg-muted rounded-md w-3/4" />
              <div className="h-6 bg-muted rounded-md w-1/4" />
              <div className="h-4 bg-muted rounded-md w-full" />
              <div className="h-4 bg-muted rounded-md w-full" />
              <div className="h-4 bg-muted rounded-md w-3/4" />
              <div className="h-12 bg-muted rounded-md w-full mt-8" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const discountedPrice = product.discountPercentage
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6 flex items-center" onClick={() => router.back()}>
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-xl overflow-hidden border">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg?height=600&width=600"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.discountPercentage && product.discountPercentage > 0 && (
              <Badge className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground">
                {product.discountPercentage}% OFF
              </Badge>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                    selectedImage === index ? "border-primary" : "border-transparent hover:border-muted-foreground/30"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg?height=80&width=80"}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>

            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-2">({product.rating})</span>
              </div>

              {product.stock && (
                <Badge variant="outline" className="text-xs">
                  {product.stock < 10 ? `Only ${product.stock} left in stock` : "In Stock"}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-baseline space-x-3">
            {product.discountPercentage && product.discountPercentage > 0 ? (
              <>
                <span className="text-2xl font-bold text-primary">{formatPrice(discountedPrice)}</span>
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
            )}
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          {product.category && (
            <div>
              <span className="text-sm text-muted-foreground">Category: </span>
              <Badge variant="secondary" className="ml-2">
                {product.category}
              </Badge>
            </div>
          )}

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-4">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-none"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                  <span className="sr-only">Decrease quantity</span>
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-none"
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  disabled={quantity >= (product.stock || 10)}
                >
                  <Plus className="h-3 w-3" />
                  <span className="sr-only">Increase quantity</span>
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button className="flex-1" size="lg" onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>

              <Button
                variant="outline"
                size="lg"
                className={`flex-1 ${isInWishlist(product.id) ? "bg-primary/10 text-primary border-primary/20" : ""}`}
                onClick={handleWishlist}
              >
                <Heart className={`h-4 w-4 mr-2 ${isInWishlist(product.id) ? "fill-primary" : ""}`} />
                {isInWishlist(product.id) ? "In Wishlist" : "Add to Wishlist"}
              </Button>

              <Button variant="outline" size="icon" className="hidden sm:flex h-11 w-11" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share product</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center space-x-2 text-sm">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span>Free shipping over $50</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              <span>2-year warranty</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <span>30-day returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <Tabs defaultValue="details" className="mb-16">
        <TabsList className="w-full max-w-md mx-auto">
          <TabsTrigger value="details" className="flex-1">
            Details
          </TabsTrigger>
          <TabsTrigger value="specifications" className="flex-1">
            Specifications
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex-1">
            Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p>{product.description}</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl
              nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl
              nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
            </p>
            <ul>
              <li>Premium quality materials</li>
              <li>Designed for comfort and durability</li>
              <li>Perfect for everyday use</li>
              <li>Backed by our satisfaction guarantee</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Dimensions</h3>
                <p className="text-sm text-muted-foreground">10 x 5 x 2 inches</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Weight</h3>
                <p className="text-sm text-muted-foreground">1.5 lbs</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Materials</h3>
                <p className="text-sm text-muted-foreground">Premium quality materials</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Warranty</h3>
                <p className="text-sm text-muted-foreground">2-year limited warranty</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Origin</h3>
                <p className="text-sm text-muted-foreground">Made in USA</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">SKU</h3>
                <p className="text-sm text-muted-foreground">PRD-{product.id.toString().padStart(6, "0")}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to review this product</p>
            <Button>Write a Review</Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && <RecommendedProducts products={relatedProducts} />}
    </div>
  )
}

