"use client"

import { useEffect, useState } from "react"
import { Send, Mail, CheckCircle, AlertCircle, AtSign, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import PDFDocument from "@/components/pdf-document"
import { pdf } from "@react-pdf/renderer"
import { sendEmailWithAttachment } from "@/app/actions/mail"
import { toast } from "@/hooks/use-toast"

 interface Booking {
  id: string;
  start: string;
  end: string;
  startTime: string;
  endTime: string;
  status: string;
  customerName: string;
  customerContact: string;
  carId: number;
  carName: string;
  carPlateNumber: string;
  dailyRentalPrice: number;
  securityDeposit?: string;
  totalPrice?: number;
  advancePayment?: number;
  customerAddress?: string;
  customerMail?: string;
  paymentMethod?: string;
  odometerReading?: string;
  notes?: string;
}

export default function MailDialog({
  booking,
  mail,
  open,
  setOpen,
  handleSkip
}:{
  booking:Booking,
  mail:string | undefined,
  open:boolean,
  setOpen:React.Dispatch<React.SetStateAction<boolean>>,
  handleSkip?:() => void
}) {
  const [recipient, setRecipient] = useState(mail || "")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (open) {
      setRecipient(booking.customerMail || "")
    }
  }, [open,booking.customerMail])

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
    
      const doc = <PDFDocument booking={booking} />;
      const pdfBuffer = await pdf(doc).toBlob();
  
      try{
        const formData = new FormData();
        formData.append("file", pdfBuffer);
        formData.append("email", recipient);
        formData.append("name", booking.id);
        const result = await sendEmailWithAttachment(formData);
        
        // Show success state
        setIsLoading(false)
        if(result.success){
            setSuccess(true)
        }else {
            throw new Error(result.message)
        }
        setTimeout(() => {
            setRecipient("")
            setSuccess(false)
            setOpen(false)
          }, 2000)
          if(handleSkip) handleSkip()
      } catch (error) {
        console.error(error);
        toast({
          description: "Failed to send email",
          className:
            "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
          variant: "destructive",
          duration: 2000,
        });
        setRecipient("")
        setSuccess(false)
        setOpen(false)
        setIsLoading(false)
        if(handleSkip) handleSkip()
      }
      if(handleSkip) handleSkip()
    }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const resetDialog = () => {
    setRecipient("")
    setSuccess(false)
    setOpen(false)
    if(handleSkip) handleSkip()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-none shadow-xl">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 absolute inset-0 z-0" />

        {success ? (
          <div className="relative z-10 flex flex-col items-center justify-center p-6 space-y-4 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Email Sent Successfully!</h2>
            <p className="text-muted-foreground">Rental agreement been sent to {recipient}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative z-10">
            <DialogHeader className="p-6 pb-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <DialogTitle>Send Rental Agreement</DialogTitle>
              </div>
              <DialogDescription>Enter the recipient&apos;s email address to send agreement.</DialogDescription>
            </DialogHeader>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-[11px] right-[11px] rounded-full h-8 w-8"
              onClick={resetDialog}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>

            <div className="p-6 pt-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient" className="text-sm font-medium flex items-center gap-2">
                    <AtSign className="h-3.5 w-3.5 text-muted-foreground" />
                    Recipient Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="recipient"
                      type="email"
                      placeholder="recipient@example.com"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className={cn(
                        "pl-10 transition-all duration-200",
                        recipient && !isValidEmail(recipient) ? "border-destructive ring-destructive/20" : "",
                      )}
                      required
                    />
                    <Mail className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    {recipient && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full"
                        onClick={() => setRecipient("")}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Clear</span>
                      </Button>
                    )}
                  </div>
                  {recipient && !isValidEmail(recipient) && (
                    <div className="flex items-center gap-1.5 text-xs text-destructive mt-1.5">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Please enter a valid email address
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetDialog}
                  disabled={isLoading}
                  className="border-primary/20 text-primary hover:bg-primary/5"
                >
                  {handleSkip ? "Skip" : "Cancel"}
                </Button>
                <Button
                  type="submit"
                  className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300"
                  disabled={!recipient || !isValidEmail(recipient) || isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

