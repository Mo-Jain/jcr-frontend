"use client";

import {  useState } from "react";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {  Loader2 } from "lucide-react";
import UserIcon from "@/public/user.svg";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import { toast } from "@/hooks/use-toast";
import {  uploadToDriveWTParent } from "@/app/actions/upload";
import { Label } from "@/components/ui/label";
import { User } from "./page";
import Image from "next/image";


interface AddUserProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export function Adduser({
  isOpen,
  setIsOpen,
  setUsers,
}: AddUserProps) {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName,setLastName] = useState<string>("");
    const [username,setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [file,setFile] = useState<File>();
    
  
    const handleEditPictureClick = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
    // Implement picture edit functionality here
    const newFile = event.target.files?.[0];
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

        return;
      }

      setIsLoading(false);
      setFile(newFile);
      setImageUrl(URL.createObjectURL(newFile));
    }
  };


  
  const handleSubmit = async () => {
    setIsLoading(true);
    try{
        const name = (firstName + " " + lastName).trim();
        if(name==""|| name==" " || !username || !password){
            toast({
                description: `Please fill all mandatory fields`,
                className:
                    "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
                variant: "destructive",
                duration: 2000,
            });
            setIsLoading(false);
            return;
        }
          
        const currentDate = new Date();
        const unixTimestamp = Math.floor(currentDate.getTime() / 1000);

        let resImage:{
            url: string;
            name: string;
            type: string;
            folderId: string;
            error?: undefined;
        } | {
            error: string;
            url?: undefined;
            name?: undefined;
            type?: undefined;
            folderId?: undefined;
        } | undefined;
        if(file){
            resImage = await uploadToDriveWTParent(
                file,
                "profile",
                name + " " + unixTimestamp,
            );

            if (resImage.error || !resImage.url) {
                return;
            }
         }
  
        const res = await axios.post(
                        `${BASE_URL}/api/v1/signup/se23crt1`,
                        {
                            name: name.trim(),
                            username: username.trim(),
                            password: password.trim(),
                            imageUrl: resImage ? resImage.url : undefined
                        },
                        {
                            headers: {
                            "Content-type": "application/json",
                            authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        },
                        );
        setUsername(username.trim());
        setPassword(password.trim());
        setUsers((prev) => [...prev, {
            id: res.data.id,
            name: name.trim(),
            username: username.trim(),
            password: password.trim(),
            imageUrl: resImage && resImage.url ? resImage.url : "",
            profileFolderId: resImage && resImage.url ? resImage.folderId : "",
        }]);
        toast({
            description: `User Successfully updated`,
            className:
              "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
          });
    }
    catch(error){
        console.log(error);
        toast({
            description: `Failed to add user`,
            className:
              "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
            variant: "destructive",
            duration: 2000,
          });
          setIsLoading(false);
          return;
    }
        setIsLoading(false);
    }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] z-20 border-border max-sm:min-h-[70%] flex flex-col p-0 items-center overflow-auto">
          <DialogHeader className="flex flex-row justify-between items-center w-full px-6 py-0">
            <DialogTitle>
              <div className="flex justify-start w-full px-3  whitespace-nowrap mt-5">
                Add User
              </div>
            </DialogTitle>
            
          </DialogHeader>

          <div className="px-6 pb-2 h-full w-full max-sm:mt-6">
            <div className=" space-y-4 w-full">
                <div className="flex items-center flex-col justify-center gap-2 w-full">
                    <div className="relative w-fit h-fit">
                        <div className="relative z-2 w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-transparent shadow-lg">
                            {!isLoading ? (
                            <>
                                {imageUrl ? (
                                <Image
                                    src={imageUrl || "/placeholder.svg"}
                                    alt={"new"}
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
                        </div>
                    </div>
                    <div className="flex justify-center items-center gap-2 mt-2 w-full">
                        <div>
                            <Label htmlFor="firstname" className={`text-sm ml-2 `}>First Name</Label>
                            <div>
                            <Input
                                name="firstname"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="bg-muted text-sm"
                            />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="lastname" className={`text-sm ml-2 `}>Last Name</Label>
                            <div>
                            <Input
                                name="lastname"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="bg-muted text-sm"
                            />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center gap-2 w-full">
                  <div>
                    <Label htmlFor="username" className={`text-sm ml-2`}>Username</Label>
                    <div>
                      <Input
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-muted text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <div>
                      <Label htmlFor="passowrd" className={`text-sm ml-2`}>Password</Label>
                        <Input
                          name="password"
                          value={password}
                          maxLength={10}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-muted text-sm"
                        />
                    </div>
                  </div>
                </div>
              </div>
             
            <div className="my-4">
                {isLoading ?
                <Button
                    className={`w-full text-white active:scale-95`}>
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
                    onClick={handleSubmit}
                    className={`w-full active:scale-95`}
                    >
                    <span className="text-white">Add User</span>
                </Button>
                }
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
    </>
  );
}
