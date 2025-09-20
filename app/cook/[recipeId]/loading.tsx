import { ChefHat } from "lucide-react"

export default function CookModeLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <ChefHat className="h-12 w-12 text-orange-500 mx-auto mb-4 animate-pulse" />
        <p className="text-lg text-gray-600">Preparing your cooking experience...</p>
      </div>
    </div>
  )
}
