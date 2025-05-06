"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, Droplet } from "lucide-react"

export default function EmergencyModeSection() {
  const [emergencyMode, setEmergencyMode] = useState(false)

  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-4">
      <div className="flex items-start">
        <div className="mr-3 mt-0.5">
          <Droplet className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-red-800">Emergency Mode</h4>
          <p className="text-sm text-red-700 mt-1">
            Emergency mode will send high-priority notifications to all compatible donors in your area. Please only use
            this for genuine emergencies.
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <Switch
              id="emergency-mode"
              checked={emergencyMode}
              onCheckedChange={setEmergencyMode}
              className="data-[state=checked]:bg-red-600"
            />
            <Label htmlFor="emergency-mode" className="font-medium text-sm text-red-800">
              Activate Emergency Mode
            </Label>
          </div>

          {emergencyMode && (
            <div className="mt-3 p-3 bg-white bg-opacity-50 rounded-md border border-red-200">
              <div className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-red-600 mr-2 mt-0.5" />
                <p className="text-sm text-red-700">
                  By activating Emergency Mode, you confirm this is a genuine medical emergency requiring immediate
                  blood donation. Misuse may result in account restrictions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
