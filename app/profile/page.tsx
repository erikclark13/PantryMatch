"use client"

import { AppNavigation } from "@/components/app-navigation"
import { AchievementSystem } from "@/components/achievement-system"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Calendar, TrendingUp, Heart, ChefHat, Clock, Utensils, Award, Users, Settings } from "lucide-react"

export default function ProfilePage() {
  const userStats = {
    recipesCooked: 47,
    totalCookingTime: 1240, // minutes
    favoriteRecipes: 23,
    wasteReduced: 85, // percentage
    householdRating: 4.8,
    streakDays: 12,
    joinDate: "January 2025",
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <Card className="md:w-1/3">
            <CardHeader className="text-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">Sarah Johnson</CardTitle>
              <p className="text-muted-foreground">Home Chef • Level 3</p>
              <div className="flex justify-center gap-2 mt-4">
                <Badge variant="secondary">
                  <Award className="h-3 w-3 mr-1" />
                  Waste Warrior
                </Badge>
                <Badge variant="outline">
                  <Users className="h-3 w-3 mr-1" />
                  Household Admin
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {userStats.joinDate}</span>
                </div>
                <Separator />
                <Button className="w-full bg-transparent" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <ChefHat className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{userStats.recipesCooked}</div>
                <div className="text-xs text-muted-foreground">Recipes Cooked</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold">{Math.round(userStats.totalCookingTime / 60)}h</div>
                <div className="text-xs text-muted-foreground">Cooking Time</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{userStats.favoriteRecipes}</div>
                <div className="text-xs text-muted-foreground">Favorites</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{userStats.wasteReduced}%</div>
                <div className="text-xs text-muted-foreground">Waste Reduced</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-mono font-bold text-2xl">Achievements & Progress</h2>
            <Badge variant="outline" className="text-sm">
              <Award className="h-4 w-4 mr-1" />
              6/12 Unlocked
            </Badge>
          </div>
          <AchievementSystem />
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Cooked", item: "Creamy Lemon Chicken Pasta", time: "2 hours ago", icon: ChefHat },
                { action: "Liked", item: "Mediterranean Stuffed Peppers", time: "1 day ago", icon: Heart },
                { action: "Added to pantry", item: "6 items from grocery run", time: "2 days ago", icon: User },
                { action: "Achieved", item: "First Match milestone", time: "3 days ago", icon: Award },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="p-2 rounded-full bg-primary/10">
                    <activity.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {activity.action} <span className="text-muted-foreground">{activity.item}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
