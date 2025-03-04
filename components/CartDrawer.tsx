"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/lib/store"
import { formatPrice } from "@/lib/utils"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem } = useCartStore()

  // Close cart drawer when pressing Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const cartItems = Object.values(items)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" onClick={onClose} />}

      {/* Cart Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-96 bg-background shadow-xl cart-drawer ${
          isOpen ? "open" : "closed"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Your Cart ({totalItems})
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 p-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mb-6 text-center">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Button onClick={onClose}>Continue Shopping</Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 p-4">
                <ul className="space-y-4">
                  {cartItems.map(({ product, quantity }) => (
                    <li key={product.id} className="flex space-x-4">
                      <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted">
                        <Image
                          src={product.images[0] || "/placeholder.svg?height=80&width=80"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">{product.name}</h3>
                        <p className="text-sm text-primary font-medium mt-1">{formatPrice(product.price)}</p>
                        <div className="flex items-center mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Decrease quantity</span>
                          </Button>
                          <span className="w-8 text-center text-sm">{quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Increase quantity</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 ml-2"
                            onClick={() => removeItem(product.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Remove item</span>
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Subtotal</span>
                    <span className="text-sm font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Shipping</span>
                    <span className="text-sm">Calculated at checkout</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-base font-medium">Total</span>
                    <span className="text-base font-medium">{formatPrice(subtotal)}</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Link href="/checkout" onClick={onClose}>
                    <Button className="w-full">Checkout</Button>
                  </Link>
                  <Button variant="outline" className="w-full" onClick={onClose}>
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

