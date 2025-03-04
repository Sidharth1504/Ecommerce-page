"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"

const categories = [
  {
    id: 1,
    name: "Clothing",
    description: "Discover the latest fashion trends and styles",
    image: "/clothing.jpg",
    link: "/categories/clothing",
    color: "bg-rose-500",
    count: 24,
  },
  {
    id: 2,
    name: "Electronics",
    description: "Cutting-edge technology and gadgets",
    image: "/electronics2.jpg",
    link: "/categories/electronics",
    color: "bg-blue-500",
    count: 18,
  },
  {
    id: 3,
    name: "Home",
    description: "Transform your space with our curated collection",
    image: "/home_stuff.jpg",
    link: "/categories/home",
    color: "bg-amber-500",
    count: 15,
  },
  {
    id: 4,
    name: "Beauty",
    description: "Premium skincare and beauty products",
    image: "/skin.jpg",
    link: "/categories/beauty",
    color: "bg-purple-500",
    count: 12,
  },
  {
    id: 5,
    name: "Sports",
    description: "Equipment and apparel for every activity",
    image: "/sport.jpg",
    link: "/categories/sports",
    color: "bg-green-500",
    count: 20,
  },
]

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Shop by Category</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our wide range of products across different categories to find exactly what you're looking for.
        </p>
      </div>

      <div className="space-y-16">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
          >
            <div className={`relative rounded-xl overflow-hidden aspect-[4/3] ${index % 2 === 1 ? "md:order-2" : ""}`}>
              <div className={`absolute inset-0 ${category.color} opacity-20`} />
              <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
            </div>

            <div className={`flex flex-col justify-center ${index % 2 === 1 ? "md:order-1" : ""}`}>
              <h2 className="text-3xl font-bold mb-4">{category.name}</h2>
              <p className="text-muted-foreground mb-6">{category.description}</p>
              <p className="text-sm mb-6">{category.count} products</p>
              <Link href={category.link} className="inline-flex items-center text-primary font-medium hover:underline">
                Explore {category.name}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

