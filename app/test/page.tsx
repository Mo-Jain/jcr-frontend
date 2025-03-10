'use client';

import { useState } from 'react';

import { handleFileUpload, uploadToDrive } from '../actions/upload';

export default function FileUploadTest() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [timeTaken, setTimeTaken] = useState<{ bunnyNet?: number; googleDrive?: number }>({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
        const newFile = event.target.files[0];
        console.log("file",newFile);
        console.log("name",newFile.name);
        setFile(newFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }
    

    try {

        const start1 = performance.now();
        const response1 = await handleFileUpload(file, "bookings");
        const end1 = performance.now();

        const start2 = performance.now();
        const response2 = await uploadToDrive(file, "1wE8gYQg-Gk4RbI8d8RKGKv6Z92e33PsY");
        const end2 = performance.now();
        
        if (response2.error) {
            throw new Error(response2.error);
            return;
            }
        console.log("response2.url",response2.url);



        if(!response1) {
        throw new Error("Error uploading file");
        };

        setTimeTaken({ bunnyNet: end1 - start1, googleDrive: end2 - start2 });
        setMessage(`Storage 1: ${response1.url} (Time: ${(end1 - start1).toFixed(2)}ms)\nStorage 2: ${response2.url} (Time: ${(end2 - start2).toFixed(2)}ms)`);
    } catch (error) {
        console.error('Upload error:', error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-background my-48 border rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-2">Upload Test</h2>
      <input type="file" onChange={handleFileChange} className="mb-2" />
      <button 
        onClick={handleUpload} 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Upload
      </button>
      {message && <pre className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{message}</pre>}
      {timeTaken.bunnyNet !== undefined && timeTaken.googleDrive !== undefined && (
        <p className="mt-2 text-sm font-bold">
          Bunny.net Time: {(Number(timeTaken.bunnyNet)/1000).toFixed(2)} seconds | Google Drive Time: {(Number(timeTaken.googleDrive)/1000).toFixed(2)} seconds
        </p>
      )}
    </div>
  );
}