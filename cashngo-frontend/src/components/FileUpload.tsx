import React, { useState } from 'react';

interface FileUploadProps {
  onUploadComplete: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success'>('idle');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus('uploading');

    // --- REAL API CALL ---
    // Here you would use axios to post to '/api/users/skill-verification'
    // const formData = new FormData();
    // formData.append('skillFile', file);
    // await apiClient.post('/users/skill-verification', formData);
    
    // --- HACKATHON SIMULATION ---
    // We'll simulate the upload time.
    setTimeout(() => {
      setStatus('success');
      // Let the parent page know the upload is "done".
      onUploadComplete();
    }, 2000); // 2 seconds
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 w-full">
      <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
      
      {!file && (
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center space-y-2">
          <span className="text-4xl">📄</span>
          <span className="font-semibold text-green-600">Click to browse</span>
          <span className="text-sm text-gray-500">or drag and drop</span>
          <span className="text-xs text-gray-400">PDF, JPG, PNG, MP4 (max 10MB)</span>
        </label>
      )}

      {file && status !== 'success' && (
        <div className="text-center">
          <p className="font-semibold mb-4">{file.name}</p>
          <button
            onClick={handleUpload}
            disabled={status === 'uploading'}
            className="w-full bg-gray-900 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 disabled:bg-gray-400"
          >
            {status === 'uploading' ? 'Uploading...' : 'Upload and Verify'}
          </button>
        </div>
      )}
      
      {status === 'success' && (
          <div className="text-center text-green-600 font-bold">
              <p>✅ Upload Successful!</p>
          </div>
      )}
    </div>
  );
};

export default FileUpload;