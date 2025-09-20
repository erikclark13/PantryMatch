"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { PantryItem } from "./types"
import { getUserPantryItems } from "./mock-data"
import { useAuth } from "./auth-context"

interface PantryContextType {
  items: PantryItem[]
  addItem: (item: Omit<PantryItem, "id" | "lastUpdated">) => void
  updateItem: (id: string, updates: Partial<PantryItem>) => void
  removeItem: (id: string) => void
  getExpiringItems: (days?: number) => PantryItem[]
  getItemsByLocation: (location: PantryItem["location"]) => PantryItem[]
  searchItems: (query: string) => PantryItem[]
  loading: boolean
}

const PantryContext = createContext<PantryContextType | undefined>(undefined)

export function PantryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<PantryItem[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user?.householdId) {
      // Load pantry items for the user's household
      const householdItems = getUserPantryItems(user.householdId)
      setItems(householdItems)
    } else {
      setItems([])
    }
    setLoading(false)
  }, [user])

  const addItem = (newItem: Omit<PantryItem, "id" | "lastUpdated">) => {
    const item: PantryItem = {
      ...newItem,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString(),
      addedBy: user?.id || "unknown",
    }
    setItems((prev) => [...prev, item])
  }

  const updateItem = (id: string, updates: Partial<PantryItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates, lastUpdated: new Date().toISOString() } : item)),
    )
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const getExpiringItems = (days = 3) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() + days)

    return items.filter((item) => {
      const expiryDate = new Date(item.expiryDate)
      return expiryDate <= cutoffDate
    })
  }

  const getItemsByLocation = (location: PantryItem["location"]) => {
    return items.filter((item) => item.location === location)
  }

  const searchItems = (query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(lowercaseQuery) || item.category.toLowerCase().includes(lowercaseQuery),
    )
  }

  return (
    <PantryContext.Provider
      value={{
        items,
        addItem,
        updateItem,
        removeItem,
        getExpiringItems,
        getItemsByLocation,
        searchItems,
        loading,
      }}
    >
      {children}
    </PantryContext.Provider>
  )
}

export function usePantry() {
  const context = useContext(PantryContext)
  if (context === undefined) {
    throw new Error("usePantry must be used within a PantryProvider")
  }
  return context
}
