"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Coins,
  Wallet,
  Crown,
  MapPin,
  TrendingUp,
  Zap,
  Target,
} from "lucide-react"
import { walletManager } from "@/lib/cardano-wallet"
import { nftValidatorSystem, locationService } from "@/lib/nft-validator-system"
import { newsContract } from "@/lib/smart-contract"

interface VotingModalProps {
  isOpen: boolean
  onClose: () => void
  article: {
    id: number
    title: string
    summary: string
    sources: number
    verificationProgress: number
    location?: {
      region: string
      country: string
    }
  }
}

export function VotingModal({ isOpen, onClose, article }: VotingModalProps) {
  const [voteType, setVoteType] = useState<"verify" | "dispute" | "">("")
  const [reasoning, setReasoning] = useState("")
  const [stakeAmount, setStakeAmount] = useState("10")
  const [walletBalance, setWalletBalance] = useState<string>("0.00")
  const [isConnected, setIsConnected] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [validatorInfo, setValidatorInfo] = useState<any>(null)
  const [userLocation, setUserLocation] = useState<any>(null)
  const [userBalance, setUserBalance] = useState<any>(null)
  const [tokenomics, setTokenomics] = useState<any>(null)

  useEffect(() => {
    if (isOpen) {
      checkWalletStatus()
    }
  }, [isOpen])

  const checkWalletStatus = async () => {
    const connected = walletManager.isConnected()
    setIsConnected(connected)

    if (connected) {
      try {
        const balance = await walletManager.getBalance()
        setWalletBalance(balance)

        const address = await walletManager.getAddress()

        const userBal = newsContract.getUserBalance(address)
        const tokenomicsData = newsContract.getTokenomics()
        setUserBalance(userBal)
        setTokenomics(tokenomicsData)

        const validator = nftValidatorSystem.getValidatorRanking(address)
        setValidatorInfo(validator)

        const location = locationService.getUserLocationData(address)
        setUserLocation(location)

        if (validator && (validator.tier === "Gold" || validator.tier === "Platinum" || validator.tier === "Diamond")) {
          setStakeAmount("5") // 50% reduction for high-tier validators
        }
      } catch (error) {
        console.error("[v0] Failed to get wallet balance:", error)
      }
    }
  }

  const handleSubmitVote = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first")
      return
    }

    setSubmitting(true)
    try {
      console.log("[v0] Submitting vote:", {
        articleId: article.id,
        voteType,
        reasoning,
        stakeAmount,
        walletAddress: await walletManager.getAddress(),
        validatorTier: validatorInfo?.tier,
        isRegionalValidator: validatorInfo?.region === article.location?.region,
      })

      await new Promise((resolve) => setTimeout(resolve, 2000))

      onClose()
    } catch (error) {
      console.error("[v0] Vote submission failed:", error)
      alert("Vote submission failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const canAffordStake = Number.parseFloat(walletBalance) >= Number.parseFloat(stakeAmount)
  const isRegionalValidator = validatorInfo?.region === article.location?.region
  const hasValidatorPrivileges = validatorInfo && validatorInfo.privileges.length > 0

  const baseReward = Number.parseFloat(stakeAmount) * (tokenomics?.rewardMultiplier || 1.5)
  let potentialReward = baseReward

  // Early voter bonus (first 10 voters)
  const earlyVoterBonus = tokenomics?.earlyVoterBonus || 0.25
  potentialReward *= 1 + earlyVoterBonus

  // Consecutive accuracy bonus
  const consecutiveBonus = userBalance
    ? Math.min(userBalance.consecutiveAccurateVotes * (tokenomics?.consecutiveAccuracyBonus || 0.1), 1.0)
    : 0
  potentialReward *= 1 + consecutiveBonus

  // Validator tier bonuses
  if (validatorInfo?.tier === "Platinum" || validatorInfo?.tier === "Diamond") {
    potentialReward *= 1.5
  }

  // Regional validator bonus
  if (isRegionalValidator) {
    potentialReward *= 1.2
  }

  // Reputation level bonuses
  if (userBalance?.reputationLevel === "Authority") {
    potentialReward *= 1.3
  } else if (userBalance?.reputationLevel === "Expert") {
    potentialReward *= 1.2
  } else if (userBalance?.reputationLevel === "Trusted") {
    potentialReward *= 1.1
  }

  let penaltyRate = tokenomics?.penaltyRate || 0.2
  if (userBalance && userBalance.penaltyCount > 5) {
    penaltyRate = Math.min(penaltyRate * (1 + userBalance.penaltyCount * 0.1), tokenomics?.maxPenaltyRate || 0.8)
  }
  const potentialPenalty = Number.parseFloat(stakeAmount) * penaltyRate

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Vote on Article Verification</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!isConnected && (
            <Alert>
              <Wallet className="h-4 w-4" />
              <AlertDescription>Please connect your Cardano wallet to participate in voting.</AlertDescription>
            </Alert>
          )}

          {userBalance && (
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">Your Performance</span>
                </div>
                <Badge variant="outline" className="bg-white">
                  {userBalance.reputationLevel}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Accuracy:</span>
                  <div className="font-medium text-green-600">{userBalance.accuracyScore.toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Streak:</span>
                  <div className="font-medium text-blue-600 flex items-center gap-1">
                    🔥 {userBalance.consecutiveAccurateVotes}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Penalties:</span>
                  <div className="font-medium text-red-600">{userBalance.penaltyCount}</div>
                </div>
              </div>
            </Card>
          )}

          {validatorInfo && (
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Validator Status</span>
                </div>
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  {validatorInfo.tier}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Region:</span>
                  <div className="font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {validatorInfo.region}
                    {isRegionalValidator && (
                      <Badge variant="secondary" className="text-xs ml-1">
                        Local
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Accuracy:</span>
                  <div className="font-medium">{validatorInfo.accuracyScore.toFixed(1)}%</div>
                </div>
              </div>

              {hasValidatorPrivileges && (
                <div className="mt-3 pt-3 border-t">
                  <div className="text-xs text-muted-foreground mb-2">Active Privileges:</div>
                  <div className="flex flex-wrap gap-1">
                    {validatorInfo.privileges.slice(0, 3).map((privilege: any) => (
                      <Badge key={privilege.type} variant="outline" className="text-xs">
                        {privilege.description}
                        {privilege.multiplier && ` (${privilege.multiplier}x)`}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          <Card className="p-4 bg-muted/50">
            <h3 className="font-semibold text-balance mb-2">{article.title}</h3>
            <p className="text-sm text-muted-foreground text-pretty mb-3">{article.summary}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{article.sources} sources</span>
              <span>{article.verificationProgress}% verified</span>
              {article.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {article.location.region}
                </span>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Card className="p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Verify</span>
              </div>
              <div className="text-2xl font-bold text-primary">127</div>
              <div className="text-xs text-muted-foreground">votes</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium">Dispute</span>
              </div>
              <div className="text-2xl font-bold text-destructive">8</div>
              <div className="text-xs text-muted-foreground">votes</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Pending</span>
              </div>
              <div className="text-2xl font-bold text-accent">23</div>
              <div className="text-xs text-muted-foreground">votes</div>
            </Card>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold">Your Vote</Label>
            <RadioGroup value={voteType} onValueChange={(value) => setVoteType(value as "verify" | "dispute")}>
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="verify" id="verify" />
                <div className="flex-1">
                  <label htmlFor="verify" className="flex items-center gap-2 cursor-pointer">
                    <ThumbsUp className="w-4 h-4 text-primary" />
                    <span className="font-medium">Verify as Truthful</span>
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    This article appears to be accurate and well-sourced
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="dispute" id="dispute" />
                <div className="flex-1">
                  <label htmlFor="dispute" className="flex items-center gap-2 cursor-pointer">
                    <ThumbsDown className="w-4 h-4 text-destructive" />
                    <span className="font-medium">Dispute as False</span>
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    This article contains inaccuracies or misleading information
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reasoning">Reasoning (Required)</Label>
            <Textarea
              id="reasoning"
              placeholder="Explain your vote decision. Include specific sources, fact-checks, or evidence..."
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              className="min-h-24"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Stake Amount</Label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <Coins className="w-4 h-4 text-accent" />
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="flex-1 bg-transparent outline-none"
                    min="1"
                    max="100"
                  />
                  <span className="text-sm text-muted-foreground">TRUTH</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Balance: {walletBalance} TRUTH
                <br />
                {validatorInfo && hasValidatorPrivileges ? (
                  <span className="text-primary">
                    Min:{" "}
                    {validatorInfo.tier === "Gold" ||
                    validatorInfo.tier === "Platinum" ||
                    validatorInfo.tier === "Diamond"
                      ? "5"
                      : "10"}{" "}
                    TRUTH (Validator)
                  </span>
                ) : (
                  <span>Min: 10 TRUTH</span>
                )}
              </div>
            </div>
            {!canAffordStake && isConnected && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Insufficient balance. You need at least {stakeAmount} TRUTH to stake.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="font-semibold">Potential Outcomes</span>
              {(validatorInfo || isRegionalValidator || consecutiveBonus > 0) && (
                <Badge variant="secondary" className="text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  Active Bonuses
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <div className="text-sm text-green-700 mb-1">If Correct:</div>
                <div className="text-xl font-bold text-green-600">+{potentialReward.toFixed(1)} TRUTH</div>
                <div className="text-xs text-green-600">
                  Stake returned + {(potentialReward - Number.parseFloat(stakeAmount)).toFixed(1)} reward
                </div>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <div className="text-sm text-red-700 mb-1">If Incorrect:</div>
                <div className="text-xl font-bold text-red-600">-{potentialPenalty.toFixed(1)} TRUTH</div>
                <div className="text-xs text-red-600">
                  {(penaltyRate * 100).toFixed(0)}% penalty rate
                  {userBalance && userBalance.penaltyCount > 5 && " (increased)"}
                </div>
              </div>
            </div>

            {/* Bonus breakdown */}
            <div className="space-y-2 text-xs border-t pt-3">
              <div className="font-medium text-muted-foreground mb-2">Active Bonuses:</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-between">
                  <span>Early voter:</span>
                  <span className="text-green-600">+{(earlyVoterBonus * 100).toFixed(0)}%</span>
                </div>
                {consecutiveBonus > 0 && (
                  <div className="flex justify-between">
                    <span>Accuracy streak:</span>
                    <span className="text-blue-600">+{(consecutiveBonus * 100).toFixed(0)}%</span>
                  </div>
                )}
                {isRegionalValidator && (
                  <div className="flex justify-between">
                    <span>Regional validator:</span>
                    <span className="text-purple-600">+20%</span>
                  </div>
                )}
                {(validatorInfo?.tier === "Platinum" || validatorInfo?.tier === "Diamond") && (
                  <div className="flex justify-between">
                    <span>{validatorInfo.tier} tier:</span>
                    <span className="text-yellow-600">+50%</span>
                  </div>
                )}
                {userBalance?.reputationLevel !== "Novice" && (
                  <div className="flex justify-between">
                    <span>{userBalance?.reputationLevel}:</span>
                    <span className="text-indigo-600">
                      +
                      {userBalance?.reputationLevel === "Authority"
                        ? "30"
                        : userBalance?.reputationLevel === "Expert"
                          ? "20"
                          : "10"}
                      %
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleSubmitVote}
              disabled={!isConnected || !voteType || !reasoning.trim() || !canAffordStake || submitting}
              className="flex-1"
            >
              {submitting ? "Submitting..." : "Submit Vote & Stake"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
