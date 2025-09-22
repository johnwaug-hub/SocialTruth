"use client"

// NFT-based validator ranking system
export interface ValidatorNFT {
  id: string
  tokenName: string
  policyId: string
  tier: ValidatorTier
  region: string
  specialization: string[]
  mintedAt: number
  owner: string
  metadata: {
    name: string
    description: string
    image: string
    attributes: ValidatorAttribute[]
  }
}

export interface ValidatorAttribute {
  trait_type: string
  value: string | number
}

export type ValidatorTier = "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond"

export interface ValidatorRanking {
  address: string
  tier: ValidatorTier
  nftId: string
  accuracyScore: number
  totalValidations: number
  specializations: string[]
  region: string
  reputation: number
  privileges: ValidatorPrivilege[]
}

export interface ValidatorPrivilege {
  type: "priority_voting" | "reduced_stake" | "bonus_rewards" | "regional_authority" | "dispute_resolution"
  description: string
  multiplier?: number
}

export interface LocationData {
  country: string
  region: string
  city?: string
  coordinates?: {
    lat: number
    lng: number
  }
  timezone: string
}

export class NFTValidatorSystem {
  private static instance: NFTValidatorSystem
  private validators: Map<string, ValidatorRanking> = new Map()
  private nfts: Map<string, ValidatorNFT> = new Map()

  static getInstance(): NFTValidatorSystem {
    if (!NFTValidatorSystem.instance) {
      NFTValidatorSystem.instance = new NFTValidatorSystem()
    }
    return NFTValidatorSystem.instance
  }

  async mintValidatorNFT(
    userAddress: string,
    tier: ValidatorTier,
    region: string,
    specializations: string[],
  ): Promise<{ success: boolean; nftId?: string; error?: string }> {
    try {
      const nftId = `validator_nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const policyId = "d5e6bf0500378d4f0da4e8dde6becec7621cd8cbf5cbb9b87013d4cc"

      const nft: ValidatorNFT = {
        id: nftId,
        tokenName: `TruthValidator${tier}${region}`,
        policyId,
        tier,
        region,
        specialization: specializations,
        mintedAt: Date.now(),
        owner: userAddress,
        metadata: {
          name: `Truth Validator - ${tier}`,
          description: `${tier} tier validator NFT for ${region} region with specializations in ${specializations.join(", ")}`,
          image: `/nft-images/validator-${tier.toLowerCase()}.png`,
          attributes: [
            { trait_type: "Tier", value: tier },
            { trait_type: "Region", value: region },
            { trait_type: "Specializations", value: specializations.length },
            { trait_type: "Minted", value: new Date().toISOString() },
          ],
        },
      }

      this.nfts.set(nftId, nft)

      // Create validator ranking
      const ranking: ValidatorRanking = {
        address: userAddress,
        tier,
        nftId,
        accuracyScore: 0,
        totalValidations: 0,
        specializations,
        region,
        reputation: this.getInitialReputation(tier),
        privileges: this.getTierPrivileges(tier),
      }

      this.validators.set(userAddress, ranking)

      return { success: true, nftId }
    } catch (error) {
      return { success: false, error: "Failed to mint validator NFT" }
    }
  }

  private getTierPrivileges(tier: ValidatorTier): ValidatorPrivilege[] {
    const basePrivileges: ValidatorPrivilege[] = []

    switch (tier) {
      case "Diamond":
        basePrivileges.push(
          { type: "dispute_resolution", description: "Can resolve high-stakes disputes", multiplier: 3.0 },
          { type: "regional_authority", description: "Regional validation authority", multiplier: 2.5 },
        )
      case "Platinum":
        basePrivileges.push({ type: "bonus_rewards", description: "50% bonus on all rewards", multiplier: 1.5 })
      case "Gold":
        basePrivileges.push({ type: "reduced_stake", description: "50% reduced minimum stake", multiplier: 0.5 })
      case "Silver":
        basePrivileges.push({ type: "priority_voting", description: "Priority in voting queues", multiplier: 1.2 })
      case "Bronze":
        break
    }

    return basePrivileges
  }

  private getInitialReputation(tier: ValidatorTier): number {
    const reputationMap = {
      Bronze: 100,
      Silver: 250,
      Gold: 500,
      Platinum: 1000,
      Diamond: 2000,
    }
    return reputationMap[tier]
  }

  getValidatorsForRegion(region: string, specialization?: string): ValidatorRanking[] {
    return Array.from(this.validators.values()).filter((validator) => {
      const regionMatch = validator.region === region
      const specializationMatch = !specialization || validator.specializations.includes(specialization)
      return regionMatch && specializationMatch
    })
  }

  getValidatorRanking(address: string): ValidatorRanking | null {
    return this.validators.get(address) || null
  }

  getAllValidators(): ValidatorRanking[] {
    return Array.from(this.validators.values())
  }

  getValidatorNFT(nftId: string): ValidatorNFT | null {
    return this.nfts.get(nftId) || null
  }

  updateValidatorStats(address: string, wasCorrect: boolean, articleRegion: string): void {
    const validator = this.validators.get(address)
    if (!validator) return

    validator.totalValidations += 1

    if (wasCorrect) {
      validator.accuracyScore =
        (validator.accuracyScore * (validator.totalValidations - 1) + 100) / validator.totalValidations
      validator.reputation += 10
    } else {
      validator.accuracyScore =
        (validator.accuracyScore * (validator.totalValidations - 1) + 0) / validator.totalValidations
      validator.reputation = Math.max(0, validator.reputation - 5)
    }

    // Regional bonus for local validation
    if (validator.region === articleRegion && wasCorrect) {
      validator.reputation += 5
    }
  }
}

export class LocationService {
  private static instance: LocationService
  private userLocations: Map<string, LocationData> = new Map()

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService()
    }
    return LocationService.instance
  }

  async getUserLocation(): Promise<LocationData | null> {
    try {
      // Try to get user's location via geolocation API
      if (navigator.geolocation) {
        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords

              // Reverse geocoding (in real app, use proper service)
              const locationData: LocationData = {
                country: "Unknown",
                region: "Unknown",
                coordinates: { lat: latitude, lng: longitude },
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              }

              resolve(locationData)
            },
            () => {
              // Fallback to timezone-based detection
              resolve(this.getLocationFromTimezone())
            },
          )
        })
      } else {
        return this.getLocationFromTimezone()
      }
    } catch (error) {
      console.error("[v0] Location detection failed:", error)
      return null
    }
  }

  private getLocationFromTimezone(): LocationData {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    // Simple timezone to region mapping
    const timezoneRegions: Record<string, { country: string; region: string }> = {
      "America/New_York": { country: "United States", region: "North America" },
      "America/Los_Angeles": { country: "United States", region: "North America" },
      "Europe/London": { country: "United Kingdom", region: "Europe" },
      "Europe/Berlin": { country: "Germany", region: "Europe" },
      "Asia/Tokyo": { country: "Japan", region: "Asia" },
      "Asia/Shanghai": { country: "China", region: "Asia" },
      "Australia/Sydney": { country: "Australia", region: "Oceania" },
    }

    const location = timezoneRegions[timezone] || { country: "Unknown", region: "Global" }

    return {
      ...location,
      timezone,
    }
  }

  setUserLocation(address: string, location: LocationData): void {
    this.userLocations.set(address, location)
  }

  getUserLocationData(address: string): LocationData | null {
    return this.userLocations.get(address) || null
  }

  getRegionalNews(region: string): string[] {
    // Mock regional news categories
    const regionalCategories: Record<string, string[]> = {
      "North America": ["US Politics", "Canadian News", "Mexico Updates"],
      Europe: ["EU Politics", "UK News", "European Economy"],
      Asia: ["Asian Markets", "China News", "Japan Updates"],
      Global: ["World News", "International", "Global Economy"],
    }

    return regionalCategories[region] || regionalCategories["Global"]
  }
}

export const nftValidatorSystem = NFTValidatorSystem.getInstance()
export const locationService = LocationService.getInstance()
