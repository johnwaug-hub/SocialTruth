"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { LocationSelector } from "@/components/location-selector"
import { Plus, Link, FileText, MapPin } from "lucide-react"
import { locationService, type LocationData } from "@/lib/nft-validator-system"
import { useCardanoWallet } from "@/lib/cardano-wallet"

export function NewsSubmissionForm() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [sources, setSources] = useState<string[]>([])
  const [newSource, setNewSource] = useState("")
  const [location, setLocation] = useState<LocationData | null>(null)
  const [showLocationSelector, setShowLocationSelector] = useState(false)
  const { address } = useCardanoWallet()

  useEffect(() => {
    // Load user's saved location
    if (address) {
      const savedLocation = locationService.getUserLocationData(address)
      if (savedLocation) {
        setLocation(savedLocation)
      }
    }
  }, [address])

  const addSource = () => {
    if (newSource.trim()) {
      setSources([...sources, newSource.trim()])
      setNewSource("")
    }
  }

  const removeSource = (index: number) => {
    setSources(sources.filter((_, i) => i !== index))
  }

  const handleLocationChange = (newLocation: LocationData) => {
    setLocation(newLocation)
    if (address) {
      locationService.setUserLocation(address, newLocation)
    }
    setShowLocationSelector(false)
  }

  if (!isExpanded) {
    return (
      <Card className="p-6">
        <Button onClick={() => setIsExpanded(true)} className="w-full gap-2" size="lg">
          <Plus className="w-5 h-5" />
          Submit News Article for Verification
        </Button>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Submit News Article
          </h2>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
            Cancel
          </Button>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Article Title</Label>
            <Input id="title" placeholder="Enter the news article title..." className="text-base" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Article Content</Label>
            <Textarea
              id="content"
              placeholder="Paste or type the full article content here..."
              className="min-h-32 text-base"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="politics">Politics</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="economics">Economics</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency Level</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Article Location
            </Label>

            {location ? (
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                <div className="space-y-1">
                  <div className="font-medium">{location.region}</div>
                  <div className="text-sm text-muted-foreground">{location.country}</div>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowLocationSelector(true)}>
                  Change
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => setShowLocationSelector(true)}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Set Article Location
              </Button>
            )}

            {showLocationSelector && (
              <div className="border rounded-lg p-4 bg-muted/20">
                <LocationSelector onLocationChange={handleLocationChange} currentLocation={location} />
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Location helps assign regional validators and categorize news appropriately
            </p>
          </div>

          <div className="space-y-2">
            <Label>Sources & References</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add source URL or reference..."
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSource())}
              />
              <Button type="button" onClick={addSource} size="sm">
                <Link className="w-4 h-4" />
              </Button>
            </div>
            {sources.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {sources.map((source, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeSource(index)}>
                    {source.length > 30 ? `${source.substring(0, 30)}...` : source}
                    <span className="ml-1">×</span>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Submit for Verification
            </Button>
            <Button type="button" variant="outline">
              Save Draft
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}
