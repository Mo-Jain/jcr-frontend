import { Dialog, DialogContent, DialogDescription, DialogTitle,DialogHeader, DialogFooter } from "./ui/dialog";
import React, { useRef, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { RenderFileList } from "./render-file-list";
import { toast } from "@/hooks/use-toast";


const UploadDialog = ({
    isUploadDialogOpen,
    setIsUploadDialogOpen,
    aadharFiles,
    setAadharFiles,
    licenseFiles,
    setLicenseFiles,
    otherFiles,
    setOtherFiles,
}:
    {
        isUploadDialogOpen:boolean,
        setIsUploadDialogOpen:React.Dispatch<React.SetStateAction<boolean>>,
        aadharFiles:File[],
        setAadharFiles:React.Dispatch<React.SetStateAction<File[]>>,
        licenseFiles:File[],
        setLicenseFiles:React.Dispatch<React.SetStateAction<File[]>>,
        otherFiles:File[],
        setOtherFiles:React.Dispatch<React.SetStateAction<File[]>>
    }) => {
  const [documentType,setDocumentType] = useState("aadhar");
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleAddFiles = ( newFiles: File[]) => {
    const files = newFiles;
    let error = ""
    if (files) {
        if (files.length > 5) {
        error =  "You can upload upto 5 documents or images"
        }
        for (const file of files) {
            if (file.size > 1024 * 1024 * 6) {
                error= "File size should be less than 6MB"
            }
            if (!file.type.startsWith("image/") && !file.type.includes("pdf")) {
                error= "Please upload only image or pdf files"
            } else {
                error= "Please upload only image"
            }
        }
    }
    switch (documentType) {
      case "aadhar":
        if(error != ""){
            toast({
                description:error,
                duration:2000,
                variant:"destructive"
            })
            setAadharFiles([])
            return;
        }
        setAadharFiles((prev) => [...prev, ...newFiles])
        break;
      case "license":
        if(error != ""){
            toast({
                description:error,
                duration:2000,
                variant:"destructive"
            })
            setLicenseFiles([])
            return;
        }
        setLicenseFiles((prev) => [...prev, ...newFiles])
        break;
      case "other":
        if(error != ""){
            toast({
                description:error,
                duration:2000,
                variant:"destructive"
            })
            setOtherFiles([])
            return;
        }
        setOtherFiles((prev) => [...prev, ...newFiles])
        break;
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files)
      handleAddFiles(filesArray)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    if (e.target.files?.length) {
      const filesArray = Array.from(e.target.files)
      handleAddFiles(filesArray)
      // Reset input value so the same file can be selected again
      e.target.value = ""
    }
  }

    
  return (
    <div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="bg-muted border-border">
          <DialogHeader>
            <DialogTitle>Upload Documents</DialogTitle>
            <DialogDescription className="text-grey-500">
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 w-full">
            <p>Select Document</p>
            <Select value={documentType} onValueChange={(value) => setDocumentType(value)}>
              <SelectTrigger className="w-[180px] rounded-sm border-border max-sm:w-[130px] hover:bg-opacity-10">
                <SelectValue placeholder="Select car" />
              </SelectTrigger>
              <SelectContent className="dark:border-border bg-muted">
                <SelectItem
                  value="aadhar"
                  className="hover:bg-opacity-50 hover:text-black cursor-pointer"
                >
                  Aadhar Card
                </SelectItem>
                <SelectItem
                  value="license"
                  className="hover:bg-opacity-50 hover:text-black cursor-pointer"
                >
                  Driving License
                </SelectItem>
                <SelectItem
                  value="other"
                  className="hover:bg-opacity-50 hover:text-black cursor-pointer"
                >
                  Others
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <div
                className={cn(
                "border-2 border-dashed rounded-lg p-6 transition-colors w-full",
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                <Upload className="h-10 w-10 text-muted-foreground" />
                <div>
                    <p className="font-medium">Drag & drop files here</p>
                    <p className="text-sm text-muted-foreground">or click to browse files</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} className="mt-2">
                    Select Files
                </Button>
                <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />
                </div>
            </div>
            {aadharFiles.length + licenseFiles.length + otherFiles.length > 0 && 
            <div className="flex rounded-sm flex-col justify-start min-w-[182px] h-full min-h-[180px] w-fit h-fit border border-border px-[2px]">
                <RenderFileList
                    uploadedFiles={aadharFiles}
                    setUploadedFiles={setAadharFiles}
                    isEditable={true}
                    />
                <RenderFileList
                    uploadedFiles={licenseFiles}
                    setUploadedFiles={setLicenseFiles}
                    isEditable={true}
                    />
                <RenderFileList
                    uploadedFiles={otherFiles}
                    setUploadedFiles={setOtherFiles}
                    isEditable={true}
                    />
            </div>
            }
          </div>
          <DialogFooter>
            <Button variant="outline" className="bg-transparent" onClick={() => setIsUploadDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
};

export default UploadDialog;
