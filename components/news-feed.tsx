"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { VotingModal } from "@/components/voting-modal"
import { ThumbsUp, ThumbsDown, MessageCircle, ExternalLink, Clock, User, TrendingUp } from "lucide-react"

const mockArticles = [
  {
    id: 1,
    title: "Cardano Introduces New Smart Contract Capabilities",
    summary:
      "The latest Cardano update brings enhanced smart contract functionality, enabling more complex DeFi applications and improved scalability.",
    category: "Technology",
    author: "CryptoReporter",
    timestamp: "2 hours ago",
    upvotes: 127,
    downvotes: 8,
    comments: 23,
    verificationProgress: 78,
    sources: 3,
    urgency: "medium",
    trending: true,
  },
  {
    id: 2,
    title: "Global Climate Summit Reaches Historic Agreement",
    summary:
      "World leaders have agreed on unprecedented climate action measures, including binding emissions targets and a $100B green technology fund.",
    category: "Politics",
    author: "NewsVerifier",
    timestamp: "4 hours ago",
    upvotes: 89,
    downvotes: 12,
    comments: 45,
    verificationProgress: 92,
    sources: 5,
    urgency: "high",
    trending: false,
  },
  {
    id: 3,
    title: "Breakthrough in Quantum Computing Achieved",
    summary:
      "Researchers demonstrate stable quantum computing at room temperature, potentially revolutionizing the field and making quantum computers more accessible.",
    category: "Science",
    author: "TechValidator",
    timestamp: "6 hours ago",
    upvotes: 203,
    downvotes: 5,
    comments: 67,
    verificationProgress: 85,
    sources: 4,
    urgency: "medium",
    trending: true,
  },
]

export function NewsFeed() {
  const [selectedArticle, setSelectedArticle] = useState<(typeof mockArticles)[0] | null>(null)
  const [votingModalOpen, setVotingModalOpen] = useState(false)

  const handleVoteClick = (article: (typeof mockArticles)[0]) => {
    setSelectedArticle(article)
    setVotingModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Latest News</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Recent
          </Button>
          <Button variant="outline" size="sm">
            Most Voted
          </Button>
          <Button variant="outline" size="sm">
            Verified
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {mockArticles.map((article) => (
          <Card key={article.id} className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary">{article.category}</Badge>
                    <Badge variant={article.urgency === "high" ? "destructive" : "outline"} className="text-xs">
                      {article.urgency} priority
                    </Badge>
                    {article.trending && (
                      <Badge variant="default" className="gap-1 text-xs">
                        <TrendingUp className="w-3 h-3" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-balance leading-tight">{article.title}</h3>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <p className="text-muted-foreground text-pretty leading-relaxed">{article.summary}</p>

              {/* Verification Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Verification Progress</span>
                  <span>{article.verificationProgress}% verified</span>
                </div>
                <Progress value={article.verificationProgress} className="h-2" />
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {article.author}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {article.timestamp}
                </div>
                <div>{article.sources} sources</div>
              </div>

              {/* Enhanced Voting Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-primary hover:bg-primary/10"
                    onClick={() => handleVoteClick(article)}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    {article.upvotes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 hover:bg-destructive/10"
                    onClick={() => handleVoteClick(article)}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    {article.downvotes}
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <MessageCircle className="w-4 h-4" />
                    {article.comments}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm" onClick={() => handleVoteClick(article)}>
                    Cast Vote
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Voting Modal */}
      {selectedArticle && (
        <VotingModal
          isOpen={votingModalOpen}
          onClose={() => {
            setVotingModalOpen(false)
            setSelectedArticle(null)
          }}
          article={selectedArticle}
        />
      )}
    </div>
  )
}
