"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ModeToggle } from "./mode-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Search, Menu, X, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/lib/store"
import CartDrawer from "./CartDrawer"

export default function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { items } = useCartStore()

  const cartItemsCount = Object.values(items).reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Categories", path: "/categories" },
    { name: "Wishlist", path: "/wishlist" },
  ]

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-200",
          isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-background",
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                  LuxeMarket
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === link.path ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-[200px] pl-8 rounded-full bg-muted"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Wishlist</span>
                </Button>
              </Link>

              <Button variant="ghost" size="icon" className="relative" onClick={toggleCart}>
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground"
                    variant="default"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
                <span className="sr-only">Cart</span>
              </Button>

              <Link href="/account">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>
              </Link>

              <ModeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative" onClick={toggleCart}>
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground"
                    variant="default"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>

              <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Toggle menu">
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background border-t">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-8 rounded-full bg-muted"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary p-2 rounded-md",
                      pathname === link.path ? "bg-muted text-primary" : "text-muted-foreground",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="/account"
                  className="text-sm font-medium transition-colors hover:text-primary p-2 rounded-md flex items-center space-x-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Account</span>
                </Link>
                <div className="p-2">
                  <ModeToggle />
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Scroll Progress Indicator */}
      <ScrollProgressIndicator />
    </>
  )
}

function ScrollProgressIndicator() {
  const [scrollWidth, setScrollWidth] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      const clientHeight = document.documentElement.clientHeight || window.innerHeight
      const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100
      setScrollWidth(scrollPercentage)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return <div className="scroll-indicator" style={{ width: `${scrollWidth}%` }} />
}

