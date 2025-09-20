"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { UserProfile } from "./types"

interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database
const mockUsers = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    password: "password123", // In real app, this would be hashed
    avatar: "/woman-profile.png",
    householdId: "household-1",
    preferences: {
      dietaryRestrictions: ["vegetarian"],
      allergies: ["nuts"],
      cuisinePreferences: ["italian", "mediterranean", "asian"],
      spiceLevel: "medium" as const,
      cookingSkill: "intermediate" as const,
      maxCookTime: 45,
      nutritionalGoals: ["high-protein", "low-sodium"],
    },
    stats: {
      recipesCooked: 47,
      wasteReduced: 23.5,
      favoriteRecipes: 12,
      cookingStreak: 5,
      totalXP: 2450,
      level: 8,
      achievements: ["waste-warrior", "recipe-explorer", "cooking-streak"],
    },
  },
  {
    id: "2",
    name: "Demo User",
    email: "demo@example.com",
    password: "demo123",
    avatar: "/diverse-person-profiles.png",
    householdId: "household-2",
    preferences: {
      dietaryRestrictions: [],
      allergies: [],
      cuisinePreferences: ["american", "mexican", "italian"],
      spiceLevel: "mild" as const,
      cookingSkill: "beginner" as const,
      maxCookTime: 30,
      nutritionalGoals: ["balanced"],
    },
    stats: {
      recipesCooked: 12,
      wasteReduced: 8.2,
      favoriteRecipes: 5,
      cookingStreak: 2,
      totalXP: 650,
      level: 3,
      achievements: ["first-recipe"],
    },
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("pantry-match-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const userProfile: UserProfile = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        avatar: foundUser.avatar,
        householdId: foundUser.householdId,
        preferences: foundUser.preferences,
        stats: foundUser.stats,
      }

      setUser(userProfile)
      localStorage.setItem("pantry-match-user", JSON.stringify(userProfile))
      setLoading(false)
      return true
    }

    setLoading(false)
    return false
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email)
    if (existingUser) {
      setLoading(false)
      return false
    }

    // Create new user
    const newUser: UserProfile = {
      id: Date.now().toString(),
      name,
      email,
      avatar: "/diverse-person-profiles.png",
      householdId: `household-${Date.now()}`,
      preferences: {
        dietaryRestrictions: [],
        allergies: [],
        cuisinePreferences: [],
        spiceLevel: "medium",
        cookingSkill: "beginner",
        maxCookTime: 30,
        nutritionalGoals: [],
      },
      stats: {
        recipesCooked: 0,
        wasteReduced: 0,
        favoriteRecipes: 0,
        cookingStreak: 0,
        totalXP: 0,
        level: 1,
        achievements: [],
      },
    }

    // Add to mock database
    mockUsers.push({
      ...newUser,
      password,
    } as any)

    setUser(newUser)
    localStorage.setItem("pantry-match-user", JSON.stringify(newUser))
    setLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("pantry-match-user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
