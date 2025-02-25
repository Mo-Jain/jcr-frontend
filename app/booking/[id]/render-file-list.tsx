import { ImageIcon, Loader2 } from "lucide-react"
import { BsFilePdfFill } from "react-icons/bs"
import Link from "next/link"
import { useState } from "react"
import { deleteFile } from "@/app/actions/delete";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import { toast } from "@/hooks/use-toast";

export interface Document{
    id: number;
    name: string;
    url: string;
    type: string;
}

export const RenderFileList = ({documents,editable,onDelete,type,bookingId}:{
    documents:Document[],
    editable: boolean,
    type: "documents" | "photos" | "selfie",
    bookingId:string,
    onDelete: (id: number, type: "documents" | "photos" | "selfie") => void
})=>{
    
    const handleDeleteFile = async (
            id: number, 
            url: string, 
            setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>
        ) => {
            setIsDeleting(true);
            const endpoints: Record<string, string> = {
                documents: `${BASE_URL}/api/v1/customer/document/${id}`,
                photos: `${BASE_URL}/api/v1/booking/car-image/${id}`,
                selfie: `${BASE_URL}/api/v1/booking/selfie-url/${bookingId}`
            };
        
            const successMessages: Record<string, string> = {
                documents: "Document successfully deleted",
                photos: "Car image successfully deleted",
                selfie: "Selfie successfully deleted"
            };
        
            try {
                await deleteFile(url);
                await axios.delete(endpoints[type], {
                    headers: {
                        "Content-type":  "application/json",
                        authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                onDelete(id, type);
                toast({
                    description: successMessages[type],
                    className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal"
                } );
            } catch (error) {
                console.log(error);
                toast({
                    description: "File could not be deleted",
                    className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
                    variant: "destructive"
                } );
                setIsDeleting(false);
            }
            setIsDeleting(false);
        };
    return(
        <>
            {documents.map((document,index) => {
                return(
                    <RenderDocument key={index} id={document.id} name={document.name} url={document.url} type={document.type} editable={editable} handleDeleteFile={handleDeleteFile} />
            )})}
        
        </>
  )}

  const RenderDocument = ({id,name,url,type,editable,handleDeleteFile}: {
    id:number,
    name:string,
    url:string,
    type:string,
    editable:boolean,
    handleDeleteFile:(id:number,url:string,setIsDeleting:React.Dispatch<React.SetStateAction<boolean>>)=>void
  }) => {
    const getFileIcon = (type: string) => {
        if(!type.startsWith('image/')){
          return <BsFilePdfFill className="w-4 h-4" />
        }
        return <ImageIcon className="w-4 h-4" />
      }
    const [isDeleting, setIsDeleting] = useState(false);
    return(
        <Link
                href={url}
                target="_blank"
                className="flex w-fit max-w-[130px] max-h-[30px] sm:max-w-[200px] sm:max-h-[40px] my-1 items-center gap-2 bg-gray-200 dark:bg-muted p-2 rounded-md"
            >
                <span className="min-w-4">
                {getFileIcon(type)}
                </span>
                <span className="whitespace-nowrap overflow-hidden text-ellipsis text-xs sm:text-sm">{name}</span>
                
                {editable &&
                <>
                {!isDeleting ?
                 <span
                    className="rotate-45 flex items-center text-red-500 w-3 cursor-pointer text-[25px]"
                    onClick={(e) => {
                        e.preventDefault(); 
                        e.stopPropagation();
                        setIsDeleting(true);
                        handleDeleteFile(id,url,setIsDeleting)
                    }}
                    >
                    +
                </span>
                :
                <div className=" flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                </div>
                }
                </>
                }
            </Link>
    )
  }

  export const RenderNewFileList = ({uploadedFiles,handleRemoveFile,type}:{
    uploadedFiles:File[],
    handleRemoveFile:(type:string,index:number)=>void,
    type:string
})=>{
    const getFileIcon = (type: string) => {
          if(!type.startsWith('image/')){
            return <BsFilePdfFill className="w-4 h-4" />
          }
          return <ImageIcon className="w-4 h-4" />
        }
    return(
        <>
            {uploadedFiles.map((file, index) => {
                const url = URL.createObjectURL(file);
                return(
                <Link
                href={url}
                key={index}
                target="_blank"
                className="flex w-fit max-w-[130px] max-h-[30px] sm:max-w-[200px] sm:max-h-[40px] my-1 items-center gap-2 bg-green-300 dark:bg-green-700 p-2 rounded-md"
                >
                    <span className="min-w-4">
                        {getFileIcon(file.type)}
                    </span>
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis text-xs sm:text-sm">{file.name}</span>
                    <span
                        className="rotate-45 text-red-500 w-3 cursor-pointer text-[25px]"
                        onClick={(e) => {
                            e.preventDefault(); 
                            e.stopPropagation();
                            handleRemoveFile(type, index)
                            }}
                        >
                            +
                    </span>
                       
                </Link>
            )})}
        </>
  )}