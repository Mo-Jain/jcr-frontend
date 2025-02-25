import { ImageIcon, Loader2 } from "lucide-react";
import { BsFilePdfFill } from "react-icons/bs";
import { deleteFile } from "@/app/actions/delete";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Document } from "./page";

const getFileIcon = (type: string) =>
  type.startsWith("image/") ? <ImageIcon className="w-4 h-4" /> : <BsFilePdfFill className="w-4 h-4" />;

const FileItem = ({
  name,
  url,
  type,
  isEditable,
  onDelete,
  newFile
}: {
  name: string;
  url: string;
  type: string;
  isEditable?: boolean;
  onDelete?: () => void;
  newFile?:boolean;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <Link
      href={url}
      target="_blank"
      className={cn("flex w-fit max-w-[200px] max-h-[40px] my-1 items-center gap-2 bg-gray-200 dark:bg-muted p-1 rounded-md",
         newFile && `bg-green-300 dark:bg-green-700`
      )}

    >
      <span className="min-w-4">{getFileIcon(type)}</span>
      <span className="whitespace-nowrap overflow-hidden max-sm:max-w-[100px] text-ellipsis text-xs sm:text-sm">{name}</span>
      {!isDeleting ? (
        isEditable && (
          <span
            className="rotate-45 text-red-500 w-3 cursor-pointer text-[25px]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDeleting(true);
              onDelete?.();
            }}
          >
            +
          </span>
        )
      ) : (
        <div className="flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
        </div>
      )}
    </Link>
  );
};

export const RenderFileList = ({
  documents,
  setDocuments,
  uploadedFiles,
  setUploadedFiles,
  isEditable,
}: {
  documents?: Document[];
  setDocuments?: React.Dispatch<React.SetStateAction<Document[] | undefined>>;
  uploadedFiles: File[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  isEditable?: boolean;
}) => {
  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteDocument = async (id: number, url: string) => {
    if (!documents) return;
    try {
      await deleteFile(url);
      await axios.delete(`${BASE_URL}/api/v1/customer/document/${id}`, {
        headers: {
          authorization: `Bearer ` + localStorage.getItem("token"),
        },
      });
      if(setDocuments) setDocuments((prev) => prev?.filter((doc) => doc.id !== id));
      toast({
        description: "Document Successfully deleted",
        className: "text-black bg-white border-0 rounded-md shadow-md shadow-black/5 font-normal",
      });
    } catch (error) {
      console.log(error);
      toast({
        description: "Document could not be deleted",
        className: "text-black bg-white border-0 rounded-md shadow-md shadow-black/5 font-normal",
        variant: "destructive",
duration: 2000
      });
    }
  };

  return (
    <div className="text-sm">
      {documents?.map((document,index) => (
        <FileItem
          key={index}
          name={document.name}
          url={document.url}
          type={document.type}
          isEditable={isEditable}
          onDelete={() => handleDeleteDocument(document.id, document.url)}
        />
      ))}
      {uploadedFiles.map((file, index) => (
        <FileItem
          key={index}
          name={file.name}
          url={URL.createObjectURL(file)}
          type={file.type}
          isEditable={isEditable}
          onDelete={() => handleRemoveFile(index)}
          newFile={true}
        />
      ))}
    </div>
  );
};
