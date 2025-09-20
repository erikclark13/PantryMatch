import type { Recipe, PantryItem, MatchScore, RecipeIngredient, UserProfile } from "./types"

export class RecipeMatchingEngine {
  private substitutionMap: Map<string, string[]> = new Map([
    ["greek yogurt", ["sour cream", "heavy cream", "cream cheese"]],
    ["chicken thighs", ["chicken breast", "turkey"]],
    ["lemon", ["lime", "white wine vinegar"]],
    ["fresh herbs", ["dried herbs", "herb seasoning"]],
    ["bell peppers", ["any peppers", "zucchini"]],
    ["rice", ["quinoa", "couscous", "pasta"]],
    ["berries", ["any fresh fruit", "frozen berries"]],
    ["honey", ["maple syrup", "agave", "sugar"]],
    ["canned tomatoes", ["fresh tomatoes", "tomato sauce"]],
    ["fresh basil", ["dried basil", "oregano"]],
  ])

  private weights = {
    availability: 0.3,
    substitution: 0.1,
    dietary: 0.15,
    time: 0.1,
    cookware: 0.05,
    skill: 0.05,
    nutrition: 0.1,
    cost: 0.15,
  }

  calculateMatchScore(
    recipe: Recipe,
    pantryItems: PantryItem[],
    userProfile: UserProfile,
    timebudget = 60,
  ): MatchScore {
    const pantryMap = new Map(pantryItems.map((item) => [item.name.toLowerCase(), item]))

    const availableIngredients: RecipeIngredient[] = []
    const missingIngredients: RecipeIngredient[] = []
    const substitutableIngredients: { ingredient: RecipeIngredient; substitute: string }[] = []

    // Analyze ingredient availability
    recipe.ingredients.forEach((ingredient) => {
      const ingredientName = ingredient.name.toLowerCase()
      const pantryItem = pantryMap.get(ingredientName)

      if (pantryItem && pantryItem.quantity >= ingredient.quantity) {
        availableIngredients.push(ingredient)
      } else {
        // Check for substitutions
        const substitutes = this.substitutionMap.get(ingredientName) || []
        let foundSubstitute = false

        for (const substitute of substitutes) {
          const substituteItem = pantryMap.get(substitute.toLowerCase())
          if (substituteItem && substituteItem.quantity >= ingredient.quantity) {
            substitutableIngredients.push({ ingredient, substitute })
            foundSubstitute = true
            break
          }
        }

        if (!foundSubstitute) {
          missingIngredients.push(ingredient)
        }
      }
    })

    // Calculate individual scores
    const availabilityScore = (availableIngredients.length / recipe.ingredients.length) * 100
    const substitutionScore = (substitutableIngredients.length / recipe.ingredients.length) * 100
    const dietaryScore = this.calculateDietaryScore(recipe, userProfile)
    const timeScore = this.calculateTimeScore(recipe.timeTotal, timebudget)
    const cookwareScore = this.calculateCookwareScore(recipe.cookwareRequired, userProfile.cookware)
    const skillScore = this.calculateSkillScore(recipe.skillRequired, userProfile.skillLevel)
    const nutritionScore = this.calculateNutritionScore(recipe.nutrition, userProfile.macroGoals)
    const costScore = this.calculateCostScore(missingIngredients)

    const totalScore =
      availabilityScore * this.weights.availability +
      substitutionScore * this.weights.substitution +
      dietaryScore * this.weights.dietary +
      timeScore * this.weights.time +
      cookwareScore * this.weights.cookware +
      skillScore * this.weights.skill +
      nutritionScore * this.weights.nutrition +
      costScore * this.weights.cost

    return {
      recipeId: recipe.id,
      totalScore: Math.round(totalScore),
      breakdown: {
        availability: Math.round(availabilityScore),
        substitution: Math.round(substitutionScore),
        dietary: Math.round(dietaryScore),
        time: Math.round(timeScore),
        cookware: Math.round(cookwareScore),
        skill: Math.round(skillScore),
        nutrition: Math.round(nutritionScore),
        cost: Math.round(costScore),
      },
      missingIngredients,
      availableIngredients,
      substitutableIngredients,
    }
  }

  private calculateDietaryScore(recipe: Recipe, userProfile: UserProfile): number {
    // Check for hard restrictions (allergies and dietary restrictions)
    for (const restriction of [...userProfile.allergies, ...userProfile.dietaryRestrictions]) {
      if (recipe.dietaryFlags.includes(restriction.toLowerCase())) {
        return 0 // Hard fail for dietary violations
      }
    }

    // Check for dislikes (soft penalty)
    let dislikeCount = 0
    recipe.ingredients.forEach((ingredient) => {
      if (userProfile.dislikes.some((dislike) => ingredient.name.toLowerCase().includes(dislike.toLowerCase()))) {
        dislikeCount++
      }
    })

    const dislikePenalty = (dislikeCount / recipe.ingredients.length) * 50
    return Math.max(0, 100 - dislikePenalty)
  }

  private calculateTimeScore(recipeTime: number, timebudget: number): number {
    if (recipeTime <= timebudget) {
      return 100
    }
    // Penalty for exceeding time budget
    const overTime = recipeTime - timebudget
    const penalty = Math.min(overTime * 2, 80) // Max 80% penalty
    return Math.max(20, 100 - penalty)
  }

  private calculateCookwareScore(required: string[], available: string[]): number {
    if (required.length === 0) return 100

    const availableSet = new Set(available.map((item) => item.toLowerCase()))
    const hasRequired = required.filter((item) => availableSet.has(item.toLowerCase())).length

    return (hasRequired / required.length) * 100
  }

  private calculateSkillScore(required: number, userSkill: number): number {
    if (userSkill >= required) {
      return 100
    }
    // Penalty for recipes above skill level
    const skillGap = required - userSkill
    const penalty = skillGap * 25 // 25% penalty per skill level
    return Math.max(0, 100 - penalty)
  }

  private calculateNutritionScore(recipeNutrition: any, goals: any): number {
    // Simple scoring based on how close recipe nutrition is to daily goals
    const calorieScore = Math.max(0, 100 - Math.abs(recipeNutrition.calories - goals.calories / 3) / 10)
    const proteinScore = Math.max(0, 100 - Math.abs(recipeNutrition.protein - goals.protein / 3) / 5)

    return (calorieScore + proteinScore) / 2
  }

  private calculateCostScore(missingIngredients: RecipeIngredient[]): number {
    // Simple cost estimation - fewer missing ingredients = higher score
    if (missingIngredients.length === 0) return 100

    // Estimate cost penalty based on number of missing ingredients
    const costPenalty = missingIngredients.length * 15 // 15% penalty per missing ingredient
    return Math.max(0, 100 - costPenalty)
  }

  getTopMatches(
    recipes: Recipe[],
    pantryItems: PantryItem[],
    userProfile: UserProfile,
    timebudget = 60,
    limit = 20,
  ): MatchScore[] {
    const scores = recipes.map((recipe) => this.calculateMatchScore(recipe, pantryItems, userProfile, timebudget))

    return scores.sort((a, b) => b.totalScore - a.totalScore).slice(0, limit)
  }

  getRecipesByIds(recipeIds: string[], recipes: Recipe[]): Recipe[] {
    const recipeMap = new Map(recipes.map((recipe) => [recipe.id, recipe]))
    return recipeIds.map((id) => recipeMap.get(id)).filter(Boolean) as Recipe[]
  }
}

export const matchingEngine = new RecipeMatchingEngine()
