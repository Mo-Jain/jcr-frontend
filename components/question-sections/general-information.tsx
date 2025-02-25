import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface GeneralInformationData {
  renterName?: string
  bookingId?: string
  carModel?: string
  mileage?: number
}

interface GeneralInformationProps {
  data: GeneralInformationData
  updateData: (data: GeneralInformationData) => void
}

export default function GeneralInformation({ data, updateData }: GeneralInformationProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ ...data, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    updateData({ ...data, carModel: value })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">General Information</h2>

      <div>
        <Label htmlFor="renterName">Renter&apos;s Name</Label>
        <Input id="renterName" name="renterName" value={data.renterName || ""} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="bookingId">Booking ID</Label>
        <Input id="bookingId" name="bookingId" value={data.bookingId || ""} onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="carModel">Car Model</Label>
        <Select onValueChange={handleSelectChange} value={data.carModel || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Select a car model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="model1">Model 1</SelectItem>
            <SelectItem value="model2">Model 2</SelectItem>
            <SelectItem value="model3">Model 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="mileage">Mileage (in meters)</Label>
        <Input id="mileage" name="mileage" type="number" value={data.mileage || ""} onChange={handleChange} required />
      </div>
    </div>
  )
}

