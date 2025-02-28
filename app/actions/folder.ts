"use server";

import { google } from "googleapis";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN as string;
const BOOKING_FOLDER_ID = process.env.BOOKING_FOLDER_ID as string;
const CAR_FOLDER_ID = process.env.CAR_FOLDER_ID as string;
const CUSTOMER_FOLDER_ID = process.env.CUSTOMER_FOLDER_ID as string;
const PROFILE_FOLDER_ID = process.env.PROFILE_FOLDER_ID as string;

// Google Drive OAuth2 Setup
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  "http://localhost:3000",
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({ version: "v3", auth: oauth2Client });

export async function createFolder(
  name: string,
  parent: "booking" | "car" | "customer" | "profile",
) {
  const FOLDER_ID =
    parent === "booking"
      ? BOOKING_FOLDER_ID
      : parent === "car"
        ? CAR_FOLDER_ID
        : parent === "customer"
          ? CUSTOMER_FOLDER_ID
          : PROFILE_FOLDER_ID;
  try {
    const folder = await drive.files.create({
      requestBody: {
        name,
        mimeType: "application/vnd.google-apps.folder",
        parents: [FOLDER_ID],
      },
      fields: "id",
    });
    return {
      success: true,
      message: "Folder created successfully",
      folderId: folder.data.id,
      name,
    };
  } catch (error) {
    console.error("Rename Folder Error:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function renameFolder(folderId: string, newName: string) {
  try {
    if (!folderId || !newName)
      throw new Error("Folder ID and new name are required");

    await drive.files.update({
      fileId: folderId,
      requestBody: {
        name: newName,
      },
    });

    console.log(`✅ Folder renamed to: ${newName} (ID: ${folderId})`);

    return {
      success: true,
      message: "Folder renamed successfully",
      folderId,
      newName,
    };
  } catch (error) {
    console.error("Rename Folder Error:", error);
    return { success: false, error: (error as Error).message };
  }
}
