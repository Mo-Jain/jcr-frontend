"use client";

import { useState } from "react";
import { sendEmailWithAttachment } from "../actions/mail";

export default function EmailUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !email) {
      alert("Please select a file and enter an email.");
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);

    // Call server action
    const result = await sendEmailWithAttachment(formData);
    console.log(result);
    alert(result.message);
  };

  return (
    <div className="bg-background w-full min-h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit} className="p-4 border rounded">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter recipient email"
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border p-2 mb-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          Send Email with Attachment
        </button>
      </form>
    </div>
  );
}
