"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, Coins, ExternalLink } from "lucide-react"

const mockVotingHistory = [
  {
    id: 1,
    articleTitle: "Cardano Introduces New Smart Contract Capabilities",
    vote: "verify",
    stake: 25,
    outcome: "correct",
    reward: 3.75,
    timestamp: "2 hours ago",
    status: "resolved",
  },
  {
    id: 2,
    articleTitle: "Global Climate Summit Reaches Historic Agreement",
    vote: "verify",
    stake: 15,
    outcome: null,
    reward: 0,
    timestamp: "4 hours ago",
    status: "pending",
  },
  {
    id: 3,
    articleTitle: "Breakthrough in Quantum Computing Achieved",
    vote: "dispute",
    stake: 10,
    outcome: "incorrect",
    reward: -10,
    timestamp: "1 day ago",
    status: "resolved",
  },
  {
    id: 4,
    articleTitle: "New Economic Policy Announced",
    vote: "verify",
    stake: 20,
    outcome: "correct",
    reward: 3.0,
    timestamp: "2 days ago",
    status: "resolved",
  },
]

export function VotingHistory() {
  const totalStaked = mockVotingHistory.reduce((sum, vote) => sum + vote.stake, 0)
  const totalRewards = mockVotingHistory.reduce((sum, vote) => sum + vote.reward, 0)
  const correctVotes = mockVotingHistory.filter((vote) => vote.outcome === "correct").length
  const totalResolved = mockVotingHistory.filter((vote) => vote.status === "resolved").length
  const accuracy = totalResolved > 0 ? (correctVotes / totalResolved) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{totalStaked}</div>
          <div className="text-sm text-muted-foreground">Total Staked (TRUTH)</div>
        </Card>
        <Card className="p-4 text-center">
          <div className={`text-2xl font-bold ${totalRewards >= 0 ? "text-primary" : "text-destructive"}`}>
            {totalRewards >= 0 ? "+" : ""}
            {totalRewards.toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground">Net Rewards (TRUTH)</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-accent">{accuracy.toFixed(0)}%</div>
          <div className="text-sm text-muted-foreground">Accuracy Rate</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{mockVotingHistory.length}</div>
          <div className="text-sm text-muted-foreground">Total Votes</div>
        </Card>
      </div>

      {/* Voting History List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Voting Activity</h3>
        <div className="space-y-4">
          {mockVotingHistory.map((vote) => (
            <div key={vote.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {vote.vote === "verify" ? (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    )}
                    <Badge variant={vote.vote === "verify" ? "default" : "destructive"} className="text-xs">
                      {vote.vote === "verify" ? "Verified" : "Disputed"}
                    </Badge>
                  </div>

                  <Badge variant={vote.status === "resolved" ? "secondary" : "outline"} className="text-xs">
                    {vote.status === "resolved" ? (vote.outcome === "correct" ? "Correct" : "Incorrect") : "Pending"}
                  </Badge>
                </div>

                <h4 className="font-medium text-balance">{vote.articleTitle}</h4>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Coins className="w-3 h-3" />
                    {vote.stake} TRUTH staked
                  </div>
                  {vote.status === "resolved" && (
                    <div
                      className={`flex items-center gap-1 ${vote.reward >= 0 ? "text-primary" : "text-destructive"}`}
                    >
                      <Coins className="w-3 h-3" />
                      {vote.reward >= 0 ? "+" : ""}
                      {vote.reward} TRUTH
                    </div>
                  )}
                  <span>{vote.timestamp}</span>
                </div>
              </div>

              <Button variant="ghost" size="sm">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
