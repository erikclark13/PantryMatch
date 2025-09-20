"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SwipeCard } from "@/components/swipe-card"
import { recipeDatabase } from "@/lib/recipe-data"
import { matchingEngine } from "@/lib/matching-engine"
import type { Recipe, MatchScore } from "@/lib/types"
import { ChefHat, Heart, X, Sparkles, Clock, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AuthGuard } from "@/components/auth-guard"
import { AppNavigation } from "@/components/app-navigation"
import { useAuth } from "@/lib/auth-context"
import { usePantry } from "@/lib/pantry-context"

interface RecipeWithScore {
  recipe: Recipe
  matchScore: MatchScore
}

function MatchPageContent() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [recipes, setRecipes] = useState<RecipeWithScore[]>([])
  const [matches, setMatches] = useState<Recipe[]>([])
  const [rejections, setRejections] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sessionStats, setSessionStats] = useState({ swiped: 0, matched: 0, rejected: 0 })
  const { toast } = useToast()

  const { user } = useAuth()
  const { items: pantryItems } = usePantry()

  useEffect(() => {
    if (user && pantryItems.length > 0) {
      const userProfile = {
        id: user.id,
        name: user.name,
        dietaryRestrictions: user.preferences.dietaryRestrictions,
        allergies: user.preferences.allergies,
        dislikes: [], // Could be extended from user preferences
        macroGoals: {
          calories: 2000,
          protein: 150,
          carbs: 200,
          fat: 70,
        },
        skillLevel:
          user.preferences.cookingSkill === "beginner" ? 2 : user.preferences.cookingSkill === "intermediate" ? 3 : 4,
        cookware: ["pot", "pan", "oven", "wok"], // Could be extended from user preferences
        defaultTimebudget: user.preferences.maxCookTime,
      }

      // Initialize recipes with match scores using real user data
      const matchedRecipes = matchingEngine.getTopMatches(recipeDatabase, pantryItems, userProfile, 60, 20)
      const recipesWithScores = matchedRecipes.map((match) => ({
        recipe: recipeDatabase.find((r) => r.id === match.recipeId)!,
        matchScore: match,
      }))
      setRecipes(recipesWithScores)
      setIsLoading(false)
    } else if (user && pantryItems.length === 0) {
      // Handle case where user has no pantry items
      setIsLoading(false)
    }
  }, [user, pantryItems])

  const handleSwipe = (direction: "left" | "right") => {
    if (currentIndex >= recipes.length) return

    const currentRecipe = recipes[currentIndex].recipe

    if (direction === "right") {
      setMatches((prev) => [...prev, currentRecipe])
      setSessionStats((prev) => ({ ...prev, matched: prev.matched + 1, swiped: prev.swiped + 1 }))
      toast({
        title: "Recipe Liked! ❤️",
        description: `${currentRecipe.title} added to your matches`,
      })
    } else {
      setRejections((prev) => [...prev, currentRecipe])
      setSessionStats((prev) => ({ ...prev, rejected: prev.rejected + 1, swiped: prev.swiped + 1 }))
    }

    setCurrentIndex((prev) => prev + 1)
  }

  const handleButtonSwipe = (direction: "left" | "right") => {
    handleSwipe(direction)
  }

  const resetSession = () => {
    setCurrentIndex(0)
    setMatches([])
    setRejections([])
    setSessionStats({ swiped: 0, matched: 0, rejected: 0 })
    toast({
      title: "Session Reset",
      description: "Starting fresh with new recipe recommendations",
    })
  }

  const startCooking = () => {
    if (matches.length === 0) return
    // In a real app, this would navigate to cook mode with the matched recipe
    toast({
      title: "Let's Cook! 👨‍🍳",
      description: `Starting cook mode with ${matches[0].title}`,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Preparing your recipe matches...</p>
        </div>
      </div>
    )
  }

  if (pantryItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="font-mono font-bold text-2xl text-foreground mb-4">No Pantry Items Found</h1>
          <p className="text-muted-foreground mb-8">
            Add some ingredients to your pantry first to get personalized recipe matches.
          </p>
          <Button asChild>
            <a href="/pantry">Add Pantry Items</a>
          </Button>
        </div>
      </div>
    )
  }

  const hasMoreRecipes = currentIndex < recipes.length
  const currentRecipe = hasMoreRecipes ? recipes[currentIndex] : null

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Swipe Area */}
          <div className="lg:col-span-2">
            <div className="text-center mb-8">
              <h1 className="font-mono font-bold text-3xl text-foreground mb-2">Tonight's Matches</h1>
              <p className="text-muted-foreground">Swipe right to like, left to pass</p>
            </div>

            {/* Swipe Cards Container */}
            <div className="relative h-[600px] max-w-sm mx-auto">
              {hasMoreRecipes ? (
                <>
                  {/* Show next 3 cards in stack */}
                  {recipes.slice(currentIndex, currentIndex + 3).map((item, index) => (
                    <SwipeCard
                      key={`${item.recipe.id}-${currentIndex + index}`}
                      recipe={item.recipe}
                      matchScore={item.matchScore}
                      onSwipe={handleSwipe}
                      isActive={index === 0}
                      zIndex={10 - index}
                    />
                  ))}
                </>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center space-y-4">
                    <Sparkles className="h-16 w-16 text-primary mx-auto" />
                    <div>
                      <h3 className="font-mono font-bold text-xl mb-2">All Done!</h3>
                      <p className="text-muted-foreground mb-4">You've seen all available recipes for tonight</p>
                      {matches.length > 0 ? (
                        <Button onClick={startCooking} size="lg">
                          Cook Your Matches ({matches.length})
                        </Button>
                      ) : (
                        <Button onClick={resetSession} variant="outline">
                          Try Again
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Action Buttons */}
            {hasMoreRecipes && (
              <div className="flex justify-center gap-6 mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full h-16 w-16 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                  onClick={() => handleButtonSwipe("left")}
                >
                  <X className="h-8 w-8" />
                </Button>
                <Button
                  size="lg"
                  className="rounded-full h-16 w-16 bg-primary hover:bg-primary/90"
                  onClick={() => handleButtonSwipe("right")}
                >
                  <Heart className="h-8 w-8" />
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5" />
                  Session Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{sessionStats.swiped}</div>
                    <div className="text-xs text-muted-foreground">Swiped</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">{sessionStats.matched}</div>
                    <div className="text-xs text-muted-foreground">Liked</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-muted-foreground">{sessionStats.rejected}</div>
                    <div className="text-xs text-muted-foreground">Passed</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">{recipes.length - currentIndex} recipes remaining</div>
                </div>
              </CardContent>
            </Card>

            {/* Current Matches */}
            {matches.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Heart className="h-5 w-5 text-secondary" />
                    Your Matches ({matches.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {matches.slice(0, 3).map((recipe) => (
                      <div key={recipe.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                        <img
                          src={recipe.image || "/placeholder.svg"}
                          alt={recipe.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{recipe.title}</div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {recipe.timeTotal}min
                          </div>
                        </div>
                      </div>
                    ))}
                    {matches.length > 3 && (
                      <div className="text-center text-sm text-muted-foreground">
                        +{matches.length - 3} more matches
                      </div>
                    )}
                    <Button className="w-full mt-4" onClick={startCooking}>
                      Start Cooking
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Swipe Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div>• Swipe right (❤️) to add to matches</div>
                <div>• Swipe left (✕) to pass</div>
                <div>• Use buttons if you prefer clicking</div>
                <div>• Higher match % = better pantry fit</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MatchPage() {
  return (
    <AuthGuard>
      <MatchPageContent />
    </AuthGuard>
  )
}
