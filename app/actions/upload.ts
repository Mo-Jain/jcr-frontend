"use server";

import { error } from "console";
import { google } from "googleapis";
import { Readable } from "stream";
import axios from "axios";
import path from "path"
import mime from 'mime-types';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN as string;
const CAR_FOLDER_ID = process.env.CAR_FOLDER_ID as string;
const PROFILE_FOLDER_ID = process.env.PROFILE_FOLDER_ID as string;

const ACCESS_KEY = process.env.ACCESS_KEY;
const HOSTNAME = process.env.HOSTNAME;
const USERNAME = process.env.STORAGE_ZONE_NAME;

// Google Drive OAuth2 Setup
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  "http://localhost:3000",
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({ version: "v3", auth: oauth2Client });

export async function uploadToDrive(file: File, folderId: string) {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    if (!folderId) {
      throw error("Invalid Folder ID");
    }

    const fileMetadata = {
      name: file.name,
      parents: [folderId],
    };

    const stream = BufferToStream(buffer);

    const media = {
      mimeType: file.type,
      body: stream,
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: "id",
    });

    await drive.permissions.create({
      fileId: response.data.id as string,
      requestBody: { role: "reader", type: "anyone" },
    });

    return {
      url: `https://drive.google.com/uc?id=${response.data.id}`,
      name: file.name,
      type: file.type,
      folderId: folderId,
    };
  } catch (error) {
    console.error("Upload Error:", error);
    return { error: (error as Error).message };
  }
}

export const handleFileUpload = async (file: File, directoryPath: string) => {

  try{
      if(!file) return null;
      const buffer = Buffer.from(await file.arrayBuffer());

      const fileStream = BufferToStream(buffer);
      const fileExtension = path.extname(file.name).slice(1);
     
      const url = `https://${HOSTNAME}/${USERNAME}/${directoryPath}/${file.name}`;
      const contentType = mime.lookup(fileExtension) || "application/octet-stream";

      const response = await axios.put(
          url,
          fileStream,
          {
              headers: {
                  AccessKey: ACCESS_KEY,
                  "Content-Type": contentType
              }
          }
      );


      if(response.data){
          return {
              success:true,
              url:`https://carbook.b-cdn.net/${directoryPath}/${file.name}`,
              public_id: file.name,
              message:"File uploaded successfully"
          }
      }
      else {
          return null;
      }
  }
  catch (error) {
    console.error("Upload Error:", error);
    return { error: (error as Error).message };
  } 
}


export async function uploadMultipleToDrive(files: File[], folderId: string) {
  const uploadedFiles = [];

  let cnt = 1;
  for (const file of files) {
    const result = await uploadToDrive(file, folderId);
    if (result.error || !result.folderId) {
      return { error: result.error };
    }

    const newResult = { ...result, id: cnt++ };
    uploadedFiles.push(newResult);
  }

  return { uploadedFiles };
}

export async function uploadToDriveWTParent(
  file: File,
  parent: "car" | "profile",
  name: string,
) {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const folderId = parent === "car" ? CAR_FOLDER_ID : PROFILE_FOLDER_ID;

    if (!folderId) {
      throw error("Invalid Folder ID");
    }

    const fileMetadata = {
      name: name,
      parents: [folderId],
    };

    const media = {
      mimeType: file.type,
      body: BufferToStream(buffer),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: "id",
    });

    await drive.permissions.create({
      fileId: response.data.id as string,
      requestBody: { role: "reader", type: "anyone" },
    });

    return {
      url: `https://drive.google.com/uc?id=${response.data.id}`,
      name: file.name,
      type: file.type,
      folderId: folderId,
    };
  } catch (error) {
    console.error("Upload Error:", error);
    return { error: (error as Error).message };
  }
}

function BufferToStream(buffer: Buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}
