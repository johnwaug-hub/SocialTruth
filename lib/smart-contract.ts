"use client"

// Smart contract interface for Cardano news verification
export interface NewsArticle {
  id: string
  title: string
  content: string
  author: string
  category: string
  sources: string[]
  timestamp: number
  submissionStake: number
  location?: {
    region: string
    country: string
  }
}

export interface Vote {
  voter: string
  articleId: string
  voteType: "verify" | "dispute"
  reasoning: string
  stake: number
  timestamp: number
  validatorTier?: string
  isRegionalValidator?: boolean
}

export interface VotingResult {
  articleId: string
  verifyVotes: number
  disputeVotes: number
  totalStake: number
  isResolved: boolean
  finalVerdict: "verified" | "disputed" | "pending"
  rewardPool: number
}

export interface TruthTokenomics {
  totalSupply: number // 10,000,000 TRUTH tokens
  circulatingSupply: number
  submissionCost: number // Cost to submit news article
  minimumVoteStake: number // Minimum stake required to vote
  rewardMultiplier: number // Multiplier for accurate voters
  penaltyRate: number // Penalty for inaccurate voters
  treasuryPool: number // Platform treasury for rewards
  burnRate: number // Percentage of tokens burned on disputes
  truthfulSubmissionBonus: number // Bonus for verified submissions
  falseSubmissionPenalty: number // Penalty for disputed submissions
  consecutiveAccuracyBonus: number // Bonus for consecutive accurate votes
  reputationThreshold: number // Accuracy threshold for reputation bonuses
  maxPenaltyRate: number // Maximum penalty for repeat offenders
  earlyVoterBonus: number // Bonus for early accurate voters
}

export interface UserTokenBalance {
  address: string
  truthBalance: number
  stakedAmount: number
  rewardsEarned: number
  accuracyScore: number
  totalVotes: number
  successfulVotes: number
  consecutiveAccurateVotes: number
  totalSubmissions: number
  verifiedSubmissions: number
  penaltyCount: number
  lastVoteTimestamp: number
  reputationLevel: "Novice" | "Trusted" | "Expert" | "Authority"
}

export interface TokenTransaction {
  id: string
  type: "submission" | "vote_stake" | "reward" | "penalty" | "burn"
  amount: number
  from: string
  to: string
  articleId?: string
  timestamp: number
  txHash: string
}

export class NewsVerificationContract {
  private static instance: NewsVerificationContract
  private contractAddress = "addr1qxy2lshvlc8shupf2txcxl4qy5cpvjlgxjvwes7rnw8nawa6klfllvhxgs7k2qs"

  private tokenomics: TruthTokenomics = {
    totalSupply: 10000000, // 10M TRUTH tokens
    circulatingSupply: 7500000, // 75% in circulation
    submissionCost: 100, // 100 TRUTH to submit article
    minimumVoteStake: 10, // 10 TRUTH minimum to vote
    rewardMultiplier: 1.5, // 50% bonus for accurate voters
    penaltyRate: 0.2, // 20% penalty for inaccurate voters
    treasuryPool: 2500000, // 25% reserved for rewards
    burnRate: 0.1, // 10% of disputed stakes burned
    truthfulSubmissionBonus: 200, // 200 TRUTH bonus for verified submissions
    falseSubmissionPenalty: 0.5, // 50% penalty for disputed submissions
    consecutiveAccuracyBonus: 0.1, // 10% bonus per consecutive accurate vote
    reputationThreshold: 80, // 80% accuracy for reputation bonuses
    maxPenaltyRate: 0.8, // Maximum 80% penalty for repeat offenders
    earlyVoterBonus: 0.25, // 25% bonus for first 10 voters
  }

  private articles: Map<string, NewsArticle> = new Map()
  private votes: Map<string, Vote[]> = new Map()
  private userBalances: Map<string, UserTokenBalance> = new Map()
  private transactions: TokenTransaction[] = []

  public static getInstance(): NewsVerificationContract {
    if (!NewsVerificationContract.instance) {
      NewsVerificationContract.instance = new NewsVerificationContract()
    }
    return NewsVerificationContract.instance
  }

  public getUserBalance(address: string): UserTokenBalance {
    if (!this.userBalances.has(address)) {
      this.userBalances.set(address, {
        address,
        truthBalance: 1000, // Starting balance for new users
        stakedAmount: 0,
        rewardsEarned: 0,
        accuracyScore: 0,
        totalVotes: 0,
        successfulVotes: 0,
        consecutiveAccurateVotes: 0,
        totalSubmissions: 0,
        verifiedSubmissions: 0,
        penaltyCount: 0,
        lastVoteTimestamp: 0,
        reputationLevel: "Novice",
      })
    }
    return this.userBalances.get(address)!
  }

  private transferTokens(
    from: string,
    to: string,
    amount: number,
    type: TokenTransaction["type"],
    articleId?: string,
  ): boolean {
    const fromBalance = this.getUserBalance(from)

    if (fromBalance.truthBalance < amount) {
      return false // Insufficient balance
    }

    fromBalance.truthBalance -= amount

    if (to !== "burn") {
      const toBalance = this.getUserBalance(to)
      toBalance.truthBalance += amount
    }

    // Record transaction
    const transaction: TokenTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      amount,
      from,
      to,
      articleId,
      timestamp: Date.now(),
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
    }

    this.transactions.push(transaction)
    return true
  }

  public async submitArticle(
    article: Omit<NewsArticle, "id" | "timestamp" | "submissionStake">,
    authorAddress: string,
    location?: { region: string; country: string },
  ): Promise<{ success: boolean; articleId?: string; error?: string }> {
    try {
      const userBalance = this.getUserBalance(authorAddress)

      let submissionCost = this.tokenomics.submissionCost
      if (userBalance.reputationLevel === "Authority") {
        submissionCost = Math.floor(submissionCost * 0.5) // 50% discount for Authority users
      } else if (userBalance.reputationLevel === "Expert") {
        submissionCost = Math.floor(submissionCost * 0.7) // 30% discount for Expert users
      } else if (userBalance.reputationLevel === "Trusted") {
        submissionCost = Math.floor(submissionCost * 0.85) // 15% discount for Trusted users
      }

      if (userBalance.truthBalance < submissionCost) {
        return {
          success: false,
          error: `Insufficient TRUTH tokens. Need ${submissionCost}, have ${userBalance.truthBalance}`,
        }
      }

      if (!this.transferTokens(authorAddress, "treasury", submissionCost, "submission")) {
        return { success: false, error: "Failed to process submission payment" }
      }

      const articleId = `article_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const newArticle: NewsArticle = {
        ...article,
        id: articleId,
        timestamp: Date.now(),
        submissionStake: submissionCost,
        location,
      }

      this.articles.set(articleId, newArticle)
      this.votes.set(articleId, [])

      userBalance.totalSubmissions += 1

      return { success: true, articleId }
    } catch (error) {
      return { success: false, error: "Failed to submit article" }
    }
  }

  public async submitVote(
    vote: Omit<Vote, "timestamp">,
    voterAddress: string,
    validatorTier?: string,
    isRegionalValidator?: boolean,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const userBalance = this.getUserBalance(voterAddress)

      let minimumStake = this.tokenomics.minimumVoteStake
      if (validatorTier === "Gold" || validatorTier === "Platinum" || validatorTier === "Diamond") {
        minimumStake = Math.floor(minimumStake * 0.5) // 50% reduction for high-tier validators
      }

      if (vote.stake < minimumStake) {
        return { success: false, error: `Minimum stake is ${minimumStake} TRUTH tokens` }
      }

      if (userBalance.truthBalance < vote.stake) {
        return {
          success: false,
          error: `Insufficient TRUTH tokens. Need ${vote.stake}, have ${userBalance.truthBalance}`,
        }
      }

      userBalance.truthBalance -= vote.stake
      userBalance.stakedAmount += vote.stake

      const newVote: Vote = {
        ...vote,
        timestamp: Date.now(),
        validatorTier,
        isRegionalValidator,
      }

      const articleVotes = this.votes.get(vote.articleId) || []
      articleVotes.push(newVote)
      this.votes.set(vote.articleId, articleVotes)

      userBalance.totalVotes += 1

      this.transactions.push({
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: "vote_stake",
        amount: vote.stake,
        from: voterAddress,
        to: "staked",
        articleId: vote.articleId,
        timestamp: Date.now(),
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      })

      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to submit vote" }
    }
  }

  public async resolveVoting(articleId: string): Promise<VotingResult> {
    const votes = this.votes.get(articleId) || []
    const article = this.articles.get(articleId)

    if (!article) {
      throw new Error("Article not found")
    }

    const verifyVotes = votes.filter((v) => v.voteType === "verify")
    const disputeVotes = votes.filter((v) => v.voteType === "dispute")

    const verifyStake = verifyVotes.reduce((sum, v) => sum + v.stake, 0)
    const disputeStake = disputeVotes.reduce((sum, v) => sum + v.stake, 0)
    const totalStake = verifyStake + disputeStake

    const finalVerdict = verifyStake > disputeStake ? "verified" : "disputed"
    const winningVotes = finalVerdict === "verified" ? verifyVotes : disputeVotes
    const losingVotes = finalVerdict === "verified" ? disputeVotes : verifyVotes

    const rewardPool = totalStake * this.tokenomics.rewardMultiplier

    for (let i = 0; i < winningVotes.length; i++) {
      const vote = winningVotes[i]
      const userBalance = this.getUserBalance(vote.voter)
      let voterReward = (vote.stake / (finalVerdict === "verified" ? verifyStake : disputeStake)) * rewardPool

      if (i < 10) {
        voterReward *= 1 + this.tokenomics.earlyVoterBonus
      }

      const consecutiveBonus = Math.min(
        userBalance.consecutiveAccurateVotes * this.tokenomics.consecutiveAccuracyBonus,
        1.0,
      )
      voterReward *= 1 + consecutiveBonus

      if (vote.validatorTier === "Platinum" || vote.validatorTier === "Diamond") {
        voterReward *= 1.5
      }

      if (vote.isRegionalValidator && article.location) {
        voterReward *= 1.2
      }

      if (userBalance.reputationLevel === "Authority") {
        voterReward *= 1.3
      } else if (userBalance.reputationLevel === "Expert") {
        voterReward *= 1.2
      } else if (userBalance.reputationLevel === "Trusted") {
        voterReward *= 1.1
      }

      userBalance.stakedAmount -= vote.stake
      userBalance.truthBalance += vote.stake + voterReward
      userBalance.rewardsEarned += voterReward
      userBalance.successfulVotes += 1
      userBalance.consecutiveAccurateVotes += 1
      userBalance.lastVoteTimestamp = Date.now()

      userBalance.accuracyScore = (userBalance.successfulVotes / userBalance.totalVotes) * 100
      this.updateReputationLevel(userBalance)
    }

    for (const vote of losingVotes) {
      const userBalance = this.getUserBalance(vote.voter)

      let penaltyRate = this.tokenomics.penaltyRate
      if (userBalance.penaltyCount > 5) {
        penaltyRate = Math.min(penaltyRate * (1 + userBalance.penaltyCount * 0.1), this.tokenomics.maxPenaltyRate)
      }

      const penalty = vote.stake * penaltyRate

      userBalance.stakedAmount -= vote.stake
      userBalance.truthBalance += vote.stake - penalty
      userBalance.penaltyCount += 1
      userBalance.consecutiveAccurateVotes = 0
      userBalance.lastVoteTimestamp = Date.now()

      userBalance.accuracyScore = (userBalance.successfulVotes / userBalance.totalVotes) * 100
      this.updateReputationLevel(userBalance)
    }

    const submitterBalance = this.getUserBalance(article.author)
    if (finalVerdict === "verified") {
      const submissionBonus = this.tokenomics.truthfulSubmissionBonus
      submitterBalance.truthBalance += submissionBonus
      submitterBalance.rewardsEarned += submissionBonus
      submitterBalance.verifiedSubmissions += 1

      this.transactions.push({
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: "reward",
        amount: submissionBonus,
        from: "treasury",
        to: article.author,
        articleId,
        timestamp: Date.now(),
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      })
    } else {
      const submissionPenalty = article.submissionStake * this.tokenomics.falseSubmissionPenalty
      submitterBalance.truthBalance = Math.max(0, submitterBalance.truthBalance - submissionPenalty)

      this.transactions.push({
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: "penalty",
        amount: submissionPenalty,
        from: article.author,
        to: "burn",
        articleId,
        timestamp: Date.now(),
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      })
    }

    this.updateReputationLevel(submitterBalance)

    const burnAmount = totalStake * this.tokenomics.burnRate
    this.transactions.push({
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "burn",
      amount: burnAmount,
      from: "treasury",
      to: "burn",
      articleId,
      timestamp: Date.now(),
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
    })

    return {
      articleId,
      verifyVotes: verifyVotes.length,
      disputeVotes: disputeVotes.length,
      totalStake,
      isResolved: true,
      finalVerdict,
      rewardPool,
    }
  }

  private updateReputationLevel(userBalance: UserTokenBalance): void {
    const accuracyScore = userBalance.accuracyScore
    const totalVotes = userBalance.totalVotes

    if (totalVotes >= 100 && accuracyScore >= 95) {
      userBalance.reputationLevel = "Authority"
    } else if (totalVotes >= 50 && accuracyScore >= 90) {
      userBalance.reputationLevel = "Expert"
    } else if (totalVotes >= 20 && accuracyScore >= 80) {
      userBalance.reputationLevel = "Trusted"
    } else {
      userBalance.reputationLevel = "Novice"
    }
  }

  public getTokenomics(): TruthTokenomics {
    return { ...this.tokenomics }
  }

  public getTransactionHistory(address?: string): TokenTransaction[] {
    if (address) {
      return this.transactions.filter((tx) => tx.from === address || tx.to === address)
    }
    return [...this.transactions]
  }

  public getArticle(articleId: string): NewsArticle | undefined {
    return this.articles.get(articleId)
  }

  public getAllArticles(): NewsArticle[] {
    return Array.from(this.articles.values())
  }

  public getVotes(articleId: string): Vote[] {
    return this.votes.get(articleId) || []
  }

  public getVotingResult(articleId: string): VotingResult | null {
    const votes = this.getVotes(articleId)
    const article = this.getArticle(articleId)

    if (!article || votes.length === 0) return null

    const verifyVotes = votes.filter((v) => v.voteType === "verify")
    const disputeVotes = votes.filter((v) => v.voteType === "dispute")
    const totalStake = votes.reduce((sum, v) => sum + v.stake, 0)

    return {
      articleId,
      verifyVotes: verifyVotes.length,
      disputeVotes: disputeVotes.length,
      totalStake,
      isResolved: false,
      finalVerdict: "pending",
      rewardPool: totalStake * this.tokenomics.rewardMultiplier,
    }
  }
}

export const newsContract = NewsVerificationContract.getInstance()
