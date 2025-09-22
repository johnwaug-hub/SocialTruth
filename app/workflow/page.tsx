import { GitBranch, User, Shield, CheckCircle, XCircle, Trophy, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function WorkflowPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Social Truth Workflow</h1>
          <p className="text-xl text-muted-foreground">
            From News Submission to Reputation: A Complete Validation Journey
          </p>
        </div>

        {/* Workflow Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Validation Process Overview
            </CardTitle>
            <CardDescription>Example scenario: 1 Submitter + 4 Validators (3 Correct, 1 Wrong)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Step 1: Submission */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">1. News Submission</h3>
                <p className="text-sm text-muted-foreground">User submits news article with 100 TRUTH stake</p>
                <Badge variant="secondary" className="mt-2">
                  -100 TRUTH
                </Badge>
              </div>

              <ArrowRight className="w-6 h-6 text-muted-foreground mx-auto mt-8 hidden lg:block" />

              {/* Step 2: Validation */}
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">2. Validator Review</h3>
                <p className="text-sm text-muted-foreground">4 validators stake 10 TRUTH each to vote</p>
                <div className="flex gap-1 justify-center mt-2">
                  <Badge variant="outline" className="text-xs">
                    V1: 10 TRUTH
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    V2: 10 TRUTH
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    V3: 10 TRUTH
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    V4: 10 TRUTH
                  </Badge>
                </div>
              </div>

              <ArrowRight className="w-6 h-6 text-muted-foreground mx-auto mt-8 hidden lg:block" />

              {/* Step 3: Voting Results */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">3. Voting Results</h3>
                <p className="text-sm text-muted-foreground">3 validators vote "True", 1 votes "False"</p>
                <div className="flex gap-1 justify-center mt-2">
                  <Badge className="bg-green-100 text-green-700 text-xs">✓ True</Badge>
                  <Badge className="bg-green-100 text-green-700 text-xs">✓ True</Badge>
                  <Badge className="bg-green-100 text-green-700 text-xs">✓ True</Badge>
                  <Badge className="bg-red-100 text-red-700 text-xs">✗ False</Badge>
                </div>
              </div>

              <ArrowRight className="w-6 h-6 text-muted-foreground mx-auto mt-8 hidden lg:block" />

              {/* Step 4: Rewards & Reputation */}
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="font-semibold mb-2">4. Final Outcome</h3>
                <p className="text-sm text-muted-foreground">Rewards distributed, reputation updated</p>
                <Badge variant="secondary" className="mt-2">
                  Consensus: TRUE
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Winning Validators (3)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Validator 1 (Gold Tier)</p>
                    <p className="text-sm text-muted-foreground">Voted: True ✓</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">+25 TRUTH</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Validator 2 (Silver Tier)</p>
                    <p className="text-sm text-muted-foreground">Voted: True ✓</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">+20 TRUTH</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Validator 3 (Bronze Tier)</p>
                    <p className="text-sm text-muted-foreground">Voted: True ✓</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">+15 TRUTH</Badge>
                </div>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm font-medium">Reputation Impact: +5 points each</p>
                <p className="text-sm text-muted-foreground">Accuracy streak continued</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                Losing Validator (1)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium">Validator 4 (Bronze Tier)</p>
                  <p className="text-sm text-muted-foreground">Voted: False ✗</p>
                </div>
                <Badge className="bg-red-100 text-red-700">-10 TRUTH</Badge>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm font-medium">Reputation Impact: -3 points</p>
                <p className="text-sm text-muted-foreground">Accuracy streak broken</p>
                <p className="text-sm text-muted-foreground">Penalty count increased</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submitter Outcome */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Submitter Outcome
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium">Original Submitter</p>
                <p className="text-sm text-muted-foreground">Article verified as TRUE by consensus</p>
              </div>
              <div className="text-right">
                <Badge className="bg-blue-100 text-blue-700 mb-1">+150 TRUTH</Badge>
                <p className="text-sm text-muted-foreground">Stake returned + bonus</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Reputation Boost: +10 points</p>
                <p className="text-muted-foreground">Truthful submission bonus</p>
              </div>
              <div>
                <p className="font-medium">Total Earned: +50 TRUTH</p>
                <p className="text-muted-foreground">After stake return</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button size="lg" className="gap-2">
            <GitBranch className="w-4 h-4" />
            View Interactive Workflow
          </Button>
        </div>
      </div>
    </div>
  )
}
