"use client"

import { useState } from "react";
import { useWishlistStore, useCartStore } from "@/lib/store";
import { useToast } from "@/components/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, ShoppingCart } from "lucide-react";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();
  const { toast } = useToast();
  const [isClearing, setIsClearing] = useState(false);

  const handleAddToCart = (productId) => {
    const product = items.find((item) => item.id === productId);
    if (product) {
      addToCart(product);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
        duration: 2000,
      });
    }
  };

  const handleRemoveFromWishlist = (productId) => {
    removeItem(productId);
    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist.",
      duration: 2000,
    });
  };

  const handleClearWishlist = () => {
    setIsClearing(true);
    setTimeout(() => {
      clearWishlist();
      setIsClearing(false);
      toast({
        title: "Wishlist cleared",
        description: "All items have been removed from your wishlist.",
        duration: 2000,
      });
    }, 300);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>
      {items.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="p-4 shadow-md border">
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
                <div className="flex gap-2 mt-4">
                  <Button onClick={() => handleAddToCart(item.id)} variant="default">
                    <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                  </Button>
                  <Button onClick={() => handleRemoveFromWishlist(item.id)} variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" /> Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {items.length > 0 && (
        <div className="mt-6">
          <Button onClick={handleClearWishlist} variant="outline" disabled={isClearing}>
            {isClearing ? "Clearing..." : "Clear Wishlist"}
          </Button>
        </div>
      )}
    </div>
  );
}