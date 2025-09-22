"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Crown, Shield, Award, MapPin, Star, TrendingUp, ExternalLink } from "lucide-react"
import type { ValidatorRanking, ValidatorTier } from "@/lib/nft-validator-system"

interface ValidatorNFTCardProps {
  validator: ValidatorRanking
  showActions?: boolean
}

export function ValidatorNFTCard({ validator, showActions = true }: ValidatorNFTCardProps) {
  const getTierIcon = (tier: ValidatorTier) => {
    switch (tier) {
      case "Diamond":
        return <Crown className="w-5 h-5 text-purple-500" />
      case "Platinum":
        return <Star className="w-5 h-5 text-gray-400" />
      case "Gold":
        return <Award className="w-5 h-5 text-yellow-500" />
      case "Silver":
        return <Shield className="w-5 h-5 text-gray-500" />
      case "Bronze":
        return <Shield className="w-5 h-5 text-orange-600" />
    }
  }

  const getTierColor = (tier: ValidatorTier) => {
    switch (tier) {
      case "Diamond":
        return "bg-gradient-to-r from-purple-500 to-pink-500"
      case "Platinum":
        return "bg-gradient-to-r from-gray-400 to-gray-600"
      case "Gold":
        return "bg-gradient-to-r from-yellow-400 to-orange-500"
      case "Silver":
        return "bg-gradient-to-r from-gray-300 to-gray-500"
      case "Bronze":
        return "bg-gradient-to-r from-orange-400 to-red-500"
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={`/nft-images/validator-${validator.tier.toLowerCase()}.png`} />
              <AvatarFallback className={`${getTierColor(validator.tier)} text-white font-bold`}>
                {validator.tier[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {getTierIcon(validator.tier)}
                {validator.tier} Validator
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {validator.region}
              </div>
            </div>
          </div>
          <Badge className={`${getTierColor(validator.tier)} text-white`}>NFT #{validator.nftId.slice(-6)}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">{validator.accuracyScore.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{validator.totalValidations}</div>
            <div className="text-xs text-muted-foreground">Validations</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-accent">{validator.reputation}</div>
            <div className="text-xs text-muted-foreground">Reputation</div>
          </div>
        </div>

        {/* Specializations */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Specializations</div>
          <div className="flex flex-wrap gap-1">
            {validator.specializations.map((spec) => (
              <Badge key={spec} variant="secondary" className="text-xs">
                {spec}
              </Badge>
            ))}
          </div>
        </div>

        {/* Privileges */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Validator Privileges</div>
          <div className="space-y-1">
            {validator.privileges.slice(0, 2).map((privilege) => (
              <div key={privilege.type} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{privilege.description}</span>
                {privilege.multiplier && (
                  <Badge variant="outline" className="text-xs">
                    {privilege.multiplier}x
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Reputation Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Reputation Progress</span>
            <span>{validator.reputation}/2000</span>
          </div>
          <Progress value={(validator.reputation / 2000) * 100} className="h-2" />
        </div>

        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              <TrendingUp className="w-3 h-3 mr-1" />
              View Stats
            </Button>
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              <ExternalLink className="w-3 h-3 mr-1" />
              View NFT
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
