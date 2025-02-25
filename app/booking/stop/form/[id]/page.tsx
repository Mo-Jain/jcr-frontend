"use client"
import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

import GeneralInformation from "@/components/question-sections/general-information"
import CarInspection from "@/components/question-sections/car-inspection"
import KeysDocumentsAccessories from "@/components/question-sections/keys-documents-accessories"
import FinalReview from "@/components/question-sections/final-review"

interface FormData {
    generalInformation: Record<string, string | number>
    carInspection: Record<string, string[]>
    keysDocumentsAccessories: Record<string, string[]>
    finalReview: Record<string, string | boolean>
}

interface FinalReviewData {
  remarks?: string
  staffApproval?: boolean
}

interface CarInspectionData {
  exterior?: string[]
  interior?: string[]
  exteriorOther?: string
  interiorOther?: string
}

interface GeneralInformationData {
  renterName?: string
  bookingId?: string
  carModel?: string
  mileage?: number
}

interface KeysDocumentsAccessoriesData {
  keys?: string[]
  accessories?: string[]
  keysOther?: string
  accessoriesOther?: string
}

export default function BookingChecklist() {
  const [currentSection, setCurrentSection] = useState<number>(1)
  const [formData, setFormData] = useState<FormData>({
    generalInformation: {},
    carInspection: {},
    keysDocumentsAccessories: {},
    finalReview: {},
  })
  
    const updateFormData = (section: keyof FormData, data: FinalReviewData | CarInspectionData | GeneralInformationData | KeysDocumentsAccessoriesData) => {
      setFormData((prevData) => ({
        ...prevData,
        [section]: data,
      }))
    }
  
    const nextSection = () => {
      if (currentSection < 4) {
        setCurrentSection(currentSection + 1)
      }
    }
  
    const prevSection = () => {
      if (currentSection > 1) {
        setCurrentSection(currentSection - 1)
      }
    }
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      console.log("Form submitted:", formData)
      // Here you would typically send the data to your backend
    }
  
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Booking End Checklist</h1>
        <Progress value={(currentSection / 4) * 100} className="mb-4" />
        <p className="text-sm text-gray-600 mb-6">Section {currentSection} / 4</p>
  
        <form onSubmit={handleSubmit}>
          {currentSection === 1 && (
            <GeneralInformation
              data={formData.generalInformation}
              updateData={(data) => updateFormData("generalInformation", data)}
            />
          )}
          {currentSection === 2 && (
            <CarInspection data={formData.carInspection} updateData={(data) => updateFormData("carInspection", data)} />
          )}
          {currentSection === 3 && (
            <KeysDocumentsAccessories
              data={formData.keysDocumentsAccessories}
              updateData={(data) => updateFormData("keysDocumentsAccessories", data)}
            />
          )}
          {currentSection === 4 && (
            <FinalReview data={formData.finalReview} updateData={(data) => updateFormData("finalReview", data)} />
          )}
  
          <div className="flex justify-between mt-6">
            {currentSection > 1 && (
              <Button type="button" onClick={prevSection}>
                Back
              </Button>
            )}
            {currentSection < 4 ? (
              <Button type="button" onClick={nextSection} className="ml-auto">
                Next
              </Button>
            ) : (
              <Button type="submit" className="ml-auto">
                Submit
              </Button>
            )}
          </div>
        </form>
      </div>
    )
  }
  
  