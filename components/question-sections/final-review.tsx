import type React from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface FinalReviewData {
  remarks?: string
  staffApproval?: boolean
}

interface FinalReviewProps {
  data: FinalReviewData
  updateData: (data: FinalReviewData) => void
}

export default function FinalReview({ data, updateData }: FinalReviewProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateData({ ...data, [e.target.name]: e.target.value })
  }

  const handleCheckboxChange = (checked: boolean) => {
    updateData({ ...data, staffApproval: checked })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-2">Final Review and Acknowledgment</h2>
      <p className="text-gray-600 mb-4">
        Conduct a final review of the vehicle&apos;s condition with the client, ensuring all points are addressed, and obtain
        the clients acknowledgment and signature confirming the vehicle&apos;s return in the agreed condition.
      </p>

      <div>
        <Label htmlFor="remarks">Remarks by renter (if any)</Label>
        <Textarea id="remarks" name="remarks" value={data.remarks || ""} onChange={handleChange} rows={4} />
      </div>

      <div>
        <p>We&apos;d love to hear your feedback! Please leave us a review on Google!</p>
        <p>
          <a href="#" className="text-blue-600 hover:underline">
            Click here to give us a review!
          </a>
        </p>
      </div>

      <div>
        <p className="font-semibold">Staff approval and renter signature</p>
        <div className="flex items-center space-x-2 mt-2">
          <Checkbox id="staffApproval" checked={data.staffApproval || false} onCheckedChange={handleCheckboxChange} />
          <Label htmlFor="staffApproval">
            We, Jain Car Rentals hereby accept that the car is in good condition and has been returned back to us
          </Label>
        </div>
      </div>
    </div>
  )
}

