"use client";

import { useEffect, useState } from "react";
import { Edit2, Trash2,  Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import Calendar from "@/public/date-and-time.svg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import UserIcon from "@/public/user.svg";
import LocationIcon from "@/public/location.svg";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { RenderFileList } from "./render-file-list";
import { Customer, Document } from "./page";
import { uploadToDrive } from "@/app/actions/upload";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/datepicker";


interface CustomerPopupInterface {
  customer: Customer;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

export function CustomerPopup({
  customer,
  isOpen,
  setIsOpen,
  setCustomers,
}: CustomerPopupInterface) {
  const [action, setAction] = useState<
    "Delete" | "Update" | "delete the documents of"
  >("Delete");
  const [address, setAddress] = useState(customer.address);
  const [documents, setDocuments] = useState<Document[] | undefined>(
    customer.documents,
  );
  const [name, setName] = useState<string>(customer.name);
  const [contact, setContact] = useState<string>(customer.contact);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDocumentsDeleting, setIsDocumentsDeleting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [joiningDate, setJoiningDate] = useState<Date>(new Date(customer.joiningDate));

  function handleAction() {
    if (action === "Delete") {
      handleDelete();
    } else if (action === "Update") {
      handleUpdate();
    } else if (action === "delete the documents of") {
      handleDocumentDelete();
    }
    return;
  }

  useEffect(() => {
    if (!isOpen) setIsEditing(false);
  }, [isOpen]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`${BASE_URL}/api/v1/customer/${customer.id}`, {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ` + localStorage.getItem("token"),
        },
      });

      setCustomers((prev) => prev.filter((c) => c.id !== customer.id));
      toast({
        description: `Customer Successfully deleted`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      toast({
        description: `Customer failed to delete`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
        duration: 2000,
      });
    }
    setIsDeleting(false);
  };

  const handleEdit = () => {
    setAction("Update");
    setIsEditing(!isEditing);
  };

  const handleDocumentDelete = async () => {
    setIsDocumentsDeleting(true);
    try {
      if (!documents) return;
      await axios.delete(
        `${BASE_URL}/api/v1/customer/${customer.id}/documents/all`,
        {
          headers: {
            authorization: `Bearer ` + localStorage.getItem("token"),
          },
        },
      );
      setDocuments([]);
      toast({
        description: `Document Successfully deleted`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });
    } catch (error) {
      toast({
        description: `Failed to delete document`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
        duration: 2000,
      });
      console.log(error);
    }
    setIsDocumentsDeleting(false);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const resDoc = [];
      let overallProgress = 0;

      setProgress(overallProgress);
      const totalSize = Object.values(uploadedFiles).reduce(
        (acc, file) => acc + file.size,
        0,
      );

      if (uploadedFiles.length > 0) {
        let cnt = 0;
        for (const file of uploadedFiles) {
          const res = await uploadToDrive(file, customer.folderId);
          if (res.error) {
            throw new Error("Failed to upload documents");
            return;
          }
          resDoc.push({ ...res, id: cnt });
          cnt++;
          overallProgress += Math.round((file.size / totalSize) * 100) * 0.98;
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

      if (!name || !contact || !address) {
        toast({
          description: `Please fill all the fields`,
          className:
            "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
          variant: "destructive",
          duration: 2000,
        });
        return;
      }

      const res = await axios.put(
        `${BASE_URL}/api/v1/customer/${customer.id}`,
        {
          name: name,
          contact: contact,
          address: address,
          documents: updatedDocuments,
          joiningDate: joiningDate.toLocaleDateString("en-US"),
        },
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ` + localStorage.getItem("token"),
          },
        },
      );

      const upadtedCustomer = {
        id: customer.id,
        name,
        contact,
        address,
        folderId: customer.folderId,
        joiningDate: joiningDate.toLocaleDateString("en-US"),
        documents: res.data.documents,
      };
      setCustomers((prev) =>
        prev.map((cust) => {
          if (cust.id === customer.id) {
            return upadtedCustomer;
          }
          return cust;
        }),
      );
      setDocuments(res.data.documents);
      setUploadedFiles([]);
      setProgress(100);
      setIsEditing(false);
      toast({
        description: `Customer Successfully updated`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        description: `Customer failed to update`,
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
      if (
        files.length +
          uploadedFiles.length +
          (documents ? documents.length : 0) >
        5
      ) {
        setUploadedFiles([]);
        setErrors("You can upload upto 5 documents or images");
        return;
      }
      setUploadedFiles([...uploadedFiles, ...Array.from(files)]);
    }
  };

  const heading = action.split(" ")[0];
  const upperHeading = heading.charAt(0).toUpperCase() + heading.slice(1);

  if (!customer) return;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] z-20 border-border max-sm:min-h-[70%] flex flex-col p-0 items-center overflow-auto">
          <DialogHeader className="flex flex-row justify-between items-center w-full px-6 py-0">
            <DialogTitle>
              <div className="flex justify-start w-full whitespace-nowrap mt-2">
                Customer Id: {customer.id}
              </div>
            </DialogTitle>
            <div className="flex justify-end w-full items-center w-full mr-4 mb-2">
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" onClick={handleEdit}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                {isDeleting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setAction("Delete");
                      setIsDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="px-6 pb-2 h-full w-full max-sm:mt-6">
            <div className=" space-y-4 w-[90%]">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-6 w-6 mt-1 mr-3 stroke-[12px] fill-black dark:fill-white stroke-black dark:stroke-white" />
                <div className="flex justify-between items-center gap-1 w-full">
                  <div>
                    <Label htmlFor="name" className={`text-sm ${isEditing && "ml-2"}`}>Name</Label>
                    <div>
                    {isEditing ? (
                      <Input
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-muted text-sm"
                      />
                    ) : (
                      <p className="text-sm font-semibold">{name}</p>
                    )}
                    </div>
                  </div>
                  <div>
                    <div>
                      <Label htmlFor="contact" className={`text-sm ${isEditing && "ml-2"}`}>Contact</Label>
                      {isEditing ? (
                        <Input
                          name="contact"
                          value={contact}
                          maxLength={10}
                          onChange={(e) => setContact(e.target.value)}
                          className="bg-muted text-sm"
                        />
                      ) : (
                        <p className="text-sm font-semibold">{contact}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 mr-3 flex-shrink-0 fill-black dark:fill-white stroke-black dark:stroke-white stroke-[1px]" />
                <div className="flex items-center gap-2 ">
                <Label htmlFor="joinning" className={`text-sm`}>Joining Date</Label>
                {isEditing ? (
                    <DatePicker
                        className="max-sm:w-[120px]"
                        date={joiningDate}
                        setDate={setJoiningDate}/>
                  ) : (
                    <p className="text-sm font-semibold">{joiningDate.toLocaleString("en-GB", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <LocationIcon className="w-6 h-6 mr-3 stroke-[20px] stroke-black fill-black dark:stroke-white dark:fill-white" />
                {isEditing ? (
                  <Textarea
                    id="address"
                    value={address || ""}
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                    className="w-full bg-gray-200 dark:bg-muted text-sm"
                  />
                ) : (
                  <p className="text-sm font-semibold">
                    {address ? address : "No Address Added"}
                  </p>
                )}
              </div>
              <div>
                <div className="flex w-full gap-2 justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <span>Documents</span>

                      {isDocumentsDeleting ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                        </div>
                      ) : (
                        <>
                          {isEditing && (
                            <Button
                              className="cursor-pointer bg-gray-200 p-3 dark:bg-muted dark:text-white text-black hover:bg-gray-300 dark:hover:bg-secondary hover:bg-opacity-30"
                              onClick={() => {
                                setAction("delete the documents of");
                                setIsDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                    {isEditing && (
                      <div
                        onClick={() => {
                          document.getElementById("documents")?.click();
                        }}
                        className="flex items-center justify-center  bg-gray-300 text-sm hover:bg-gray-400 dark:bg-muted dark:hover:bg-gray-900 w-fit cursor-pointer text-secondary-foreground px-2 py-1 rounded-sm hover:bg-gray-200 transition-colors"
                      >
                        <Upload className="mr-2  h-4 w-4" />
                        <span>Choose file</span>
                      </div>
                    )}
                    {uploadedFiles.length +
                      (documents ? documents.length : 0) <=
                      5 && (
                      <Input
                        id="documents"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          setErrors("");
                          handleFileUpload(e);
                        }}
                        className={"hidden"}
                      />
                    )}
                    <p className="text-red-500 text-sm mt-1">{errors}</p>
                  </div>
                  <div className="flex justify-center w-[210px] h-[175px] max-sm:min-w-[150px] min-h-[175px] max-sm:min-h-[165px] w-fit h-fit border border-border px-[2px]">
                    <RenderFileList
                      documents={documents}
                      setDocuments={setDocuments}
                      uploadedFiles={uploadedFiles}
                      setUploadedFiles={setUploadedFiles}
                      isEditable={isEditing}
                    />
                    {documents &&
                      documents.length === 0 &&
                      uploadedFiles.length === 0 && (
                        <span className="text-center text-sm text-gray-400 dark:text-gray-500">
                          Upload upto 5 documents or images
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
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
                    onClick={() => {
                      setAction("Update");
                      setIsDialogOpen(true);
                    }}
                    className={`w-full ${isLoading && "cursor-not-allowed opacity-50"}`}
                  >
                    <span className="text-white">Save Changes</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-muted border-border">
          <DialogHeader>
            <DialogTitle>{upperHeading}</DialogTitle>
            <DialogDescription className="text-grey-500">
              Are you sure you want to {action} the customer?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="max-sm:w-full bg-primary hover:bg-opacity-10 shadow-lg"
              onClick={() => {
                handleAction();
                setIsDialogOpen(false);
              }}
            >
              {upperHeading}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
