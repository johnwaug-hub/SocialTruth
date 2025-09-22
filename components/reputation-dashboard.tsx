"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Trophy,
  TrendingUp,
  Target,
  Coins,
  History,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { newsContract, type UserTokenBalance, type TokenTransaction } from "@/lib/smart-contract"
import { RewardPenaltyDisplay } from "@/components/reward-penalty-display"

interface ReputationStats {
  rank: number
  totalUsers: number
  accuracyTrend: "up" | "down" | "stable"
  recentPerformance: number[]
}

export function ReputationDashboard({ userAddress }: { userAddress: string }) {
  const [userBalance, setUserBalance] = useState<UserTokenBalance | null>(null)
  const [transactions, setTransactions] = useState<TokenTransaction[]>([])
  const [stats, setStats] = useState<ReputationStats>({
    rank: 1,
    totalUsers: 1247,
    accuracyTrend: "up",
    recentPerformance: [85, 88, 92, 89, 94],
  })

  useEffect(() => {
    if (userAddress) {
      const balance = newsContract.getUserBalance(userAddress)
      const userTransactions = newsContract.getTransactionHistory(userAddress)

      setUserBalance(balance)
      setTransactions(userTransactions.slice(-10)) // Last 10 transactions
    }
  }, [userAddress])

  if (!userBalance) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">Loading reputation data...</p>
        </div>
      </div>
    )
  }

  const getReputationLevel = (score: number) => {
    if (score >= 95)
      return { level: "Truth Guardian", color: "bg-gradient-to-r from-yellow-400 to-orange-500", icon: Trophy }
    if (score >= 85) return { level: "Fact Checker", color: "bg-gradient-to-r from-blue-500 to-cyan-500", icon: Award }
    if (score >= 70)
      return { level: "Verifier", color: "bg-gradient-to-r from-green-500 to-emerald-500", icon: CheckCircle }
    if (score >= 50)
      return { level: "Contributor", color: "bg-gradient-to-r from-purple-500 to-pink-500", icon: Target }
    return { level: "Novice", color: "bg-gradient-to-r from-gray-400 to-gray-600", icon: Clock }
  }

  const reputation = getReputationLevel(userBalance.accuracyScore)
  const ReputationIcon = reputation.icon

  return (
    <div className="space-y-6">
      <RewardPenaltyDisplay userBalance={userBalance} tokenomics={newsContract.getTokenomics()} />

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Coins className="h-5 w-5 text-cyan-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">TRUTH Balance</p>
                <p className="text-2xl font-bold">{userBalance.truthBalance.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Accuracy Score</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold">{userBalance.accuracyScore.toFixed(1)}%</p>
                  {stats.accuracyTrend === "up" && <ArrowUp className="h-4 w-4 text-green-500" />}
                  {stats.accuracyTrend === "down" && <ArrowDown className="h-4 w-4 text-red-500" />}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Votes</p>
                <p className="text-2xl font-bold">{userBalance.totalVotes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Platform Rank</p>
                <p className="text-2xl font-bold">#{stats.rank}</p>
                <p className="text-xs text-muted-foreground">of {stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reputation Level Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ReputationIcon className="h-6 w-6" />
            <span>Reputation Level</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <Badge className={`${reputation.color} text-white px-3 py-1`}>{reputation.level}</Badge>
              <p className="text-sm text-muted-foreground mt-1">
                {userBalance.successfulVotes} successful votes out of {userBalance.totalVotes} total
              </p>
              <p className="text-sm text-green-600 mt-1">
                🔥 {userBalance.consecutiveAccurateVotes} consecutive accurate votes
              </p>
            </div>
            <Avatar className="h-16 w-16">
              <AvatarFallback className={`${reputation.color} text-white text-xl font-bold`}>
                {userAddress.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to next level</span>
              <span>{Math.min(userBalance.accuracyScore, 100).toFixed(1)}%</span>
            </div>
            <Progress value={Math.min(userBalance.accuracyScore, 100)} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Stats Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Voting Performance</CardTitle>
                <CardDescription>Your accuracy over recent votes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Successful Votes</span>
                    <span className="font-semibold text-green-600">{userBalance.successfulVotes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Failed Votes</span>
                    <span className="font-semibold text-red-600">
                      {userBalance.totalVotes - userBalance.successfulVotes}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Success Rate</span>
                    <span className="font-semibold">{userBalance.accuracyScore.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Penalties Received</span>
                    <span className="font-semibold text-red-600">{userBalance.penaltyCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Submission Performance</CardTitle>
                <CardDescription>Your article submission success rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Submissions</span>
                    <span className="font-semibold">{userBalance.totalSubmissions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Verified Submissions</span>
                    <span className="font-semibold text-green-600">{userBalance.verifiedSubmissions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Success Rate</span>
                    <span className="font-semibold">
                      {userBalance.totalSubmissions > 0
                        ? ((userBalance.verifiedSubmissions / userBalance.totalSubmissions) * 100).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Reputation Level</span>
                    <Badge variant="outline">{userBalance.reputationLevel}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>Recent Transactions</span>
              </CardTitle>
              <CardDescription>Your latest TRUTH token activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No transactions yet</p>
                ) : (
                  transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {tx.type === "reward" && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {tx.type === "penalty" && <XCircle className="h-4 w-4 text-red-500" />}
                        {tx.type === "vote_stake" && <Target className="h-4 w-4 text-blue-500" />}
                        {tx.type === "submission" && <Coins className="h-4 w-4 text-cyan-500" />}
                        {tx.type === "burn" && <XCircle className="h-4 w-4 text-orange-500" />}

                        <div>
                          <p className="font-medium capitalize">{tx.type.replace("_", " ")}</p>
                          <p className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            tx.type === "reward"
                              ? "text-green-600"
                              : tx.type === "penalty"
                                ? "text-red-600"
                                : "text-gray-600"
                          }`}
                        >
                          {tx.type === "reward" ? "+" : "-"}
                          {tx.amount.toLocaleString()} TRUTH
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tx.txHash.slice(0, 8)}...{tx.txHash.slice(-6)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Badges Earned</CardTitle>
                <CardDescription>Recognition for your contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {userBalance.totalVotes >= 10 && (
                    <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                      <Target className="h-5 w-5 text-blue-500" />
                      <span className="text-sm font-medium">Active Voter</span>
                    </div>
                  )}

                  {userBalance.accuracyScore >= 80 && (
                    <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium">Truth Seeker</span>
                    </div>
                  )}

                  {userBalance.rewardsEarned >= 500 && (
                    <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                      <Coins className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm font-medium">Token Earner</span>
                    </div>
                  )}

                  {userBalance.successfulVotes >= 25 && (
                    <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded-lg">
                      <Trophy className="h-5 w-5 text-purple-500" />
                      <span className="text-sm font-medium">Expert Verifier</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Milestones</CardTitle>
                <CardDescription>Track your progress goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Votes Cast</span>
                      <span>{userBalance.totalVotes}/100</span>
                    </div>
                    <Progress value={(userBalance.totalVotes / 100) * 100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Accuracy Target</span>
                      <span>{userBalance.accuracyScore.toFixed(1)}/95%</span>
                    </div>
                    <Progress value={(userBalance.accuracyScore / 95) * 100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Rewards Earned</span>
                      <span>{userBalance.rewardsEarned}/1000</span>
                    </div>
                    <Progress value={(userBalance.rewardsEarned / 1000) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
