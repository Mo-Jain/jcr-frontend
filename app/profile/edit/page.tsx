"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {  Edit, Eye, EyeOff, Loader2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import BackArrow from "@/public/back-arrow.svg";
import UserIcon from "@/public/user.svg"
import axios from "axios"
import { BASE_URL } from "@/lib/config"
import LoadingScreen from "@/components/loading-screen"
import { useUserStore } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { deleteFile } from "@/app/actions/delete"
import {  uploadToDriveWTParent } from "@/app/actions/upload";
import Update from "@/public/updated.svg"

interface User {
  name: string;
  imageUrl: string;
  username: string;
  password: string;
  profileFolderId:string | null;
}

export default function ProfilePage() {
  const [user,setUser] = useState<User>();
  const {name,setName,imageUrl,setImageUrl} = useUserStore();
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const usernameInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [newName,setNewName] = useState(user?.name);

  // This would typically come from your authentication system
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/me`,{
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setUser(res.data.user);
      }
      catch(error){
        console.log(error);
      }
    }
    fetchData();
  },[]);

  useEffect(() => {
    if(user) {
      setUsername(user.username);
      setPassword(user.password);
      setNewName(user.name);
    }
  },[user]);

  useEffect(() => {
    if (isEditingUsername && usernameInputRef.current) {
      usernameInputRef.current.focus()
    }
  }, [isEditingUsername])

  useEffect(() => {
    if (isEditingPassword && passwordInputRef.current) {
      passwordInputRef.current.focus()
    }
  }, [isEditingPassword]);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus()
    }
  }, [isEditingName]);

  const handleNameUpdate = async() => {
    if(!newName) return;
    try {
      await axios.put(`${BASE_URL}/api/v1/me`,{
        name: newName
      },{
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setIsEditingName(false);
      setName(newName);
      toast({
        description: `Name Successfully updated`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });
    }
    catch(error){
      console.log(error);
      toast({
        description: `Failed to update name`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
        duration: 2000
      });
    }
    
  }

  if(!user) {
    return <LoadingScreen/>;
  }

  const handleEditPictureClick = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // Implement picture edit functionality here
    const file = event.target.files?.[0];
    setIsLoading(true);
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          description: `Please select an image file`,
          className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
          variant: "destructive",
          duration: 2000
        });
        setIsLoading(false);
        return
      }

      const maxSize = 6 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        toast({
          description: `File size should not exceed 5MB`,
          className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
          variant: "destructive",
          duration: 2000
        });
        setIsLoading(false);

        return
      }
      

      try{
        const currentDate = new Date();
        const unixTimestamp = Math.floor(currentDate.getTime() / 1000);

        const resImage = await uploadToDriveWTParent(file,"profile",user.name+" "+unixTimestamp);

        if(resImage.error || !resImage.url){
          setIsLoading(false);
          return
        }
        await axios.put(`${BASE_URL}/api/v1/me`,{
          imageUrl: resImage.url,
          profileFolderId:resImage.folderId
        },{
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        if(imageUrl && imageUrl !== ""){
          await deleteFile(imageUrl);
        }
        setIsLoading(false);
        setImageUrl(URL.createObjectURL(file));
        toast({
          description: `Profile picture Successfully updated`,
          className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        });
      }
      catch(error){
        console.log(error);
        setIsLoading(false);
        toast({
          description: `Failed to upload profile picture`,
          className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
          variant: "destructive",
          duration: 2000
        });
      }
    }
  }

  const handleUsernameClick = () => {
    setIsEditingUsername(true)
  }

  const handlePasswordClick = () => {
    setIsEditingPassword(true)
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleUpdateUsername = async () => {
    // Here you would typically update the username in your backend
    try {
      await axios.put(`${BASE_URL}/api/v1/me`,{
        username: username
      },{
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setIsEditingUsername(false);
      toast({
        description: `Username Successfully updated`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });
    }
    catch(error){
      console.log(error);
      toast({
        description: `Failed to update username`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
        duration: 2000
      });
    }
  }

  const handleUpdatePassword = async() => {
    // Here you would typically update the password in your backend
    try {
      await axios.put(`${BASE_URL}/api/v1/me`,{
        password: password
      },{
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setIsEditingPassword(false)
      setShowPassword(false)
      toast({
        description: `Password Successfully updated`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });
    }
    catch(error){
      console.log(error);
      toast({
        description: `Failed to update password`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
        duration: 2000
      });
    }
  }

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement) {
      if (!e.target.closest("#username-field") && !e.target.closest("#password-field")) {
        setUsername(user.username);
        setPassword(user.password);
        setIsEditingUsername(false)
        setIsEditingPassword(false)
        setShowPassword(false)
        setIsEditingName(false)
      }
    }
  }



  return (
    <div className="min-h-screen bg-white dark:bg-background " onClick={handleClickOutside}>
      {/* Blue section covering ~30% of the page */}
      <div className="sm:h-[30vh] h-[20vh] bg-muted dark:bg-black border-b-[1px] dark:border-muted text-muted-foreground relative">
        {/* Circle for user image or icon */}
    
        <div className="absolute z-0 left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
          <div className="relative z-2 w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-transparent shadow-lg">
            {!isLoading ?
            <>
              { imageUrl  ? (
                <Image src={imageUrl || "/placeholder.svg"} alt={user.name} fill className="object-cover rounded-full" />
              ) : (
                <UserIcon className="w-28 h-28 stroke-[12px] stroke-blue-600 fill-blue-600" />
              )}
            </>
            :
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>}
          </div>
          <div className="flex z-5 absolute bottom-0 right-0 justify-center">
            <div
              className="bg-blue-600 cursor-pointer p-1 rounded-full dark:text-black text-white hover:bg-gray-800"
              onClick={() => document.getElementById('profileImage')?.click()}
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
      </div>

      

      {/* Content area */}
      <div className="max-w-3xl mx-auto">      
          <Button 
            onClick={() => router.push('/profile')}
            className=" mt-2 flex ml-4 bg-transparent w-fit rounded-md cursor-pointer shadow-none justify-start text-black border dark:border-card border-gray-200 hover:bg-gray-200 dark:hover:bg-card ">
                <BackArrow className="h-6 w-6 stroke-0 fill-gray-800 dark:fill-blue-300" />
          </Button>
      <div className="max-w-3xl mx-auto pt-12 px-4 sm:px-6 lg:px-8 pb-12  ">
        {!isEditingName ?
          <div className="flex items-center mb-8 justify-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900   dark:text-white">{name}</h1>
            <Pencil
            onClick={() => setIsEditingName(true)}
             className="w-4 h-4 mt-2 cursor-pointer text-white" />
          </div>
          :
          <div className="flex items-center mb-8 justify-center gap-2 ">
            <div className="w-fit">
              <div className="flex items-center">
                <input 
                type="text" 
                id="name" 
                ref={nameInputRef}
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                className="text-3xl sm:text-4xl px-1 font-bold max-w-[220px] py-1 sm:max-w-[250px] bg-transparent w-fit border-0 shadow-none focus-visible:ring-0 " />
                <Update
                onClick={handleNameUpdate}
                 className="w-7 h-7  cursor-pointer"/>
              </div>
              <div className={`h-px bg-blue-400`} />
            </div>
          </div>
        }
        {/* Edit picture button */}
        

        {/* Username section */}
        <div className="space-y-2 mb-6" id="username-field">
          <label
            htmlFor="username"
            className={`block text-sm font-medium ${isEditingUsername ? "text-blue-500" : "text-gray-500"}`}
          >
            USERNAME
          </label>
          <div className="flex items-center cursor-text space-x-4" onClick={handleUsernameClick}>
            {isEditingUsername ? (
              <input
                ref={usernameInputRef}
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                className="block w-full dark:bg-black dark:bg-opacity-0 dark:text-blue-200 border-none p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
              />
            ) : (
              <span className="text-gray-900 cursor-pen dark:text-blue-200" >
                {username}
              </span>
            )}
            {isEditingUsername && (
              <button onClick={handleUpdateUsername} className="text-blue-500 flex items-center gap-1 text-sm font-medium">
                <Update className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className={`h-px ${isEditingUsername ? "bg-blue-500" : "bg-gray-200"}`} />
        </div>

        {/* Password section */}
        <div className="space-y-2" id="password-field">
          <label
            htmlFor="password"
            className={`block text-sm font-medium ${isEditingPassword ? "text-blue-500" : "text-gray-500"}`}
          >
            PASSWORD
          </label>
          <div className="flex items-center cursor-text space-x-4" onClick={handlePasswordClick}>
            {isEditingPassword ? (
              <div className="relative w-full">
                <input
                  ref={passwordInputRef}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="block w-full border-none p-0 dark:bg-black dark:bg-opacity-0 dark:text-blue-200 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none pr-10 "
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            ) : (
              <span className="text-gray-900 cursor-pen dark:text-blue-200" >
                {password ? "•".repeat(password.length) : ""}
              </span>
            )}
            {isEditingPassword && (
              <button onClick={handleUpdatePassword} className="text-blue-500 text-sm font-medium">
                <Update className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className={`h-px ${isEditingPassword ? "bg-blue-500" : "bg-gray-200"}`} />
        </div>
      </div>
      </div>
    </div>
  )
}

