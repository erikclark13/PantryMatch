export interface PantryItem {
  id: string
  name: string
  quantity: number
  unit: string
  location: "fridge" | "freezer" | "pantry" | "spice-rack"
  expiryDate: string
  category: string
  barcode?: string
  addedBy: string
  lastUpdated: string
}

export interface RecipeIngredient {
  name: string
  quantity: number
  unit: string
  optional?: boolean
  substitutions?: string[]
  category?: string
}

export interface Recipe {
  id: string
  title: string
  description: string
  image: string
  ingredients: RecipeIngredient[]
  instructions: string[]
  timeTotal: number // minutes
  timeActive: number // minutes
  skillRequired: 1 | 2 | 3 | 4 | 5
  cookwareRequired: string[]
  servings: number
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  dietaryFlags: string[]
  tags: string[]
  cuisine: string
  source: string
  rating: number
  reviewCount: number
}

export interface MatchScore {
  recipeId: string
  totalScore: number
  breakdown: {
    availability: number
    substitution: number
    dietary: number
    time: number
    cookware: number
    skill: number
    nutrition: number
    cost: number
  }
  missingIngredients: RecipeIngredient[]
  availableIngredients: RecipeIngredient[]
  substitutableIngredients: { ingredient: RecipeIngredient; substitute: string }[]
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  householdId: string
  preferences: {
    dietaryRestrictions: string[]
    allergies: string[]
    cuisinePreferences: string[]
    spiceLevel: "mild" | "medium" | "hot"
    cookingSkill: "beginner" | "intermediate" | "advanced"
    maxCookTime: number
    nutritionalGoals: string[]
  }
  stats: {
    recipesCooked: number
    wasteReduced: number
    favoriteRecipes: number
    cookingStreak: number
    totalXP: number
    level: number
    achievements: string[]
  }
}

export interface Household {
  id: string
  name: string
  members: { userId: string; role: "admin" | "member" | "viewer" }[]
  pantryId: string
  decisionMode: "unanimous" | "majority"
  quorum: number
}
