"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star, ChefHat, X, Heart, Info } from "lucide-react"
import type { Recipe, MatchScore } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SwipeCardProps {
  recipe: Recipe
  matchScore: MatchScore
  onSwipe: (direction: "left" | "right") => void
  isActive: boolean
  zIndex: number
}

export function SwipeCard({ recipe, matchScore, onSwipe, isActive, zIndex }: SwipeCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const startPos = useRef({ x: 0, y: 0 })

  const handleStart = (clientX: number, clientY: number) => {
    if (!isActive) return
    setIsDragging(true)
    startPos.current = { x: clientX, y: clientY }
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !isActive) return

    const deltaX = clientX - startPos.current.x
    const deltaY = clientY - startPos.current.y
    const newRotation = deltaX * 0.1 // Rotation based on horizontal movement

    setDragOffset({ x: deltaX, y: deltaY })
    setRotation(newRotation)
  }

  const handleEnd = () => {
    if (!isDragging || !isActive) return

    const threshold = 100
    const { x } = dragOffset

    if (Math.abs(x) > threshold) {
      const direction = x > 0 ? "right" : "left"
      onSwipe(direction)
    } else {
      // Snap back to center
      setDragOffset({ x: 0, y: 0 })
      setRotation(0)
    }

    setIsDragging(false)
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX, e.clientY)
  }

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX, e.clientY)
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleMove(touch.clientX, touch.clientY)
  }

  const handleTouchEnd = () => {
    handleEnd()
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging])

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

  const opacity = Math.abs(dragOffset.x) > 50 ? Math.max(0.3, 1 - Math.abs(dragOffset.x) / 300) : 1

  return (
    <div
      ref={cardRef}
      className={cn(
        "absolute inset-0 cursor-grab active:cursor-grabbing transition-transform duration-300 ease-out",
        isDragging ? "transition-none" : "",
        !isActive && "pointer-events-none",
      )}
      style={{
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
        zIndex,
        opacity,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Card className="h-full w-full max-w-sm mx-auto shadow-2xl border-2 overflow-hidden">
        {/* Recipe Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={recipe.image || "/placeholder.svg"}
            alt={recipe.title}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute top-4 right-4">
            <Badge variant={getMatchBadgeColor(matchScore.totalScore)} className="text-xs font-semibold">
              {matchScore.totalScore}%
            </Badge>
          </div>
          <div className="absolute top-4 left-4">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
              {getMatchBadgeText(matchScore.totalScore)}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          {/* Recipe Title & Rating */}
          <div className="space-y-2">
            <h3 className="font-mono font-bold text-xl leading-tight text-balance">{recipe.title}</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-current text-secondary" />
                <span className="text-sm font-medium">{recipe.rating}</span>
                <span className="text-xs text-muted-foreground">({recipe.reviewCount})</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {recipe.cuisine}
              </Badge>
            </div>
          </div>

          {/* Recipe Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <Clock className="h-4 w-4 mx-auto text-muted-foreground" />
              <div className="text-sm font-medium">{recipe.timeTotal}min</div>
            </div>
            <div className="space-y-1">
              <Users className="h-4 w-4 mx-auto text-muted-foreground" />
              <div className="text-sm font-medium">{recipe.servings} servings</div>
            </div>
            <div className="space-y-1">
              <ChefHat className="h-4 w-4 mx-auto text-muted-foreground" />
              <div className="text-sm font-medium">Level {recipe.skillRequired}</div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">{recipe.description}</p>

          {/* Match Details */}
          <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">Match Breakdown</span>
              <Info className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span>Available:</span>
                <span className="font-medium">{matchScore.breakdown.availability}%</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span className="font-medium">{matchScore.breakdown.time}%</span>
              </div>
              <div className="flex justify-between">
                <span>Skill:</span>
                <span className="font-medium">{matchScore.breakdown.skill}%</span>
              </div>
              <div className="flex justify-between">
                <span>Cookware:</span>
                <span className="font-medium">{matchScore.breakdown.cookware}%</span>
              </div>
            </div>
            {matchScore.missingIngredients.length > 0 && (
              <div className="text-xs">
                <span className="text-secondary font-medium">Missing: </span>
                <span className="text-muted-foreground">
                  {matchScore.missingIngredients
                    .slice(0, 2)
                    .map((i) => i.name)
                    .join(", ")}
                  {matchScore.missingIngredients.length > 2 && ` +${matchScore.missingIngredients.length - 2} more`}
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {recipe.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        {/* Swipe Indicators */}
        {Math.abs(dragOffset.x) > 30 && (
          <>
            {dragOffset.x > 0 && (
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                <div className="bg-primary text-primary-foreground rounded-full p-4">
                  <Heart className="h-8 w-8" />
                </div>
              </div>
            )}
            {dragOffset.x < 0 && (
              <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center">
                <div className="bg-destructive text-destructive-foreground rounded-full p-4">
                  <X className="h-8 w-8" />
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  )
}
