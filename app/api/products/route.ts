import { NextResponse } from "next/server"

const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    images: ["/headphones.jpg", "/headphones.jpg"],
    price: 199.99,
    rating: 4.8,
    description:
      "Experience crystal-clear sound with our premium wireless headphones featuring nois e cancellation technology.",
    category: "Electronics",
    discountPercentage: 15,
    stock: 23,
    tags: ["wireless", "audio", "premium"],
  },
  {
    id: 2,
    name: "Designer Leather Jacket",
    images: ["/leather_jacket.jpg", "/leather_jacket.jpg"],
    price: 349.99,
    rating: 4.6,
    description:
      "Elevate your style with this premium leather jacket, crafted with the finest materials for lasting comfort.",
    category: "Clothing",
    discountPercentage: 0,
    stock: 12,
    tags: ["fashion", "outerwear", "leather"],
  },
  {
    id: 3,
    name: "Smart Home Assistant",
    images: ["/home_assistant.jpg", "/home_assistant.jpg"],
    price: 129.99,
    rating: 4.5,
    description: "Control your home with voice commands using our advanced smart home assistant with AI technology.",
    category: "Electronics",
    discountPercentage: 10,
    stock: 45,
    tags: ["smart home", "AI", "voice control"],
  },
  {
    id: 4,
    name: "Luxury Scented Candle Set",
    images: ["/scented_candles.jpg", "/scented_candles.jpg"],
    price: 49.99,
    rating: 4.7,
    description: "Transform your space with our collection of premium scented candles, made with natural soy wax.",
    category: "Home",
    discountPercentage: 0,
    stock: 32,
    tags: ["home decor", "candles", "scented"],
  },
  {
    id: 5,
    name: "Professional Skincare Kit",
    images: ["/skincare_Set.jpg", "/skincare_Set.jpg"],
    price: 89.99,
    rating: 4.9,
    description: "Achieve radiant skin with our professional-grade skincare kit featuring natural ingredients.",
    category: "Beauty",
    discountPercentage: 20,
    stock: 18,
    tags: ["skincare", "beauty", "natural"],
  },
  {
    id: 6,
    name: "Ultra-Light Running Shoes",
    images: ["/shoes.jpg", "/shoes.jpg"],
    price: 129.99,
    rating: 4.6,
    description: "Engineered for performance, these ultra-light running shoes provide superior comfort and support.",
    category: "Sports",
    discountPercentage: 0,
    stock: 27,
    tags: ["running", "shoes", "athletic"],
  },
]

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return NextResponse.json(products)
}

