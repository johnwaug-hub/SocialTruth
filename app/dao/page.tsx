"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Building2, Coins, Users, TrendingUp, Clock, CheckCircle, XCircle, Plus, Eye } from "lucide-react"
import { useCardanoWallet } from "@/lib/cardano-wallet"

interface Proposal {
  id: string
  title: string
  description: string
  proposer: string
  status: "active" | "passed" | "rejected" | "pending"
  votesFor: number
  votesAgainst: number
  totalVotes: number
  endDate: Date
  requiredQuorum: number
  category: "governance" | "treasury" | "protocol" | "validator"
}

interface TreasuryStats {
  totalTruth: number
  totalAda: number
  monthlyBurn: number
  validatorRewards: number
  proposalFunding: number
}

export default function DAOPage() {
  const { isConnected, address, truthBalance } = useCardanoWallet()
  const [activeTab, setActiveTab] = useState("proposals")
  const [showCreateProposal, setShowCreateProposal] = useState(false)
  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
    category: "governance" as const,
    requestedAmount: "",
  })

  const [proposals] = useState<Proposal[]>([
    {
      id: "1",
      title: "Increase Validator Rewards by 15%",
      description:
        "Proposal to increase validator rewards to incentivize more participation and improve network security.",
      proposer: "addr1q9x7...8k2m",
      status: "active",
      votesFor: 2847,
      votesAgainst: 1203,
      totalVotes: 4050,
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      requiredQuorum: 5000,
      category: "protocol",
    },
    {
      id: "2",
      title: "Fund Community Education Program",
      description: "Allocate 50,000 TRUTH tokens for educational content creation and community outreach programs.",
      proposer: "addr1q8m3...7n9p",
      status: "active",
      votesFor: 3421,
      votesAgainst: 892,
      totalVotes: 4313,
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      requiredQuorum: 5000,
      category: "treasury",
    },
    {
      id: "3",
      title: "Implement Location-Based Validation Bonuses",
      description: "Add 5% bonus rewards for validators operating in underrepresented geographic regions.",
      proposer: "addr1q7k1...5m8x",
      status: "passed",
      votesFor: 4892,
      votesAgainst: 1108,
      totalVotes: 6000,
      endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      requiredQuorum: 5000,
      category: "validator",
    },
  ])

  const [treasuryStats] = useState<TreasuryStats>({
    totalTruth: 2847392,
    totalAda: 156789,
    monthlyBurn: 45000,
    validatorRewards: 125000,
    proposalFunding: 75000,
  })

  const handleCreateProposal = () => {
    // Implementation for creating new proposal
    console.log("Creating proposal:", newProposal)
    setShowCreateProposal(false)
    setNewProposal({ title: "", description: "", category: "governance", requestedAmount: "" })
  }

  const handleVote = (proposalId: string, vote: "for" | "against") => {
    // Implementation for voting on proposal
    console.log(`Voting ${vote} on proposal ${proposalId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-500"
      case "passed":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      case "pending":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="w-4 h-4" />
      case "passed":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      case "pending":
        return <Eye className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Social Truth DAO</h1>
        <p className="text-muted-foreground">
          Decentralized governance for the Social Truth ecosystem. Participate in proposals, vote on protocol changes,
          and help shape the future of truth verification.
        </p>
      </div>

      {/* DAO Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Proposals</p>
                <p className="text-2xl font-bold">{proposals.filter((p) => p.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">DAO Members</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Coins className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Treasury TRUTH</p>
                <p className="text-2xl font-bold">{treasuryStats.totalTruth.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Voting Power</p>
                <p className="text-2xl font-bold">{isConnected ? truthBalance?.toLocaleString() || "0" : "0"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="treasury">Treasury</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Active Proposals</h2>
            <Button onClick={() => setShowCreateProposal(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Proposal
            </Button>
          </div>

          {showCreateProposal && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Proposal</CardTitle>
                <CardDescription>Submit a proposal for DAO consideration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Proposal Title</Label>
                  <Input
                    id="title"
                    value={newProposal.title}
                    onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                    placeholder="Enter proposal title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProposal.description}
                    onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                    placeholder="Describe your proposal in detail"
                    rows={4}
                  />
                </div>
                <div className="flex gap-4">
                  <Button onClick={handleCreateProposal}>Submit Proposal</Button>
                  <Button variant="outline" onClick={() => setShowCreateProposal(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {proposals.map((proposal) => (
              <Card key={proposal.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {proposal.title}
                        <Badge variant="secondary" className={`${getStatusColor(proposal.status)} text-white`}>
                          {getStatusIcon(proposal.status)}
                          {proposal.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{proposal.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>
                          Votes: {proposal.totalVotes.toLocaleString()} / {proposal.requiredQuorum.toLocaleString()}{" "}
                          required
                        </span>
                        <span>{Math.round((proposal.totalVotes / proposal.requiredQuorum) * 100)}% quorum</span>
                      </div>
                      <Progress value={(proposal.totalVotes / proposal.requiredQuorum) * 100} className="mb-2" />

                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">For: {proposal.votesFor.toLocaleString()}</span>
                        <span className="text-red-600">Against: {proposal.votesAgainst.toLocaleString()}</span>
                      </div>
                    </div>

                    {proposal.status === "active" && isConnected && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleVote(proposal.id, "for")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Vote For
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleVote(proposal.id, "against")}>
                          Vote Against
                        </Button>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      Proposed by: {proposal.proposer} • Ends: {proposal.endDate.toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="treasury" className="space-y-6">
          <h2 className="text-xl font-semibold">DAO Treasury</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Treasury Holdings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>TRUTH Tokens</span>
                  <span className="font-bold">{treasuryStats.totalTruth.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>ADA</span>
                  <span className="font-bold">{treasuryStats.totalAda.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Allocations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Validator Rewards</span>
                  <span className="font-bold">{treasuryStats.validatorRewards.toLocaleString()} TRUTH</span>
                </div>
                <div className="flex justify-between">
                  <span>Proposal Funding</span>
                  <span className="font-bold">{treasuryStats.proposalFunding.toLocaleString()} TRUTH</span>
                </div>
                <div className="flex justify-between">
                  <span>Token Burn</span>
                  <span className="font-bold text-red-600">{treasuryStats.monthlyBurn.toLocaleString()} TRUTH</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="governance" className="space-y-6">
          <h2 className="text-xl font-semibold">Governance Framework</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Voting Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Minimum TRUTH to Propose</span>
                  <span className="font-bold">10,000 TRUTH</span>
                </div>
                <div className="flex justify-between">
                  <span>Minimum TRUTH to Vote</span>
                  <span className="font-bold">100 TRUTH</span>
                </div>
                <div className="flex justify-between">
                  <span>Quorum Required</span>
                  <span className="font-bold">5,000 votes</span>
                </div>
                <div className="flex justify-between">
                  <span>Voting Period</span>
                  <span className="font-bold">7 days</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Proposal Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Protocol Changes</span>
                  <Badge variant="outline">High Impact</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Treasury Allocation</span>
                  <Badge variant="outline">Medium Impact</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Validator Parameters</span>
                  <Badge variant="outline">Medium Impact</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Governance Rules</span>
                  <Badge variant="outline">High Impact</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
