"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { recipeDatabase } from "@/lib/recipe-data"
import { matchingEngine } from "@/lib/matching-engine"
import type { PantryItem, UserProfile } from "@/lib/types"
import { Search, Clock, Users, Star, ChefHat, Filter, Zap, Heart } from "lucide-react"

// Mock data for demonstration
const mockPantryItems: PantryItem[] = [
  {
    id: "1",
    name: "chicken thighs",
    quantity: 6,
    unit: "pieces",
    location: "freezer",
    expiryDate: "2025-02-15",
    category: "protein",
    addedBy: "Sarah",
    lastUpdated: "2025-01-20",
  },
  {
    id: "2",
    name: "greek yogurt",
    quantity: 2,
    unit: "containers",
    location: "fridge",
    expiryDate: "2025-01-25",
    category: "dairy",
    addedBy: "Mike",
    lastUpdated: "2025-01-18",
  },
  {
    id: "3",
    name: "pasta",
    quantity: 500,
    unit: "g",
    location: "pantry",
    expiryDate: "2025-12-01",
    category: "grains",
    addedBy: "Sarah",
    lastUpdated: "2025-01-15",
  },
  {
    id: "4",
    name: "bell peppers",
    quantity: 3,
    unit: "pieces",
    location: "fridge",
    expiryDate: "2025-01-22",
    category: "vegetables",
    addedBy: "Mike",
    lastUpdated: "2025-01-19",
  },
  {
    id: "5",
    name: "olive oil",
    quantity: 500,
    unit: "ml",
    location: "pantry",
    expiryDate: "2025-06-01",
    category: "other",
    addedBy: "Sarah",
    lastUpdated: "2025-01-10",
  },
  {
    id: "6",
    name: "garlic",
    quantity: 8,
    unit: "cloves",
    location: "pantry",
    expiryDate: "2025-02-01",
    category: "vegetables",
    addedBy: "Mike",
    lastUpdated: "2025-01-16",
  },
]

const mockUserProfile: UserProfile = {
  id: "user1",
  name: "Sarah",
  dietaryRestrictions: [],
  allergies: [],
  dislikes: ["mushrooms"],
  macroGoals: {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 70,
  },
  skillLevel: 3,
  cookware: ["pot", "pan", "oven", "wok"],
  defaultTimebudget: 45,
}

export default function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [cuisineFilter, setCuisineFilter] = useState("all")
  const [timebudget, setTimebudget] = useState([45])
  const [skillFilter, setSkillFilter] = useState("all")
  const [showMatchedOnly, setShowMatchedOnly] = useState(true)

  const matchedRecipes = useMemo(() => {
    const matches = matchingEngine.getTopMatches(recipeDatabase, mockPantryItems, mockUserProfile, timebudget[0])
    return matches.map((match) => ({
      ...recipeDatabase.find((r) => r.id === match.recipeId)!,
      matchScore: match,
    }))
  }, [timebudget])

  const filteredRecipes = useMemo(() => {
    let recipes = showMatchedOnly ? matchedRecipes : recipeDatabase.map((r) => ({ ...r, matchScore: null }))

    if (searchQuery) {
      recipes = recipes.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    if (cuisineFilter !== "all") {
      recipes = recipes.filter((recipe) => recipe.cuisine.toLowerCase().includes(cuisineFilter))
    }

    if (skillFilter !== "all") {
      const skillLevel = Number.parseInt(skillFilter)
      recipes = recipes.filter((recipe) => recipe.skillRequired <= skillLevel)
    }

    return recipes
  }, [matchedRecipes, searchQuery, cuisineFilter, skillFilter, showMatchedOnly])

  const getMatchBadgeColor = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    if (score >= 40) return "outline"
    return "destructive"
  }

  const getMatchBadgeText = (score: number) => {
    if (score >= 80) return "Perfect Match"
    if (score >= 60) return "Good Match"
    if (score >= 40) return "Okay Match"
    return "Poor Match"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <ChefHat className="h-8 w-8 text-primary" />
              <span className="font-mono font-bold text-xl text-foreground">PantryMatch</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                Pantry
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Start Matching
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-mono font-bold text-3xl text-foreground mb-2">Recipe Database</h1>
            <p className="text-muted-foreground">Discover recipes matched to your pantry</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showMatchedOnly ? "default" : "outline"}
              onClick={() => setShowMatchedOnly(!showMatchedOnly)}
              size="sm"
            >
              <Zap className="h-4 w-4 mr-2" />
              {showMatchedOnly ? "Matched Recipes" : "All Recipes"}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Cuisine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cuisines</SelectItem>
              <SelectItem value="italian">Italian</SelectItem>
              <SelectItem value="mediterranean">Mediterranean</SelectItem>
              <SelectItem value="asian">Asian</SelectItem>
              <SelectItem value="international">International</SelectItem>
            </SelectContent>
          </Select>

          <Select value={skillFilter} onValueChange={setSkillFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Skill Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="1">Beginner (1)</SelectItem>
              <SelectItem value="2">Easy (2)</SelectItem>
              <SelectItem value="3">Medium (3)</SelectItem>
              <SelectItem value="4">Advanced (4)</SelectItem>
              <SelectItem value="5">Expert (5)</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <Slider value={timebudget} onValueChange={setTimebudget} max={120} min={10} step={5} className="w-full" />
            </div>
            <span className="text-sm text-muted-foreground w-12">{timebudget[0]}min</span>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={recipe.image || "/placeholder.svg"}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
                {recipe.matchScore && (
                  <div className="absolute top-3 right-3">
                    <Badge variant={getMatchBadgeColor(recipe.matchScore.totalScore)}>
                      {recipe.matchScore.totalScore}% {getMatchBadgeText(recipe.matchScore.totalScore)}
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight">{recipe.title}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-current text-secondary" />
                    {recipe.rating}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {recipe.timeTotal}min
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {recipe.servings} servings
                  </div>
                  <div className="flex items-center gap-1">
                    <ChefHat className="h-4 w-4" />
                    Level {recipe.skillRequired}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {recipe.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {recipe.matchScore && (
                  <div className="space-y-2 mb-4 p-3 bg-muted/30 rounded-lg">
                    <div className="text-xs font-medium text-muted-foreground">Match Breakdown:</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Available: {recipe.matchScore.breakdown.availability}%</div>
                      <div>Time: {recipe.matchScore.breakdown.time}%</div>
                      <div>Skill: {recipe.matchScore.breakdown.skill}%</div>
                      <div>Cookware: {recipe.matchScore.breakdown.cookware}%</div>
                    </div>
                    {recipe.matchScore.missingIngredients.length > 0 && (
                      <div className="text-xs text-secondary">
                        Missing:{" "}
                        {recipe.matchScore.missingIngredients
                          .slice(0, 2)
                          .map((i) => i.name)
                          .join(", ")}
                        {recipe.matchScore.missingIngredients.length > 2 &&
                          ` +${recipe.matchScore.missingIngredients.length - 2} more`}
                      </div>
                    )}
                  </div>
                )}

                <Button className="w-full" size="sm">
                  View Recipe
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No recipes found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  )
}
