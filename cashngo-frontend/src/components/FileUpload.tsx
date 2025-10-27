import React, { useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  accept?: string;
  helperText?: string;
  error?: string;
  onFileSelect: (file: File | null) => void; // Callback with the selected file
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  id,
  accept = "image/*,application/pdf",
  helperText,
  error,
  className,
  onFileSelect,
  ...props
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFileName(file ? file.name : null);
    onFileSelect(file); // Call the parent callback
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-gray-100">{label}</Label>
      <div className="flex items-center gap-3">
        <Button
            type="button"
            variant="outline"
            onClick={triggerFileInput}
            className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 text-slate-300"
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose File
        </Button>
         <div className="flex-1 min-w-0">
            {fileName ? (
                <div className="flex items-center gap-2 text-sm text-green-400">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{fileName}</span>
                </div>
            ) : (
                <span className="text-sm text-slate-500">No file selected</span>
            )}
        </div>
      </div>
       {/* Hidden actual file input */}
      <Input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden" // Keep hidden, triggered by button
        {...props} // Pass through register etc.
      />
      {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default FileUpload
