"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Product {
  id: number
  name: string
  images: string[]
  price: number
  rating: number
  description: string
  category?: string
  discountPercentage?: number
  tags?: string[]
  stock?: number
}

interface CartItem {
  product: Product
  quantity: number
}

interface CartStore {
  items: { [key: number]: CartItem }
  addItem: (product: Product) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: {},
      addItem: (product) =>
        set((state) => {
          const current = state.items[product.id]
          return {
            items: {
              ...state.items,
              [product.id]: {
                product,
                quantity: current ? current.quantity + 1 : 1,
              },
            },
          }
        }),
      removeItem: (productId) =>
        set((state) => {
          const newItems = { ...state.items }
          delete newItems[productId]
          return { items: newItems }
        }),
      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            const newItems = { ...state.items }
            delete newItems[productId]
            return { items: newItems }
          }
          return {
            items: {
              ...state.items,
              [productId]: {
                ...state.items[productId],
                quantity,
              },
            },
          }
        }),
      clearCart: () => set({ items: {} }),
    }),
    {
      name: "cart-storage",
    },
  ),
)

interface WishlistStore {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: number) => void
  isInWishlist: (productId: number) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          if (state.items.some((item) => item.id === product.id)) {
            return state
          }
          return { items: [...state.items, product] }
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      isInWishlist: (productId) => get().items.some((item) => item.id === productId),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "wishlist-storage",
    },
  ),
)

interface FilterState {
  search: string
  priceRange: [number, number]
  categories: string[]
  sortBy: string
  setSearch: (search: string) => void
  setPriceRange: (range: [number, number]) => void
  toggleCategory: (category: string) => void
  setSortBy: (sort: string) => void
  resetFilters: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  search: "",
  priceRange: [0, 1000],
  categories: [],
  sortBy: "featured",
  setSearch: (search) => set({ search }),
  setPriceRange: (range) => set({ priceRange: range }),
  toggleCategory: (category) =>
    set((state) => {
      if (state.categories.includes(category)) {
        return {
          categories: state.categories.filter((c) => c !== category),
        }
      }
      return { categories: [...state.categories, category] }
    }),
  setSortBy: (sortBy) => set({ sortBy }),
  resetFilters: () =>
    set({
      search: "",
      priceRange: [0, 1000],
      categories: [],
      sortBy: "featured",
    }),
}))

