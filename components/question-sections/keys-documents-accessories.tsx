"use state"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface KeysDocumentsAccessoriesData {
  keys?: string[]
  accessories?: string[]
  keysOther?: string
  accessoriesOther?: string
}

interface KeysDocumentsAccessoriesProps {
  data: KeysDocumentsAccessoriesData
  updateData: (data: KeysDocumentsAccessoriesData) => void
}

export default function KeysDocumentsAccessories({ data, updateData }: KeysDocumentsAccessoriesProps) {
  const [keysOther, setKeysOther] = useState(data.keysOther || "")
  const [accessoriesOther, setAccessoriesOther] = useState(data.accessoriesOther || "")

  const handleCheckboxChange = (question: "keys" | "accessories", option: string) => {
    const updatedOptions = data[question] ? [...data[question]!] : []
    const index = updatedOptions.indexOf(option)
    if (index > -1) {
      updatedOptions.splice(index, 1)
    } else {
      updatedOptions.push(option)
    }
    updateData({ ...data, [question]: updatedOptions })
  }

  const handleOtherChange = (question: "keys" | "accessories", value: string) => {
    if (question === "keys") {
      setKeysOther(value)
    } else {
      setAccessoriesOther(value)
    }
    updateData({ ...data, [`${question}Other`]: value })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-2">Keys, Documents and Accessories</h2>
      <p className="text-gray-600 mb-4">
        Ensure that all keys, rental documents, and accessories (such as manuals, spare tire, and tools) are present,
        intact, and in good condition.
      </p>

      <div className="space-y-4">
        <Label className="text-lg font-medium">Check return of keys and documents:</Label>
        {[
          "All keys and required documents are returned, complete, and in good condition",
          "One or more keys or documents are missing or slightly damaged",
          "Keys or documents are missing, damaged beyond use, or not returned",
          "Others",
        ].map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`keys-${option}`}
              checked={data.keys && data.keys.includes(option)}
              onCheckedChange={() => handleCheckboxChange("keys", option)}
            />
            <Label htmlFor={`keys-${option}`}>{option}</Label>
          </div>
        ))}
        {data.keys && data.keys.includes("Others") && (
          <Input
            value={keysOther}
            onChange={(e) => handleOtherChange("keys", e.target.value)}
            className="mt-2 border-gray-300 focus:border-blue-500"
            placeholder="Please specify"
          />
        )}
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-medium">Inspect accessories (e.g., spare tire, GPS, child seat):</Label>
        {[
          "All accessories (spare tire, GPS, child seat) are present, in good condition, and fully functional",
          "Some accessories are present but show signs of wear or slight damage",
          "Accessories are missing, damaged, or not functional",
          "Other",
        ].map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`accessories-${option}`}
              checked={data.accessories && data.accessories.includes(option)}
              onCheckedChange={() => handleCheckboxChange("accessories", option)}
            />
            <Label htmlFor={`accessories-${option}`}>{option}</Label>
          </div>
        ))}
        {data.accessories && data.accessories.includes("Other") && (
          <Input
            value={accessoriesOther}
            onChange={(e) => handleOtherChange("accessories", e.target.value)}
            className="mt-2 border-gray-300 focus:border-blue-500"
            placeholder="Please specify"
          />
        )}
      </div>
    </div>
  )
}

