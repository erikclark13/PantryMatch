"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Flame, Target, ChefHat, Heart, Recycle, Clock, Users, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  category: "cooking" | "matching" | "sustainability" | "social"
  progress: number
  maxProgress: number
  unlocked: boolean
  points: number
  rarity: "common" | "rare" | "epic" | "legendary"
}

const achievements: Achievement[] = [
  {
    id: "first_match",
    title: "First Match",
    description: "Like your first recipe",
    icon: Heart,
    category: "matching",
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    points: 10,
    rarity: "common",
  },
  {
    id: "cooking_streak",
    title: "On Fire!",
    description: "Cook 7 days in a row",
    icon: Flame,
    category: "cooking",
    progress: 3,
    maxProgress: 7,
    unlocked: false,
    points: 50,
    rarity: "rare",
  },
  {
    id: "waste_warrior",
    title: "Waste Warrior",
    description: "Prevent 10 items from expiring",
    icon: Recycle,
    category: "sustainability",
    progress: 7,
    maxProgress: 10,
    unlocked: false,
    points: 75,
    rarity: "epic",
  },
  {
    id: "speed_chef",
    title: "Speed Chef",
    description: "Complete 5 recipes under 20 minutes",
    icon: Clock,
    category: "cooking",
    progress: 2,
    maxProgress: 5,
    unlocked: false,
    points: 30,
    rarity: "common",
  },
  {
    id: "master_chef",
    title: "Master Chef",
    description: "Cook 100 different recipes",
    icon: ChefHat,
    category: "cooking",
    progress: 23,
    maxProgress: 100,
    unlocked: false,
    points: 200,
    rarity: "legendary",
  },
  {
    id: "household_hero",
    title: "Household Hero",
    description: "Get 50 likes from household members",
    icon: Users,
    category: "social",
    progress: 12,
    maxProgress: 50,
    unlocked: false,
    points: 100,
    rarity: "epic",
  },
]

export function AchievementSystem() {
  const [userAchievements, setUserAchievements] = useState(achievements)
  const [totalPoints, setTotalPoints] = useState(185)
  const [level, setLevel] = useState(3)
  const [levelProgress, setLevelProgress] = useState(85)
  const { toast } = useToast()

  const getRarityColor = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common":
        return "text-gray-600 border-gray-200"
      case "rare":
        return "text-blue-600 border-blue-200"
      case "epic":
        return "text-purple-600 border-purple-200"
      case "legendary":
        return "text-amber-600 border-amber-200"
    }
  }

  const getRarityBadgeVariant = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common":
        return "secondary"
      case "rare":
        return "default"
      case "epic":
        return "secondary"
      case "legendary":
        return "default"
    }
  }

  const getCategoryIcon = (category: Achievement["category"]) => {
    switch (category) {
      case "cooking":
        return ChefHat
      case "matching":
        return Heart
      case "sustainability":
        return Recycle
      case "social":
        return Users
    }
  }

  const simulateProgress = () => {
    const updatedAchievements = userAchievements.map((achievement) => {
      if (achievement.id === "cooking_streak" && !achievement.unlocked) {
        const newProgress = Math.min(achievement.progress + 1, achievement.maxProgress)
        const unlocked = newProgress >= achievement.maxProgress

        if (unlocked) {
          toast({
            title: "🏆 Achievement Unlocked!",
            description: `${achievement.title} - ${achievement.description}`,
          })
        }

        return { ...achievement, progress: newProgress, unlocked }
      }
      return achievement
    })

    setUserAchievements(updatedAchievements)
  }

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              Level {level} Chef
            </span>
            <Badge variant="secondary">{totalPoints} XP</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {level + 1}</span>
              <span>{levelProgress}/100 XP</span>
            </div>
            <Progress value={levelProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Achievement Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {["cooking", "matching", "sustainability", "social"].map((category) => {
          const categoryAchievements = userAchievements.filter((a) => a.category === category)
          const unlockedCount = categoryAchievements.filter((a) => a.unlocked).length
          const CategoryIcon = getCategoryIcon(category as Achievement["category"])

          return (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between capitalize">
                  <span className="flex items-center gap-2">
                    <CategoryIcon className="h-5 w-5" />
                    {category}
                  </span>
                  <Badge variant="outline">
                    {unlockedCount}/{categoryAchievements.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-3 rounded-lg border transition-all ${
                        achievement.unlocked ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                      } ${getRarityColor(achievement.rarity)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${achievement.unlocked ? "bg-green-100" : "bg-gray-100"}`}>
                          <achievement.icon
                            className={`h-4 w-4 ${achievement.unlocked ? "text-green-600" : "text-gray-400"}`}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4
                              className={`font-medium text-sm ${
                                achievement.unlocked ? "text-green-900" : "text-gray-700"
                              }`}
                            >
                              {achievement.title}
                            </h4>
                            <Badge variant={getRarityBadgeVariant(achievement.rarity)} className="text-xs capitalize">
                              {achievement.rarity}
                            </Badge>
                            {achievement.unlocked && <Trophy className="h-3 w-3 text-amber-500" />}
                          </div>

                          <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>

                          {!achievement.unlocked && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Progress</span>
                                <span>
                                  {achievement.progress}/{achievement.maxProgress}
                                </span>
                              </div>
                              <Progress
                                value={(achievement.progress / achievement.maxProgress) * 100}
                                className="h-1"
                              />
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">+{achievement.points} XP</span>
                            {achievement.unlocked && (
                              <Badge variant="secondary" className="text-xs">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Unlocked
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Demo Button */}
      <div className="text-center">
        <Button onClick={simulateProgress} variant="outline">
          <Target className="h-4 w-4 mr-2" />
          Simulate Progress (Demo)
        </Button>
      </div>
    </div>
  )
}
