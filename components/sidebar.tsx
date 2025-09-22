import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Award, Clock, CheckCircle, Trophy, ExternalLink } from "lucide-react"

export function Sidebar() {
  return (
    <aside className="w-80 p-6 border-r bg-card/50">
      <div className="space-y-6">
        {/* User Reputation */}
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Your Reputation</h3>
              <Badge variant="secondary">Level 3</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Trust Score</span>
                <span className="font-medium">847/1000</span>
              </div>
              <Progress value={84.7} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>23 Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-accent" />
                <span>5 Rewards</span>
              </div>
            </div>
            <Link href="/reputation">
              <Button variant="outline" size="sm" className="w-full gap-2 mt-3 bg-transparent">
                <Trophy className="w-4 h-4" />
                View Full Dashboard
                <ExternalLink className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Platform Stats */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Platform Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm">Articles Today</span>
              </div>
              <span className="font-medium">142</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-sm">Pending Votes</span>
              </div>
              <span className="font-medium">38</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="text-sm">Verified Today</span>
              </div>
              <span className="font-medium">89</span>
            </div>
          </div>
        </Card>

        {/* Categories */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Categories</h3>
          <div className="space-y-2">
            {["Politics", "Technology", "Science", "Economics", "Health"].map((category) => (
              <button
                key={category}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm"
              >
                {category}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </aside>
  )
}
