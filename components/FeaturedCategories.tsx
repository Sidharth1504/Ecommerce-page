"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

const categories = [
  {
    id: 1,
    name: "Clothing",
    image: "/leather_jacket.jpg",
    link: "/categories/clothing",
    color: "bg-rose-500",
  },
  {
    id: 2,
    name: "Electronics",
    image: "/home_assistant.jpg",
    link: "/categories/electronics",
    color: "bg-blue-500",
  },
  {
    id: 3,
    name: "Home",
    image: "/scented_candles.jpg",
    link: "/categories/home",
    color: "bg-amber-500",
  },
  {
    id: 4,
    name: "Beauty",
    image: "/skincare_Set.jpg",
    link: "/categories/beauty",
    color: "bg-purple-500",
  },
  {
    id: 5,
    name: "Sports",
    image: "/headphones.jpg",
    link: "/categories/sports",
    color: "bg-green-500",
  },
]

export function FeaturedCategories() {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Shop by Category</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link href={category.link} className="block group">
              <div className="relative aspect-square rounded-xl overflow-hidden border shadow-sm group-hover:shadow-md transition-shadow">
                <div
                  className={`absolute inset-0 ${category.color} opacity-20 group-hover:opacity-30 transition-opacity`}
                />
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full">
                    <h3 className="text-sm font-medium">{category.name}</h3>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

