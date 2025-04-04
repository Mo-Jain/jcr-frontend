"use client";

import { useEffect, useState } from "react";
import { Check, Clock, Edit2, Trash2,  Upload } from "lucide-react";
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
import MailIcon from "@/public/mail.svg";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { RenderFileList } from "./render-file-list";
import { Customer, Document } from "../app/profile/manage-customer/page";
import { uploadToDrive } from "@/app/actions/upload";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/datepicker";
import UploadDialog from "./upload-dialog";

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
    "Delete" | "Update" 
  >("Delete");
  const [address, setAddress] = useState(customer.address);
  const [documents, setDocuments] = useState<Document[] | undefined>(
    customer.documents,
  );
  const [name, setName] = useState<string>(customer.name);
  const [contact, setContact] = useState<string>(customer.contact);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [joiningDate, setJoiningDate] = useState<Date>(new Date(customer.joiningDate));
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [aadharFiles, setAadharFiles] = useState<File[]>([])
  const [licenseFiles, setLicenseFiles] = useState<File[]>([])
  const [otherFiles, setOtherFiles] = useState<File[]>([])
  const [mail, setMail] = useState<string>(customer.email || "");

  function handleAction() {
    if (action === "Delete") {
      handleDelete();
    } else if (action === "Update") {
      handleUpdate();
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

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const resDoc = [];
      let overallProgress = 0;

      setProgress(overallProgress);
      const totalSize = Object.values([...aadharFiles,...licenseFiles,...otherFiles]).reduce(
        (acc, file) => acc + file.size,
        0,
      );

      if (aadharFiles.length > 0) {
        let cnt = 0;
        for (const file of aadharFiles) {
          const res = await uploadToDrive(file, customer.folderId);
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
          const res = await uploadToDrive(file, customer.folderId);
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
          const res = await uploadToDrive(file, customer.folderId);
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
          email:mail,
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
        email:mail,
        folderId: customer.folderId,
        joiningDate: joiningDate.toLocaleDateString("en-US"),
        documents: res.data.documents,
        kycStatus:customer.kycStatus
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
      setProgress(100);
      setAadharFiles([]);
      setLicenseFiles([]);
      setOtherFiles([]);
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

  const heading = action.split(" ")[0];
  const upperHeading = heading.charAt(0).toUpperCase() + heading.slice(1);

  if (!customer) return;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] z-20 border-border max-sm:min-h-[70%] flex flex-col p-0 px-3 sm:px-6 items-center overflow-auto gap-0">
          <DialogHeader className="flex flex-row justify-between items-center w-full mb-2">
            <DialogTitle>
              <div className="flex justify-start items-center gap-2 w-full whitespace-nowrap mt-2">
                Customer Id: {customer.id}
                {customer.kycStatus === "verified" &&
                  <div className="flex items-center gap-1 text-sm bg-green-500 text-white rounded-full px-2 py-1">
                    <Check className="w-4 h-5"/>
                    <span className="whitespace-nowrap text-xs">{customer.kycStatus}</span>
                  </div>
                }
                {customer.kycStatus === "under review" &&
                  <div className="flex items-center gap-1 text-sm bg-blue-500 text-white rounded-full px-2 py-1">
                    <Clock className="w-4 h-5"/>
                    <span className="whitespace-nowrap text-xs">{customer.kycStatus}</span>
                  </div>
                }
                {customer.kycStatus === "pending" &&
                  <div className="flex items-center gap-1 text-sm bg-red-500 text-white rounded-full px-2 py-1">
                    <Clock className="w-4 h-5"/>
                    <span className="whitespace-nowrap text-xs">{customer.kycStatus}</span>
                  </div>
                }
              </div>
            </DialogTitle>
            <div className="flex justify-end w-full items-center w-full mr-6 sm:mr-4 ">
              <div className="flex">
                <Button variant="ghost" className="p-0 gap-0 mt-[2px]" size="icon" onClick={handleEdit}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                {isDeleting ? (
                  <div className="flex items-center justify-center mt-[2px]">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-0 gap-0 mt-[2px]"
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

          <div className=" pb-2 h-full w-full">
            <div className=" space-y-2 w-full">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-6 w-6 mt-1 mr-3 stroke-[12px] fill-black dark:fill-white stroke-black dark:stroke-white" />
                <div className="flex justify-between items-center gap-1 w-full">
                  <div>
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
                <div className="text-sm" >
                  <span>Pwd: </span>
                  <span> {customer.password}</span>
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
              <div className="flex items-center space-x-2">
                <MailIcon className="h-6 w-6 mt-1 mr-3 fill-black dark:fill-white stroke-black dark:stroke-white" />
                <div className="flex justify-between items-center gap-1 w-full">
                  <div>
                    <div>
                    {isEditing ? (
                      <Input
                        name="mail"
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                        className="bg-muted text-sm"
                      />
                    ) : (
                      <p className="text-sm font-semibold">{mail}</p>
                    )}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex flex-col w-full gap-1 justify-between">
                  <div className="flex item-center gap-1 w-full">
                    <div>
                      <div className="flex flex-col rounded-sm justify-start min-w-[165px] sm:min-w-[180px] h-[90px] min-h-[90px] w-fit h-fit border border-border px-[2px]">
                        <p className="text-xs">Aadhar Card :</p>
                        <div className="h-[74px] overflow-y-scroll overflow-x-hidden scrollbar-hide">
                          {(documents &&
                            documents.filter((doc:Document) => doc.docType === "aadhar").length === 0) &&
                            aadharFiles.length === 0 ? (
                              <span className="text-center text-xs text-gray-400 min-w-[185px] dark:text-gray-500">
                                Upload upto 2 documents
                              </span>
                            )
                            :
                              <RenderFileList
                                documents={documents?.filter((doc:Document) => doc.docType === "aadhar")}
                                setDocuments={setDocuments}
                                uploadedFiles={aadharFiles}
                                setUploadedFiles={setAadharFiles}
                                isEditable={isEditing}
                              />
                            }
                          </div>
                      </div>
                      <div className="flex flex-col rounded-sm justify-start min-w-[165px] sm:min-w-[180px] h-[90px] min-h-[90px] w-fit h-fit border border-border px-[2px]">
                        <p className="text-xs">Driving License :</p>
                        <div className="h-[74px] overflow-scroll scrollbar-hide">
                          {(documents &&
                            documents.filter((doc:Document) => doc.docType === "license").length === 0 &&
                            licenseFiles.length === 0) ? (
                              <span className="text-center text-xs text-gray-400 min-w-[185px] dark:text-gray-500">
                                Upload upto 2 documents
                              </span>
                            )
                            :
                              <RenderFileList
                                documents={documents?.filter((doc:Document) => doc.docType === "license")}
                                setDocuments={setDocuments}
                                uploadedFiles={licenseFiles}
                                setUploadedFiles={setLicenseFiles}
                                isEditable={isEditing}
                              />
                            }
                          </div>
                          
                      </div>
                    </div>
                    <div className="h-full flex flex-col gap-1">
                      {(documents && 
                      documents.filter((doc:Document) => doc.docType === "others").length + otherFiles.length > 0
                      ) &&
                       (
                        <div className="flex flex-col justify-start rounded-sm h-full min-w-[165px] sm:min-w-[180px] h-[90px] min-h-[90px] w-fit h-fit border border-border px-[2px]">
                          <p className="text-xs">Others :</p>
                          <div className="h-full max-h-full overflow-scroll scrollbar-hide">
                            <RenderFileList
                              documents={documents?.filter((doc:Document) => doc.docType === "others")}
                              setDocuments={setDocuments}
                              uploadedFiles={otherFiles}
                              setUploadedFiles={setOtherFiles}
                              isEditable={isEditing}
                            />
                          </div>
                        </div>
                      )}
                      {isEditing && (
                        <div
                          onClick={() => {
                            setIsUploadDialogOpen(true);
                          }}
                          className="flex items-center w-full justify-center bg-gray-300 text-sm hover:bg-gray-400 dark:bg-muted dark:hover:bg-gray-900 w-fit cursor-pointer text-secondary-foreground px-2 py-1 rounded-sm hover:bg-gray-200 transition-colors"
                        >
                          <Upload className="mr-2  h-4 w-4" />
                          <span className="text-xs whitespace-nowrap">Upload</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {!isEditing &&  customer.kycStatus==="under review" &&
              <div className="w-full flex justify-center items-center mt-2 gap-4">
                <Button className="py-0 w-full px-1 text-xs text-white"
                >Verify KYC</Button>
              </div>
            }

            {isEditing && (
              <div className="mt-2">
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
                      <div className="flex items-end py-1 h-full">
                        <span className="sr-only">Loading...</span>
                        <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce"></div>
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
                    className={`w-full ${isLoading && "cursor-not-allowed active:scale-95 opacity-50"}`}
                  >
                    <span className="text-white">Save Changes</span>
                  </Button>
                )}
              </div>
            )}
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
              className="max-sm:w-full bg-primary hover:bg-opacity-10 active:scale-95 shadow-lg"
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
