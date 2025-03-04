"use client"

import { useState, useEffect, useCallback } from "react"
import { useDebouncedCallback } from 'use-debounce'
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useFilterStore } from "@/lib/store"
import { formatPrice } from "@/lib/utils"
import { Search, SlidersHorizontal, X } from "lucide-react"

export function FilterSidebar() {
  const { search, priceRange, categories, sortBy, setSearch, setPriceRange, toggleCategory, setSortBy, resetFilters } =
    useFilterStore()

  const [localSearch, setLocalSearch] = useState(search)
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Debounce store update to prevent excessive re-renders
  const debouncedSetSearch = useDebouncedCallback(
    (value) => {
      setSearch(value)
    },
    300
  )

  // Update local search when store changes
  useEffect(() => {
    setLocalSearch(search)
  }, [search])

  // Update local price range when store changes
  useEffect(() => {
    setLocalPriceRange(priceRange)
  }, [priceRange])

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalSearch(value)
    debouncedSetSearch(value)
  }, [debouncedSetSearch])

  // Apply price range after slider interaction ends
  const handlePriceRangeChange = (value: number[]) => {
    setLocalPriceRange([value[0], value[1]])
  }

  const handlePriceRangeCommit = () => {
    setPriceRange(localPriceRange)
  }

  const availableCategories = ["Clothing", "Electronics", "Home", "Beauty", "Sports"]

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low-high", label: "Price: Low to High" },
    { value: "price-high-low", label: "Price: High to Low" },
    { value: "rating", label: "Top Rated" },
  ]

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen)
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search Input */}
      <div>
        <h3 className="text-sm font-medium mb-2">Search</h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8"
            value={localSearch}
            onChange={handleSearchChange}
          />
          {localSearch && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-7 w-7"
              onClick={() => {
                setLocalSearch("")
                setSearch("")
              }}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
      </div>

      {/* Accordion for Filters */}
      <Accordion type="single" collapsible defaultValue="categories">
        <AccordionItem value="categories">
          <AccordionTrigger className="text-sm font-medium">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {availableCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={categories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-medium">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider
                min={0}
                max={1000}
                step={10}
                value={[localPriceRange[0], localPriceRange[1]]}
                onValueChange={handlePriceRangeChange}
                onValueCommit={handlePriceRangeCommit}
                className="py-4"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">{formatPrice(localPriceRange[0])}</span>
                <span className="text-sm">{formatPrice(localPriceRange[1])}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Sort By */}
        <AccordionItem value="sort">
          <AccordionTrigger className="text-sm font-medium">Sort By</AccordionTrigger>
          <AccordionContent>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button variant="outline" className="w-full" onClick={resetFilters}>
        Reset Filters
      </Button>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 shrink-0">
        <div className="sticky top-24 pr-4">
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4 flex justify-between items-center">
        <Button variant="outline" size="sm" className="flex items-center" onClick={toggleMobileFilter}>
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters & Sort
        </Button>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <>
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" onClick={toggleMobileFilter} />
          <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button variant="ghost" size="icon" onClick={toggleMobileFilter}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <FilterContent />
          </div>
        </>
      )}
    </>
  )
}
