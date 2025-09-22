"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Award, AlertTriangle, Target, Zap } from "lucide-react"

interface RewardPenaltyDisplayProps {
  userBalance: {
    address: string
    truthBalance: number
    rewardsEarned: number
    accuracyScore: number
    consecutiveAccurateVotes: number
    totalSubmissions: number
    verifiedSubmissions: number
    penaltyCount: number
    reputationLevel: "Novice" | "Trusted" | "Expert" | "Authority"
  }
  tokenomics: {
    truthfulSubmissionBonus: number
    falseSubmissionPenalty: number
    consecutiveAccuracyBonus: number
    earlyVoterBonus: number
    reputationThreshold: number
  }
}

export function RewardPenaltyDisplay({ userBalance, tokenomics }: RewardPenaltyDisplayProps) {
  const submissionSuccessRate =
    userBalance.totalSubmissions > 0 ? (userBalance.verifiedSubmissions / userBalance.totalSubmissions) * 100 : 0

  const getReputationColor = (level: string) => {
    switch (level) {
      case "Authority":
        return "bg-purple-500"
      case "Expert":
        return "bg-blue-500"
      case "Trusted":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getReputationBadgeVariant = (level: string) => {
    switch (level) {
      case "Authority":
        return "default"
      case "Expert":
        return "secondary"
      case "Trusted":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Reward Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Rewards Earned</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{userBalance.rewardsEarned.toLocaleString()} TRUTH</div>
          <p className="text-xs text-muted-foreground">From accurate voting and verified submissions</p>
        </CardContent>
      </Card>

      {/* Accuracy & Reputation */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reputation Level</CardTitle>
          <Award className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={getReputationBadgeVariant(userBalance.reputationLevel)}>
              {userBalance.reputationLevel}
            </Badge>
            <span className="text-sm text-muted-foreground">{userBalance.accuracyScore.toFixed(1)}% accuracy</span>
          </div>
          <Progress value={userBalance.accuracyScore} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {tokenomics.reputationThreshold - userBalance.accuracyScore > 0
              ? `${(tokenomics.reputationThreshold - userBalance.accuracyScore).toFixed(1)}% to next level`
              : "Maximum reputation achieved"}
          </p>
        </CardContent>
      </Card>

      {/* Consecutive Accuracy Streak */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Accuracy Streak</CardTitle>
          <Target className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{userBalance.consecutiveAccurateVotes}</div>
          <p className="text-xs text-muted-foreground">Consecutive accurate votes</p>
          <div className="mt-2 text-xs">
            <span className="text-green-600">
              +{(userBalance.consecutiveAccurateVotes * tokenomics.consecutiveAccuracyBonus * 100).toFixed(0)}%
            </span>
            <span className="text-muted-foreground"> bonus on next reward</span>
          </div>
        </CardContent>
      </Card>

      {/* Submission Success Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Submission Success</CardTitle>
          <Zap className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{submissionSuccessRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {userBalance.verifiedSubmissions} of {userBalance.totalSubmissions} verified
          </p>
          <div className="mt-2 text-xs">
            <span className="text-green-600">+{tokenomics.truthfulSubmissionBonus} TRUTH</span>
            <span className="text-muted-foreground"> per verified submission</span>
          </div>
        </CardContent>
      </Card>

      {/* Penalty Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Penalty Status</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{userBalance.penaltyCount}</div>
          <p className="text-xs text-muted-foreground">Total penalties received</p>
          {userBalance.penaltyCount > 0 && (
            <div className="mt-2 text-xs text-red-600">Higher penalty rates apply for repeat offenses</div>
          )}
        </CardContent>
      </Card>

      {/* Bonus Opportunities */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Bonuses</CardTitle>
          <Award className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Early voter bonus:</span>
              <span className="text-green-600">+{(tokenomics.earlyVoterBonus * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Reputation bonus:</span>
              <span className="text-green-600">
                +
                {userBalance.reputationLevel === "Authority"
                  ? "30"
                  : userBalance.reputationLevel === "Expert"
                    ? "20"
                    : userBalance.reputationLevel === "Trusted"
                      ? "10"
                      : "0"}
                %
              </span>
            </div>
            <div className="flex justify-between">
              <span>Streak bonus:</span>
              <span className="text-green-600">
                +{(userBalance.consecutiveAccurateVotes * tokenomics.consecutiveAccuracyBonus * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
