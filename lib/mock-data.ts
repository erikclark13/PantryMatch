import type { PantryItem, Household } from "./types"

// Mock pantry data for different households
export const mockPantryItems: Record<string, PantryItem[]> = {
  "household-1": [
    {
      id: "1",
      name: "Chicken Breast",
      quantity: 2,
      unit: "lbs",
      location: "fridge",
      expiryDate: "2024-01-15",
      category: "protein",
      addedBy: "1",
      lastUpdated: "2024-01-10",
    },
    {
      id: "2",
      name: "Bell Peppers",
      quantity: 3,
      unit: "pieces",
      location: "fridge",
      expiryDate: "2024-01-12",
      category: "vegetables",
      addedBy: "1",
      lastUpdated: "2024-01-08",
    },
    {
      id: "3",
      name: "Pasta",
      quantity: 1,
      unit: "box",
      location: "pantry",
      expiryDate: "2025-06-01",
      category: "grains",
      addedBy: "1",
      lastUpdated: "2024-01-05",
    },
    {
      id: "4",
      name: "Greek Yogurt",
      quantity: 2,
      unit: "cups",
      location: "fridge",
      expiryDate: "2024-01-14",
      category: "dairy",
      addedBy: "1",
      lastUpdated: "2024-01-09",
    },
    {
      id: "5",
      name: "Olive Oil",
      quantity: 1,
      unit: "bottle",
      location: "pantry",
      expiryDate: "2025-12-01",
      category: "oils",
      addedBy: "1",
      lastUpdated: "2024-01-01",
    },
    {
      id: "6",
      name: "Garlic",
      quantity: 1,
      unit: "bulb",
      location: "pantry",
      expiryDate: "2024-02-01",
      category: "aromatics",
      addedBy: "1",
      lastUpdated: "2024-01-07",
    },
    {
      id: "7",
      name: "Tomatoes",
      quantity: 4,
      unit: "pieces",
      location: "fridge",
      expiryDate: "2024-01-13",
      category: "vegetables",
      addedBy: "1",
      lastUpdated: "2024-01-08",
    },
    {
      id: "8",
      name: "Mozzarella Cheese",
      quantity: 8,
      unit: "oz",
      location: "fridge",
      expiryDate: "2024-01-20",
      category: "dairy",
      addedBy: "1",
      lastUpdated: "2024-01-06",
    },
    {
      id: "9",
      name: "Basil",
      quantity: 1,
      unit: "bunch",
      location: "fridge",
      expiryDate: "2024-01-11",
      category: "herbs",
      addedBy: "1",
      lastUpdated: "2024-01-09",
    },
    {
      id: "10",
      name: "Rice",
      quantity: 2,
      unit: "cups",
      location: "pantry",
      expiryDate: "2025-08-01",
      category: "grains",
      addedBy: "1",
      lastUpdated: "2024-01-03",
    },
  ],
  "household-2": [
    {
      id: "11",
      name: "Ground Beef",
      quantity: 1,
      unit: "lb",
      location: "freezer",
      expiryDate: "2024-03-01",
      category: "protein",
      addedBy: "2",
      lastUpdated: "2024-01-08",
    },
    {
      id: "12",
      name: "Onions",
      quantity: 2,
      unit: "pieces",
      location: "pantry",
      expiryDate: "2024-01-25",
      category: "vegetables",
      addedBy: "2",
      lastUpdated: "2024-01-05",
    },
    {
      id: "13",
      name: "Cheddar Cheese",
      quantity: 6,
      unit: "oz",
      location: "fridge",
      expiryDate: "2024-01-18",
      category: "dairy",
      addedBy: "2",
      lastUpdated: "2024-01-07",
    },
    {
      id: "14",
      name: "Tortillas",
      quantity: 8,
      unit: "pieces",
      location: "pantry",
      expiryDate: "2024-01-22",
      category: "grains",
      addedBy: "2",
      lastUpdated: "2024-01-06",
    },
    {
      id: "15",
      name: "Black Beans",
      quantity: 2,
      unit: "cans",
      location: "pantry",
      expiryDate: "2025-12-01",
      category: "legumes",
      addedBy: "2",
      lastUpdated: "2024-01-04",
    },
  ],
}

// Mock household data
export const mockHouseholds: Household[] = [
  {
    id: "household-1",
    name: "The Johnson Family",
    members: [{ userId: "1", role: "admin" }],
    pantryId: "pantry-1",
    decisionMode: "unanimous",
    quorum: 1,
  },
  {
    id: "household-2",
    name: "Demo Household",
    members: [{ userId: "2", role: "admin" }],
    pantryId: "pantry-2",
    decisionMode: "majority",
    quorum: 1,
  },
]

// Mock cooking history and user activity
export const mockCookingHistory = {
  "1": [
    {
      recipeId: "lemon-herb-chicken",
      cookedAt: "2024-01-09",
      rating: 5,
      notes: "Absolutely delicious! The family loved it.",
    },
    {
      recipeId: "mediterranean-stuffed-peppers",
      cookedAt: "2024-01-07",
      rating: 4,
      notes: "Great flavors, will make again.",
    },
    {
      recipeId: "chicken-stir-fry",
      cookedAt: "2024-01-05",
      rating: 5,
      notes: "Quick and easy weeknight dinner.",
    },
  ],
  "2": [
    {
      recipeId: "spicy-arrabbiata",
      cookedAt: "2024-01-08",
      rating: 3,
      notes: "A bit too spicy for me, but good flavor.",
    },
  ],
}

// Mock user preferences and dietary data
export const mockUserPreferences = {
  "1": {
    favoriteRecipes: ["lemon-herb-chicken", "mediterranean-stuffed-peppers", "chicken-stir-fry"],
    dislikedIngredients: ["mushrooms", "anchovies"],
    preferredCuisines: ["italian", "mediterranean", "asian"],
    cookingGoals: ["reduce-waste", "eat-healthy", "save-time"],
  },
  "2": {
    favoriteRecipes: ["spicy-arrabbiata"],
    dislikedIngredients: ["olives", "capers"],
    preferredCuisines: ["american", "mexican", "italian"],
    cookingGoals: ["learn-basics", "quick-meals"],
  },
}

// Helper functions to get user-specific data
export function getUserPantryItems(householdId: string): PantryItem[] {
  return mockPantryItems[householdId] || []
}

export function getUserHousehold(householdId: string): Household | undefined {
  return mockHouseholds.find((h) => h.id === householdId)
}

export function getUserCookingHistory(userId: string) {
  return mockCookingHistory[userId as keyof typeof mockCookingHistory] || []
}

export function getUserPreferences(userId: string) {
  return (
    mockUserPreferences[userId as keyof typeof mockUserPreferences] || {
      favoriteRecipes: [],
      dislikedIngredients: [],
      preferredCuisines: [],
      cookingGoals: [],
    }
  )
}

// Mock achievements system
export const mockAchievements = {
  "waste-warrior": {
    id: "waste-warrior",
    name: "Waste Warrior",
    description: "Reduced food waste by 20+ lbs",
    icon: "♻️",
    unlockedAt: "2024-01-01",
  },
  "recipe-explorer": {
    id: "recipe-explorer",
    name: "Recipe Explorer",
    description: "Cooked 25+ different recipes",
    icon: "🗺️",
    unlockedAt: "2024-01-03",
  },
  "cooking-streak": {
    id: "cooking-streak",
    name: "Cooking Streak",
    description: "Cooked for 5 days in a row",
    icon: "🔥",
    unlockedAt: "2024-01-08",
  },
  "first-recipe": {
    id: "first-recipe",
    name: "First Recipe",
    description: "Cooked your first recipe!",
    icon: "🍳",
    unlockedAt: "2024-01-08",
  },
}
