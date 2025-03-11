"use client";

import { useEffect, useState } from "react";
import { Edit, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {  Loader2 } from "lucide-react";
import UserIcon from "@/public/user.svg";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import { toast } from "@/hooks/use-toast";
import { uploadToDrive } from "@/app/actions/upload";
import { Label } from "@/components/ui/label";
import { User } from "./page";
import Image from "next/image";

interface UserPopupProps {
  user: User;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export function UserPopup({
  user,
  isOpen,
  setIsOpen,
}: UserPopupProps) {
  const [action, setAction] = useState<
    "Delete" | "Update" | "delete the documents of"
  >("Delete");

  const [name, setName] = useState<string>(user.name);
  const [username,setUsername] = useState<string>(user.username);
  const [password, setPassword] = useState<string>(user.password);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(user.imageUrl || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [file,setFile] = useState<File>();

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
      await axios.delete(`${BASE_URL}/api/v1/user/${user.id}`, {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ` + localStorage.getItem("token"),
        },
      });

      toast({
        description: `User Successfully deleted`,
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

  
    const handleEditPictureClick = async (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const newFile = event.target.files?.[0];
      setIsLoading(true);
      if (newFile) {
        if (!newFile.type.startsWith("image/")) {
          toast({
            description: `Please select an image file`,
            className:
              "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
            variant: "destructive",
            duration: 2000,
          });
          setIsLoading(false);
          return;
        }
  
        const maxSize = 6 * 1024 * 1024; // 5MB
        if (newFile.size > maxSize) {
          toast({
            description: `File size should not exceed 5MB`,
            className:
              "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
            variant: "destructive",
            duration: 2000,
          });
          setIsLoading(false);
  
          return;
        }
  
        setIsLoading(false);
        setFile(newFile);
        setImageUrl(URL.createObjectURL(newFile));
      }
    };

  const handleEdit = () => {
    setAction("Update");
    setIsEditing(!isEditing);
  };

  
  const handleUpdate = async () => {
    setIsUpdating(true);
    try{
        let newImageUrl:string|undefined;
        if(file){
            const resImage = await uploadToDrive(
                file,
                user.profileFolderId
            );

            if (resImage.error || !resImage.url) {
                return;
            }
            newImageUrl = resImage.url;
        }
  
        await axios.put(
            `${BASE_URL}/api/v1/user/${user.id}`,
            {
                name: name.trim(),
                username: username.trim(),
                password: password.trim(),
                imageUrl: newImageUrl
            },
            {
                headers: {
                "Content-type": "application/json",
                authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            },
            );
        setName(name.trim());
        setUsername(username.trim());
        setPassword(password.trim());
        
        toast({
            description: `User Successfully updated`,
            className:
              "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
          });
    }
    catch(error){
        console.log(error);
        toast({
            description: `Failed to update user`,
            className:
              "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
            variant: "destructive",
            duration: 2000,
          });
          setIsLoading(false);
          setIsUpdating(false);
          return;
    }
    setIsUpdating(false);
    }


  const heading = action.split(" ")[0];
  const upperHeading = heading.charAt(0).toUpperCase() + heading.slice(1);

  if (!user) return;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] z-20 border-border max-sm:min-h-[70%] flex flex-col p-2  items-center overflow-auto">
          <DialogHeader className="flex flex-row justify-between items-center w-full px-6 py-0">
            <DialogTitle>
              <div className="flex justify-start w-full whitespace-nowrap mt-2">
                User Id: {user.id}
              </div>
            </DialogTitle>
            <div className="flex justify-end  items-start absolute top-[2px] right-10">
              <div className="flex items-center">
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
                <div className="flex items-center justify-between gap-2 w-full">
                    <div className="relative w-fit h-fit">
                        <div className="relative z-2 w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-transparent shadow-lg">
                            {!isLoading ? (
                            <>
                                {imageUrl ? (
                                <Image
                                    src={imageUrl || "/placeholder.svg"}
                                    alt={user.name}
                                    fill
                                    className="object-cover rounded-full"
                                />
                                ) : (
                                <UserIcon className="w-28 h-28 stroke-[12px] stroke-blue-600 fill-blue-600" />
                                )}
                            </>
                            ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                            </div>
                            )}
                        </div>
                        {isEditing &&
                        <div className="flex z-5 absolute bottom-0 right-0 justify-center">
                            <div
                            className="bg-blue-600 cursor-pointer p-1 rounded-full dark:text-black text-white hover:bg-gray-800"
                            onClick={() => document.getElementById("profileImage")?.click()}
                            >
                            <Edit className="h-5 w-5" />
                            <Input
                                id="profileImage"
                                type="file"
                                accept="image/*"
                                onChange={handleEditPictureClick}
                                className="hidden"
                                // className={cn("border-0 cursor-pointer overflow-hidden text-ellipsis border-b-gray-400 rounded-none border-b border-black p-0 focus:border-blue-500 focus:ring-0", "transition-colors duration-200")}
                            />
                            </div>
                        </div>}
                    </div>
                    <div className="flex justify-center items-center gap-1 w-full">
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
                    </div>
                </div>
              <div className="flex items-center space-x-2">
                <div className="flex justify-between items-center gap-1 w-full">
                  <div>
                    <Label htmlFor="username" className={`text-sm ${isEditing && "ml-2"}`}>Username</Label>
                    <div>
                    {isEditing ? (
                      <Input
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-muted text-sm"
                      />
                    ) : (
                      <p className="text-sm font-semibold">{username}</p>
                    )}
                    </div>
                  </div>
                  <div>
                    <div>
                      <Label htmlFor="name" className={`text-sm ${isEditing && "ml-2"}`}>Password</Label>
                      {isEditing ? (
                        <Input
                          name="bookedBy"
                          value={password}
                          maxLength={10}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-muted text-sm"
                        />
                      ) : (
                        <p className="text-sm font-semibold">{password}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                    <div className="flex justify-between items-center gap-1 w-full">
                        <div>
                            <Label className={`text-sm`}>Profile Folder Id</Label>
                            <div>
                            <p className="text-sm font-semibold">{user.profileFolderId}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isEditing && 
            <div className="my-2">
                {isUpdating ?
                <Button
                    className={`w-full text-white`}>
                    <span>Please wait</span>
                    <div className="flex items-end py-1 h-full">
                        <span className="sr-only">Loading...</span>
                        <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce"></div>
                    </div>
                </Button>
                :
                <Button
                    onClick={() => {
                        setAction("Update");
                        setIsDialogOpen(true);
                    }}
                    className={`w-full`}
                    >
                    <span className="text-white">Save Changes</span>
                </Button>
                }
            </div>
            }
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-muted border-border">
          <DialogHeader>
            <DialogTitle>{upperHeading}</DialogTitle>
            <DialogDescription className="text-grey-500">
              Are you sure you want to {action} the user?
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
