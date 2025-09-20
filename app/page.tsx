"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Users, Clock, Sparkles, Heart, TrendingUp } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth-context"

export default function HomePage() {
  const { user } = useAuth()

  return (
    <AuthGuard requireAuth={false}>
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
                {user ? (
                  <>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/pantry">Pantry</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/match">Match</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/profile">Profile</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/auth/login">Sign In</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/auth/signup">Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-card via-background to-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-6 text-sm font-medium">
                <Sparkles className="h-4 w-4 mr-2" />
                Smart Recipe Matching
              </Badge>
              <h1 className="font-mono font-bold text-5xl sm:text-6xl lg:text-7xl text-foreground mb-6 text-balance">
                Turn what you have into
                <span className="text-primary"> dinner you'll love</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
                Swipe through recipes matched to your pantry. No more food waste, no more "what's for dinner?" Just
                smart cooking that brings households together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link href={user ? "/match" : "/auth/signup"}>Start Matching Recipes</Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent" asChild>
                  <Link href={user ? "/pantry" : "/auth/signup"}>
                    <Users className="h-5 w-5 mr-2" />
                    {user ? "Manage Pantry" : "Create Household"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-mono font-bold text-3xl sm:text-4xl text-foreground mb-4">How PantryMatch Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to transform your cooking experience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-border bg-card hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ChefHat className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-mono font-semibold text-xl mb-4">Scan Your Pantry</h3>
                  <p className="text-muted-foreground">
                    Quick barcode scanning and photo recognition to build your shared household pantry inventory.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="h-16 w-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-mono font-semibold text-xl mb-4">Swipe & Match</h3>
                  <p className="text-muted-foreground">
                    Tinder-style swiping on recipes that match your ingredients, dietary needs, and cooking time.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-mono font-semibold text-xl mb-4">Cook Together</h3>
                  <p className="text-muted-foreground">
                    Step-by-step cooking mode with timers, substitution suggestions, and portion scaling.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="font-mono font-bold text-3xl text-primary mb-2">85%</div>
                <div className="text-sm text-muted-foreground">Less Food Waste</div>
              </div>
              <div>
                <div className="font-mono font-bold text-3xl text-secondary mb-2">2min</div>
                <div className="text-sm text-muted-foreground">Average Decision Time</div>
              </div>
              <div>
                <div className="font-mono font-bold text-3xl text-accent mb-2">10k+</div>
                <div className="text-sm text-muted-foreground">Recipe Matches</div>
              </div>
              <div>
                <div className="font-mono font-bold text-3xl text-primary mb-2">95%</div>
                <div className="text-sm text-muted-foreground">Household Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <TrendingUp className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h2 className="font-mono font-bold text-3xl sm:text-4xl mb-6">Ready to revolutionize dinner time?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of households already saving time, reducing waste, and discovering amazing meals.
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <Link href={user ? "/match" : "/auth/signup"}>{user ? "Start Matching" : "Start Your Free Trial"}</Link>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card border-t border-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChefHat className="h-6 w-6 text-primary" />
                <span className="font-mono font-semibold text-foreground">PantryMatch</span>
              </div>
              <p className="text-sm text-muted-foreground">© 2025 PantryMatch. Smart cooking for modern households.</p>
            </div>
          </div>
        </footer>
      </div>
    </AuthGuard>
  )
}
