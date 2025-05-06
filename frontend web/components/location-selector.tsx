"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

type LocationSelectorProps = {
  value: string
  onChange: (location: string) => void
  error?: string
}

export default function LocationSelector({ value, onChange, error }: LocationSelectorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Debounced search for location suggestions
  useEffect(() => {
    if (!value || value.length < 3) {
      setSuggestions([])
      return
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true)
        // This would be a real API call in production
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            value,
          )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&types=address,place,poi&limit=5`,
        )

        if (response.ok) {
          const data = await response.json()
          setSuggestions(data.features.map((feature: any) => feature.place_name))
          setShowSuggestions(true)
        }
      } catch (error) {
        console.error("Error fetching location suggestions:", error)
      } finally {
        setIsLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [value])

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords

            // Reverse geocode to get address
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
            )

            if (response.ok) {
              const data = await response.json()
              const placeName = data.features[0]?.place_name

              if (placeName) {
                onChange(placeName)
              }
            }
          } catch (error) {
            console.error("Error getting location:", error)
            toast({
              title: "Location error",
              description: "Could not retrieve your current location.",
              variant: "destructive",
            })
          } finally {
            setIsLoading(false)
          }
        },
        (err) => {
          console.error("Geolocation error:", err)
          toast({
            title: "Location error",
            description: "Could not access your location. Please check your browser permissions.",
            variant: "destructive",
          })
          setIsLoading(false)
        },
      )
    } else {
      toast({
        title: "Location not supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="relative">
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className={`pl-9 ${error ? "border-red-500" : ""}`}
            placeholder="Enter hospital or treatment location"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => value && setSuggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => {
              // Delay hiding suggestions to allow for clicks
              setTimeout(() => setShowSuggestions(false), 200)
            }}
          />
          {isLoading && (
            <div className="absolute right-3 top-3 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-600"></div>
          )}
        </div>
        <Button variant="outline" type="button" onClick={handleUseCurrentLocation} disabled={isLoading}>
          {isLoading ? "Loading..." : "Use Current"}
        </Button>
      </div>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
          <ul className="max-h-60 overflow-auto rounded-md py-1 text-base">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="cursor-pointer select-none px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  onChange(suggestion)
                  setShowSuggestions(false)
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
