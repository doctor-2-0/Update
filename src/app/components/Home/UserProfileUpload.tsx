import React, { useState } from 'react';
import axios from 'axios';

const UserProfileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const token = localStorage.getItem('token');

      try {
        const response = await axios.post(
          'http://localhost:5000/api/media/upload',
          { base64 },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log('Upload successful:', response.data);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" style={{ width: '200px', height: '200px' }} />}
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};


export default UserProfileUpload;