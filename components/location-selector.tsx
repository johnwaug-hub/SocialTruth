"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Globe, Navigation } from "lucide-react"
import { locationService, type LocationData } from "@/lib/nft-validator-system"

interface LocationSelectorProps {
  onLocationChange: (location: LocationData) => void
  currentLocation?: LocationData | null
}

export function LocationSelector({ onLocationChange, currentLocation }: LocationSelectorProps) {
  const [detectedLocation, setDetectedLocation] = useState<LocationData | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [isDetecting, setIsDetecting] = useState(false)

  const regions = ["North America", "South America", "Europe", "Asia", "Africa", "Oceania", "Global"]

  const countries = {
    "North America": ["United States", "Canada", "Mexico"],
    "South America": ["Brazil", "Argentina", "Chile", "Colombia"],
    Europe: ["United Kingdom", "Germany", "France", "Spain", "Italy"],
    Asia: ["Japan", "China", "India", "South Korea", "Singapore"],
    Africa: ["South Africa", "Nigeria", "Egypt", "Kenya"],
    Oceania: ["Australia", "New Zealand"],
    Global: ["International"],
  }

  useEffect(() => {
    if (currentLocation) {
      setSelectedRegion(currentLocation.region)
    }
  }, [currentLocation])

  const handleDetectLocation = async () => {
    setIsDetecting(true)
    try {
      const location = await locationService.getUserLocation()
      if (location) {
        setDetectedLocation(location)
        setSelectedRegion(location.region)
        onLocationChange(location)
      }
    } catch (error) {
      console.error("[v0] Location detection failed:", error)
    } finally {
      setIsDetecting(false)
    }
  }

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region)
    const locationData: LocationData = {
      country: "Unknown",
      region,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
    onLocationChange(locationData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Location Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Location Display */}
        {(currentLocation || detectedLocation) && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-primary" />
              <span className="font-medium">Current Location</span>
            </div>
            <div className="space-y-1 text-sm">
              <div>
                Region: <Badge variant="secondary">{(currentLocation || detectedLocation)?.region}</Badge>
              </div>
              <div>Country: {(currentLocation || detectedLocation)?.country}</div>
              <div>Timezone: {(currentLocation || detectedLocation)?.timezone}</div>
            </div>
          </div>
        )}

        {/* Auto-detect Location */}
        <div className="space-y-2">
          <Button
            onClick={handleDetectLocation}
            disabled={isDetecting}
            className="w-full bg-transparent"
            variant="outline"
          >
            <Navigation className="w-4 h-4 mr-2" />
            {isDetecting ? "Detecting..." : "Auto-detect Location"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Used for regional news filtering and validator assignment
          </p>
        </div>

        {/* Manual Region Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Or select region manually:</label>
          <Select value={selectedRegion} onValueChange={handleRegionSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Choose your region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Regional News Categories */}
        {selectedRegion && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Regional News Categories</div>
            <div className="flex flex-wrap gap-1">
              {locationService.getRegionalNews(selectedRegion).map((category) => (
                <Badge key={category} variant="outline" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
