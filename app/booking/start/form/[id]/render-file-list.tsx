import { ImageIcon, Loader2 } from "lucide-react";
import { BsFilePdfFill } from "react-icons/bs";
import { Document } from "./page";
import Link from "next/link";
import { useState } from "react";

export const RenderFileList = ({
  documents,
  handleDeleteDocument,
}: {
  documents: Document[];
  handleDeleteDocument: (
    id: number,
    url: string,
    setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>,
  ) => void;
}) => {
  return (
    <>
      {documents.map((document, index) => {
        return (
          <RenderDocument
            key={index}
            id={document.id}
            name={document.name}
            url={document.url}
            type={document.type}
            handleDeleteFile={handleDeleteDocument}
          />
        );
      })}
    </>
  );
};

const RenderDocument = ({
  id,
  name,
  url,
  type,
  handleDeleteFile,
}: {
  id: number;
  name: string;
  url: string;
  type: string;
  handleDeleteFile: (
    id: number,
    url: string,
    setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>,
  ) => void;
}) => {
  const getFileIcon = (type: string) => {
    if (!type.startsWith("image/")) {
      return <BsFilePdfFill className="w-4 h-4" />;
    }
    return <ImageIcon className="w-4 h-4" />;
  };
  const [isDeleting, setIsDeleting] = useState(false);
  return (
    <Link
      href={url}
      key={id}
      target="_blank"
      className="flex w-fit max-w-[200px] max-h-[40px] my-1 items-center gap-2 bg-gray-200 dark:bg-muted p-2 rounded-md"
    >
      <span className="min-w-4">{getFileIcon(type)}</span>
      <span className="whitespace-nowrap overflow-hidden text-ellipsis text-sm">
        {name}
      </span>
      {!isDeleting ? (
        <span
          className="rotate-45 text-red-500 w-3 cursor-pointer text-[25px]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDeleteFile(id, url, setIsDeleting);
          }}
        >
          +
        </span>
      ) : (
        <div className=" flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
        </div>
      )}
    </Link>
  );
};

export const RenderNewFileList = ({
  uploadedFiles,
  handleRemoveFile,
  type,
}: {
  uploadedFiles: File[];
  handleRemoveFile: (type: string, index: number) => void;
  type: string;
}) => {
  const getFileIcon = (type: string) => {
    if (!type.startsWith("image/")) {
      return <BsFilePdfFill className="w-4 h-4" />;
    }
    return <ImageIcon className="w-4 h-4" />;
  };
  return (
    <>
      {uploadedFiles.map((file, index) => {
        const url = URL.createObjectURL(file);
        return (
          <Link
            href={url}
            key={index}
            target="_blank"
            className="flex w-fit max-w-[200px] max-h-[40px] my-1 items-center gap-2 bg-green-300 dark:bg-green-800 p-2 rounded-md"
          >
            <span className="min-w-4">{getFileIcon(file.type)}</span>
            <span className="whitespace-nowrap overflow-hidden text-ellipsis text-sm">
              {file.name}
            </span>
            <span
              className="rotate-45 text-red-500 w-3 cursor-pointer text-[25px]"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRemoveFile(type, index);
              }}
            >
              +
            </span>
          </Link>
        );
      })}
    </>
  );
};
