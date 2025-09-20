"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { recipeDatabase } from "@/lib/recipe-data"
import type { Recipe } from "@/lib/types"
import {
  Play,
  Pause,
  RotateCcw,
  ChefHat,
  Clock,
  Users,
  CheckCircle2,
  Circle,
  ArrowLeft,
  ArrowRight,
  Timer,
  Utensils,
  Scale,
} from "lucide-react"

export default function CookModePage() {
  const params = useParams()
  const router = useRouter()
  const recipeId = params.recipeId as string

  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set())
  const [servingMultiplier, setServingMultiplier] = useState(1)
  const [timer, setTimer] = useState<number | null>(null)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [activeView, setActiveView] = useState<"ingredients" | "instructions" | "overview">("overview")

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const foundRecipe = recipeDatabase.find((r) => r.id === recipeId)
    if (foundRecipe) {
      setRecipe(foundRecipe)
    }
  }, [recipeId])

  useEffect(() => {
    if (isTimerRunning && timer !== null && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev === null || prev <= 1) {
            setIsTimerRunning(false)
            // Timer finished - could add notification here
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isTimerRunning, timer])

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Recipe not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const startTimer = (minutes: number) => {
    setTimer(minutes * 60)
    setIsTimerRunning(true)
  }

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning)
  }

  const resetTimer = () => {
    setTimer(null)
    setIsTimerRunning(false)
  }

  const toggleStepComplete = (stepIndex: number) => {
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(stepIndex)) {
      newCompleted.delete(stepIndex)
    } else {
      newCompleted.add(stepIndex)
    }
    setCompletedSteps(newCompleted)
  }

  const toggleIngredientCheck = (ingredientIndex: number) => {
    const newChecked = new Set(checkedIngredients)
    if (newChecked.has(ingredientIndex)) {
      newChecked.delete(ingredientIndex)
    } else {
      newChecked.add(ingredientIndex)
    }
    setCheckedIngredients(newChecked)
  }

  const adjustServings = (multiplier: number) => {
    setServingMultiplier(multiplier)
  }

  const progress = (completedSteps.size / recipe.instructions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Recipes
            </Button>

            {/* Timer Display */}
            {timer !== null && (
              <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full">
                <Timer className="h-4 w-4 text-orange-600" />
                <span className="font-mono text-lg font-semibold text-orange-800">{formatTime(timer)}</span>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={toggleTimer} className="h-8 w-8 p-0">
                    {isTimerRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={resetTimer} className="h-8 w-8 p-0">
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Recipe Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={recipe.image || "/placeholder.svg"}
              alt={recipe.title}
              className="w-full md:w-64 h-48 object-cover rounded-lg shadow-md"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-balance">{recipe.title}</h1>
              <p className="text-gray-600 mb-4 text-pretty">{recipe.description}</p>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-gray-600">{recipe.timeTotal} min total</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-gray-600">{recipe.servings * servingMultiplier} servings</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChefHat className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-gray-600">Skill level {recipe.skillRequired}/5</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Cooking Progress</span>
                  <span className="text-sm text-gray-500">
                    {completedSteps.size}/{recipe.instructions.length} steps
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeView === "overview" ? "default" : "outline"}
            onClick={() => setActiveView("overview")}
            className="flex items-center gap-2"
          >
            <Utensils className="h-4 w-4" />
            Overview
          </Button>
          <Button
            variant={activeView === "ingredients" ? "default" : "outline"}
            onClick={() => setActiveView("ingredients")}
            className="flex items-center gap-2"
          >
            <Scale className="h-4 w-4" />
            Ingredients
          </Button>
          <Button
            variant={activeView === "instructions" ? "default" : "outline"}
            onClick={() => setActiveView("instructions")}
            className="flex items-center gap-2"
          >
            <ChefHat className="h-4 w-4" />
            Instructions
          </Button>
        </div>

        {/* Content Views */}
        {activeView === "overview" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Cookware Required */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5" />
                  Required Cookware
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {recipe.cookwareRequired.map((item, index) => (
                    <Badge key={index} variant="secondary" className="capitalize">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Timers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  Quick Timers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 15, 20, 25, 30].map((minutes) => (
                    <Button
                      key={minutes}
                      variant="outline"
                      size="sm"
                      onClick={() => startTimer(minutes)}
                      className="text-xs"
                    >
                      {minutes}m
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === "ingredients" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Ingredients
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Servings:</span>
                  <div className="flex gap-1">
                    {[0.5, 1, 1.5, 2].map((multiplier) => (
                      <Button
                        key={multiplier}
                        variant={servingMultiplier === multiplier ? "default" : "outline"}
                        size="sm"
                        onClick={() => adjustServings(multiplier)}
                        className="text-xs px-2"
                      >
                        {multiplier}x
                      </Button>
                    ))}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      checkedIngredients.has(index) ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
                    }`}
                  >
                    <button onClick={() => toggleIngredientCheck(index)} className="flex-shrink-0">
                      {checkedIngredients.has(index) ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`font-medium capitalize ${
                            checkedIngredients.has(index) ? "line-through text-gray-500" : "text-gray-900"
                          }`}
                        >
                          {ingredient.name}
                        </span>
                        {ingredient.optional && (
                          <Badge variant="outline" className="text-xs">
                            optional
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {(ingredient.quantity * servingMultiplier).toFixed(1)} {ingredient.unit}
                      </div>
                      {ingredient.substitutions && ingredient.substitutions.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          Substitutes: {ingredient.substitutions.join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeView === "instructions" && (
          <div className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <Card
                key={index}
                className={`transition-all ${
                  completedSteps.has(index)
                    ? "bg-green-50 border-green-200"
                    : currentStep === index
                      ? "bg-orange-50 border-orange-200 shadow-md"
                      : "bg-white border-gray-200"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <button onClick={() => toggleStepComplete(index)} className="flex-shrink-0 mt-1">
                      {completedSteps.has(index) ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-400" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-orange-600">Step {index + 1}</span>
                        {currentStep === index && (
                          <Badge variant="default" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p
                        className={`text-lg leading-relaxed text-pretty ${
                          completedSteps.has(index) ? "line-through text-gray-500" : "text-gray-900"
                        }`}
                      >
                        {instruction}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Step Navigation */}
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous Step
              </Button>

              <span className="text-sm text-gray-600">
                Step {currentStep + 1} of {recipe.instructions.length}
              </span>

              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.min(recipe.instructions.length - 1, currentStep + 1))}
                disabled={currentStep === recipe.instructions.length - 1}
                className="flex items-center gap-2"
              >
                Next Step
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
