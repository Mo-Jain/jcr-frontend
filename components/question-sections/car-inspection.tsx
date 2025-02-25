"use client"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface CarInspectionData {
  exterior?: string[]
  interior?: string[]
  exteriorOther?: string
  interiorOther?: string
}

interface CarInspectionProps {
  data: CarInspectionData
  updateData: (data: CarInspectionData) => void
}

export default function CarInspection({ data, updateData }: CarInspectionProps) {
  const [exteriorOther, setExteriorOther] = useState(data.exteriorOther || "")
  const [interiorOther, setInteriorOther] = useState(data.interiorOther || "")

  const handleCheckboxChange = (question: "exterior" | "interior", option: string) => {
    const updatedOptions = data[question] ? [...data[question]!] : []
    const index = updatedOptions.indexOf(option)
    if (index > -1) {
      updatedOptions.splice(index, 1)
    } else {
      updatedOptions.push(option)
    }
    updateData({ ...data, [question]: updatedOptions })
  }

  const handleOtherChange = (question: "exterior" | "interior", value: string) => {
    if (question === "exterior") {
      setExteriorOther(value)
    } else {
      setInteriorOther(value)
    }
    updateData({ ...data, [`${question}Other`]: value })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-2">Car Inspection</h2>
      <p className="text-gray-600 mb-4">
        Conducting a thorough exterior inspection of the car upon receiving it from the rental service to check for any
        pre-existing damages or issues.
      </p>

      <div className="space-y-4">
        <Label className="text-lg font-medium">Check for any exterior scratches, dents, or damages</Label>
        {["Major Damage or Scratches", "Nothing to report", "Ignore, Just some minor scratches", "Others"].map(
          (option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`exterior-${option}`}
                checked={data.exterior && data.exterior.includes(option)}
                onCheckedChange={() => handleCheckboxChange("exterior", option)}
              />
              <Label htmlFor={`exterior-${option}`}>{option}</Label>
            </div>
          ),
        )}
        {data.exterior && data.exterior.includes("Others") && (
          <Input
            value={exteriorOther}
            onChange={(e) => handleOtherChange("exterior", e.target.value)}
            className="mt-2 border-gray-300 focus:border-blue-500"
            placeholder="Please specify"
          />
        )}
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-medium">Check for any Interior Scratches, dents or damages</Label>
        {["Major Damage or Scratches", "Ignore it's Minor Scratches", "No Scratches", "Others"].map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`interior-${option}`}
              checked={data.interior && data.interior.includes(option)}
              onCheckedChange={() => handleCheckboxChange("interior", option)}
            />
            <Label htmlFor={`interior-${option}`}>{option}</Label>
          </div>
        ))}
        {data.interior && data.interior.includes("Others") && (
          <Input
            value={interiorOther}
            onChange={(e) => handleOtherChange("interior", e.target.value)}
            className="mt-2 border-gray-300 focus:border-blue-500"
            placeholder="Please specify"
          />
        )}
      </div>
    </div>
  )
}

