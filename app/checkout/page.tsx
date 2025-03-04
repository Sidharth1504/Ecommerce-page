"use client"

import { Checkbox } from "@/components/ui/checkbox"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, CreditCard, Truck, ShieldCheck, CheckCircle2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCartStore } from "@/lib/store"
import { formatPrice } from "@/lib/utils"
import { ShoppingCart, Minus, Plus } from "lucide-react" // Import missing icons

export default function CheckoutPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore()
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "shipping" | "payment" | "confirmation">("cart")

  const cartItems = Object.values(items)
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleContinue = () => {
    if (checkoutStep === "cart") setCheckoutStep("shipping")
    else if (checkoutStep === "shipping") setCheckoutStep("payment")
    else if (checkoutStep === "payment") {
      setCheckoutStep("confirmation")
      // In a real app, you would process the payment here
      clearCart()
    }
  }

  const handleBack = () => {
    if (checkoutStep === "shipping") setCheckoutStep("cart")
    else if (checkoutStep === "payment") setCheckoutStep("shipping")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back to home</span>
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      {/* Checkout Progress */}
      <div className="mb-8">
        <div className="flex justify-between max-w-2xl mx-auto">
          {["cart", "shipping", "payment", "confirmation"].map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  checkoutStep === step
                    ? "bg-primary text-primary-foreground"
                    : checkoutStep === "confirmation" ||
                        (checkoutStep === "payment" && step === "shipping") ||
                        (checkoutStep === "shipping" && step === "cart")
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              <span className="text-xs capitalize">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Cart Step */}
          {checkoutStep === "cart" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-card rounded-xl border p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Your Cart</h2>

                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                    <p className="text-muted-foreground mb-6">
                      Looks like you haven't added anything to your cart yet.
                    </p>
                    <Link href="/">
                      <Button>Continue Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map(({ product, quantity }) => (
                      <div key={product.id} className="flex items-center space-x-4 py-4 border-b">
                        <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={product.images[0] || "/placeholder.svg?height=80&width=80"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium truncate">{product.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatPrice(product.price)} × {quantity}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              disabled={quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                              <span className="sr-only">Decrease quantity</span>
                            </Button>
                            <span className="w-8 text-center text-sm">{quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Increase quantity</span>
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove item</span>
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="pt-4">
                      <Button onClick={handleContinue} className="w-full" disabled={cartItems.length === 0}>
                        Continue to Shipping
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Shipping Step */}
          {checkoutStep === "shipping" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-card rounded-xl border p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john.doe@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="(123) 456-7890" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="123 Main St" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="New York" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="NY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" placeholder="10001" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" placeholder="United States" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Shipping Method</h3>
                    <RadioGroup defaultValue="standard">
                      <div className="flex items-center space-x-2 border rounded-lg p-3">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="flex-1 cursor-pointer">
                          <div className="font-medium">Standard Shipping</div>
                          <div className="text-sm text-muted-foreground">3-5 business days</div>
                        </Label>
                        <div className="font-medium">{subtotal > 50 ? "Free" : formatPrice(shipping)}</div>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-3 mt-2">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="flex-1 cursor-pointer">
                          <div className="font-medium">Express Shipping</div>
                          <div className="text-sm text-muted-foreground">1-2 business days</div>
                        </Label>
                        <div className="font-medium">{formatPrice(19.99)}</div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button variant="outline" onClick={handleBack}>
                      Back to Cart
                    </Button>
                    <Button onClick={handleContinue} className="flex-1">
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Payment Step */}
          {checkoutStep === "payment" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-card rounded-xl border p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

                <Tabs defaultValue="card" className="mb-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="card">Credit Card</TabsTrigger>
                    <TabsTrigger value="paypal">PayPal</TabsTrigger>
                    <TabsTrigger value="apple">Apple Pay</TabsTrigger>
                  </TabsList>

                  <TabsContent value="card" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="paypal" className="py-4">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        You will be redirected to PayPal to complete your payment.
                      </p>
                      <Button>Continue with PayPal</Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="apple" className="py-4">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        You will be prompted to complete your payment with Apple Pay.
                      </p>
                      <Button>Continue with Apple Pay</Button>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="savePayment" />
                    <Label htmlFor="savePayment">Save payment information for future purchases</Label>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button variant="outline" onClick={handleBack}>
                      Back to Shipping
                    </Button>
                    <Button onClick={handleContinue} className="flex-1">
                      Complete Order
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Confirmation Step */}
          {checkoutStep === "confirmation" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-card rounded-xl border p-6 shadow-sm text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Order Confirmed!</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for your purchase. Your order has been confirmed and will be shipped soon.
                </p>
                <p className="font-medium mb-8">
                  Order #ORD-
                  {Math.floor(Math.random() * 10000)
                    .toString()
                    .padStart(4, "0")}
                </p>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-center">
                  <Link href="/">
                    <Button>Continue Shopping</Button>
                  </Link>
                  <Button variant="outline">View Order Status</Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{subtotal > 50 ? "Free" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                <span>Secure payment processing</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span>We accept all major credit cards</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

