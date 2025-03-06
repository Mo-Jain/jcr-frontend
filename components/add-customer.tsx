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
import { RenderFileList } from "../app/profile/manage-customer/render-file-list";
import { Phone, Upload } from "lucide-react";
import { createFolder } from "@/app/actions/folder";
import { uploadToDrive } from "@/app/actions/upload";
import UserIcon from "@/public/user.svg";
import LocationIcon from "@/public/location.svg";

interface Customer {
  id: number;
  name: string;
  contact: string;
  address?: string;
  documents?: Document[];
  folderId: string;
}

export interface Document {
  id: number;
  name: string;
  url: string;
  type: string;
}

interface AddCarDialogProps {
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
}: AddCarDialogProps) {
  const [name, setName] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);

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
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    if (!documents) return;

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

      const totalSize = Object.values(documents).reduce(
        (acc, file) => acc + file.size,
        0,
      );

      if (documents.length > 0) {
        let cnt = 0;
        for (const file of documents) {
          const res = await uploadToDrive(file, folder.folderId);
          if (res.error) {
            throw new Error("Failed to upload documents");
            return;
          }
          resDoc.push({ ...res, id: cnt });
          cnt++;
          overallProgress += Math.round((file.size / totalSize) * 100) * 0.93;
          setProgress(overallProgress);
        }
      }

      const updatedDocuments =
        resDoc &&
        resDoc &&
        resDoc.map((file) => {
          return {
            id: file.id || 0,
            name: file.name || "",
            url: file.url || "",
            type: file.type || "",
          };
        });

      const res = await axios.post(
        `${BASE_URL}/api/v1/customer`,
        {
          name,
          contact,
          address,
          folderId: folder.folderId,
          documents: updatedDocuments,
        },
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ` + localStorage.getItem("token"),
          },
        },
      );

      console.log("res.data.documents", res.data.documents);

      const customer = {
        id: res.data.id,
        name,
        contact,
        address,
        folderId: folder.folderId || "",
        documents: res.data.documents,
      };
      console.log("customer", customer);
      setCustomers((prev) => [...prev, customer]);
      setName("");
      setContact("");
      setAddress("");
      setDocuments([]);
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      if (files.length + documents.length > 5) {
        setErrors((prev) => ({
          ...prev,
          ["documents"]: "You can upload upto 5 documents or images",
        }));
        setDocuments([]);
        return;
      }
      for (const file of files) {
        if (file.size > 1024 * 1024 * 6) {
          setErrors((prev) => ({
            ...prev,
            ["documents"]: "File size should be less than 6MB",
          }));
          return;
        }
        if (!file.type.startsWith("image/") && !file.type.includes("pdf")) {
          setErrors((prev) => ({
            ...prev,
            ["documents"]: "Please upload only image or pdf files",
          }));
          setDocuments([]);

          return;
        } else {
          if (!file.type.startsWith("image/")) {
            setErrors((prev) => ({
              ...prev,
              ["documents"]: "Please upload only image",
            }));
            setDocuments([]);

            return;
          }
        }
      }
      setDocuments([...Array.from(files)]);
      setErrors((prev) => ({ ...prev, ["documents"]: "" }));
    }
  };

  const inputClassName = (fieldName: "name" | "contact" | "address") =>
    cn(
      "rounded-none shadow-none border-transparent border-b-2 border-b-border text-sm focus-visible:ring-0 focus-visible:border-b-blue-400",
      errors[fieldName] && "border-b-red-500 focus:border-b-red-500",
    );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] p-4 z-20 border-border max-sm:min-h-[70%] flex flex-col p-0 items-center overflow-auto">
          <DialogHeader className="flex flex-row justify-between items-center w-full px-6 py-0">
            <DialogTitle>
              <div className="flex justify-start w-full whitespace-nowrap mt-2">
                Add Customer
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-2 h-full w-full max-sm:mt-6">
            <div className=" space-y-2 w-[90%]">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-6 w-6 mt-1 mr-3 stroke-[12px] fill-black dark:fill-white stroke-black dark:stroke-white" />
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
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-6 w-6 mr-3 text-black dark:text-white" />
                <div>
                  <Input
                    name="contact"
                    value={contact}
                    placeholder="Add contact number"
                    maxLength={10}
                    onChange={(e) => {
                      setContact(e.target.value);
                      setErrors((prev) => ({ ...prev, contact: "" }));
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

              <div className="flex items-center sm:gap-2 w-full">
                <div>
                  <Label className="max-sm:text-xs" htmlFor="documents">
                    Driving License and Aadhar Card{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div
                    onClick={() => {
                      document.getElementById("documents")?.click();
                    }}
                    className="flex items-center justify-center  bg-gray-300 max-sm:text-sm hover:bg-gray-400 dark:bg-muted dark:hover:bg-gray-900 w-fit cursor-pointer text-secondary-foreground px-2 py-1 rounded-sm hover:bg-gray-200 transition-colors"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    <span className="text-sm whitespace-nowrap">
                      Choose file
                    </span>
                  </div>
                  <Input
                    id="documents"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileUpload(e)}
                    className={"hidden"}
                  />
                  {errors.documents && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.documents}
                    </p>
                  )}
                </div>
                <div className="flex justify-center w-[210px] h-[175px] max-sm:min-w-[150px] min-h-[175px] max-sm:min-h-[165px] w-fit h-fit border border-border px-[2px]">
                  <RenderFileList
                    uploadedFiles={documents}
                    setUploadedFiles={setDocuments}
                    isEditable={true}
                  />
                  {documents.length === 0 && (
                    <span className="text-center text-sm text-gray-400 dark:text-gray-500">
                      Upload upto 5 documents or images
                    </span>
                  )}
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
                  className={`w-full ${isLoading && "cursor-not-allowed opacity-50"}`}
                >
                  <span className="text-white">Create</span>
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
