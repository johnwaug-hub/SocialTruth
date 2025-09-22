"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { ValidatorNFTCard } from "@/components/validator-nft-card"
import { LocationSelector } from "@/components/location-selector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Crown, Users, MapPin, Award, Plus } from "lucide-react"
import {
  nftValidatorSystem,
  locationService,
  type ValidatorRanking,
  type LocationData,
} from "@/lib/nft-validator-system"
import { useCardanoWallet } from "@/lib/cardano-wallet"

export default function ValidatorsPage() {
  const { isConnected, address } = useCardanoWallet()
  const [validators, setValidators] = useState<ValidatorRanking[]>([])
  const [userLocation, setUserLocation] = useState<LocationData | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [selectedTier, setSelectedTier] = useState<string>("all")

  useEffect(() => {
    // Load validators
    const allValidators = nftValidatorSystem.getAllValidators()
    setValidators(allValidators)

    // Load user location if connected
    if (address) {
      const location = locationService.getUserLocationData(address)
      setUserLocation(location)
    }
  }, [address])

  const handleLocationChange = (location: LocationData) => {
    setUserLocation(location)
    if (address) {
      locationService.setUserLocation(address, location)
    }
  }

  const filteredValidators = validators.filter((validator) => {
    const regionMatch = selectedRegion === "all" || validator.region === selectedRegion
    const tierMatch = selectedTier === "all" || validator.tier === selectedTier
    return regionMatch && tierMatch
  })

  const userValidator = address ? nftValidatorSystem.getValidatorRanking(address) : null

  const regions = ["all", "North America", "Europe", "Asia", "Oceania", "Global"]
  const tiers = ["all", "Bronze", "Silver", "Gold", "Platinum", "Diamond"]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Crown className="w-8 h-8 text-primary" />
                Validator Network
              </h1>
              <p className="text-muted-foreground">NFT-powered validator ranking system with regional specialization</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{validators.length}</div>
                  <div className="text-sm text-muted-foreground">Active Validators</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-2 text-accent" />
                  <div className="text-2xl font-bold">{new Set(validators.map((v) => v.region)).size}</div>
                  <div className="text-sm text-muted-foreground">Regions Covered</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <div className="text-2xl font-bold">
                    {validators.filter((v) => v.tier === "Diamond" || v.tier === "Platinum").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Elite Validators</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Crown className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">
                    {validators.reduce((sum, v) => sum + v.totalValidations, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Validations</div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="network" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="network">Validator Network</TabsTrigger>
                <TabsTrigger value="profile">My Profile</TabsTrigger>
                <TabsTrigger value="location">Location Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="network" className="space-y-6">
                {/* Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle>Filter Validators</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-sm font-medium mb-2 block">Region</label>
                        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {regions.map((region) => (
                              <SelectItem key={region} value={region}>
                                {region === "all" ? "All Regions" : region}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <label className="text-sm font-medium mb-2 block">Tier</label>
                        <Select value={selectedTier} onValueChange={setSelectedTier}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {tiers.map((tier) => (
                              <SelectItem key={tier} value={tier}>
                                {tier === "all" ? "All Tiers" : tier}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Validators Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredValidators.map((validator) => (
                    <ValidatorNFTCard key={validator.address} validator={validator} />
                  ))}
                </div>

                {filteredValidators.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Crown className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No Validators Found</h3>
                      <p className="text-muted-foreground">
                        No validators match your current filters. Try adjusting the region or tier selection.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="profile" className="space-y-6">
                {!isConnected ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Crown className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
                      <p className="text-muted-foreground mb-4">
                        Connect your Cardano wallet to view your validator profile and NFT status.
                      </p>
                      <Button>Connect Wallet</Button>
                    </CardContent>
                  </Card>
                ) : userValidator ? (
                  <div className="max-w-2xl mx-auto">
                    <ValidatorNFTCard validator={userValidator} showActions={false} />
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Plus className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">Become a Validator</h3>
                      <p className="text-muted-foreground mb-4">
                        You don't have a validator NFT yet. Earn one by participating in the platform and building your
                        reputation.
                      </p>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div>• Complete 10+ accurate votes</div>
                        <div>• Maintain 80%+ accuracy rate</div>
                        <div>• Stake 1000+ TRUTH tokens</div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="location" className="space-y-6">
                <div className="max-w-2xl mx-auto">
                  <LocationSelector onLocationChange={handleLocationChange} currentLocation={userLocation} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
