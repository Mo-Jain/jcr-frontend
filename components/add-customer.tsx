"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BASE_URL } from "@/lib/config";
import axios from "axios"
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea";
import LoactionIcon from "@/public/location.svg";
import { RenderFileList } from "../app/profile/manage-customer/render-file-list"
import { Phone, Upload } from "lucide-react"
import { createFolder } from "@/app/actions/folder"
import { uploadMultipleToDrive } from "@/app/actions/upload"

interface Customer {
    id: number;
    name:string;
    contact:string;
    address?:string;
    documents? : Document[];
    folderId:string;
  }

  export interface Document {
    id:number;
    name:string;
    url:string;
    type:string;
  }

interface AddCarDialogProps {
  isOpen:boolean;
  setIsOpen:React.Dispatch<React.SetStateAction<boolean>>;
  setCustomers:React.Dispatch<React.SetStateAction<Customer[]>>;
}

interface FormErrors {
  [key: string]: string;
}


export function AddCustomer({isOpen,setIsOpen,setCustomers}:AddCarDialogProps) {
    
  const [name,setName] = useState<string>("");
  const [contact,setContact] = useState<string>("");
  const [address,setAddress] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!name) newErrors.name = "This field is mandatory";
    if (!contact) newErrors.contact = "This field is mandatory";
    if (!address) newErrors.address = "This field is mandatory";
    if (!documents) newErrors.documents = "No Files uploaded";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      toast({
        description: `Please fill all mandatory fields`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
duration: 2000
      });
      return;
    }
    if(!documents) return;

    setIsLoading(true);
    try {

        const folder = await createFolder(name+"_"+contact,"customer");

        if(folder.error || !folder.folderId){
            toast({
              description: `Failed to create folder`,
              className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
              variant: "destructive",
duration: 2000
            });
            setIsLoading(false);
            return;
        }

        const resDoc = await uploadMultipleToDrive(documents,folder.folderId);

        if(resDoc.error || !resDoc.uploadedFiles){
            toast({
              description: `Failed to upload aadhar card and driving license`,
              className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
              variant: "destructive",
duration: 2000
            });
            throw new Error("Failed to upload aadhar card and driving license");
          }
        
        const res = await axios.post(`${BASE_URL}/api/v1/customer`,{
          name,
          contact,
          address,
          folderId:resDoc.uploadedFiles[0].folderId,
          documents:resDoc.uploadedFiles
        },{
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ` + localStorage.getItem('token')
            }
          })
        const documentsObj = resDoc.uploadedFiles;
       
        const customer = {
          id: res.data.id,
          name,
          contact,
          address,
          folderId:documentsObj[0].folderId || "",
          documents:resDoc.uploadedFiles.map(file => {
            return {
              id:file.id,
              name:file.name|| "",
              url:file.url || "",
              type:file.type || "",
              
            }
          })
        };
        setCustomers(prev => [...prev,customer]);
        setName("");
        setContact("");
        setAddress("");
        setDocuments([]);
        setIsLoading(false);
        setIsOpen(false);
        toast({
          description: `Customer Successfully added`,
          className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        });
      }
      catch (error) {
        console.log(error);
        toast({
          description: `Failed to submit form`,
          className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
          variant: "destructive",
duration: 2000
        });
        setIsLoading(false);
      }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
      if (files) {
          if(files.length + documents.length > 5){
            setErrors(prev => ({ ...prev, ["documents"]: "You can upload upto 5 documents or images" }));
            setDocuments([]);
            return;
          }
        for (const file of files) {
          if(file.size > 1024*1024*6){
            setErrors(prev => ({ ...prev, ["documents"]: "File size should be less than 6MB" }));
            return;
          }
            if(!file.type.startsWith("image/") && !file.type.includes("pdf")){
              setErrors(prev => ({ ...prev, ["documents"]: "Please upload only image or pdf files" }));
              setDocuments([]);

              return;
            }
          else{
            if(!file.type.startsWith("image/")){
              setErrors(prev => ({ ...prev, ["documents"]: "Please upload only image" }));
              setDocuments([]);

              return;
            }
          } 
        }
        setDocuments([...Array.from(files)])
        setErrors(prev => ({ ...prev, ["documents"]: "" }));
      }
  }


  const inputClassName = (fieldName: string) => cn(
    "w-full text-sm",
    errors[fieldName] && "border-red-500 focus:border-red-500"
  );

  return (
    <>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="h-auto overflow-y-auto dark:border-gray-800 px-4 py-2 ">
            <form onSubmit={handleSubmit} className="space-y-4">
                <DialogHeader>
                    <DialogTitle>
                        <div></div>
                    </DialogTitle>
                </DialogHeader>
                <div className=" font-bold">
                    <Input
                    type="text"
                    name="title"
                    value={name} 
                    onChange={(e) =>{
                      setName(e.target.value);
                      setErrors(prev => ({ ...prev, carBrand: "" }));
                    }}
                    placeholder="Add Customer Name"
                    className="rounded-none placeholder:text-[25px] text-[25px] max-sm:placeholder:text-[20px]  md:text-[25px] placeholder:text-gray-700 dark:placeholder:text-gray-400  border-0 border-b focus-visible:border-b-2 border-b-gray-400 focus-visible:border-b-blue-600  focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
                    />
                    {errors.name && <p className="text-red-500 font-normal text-sm mt-1">{errors.name}</p>}
                </div>
                
                <div className="gap-4 w-10/11">
                            <div className="flex justify-between gap-1 items-center">
                                <Phone className="w-16 h-4 text-black dark:text-white" />
                                <div className="w-full">
                                    <Input
                                        type="text"
                                        name="title"
                                        placeholder="Add contact number"
                                        value={contact} 
                                        maxLength={10}
                                        onChange={(e) => {
                                            setContact(e.target.value);
                                            setErrors(prev => ({ ...prev, contact: "" }));
                                        }}
                                        className=" w-full rounded-none placeholder:text-[14px] max-sm:placeholder:text-[12px] max-sm:text-[12px] text-[14px] md:text-[14px] placeholder:text-gray-700 dark:placeholder:text-gray-400  border-0 border-b focus-visible:border-b-2 border-b-gray-400 focus-visible:border-b-blue-600  focus-visible:ring-0 focus-visible:ring-offset-0"
                                        />
                                        {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
                                </div>      
                            </div>
                            <div className="flex justify-between gap-1 items-center">
                                <LoactionIcon className="w-16 h-4 stroke-[6px] dark:stroke-white dark:fill-white  stroke-black fill-black" />
                                <div className="w-full">
                                    <Label className="max-sm:text-xs" htmlFor="documents">Address<span className="text-red-500">*</span></Label>
                                    <Textarea
                                        id="address" 
                                        value={address} 
                                        onChange={(e) => {
                                            setAddress(e.target.value);
                                            setErrors(prev => ({ ...prev, address: "" }));
                                        }}
                                        className={inputClassName("address")}
                                        />
                                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                </div>
                            </div>
                </div>

                <div className="flex items-center sm:gap-2 w-full">
                    <div>
                        <Label className="max-sm:text-xs" htmlFor="documents">Driving License and Aadhar Card <span className="text-red-500">*</span></Label>
                        <div onClick={() => {
                            document.getElementById('documents')?.click()
                            }} className="flex items-center justify-center  bg-gray-300 max-sm:text-sm hover:bg-gray-400 dark:bg-muted dark:hover:bg-gray-900 w-fit cursor-pointer text-secondary-foreground px-2 py-1 rounded-sm hover:bg-gray-200 transition-colors">
                            <Upload className="mr-2 h-4 w-4" />
                            <span>Choose file</span>
                        </div>
                        <Input
                        id="documents"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileUpload(e)}
                        className={"hidden"}
                        />
                        {errors.documents && <p className="text-red-500 text-sm mt-1">{errors.documents}</p>}
                        
                    </div>
                    <div className="flex justify-center w-[210px] h-[175px] max-sm:min-w-[155px] min-h-[170px] border border-border px-[2px]">
                        
                        <RenderFileList uploadedFiles={documents} setUploadedFiles={setDocuments} isEditable={true} />
                        {documents.length === 0 &&(
                            <span className="text-center text-sm text-gray-400 dark:text-gray-500">
                                Upload upto 5 documents or images
                            </span>
                        )}

                    </div>
                </div>
                <div>
                <Button type="submit" disabled={isLoading} className={`bg-blue-600 dark:text-white hover:bg-opacity-80 w-full ${isLoading && "cursor-not-allowed opacity-50"}`}>
                    {isLoading ?
                      <>
                      <span>Please wait</span>
                      <div className="flex items-end py-1 h-full">
                        <span className="sr-only">Loading...</span>
                        <div className="h-1 w-1 dark:bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-1 w-1 dark:bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-1 w-1 dark:bg-white mx-[2px] border-border rounded-full animate-bounce"></div>
                      </div>
                      </>
                    :
                    <span>Create</span>
                    }
                </Button>
                </div>
            </form>
        </DialogContent>
        </Dialog>
    </>
  )
}