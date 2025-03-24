"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BASE_URL } from "@/lib/config";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { RenderFileList } from "./render-file-list";
import {  Upload } from "lucide-react";
import { createFolder } from "@/app/actions/folder";
import { uploadToDrive } from "@/app/actions/upload";
import UserIcon from "@/public/user.svg";
import LocationIcon from "@/public/location.svg";
import { DatePicker } from "./ui/datepicker";
import Calendar from "@/public/date-and-time.svg";
import { Customer } from "@/app/profile/manage-customer/page";
import UploadDialog from "./upload-dialog";


export interface Document {
  id: number;
  name: string;
  url: string;
  type: string;
  docType:string;
}

interface AddCustomerDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

interface FormErrors {
  [key: string]: string;
}

export function AddCustomer({
  isOpen,
  setIsOpen,
  setCustomers,
}: AddCustomerDialogProps) {
  const [name, setName] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [joiningDate, setJoiningDate] = useState<Date>(new Date());
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [aadharFiles, setAadharFiles] = useState<File[]>([])
  const [licenseFiles, setLicenseFiles] = useState<File[]>([])
  const [otherFiles, setOtherFiles] = useState<File[]>([])

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!name) newErrors.name = "This field is mandatory";
    if (!contact) newErrors.contact = "This field is mandatory";
    if (!address) newErrors.address = "This field is mandatory";
    if (!(aadharFiles && licenseFiles && otherFiles)) newErrors.documents = "No Files uploaded";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      toast({
        description: `Please fill all mandatory fields`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    if (!(aadharFiles && licenseFiles && otherFiles)) return;

    setIsLoading(true);
    try {
      const resDoc = [];
      let overallProgress = 0;
      setProgress(overallProgress);
      const folder = await createFolder(name + "_" + contact, "customer");

      if (folder.error || !folder.folderId) {
        toast({
          description: `Failed to create folder`,
          className:
            "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
          variant: "destructive",
          duration: 2000,
        });
        setIsLoading(false);
        return;
      }
      overallProgress += 5;
      setProgress(overallProgress);

      const totalSize = Object.values([...aadharFiles,...licenseFiles,...otherFiles]).reduce(
        (acc, file) => acc + file.size,
        0,
      );

      if (aadharFiles.length > 0) {
        let cnt = 0;
        for (const file of aadharFiles) {
          const res = await uploadToDrive(file, folder.folderId);
          if (res.error) {
            throw new Error("Failed to upload documents");
            return;
          }
          resDoc.push({ ...res, id: cnt,docType:"aadhar" });
          cnt++;
          overallProgress += Math.round((file.size / totalSize) * 100) * 0.98;
          setProgress(overallProgress);
        }
      }

      if (licenseFiles.length > 0) {
        let cnt = 0;
        for (const file of licenseFiles) {
          const res = await uploadToDrive(file, folder.folderId);
          if (res.error) {
            throw new Error("Failed to upload documents");
            return;
          }
          resDoc.push({ ...res, id: cnt,docType:"license" });
          cnt++;
          overallProgress += Math.round((file.size / totalSize) * 100) * 0.98;
          setProgress(overallProgress);
        }
      }
      if (otherFiles.length > 0) {
        let cnt = 0;
        for (const file of otherFiles) {
          const res = await uploadToDrive(file, folder.folderId);
          if (res.error) {
            throw new Error("Failed to upload documents");
            return;
          }
          resDoc.push({ ...res, id: cnt,docType:"others" });
          cnt++;
          overallProgress += Math.round((file.size / totalSize) * 100) * 0.98;
          setProgress(overallProgress);
        }
      }

      const updatedDocuments =
        resDoc &&
        resDoc.map((file) => {
          return {
            id: file.id || 0,
            name: file.name || "",
            url: file.url || "",
            type: file.type || "",
            docType:file.docType || ""
          };
        });

      const res = await axios.post(
        `${BASE_URL}/api/v1/customer`,
        {
          name,
          contact,
          address,
          folderId: folder.folderId,
          joiningDate: joiningDate.toLocaleDateString("en-US"),
          documents: updatedDocuments,
        },
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ` + localStorage.getItem("token"),
          },
        },
      );

      const customer = {
        id: res.data.id,
        name,
        contact,
        address,
        folderId: folder.folderId || "",
        joiningDate: joiningDate.toLocaleDateString("en-US"),
        documents: res.data.documents,
        kycStatus:"verified"
      };
      setCustomers((prev) => [...prev, customer]);
      setName("");
      setContact("");
      setAddress("");
      setAadharFiles([]);
      setLicenseFiles([]);
      setOtherFiles([]);
      setIsLoading(false);
      setProgress(0);
      setIsOpen(false);
      toast({
        description: `Customer Successfully added`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });
    } catch (error) {
      console.log(error);
      toast({
        description: `Failed to submit form`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
        duration: 2000,
      });
      setIsLoading(false);
    }
  };

  const inputClassName = (fieldName: "name" | "contact" | "address") =>
    cn(
      "rounded-none shadow-none border-transparent px-2  border-b-2 border-b-border text-sm focus-visible:ring-0 focus-visible:border-b-blue-400",
      errors[fieldName] && "border-b-red-500 focus:border-b-red-500",
      "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"

    );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] p-4 z-20 border-border max-sm:min-h-[70%] flex flex-col p-0 items-center overflow-auto">
          <DialogHeader className="flex flex-row justify-between items-center w-full px-3 sm:px-6 py-0">
            <DialogTitle>
              <div className="flex justify-start w-full whitespace-nowrap mt-2">
                Add Customer
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="px-3 sm:px-6 pb-2 h-full w-full max-sm:mt-6">
            <div className=" space-y-2 w-full">
              <div className="flex items-center space-x-2 w-full">
                <UserIcon className="h-6 w-6 mt-1 mr-3 stroke-[12px] fill-black dark:fill-white stroke-black dark:stroke-white" />
                <div className="flex justify-between items-center gap-2 w-full">
                  <div>
                    <Input
                      type="text"
                      name="name"
                      value={name}
                      placeholder="Add name"
                      onChange={(e) => {
                        setName(e.target.value);
                        setErrors((prev) => ({ ...prev, name: "" }));
                      }}
                      className={inputClassName("name")}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      name="contact"
                      value={contact}
                      type="number"
                      placeholder="Add contact number"
                      max={9999999999}
                      onChange={(e) => {
                        if (e.target.value.length <= 10) {
                          setContact(e.target.value);
                          setErrors((prev) => ({ ...prev, contact: "" }));
                        }
                      }}
                      className={inputClassName("contact")}
                    />
                    {errors.contact && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.contact}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 mr-3 flex-shrink-0 fill-black dark:fill-white stroke-black dark:stroke-white stroke-[1px]" />
                  <div className="flex items-center gap-2 ">
                  <Label htmlFor="joinning" className={`text-sm`}>Joining Date</Label>
                      <DatePicker
                          className="max-sm:w-[120px]"
                          date={joiningDate}
                          setDate={setJoiningDate}/>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <LocationIcon className="w-6 h-6 mr-3 stroke-[20px] stroke-black fill-black dark:stroke-white dark:fill-white" />
                <Textarea
                  id="address"
                  value={address || ""}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setErrors((prev) => ({ ...prev, address: "" }));
                  }}
                  className={cn(
                    "w-full bg-gray-200 dark:bg-muted text-sm focus-visible:ring-0 focus-visible:border-blue-400",
                    errors.address && "border-red-500 focus:border-red-500",
                  )}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div className="flex flex-col w-full gap-1 justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm">
                      <span>Documents</span>
                    </div>
                    
                    <p className="text-red-500 text-sm mt-1">{errors.documents}</p>
                  </div>
                  <div className="flex item-center gap-1 w-full">
                    <div>
                      <div className="flex flex-col rounded-sm justify-start min-w-[165px] sm:min-w-[180px] h-[90px] min-h-[90px] w-fit h-fit border border-border px-[2px]">
                        <p className="text-xs">Aadhar Card :</p>
                        <div className="h-[74px] overflow-scroll scrollbar-hide">
                          {
                            aadharFiles.length === 0 ? (
                              <span className="text-center text-xs text-gray-400 min-w-[185px] dark:text-gray-500">
                                Upload upto 2 documents
                              </span>
                            )
                            :
                              <RenderFileList
                                uploadedFiles={aadharFiles}
                                setUploadedFiles={setAadharFiles}
                                isEditable={true}
                              />
                            }
                          </div>
                      </div>
                      <div className="flex flex-col rounded-sm justify-start min-w-[165px] sm:min-w-[180px] h-[90px] min-h-[90px] w-fit h-fit border border-border px-[2px]">
                        <p className="text-xs">Driving License :</p>
                        <div className="h-[74px] overflow-scroll scrollbar-hide">
                          {licenseFiles.length === 0 ? (
                              <span className="text-center text-xs text-gray-400 min-w-[185px] dark:text-gray-500">
                                Upload upto 2 documents
                              </span>
                            )
                            :
                              <RenderFileList
                                uploadedFiles={licenseFiles}
                                setUploadedFiles={setLicenseFiles}
                                isEditable={true}
                              />
                            }
                          </div>
                          
                      </div>
                    </div>
                    <div className="h-full flex flex-col gap-1">
                      
                        <div className="flex flex-col justify-start rounded-sm h-full min-w-[165px] sm:min-w-[180px] h-[90px] min-h-[90px] w-fit h-fit border border-border px-[2px]">
                          <p className="text-xs">Others :</p>
                          <div className="h-full overflow-y-scroll overflow-x-hidden scrollbar-hide">
                          {otherFiles.length === 0 ? (
                              <span className="text-center text-xs text-gray-400 min-w-[185px] dark:text-gray-500">
                                Upload upto 2 documents
                              </span>
                            )
                            :
                              <RenderFileList
                                uploadedFiles={otherFiles}
                                setUploadedFiles={setOtherFiles}
                                isEditable={true}
                              />
                            }
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            setIsUploadDialogOpen(true);
                          }}
                          className="flex items-center w-full justify-center bg-gray-300 text-sm hover:bg-gray-400 dark:bg-muted dark:hover:bg-gray-900 w-fit cursor-pointer text-secondary-foreground px-2 py-1 rounded-sm hover:bg-gray-200 transition-colors"
                        >
                          <Upload className="mr-2  h-4 w-4" />
                          <span className="text-xs whitespace-nowrap">Upload</span>
                        </div>
                    </div>
                  </div>
                </div>
            </div>
            <div className="mt-4">
              {isLoading ? (
                <div className="w-full border-2 border-border rounded-lg relative">
                  <div
                    style={{ width: `${progress}%` }}
                    className={`bg-primary rounded-lg text-white h-[35px] transition-all duration-300 ease-in-out hover:bg-opacity-80 ${isLoading && "rounded-e-none"}`}
                  />
                  <div
                    className={`w-full h-[35px] p-1 flex justify-center items-center absolute top-0 left-0 `}
                  >
                    <span className="text-black dark:text-white">
                      Uploading Documents
                    </span>
                    <div className="flex items-end px-1 pb-2 h-full">
                      <span className="sr-only">Loading...</span>
                      <div className="h-1 w-1 bg-black dark:bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-1 w-1 bg-black dark:bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-1 w-1 bg-black dark:bg-white mx-[2px] border-border rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  disabled={isLoading}
                  onClick={handleSubmit}
                  className={`w-full ${isLoading && "cursor-not-allowed active:scale-95 opacity-50"}`}
                >
                  <span className="text-white">Create</span>
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <UploadDialog
        isUploadDialogOpen={isUploadDialogOpen} 
        setIsUploadDialogOpen={setIsUploadDialogOpen}
        aadharFiles={aadharFiles}
        setAadharFiles={setAadharFiles}
        licenseFiles={licenseFiles}
        setLicenseFiles={setLicenseFiles}
        otherFiles={otherFiles}
        setOtherFiles={setOtherFiles}
      />
    </>
  );
}
