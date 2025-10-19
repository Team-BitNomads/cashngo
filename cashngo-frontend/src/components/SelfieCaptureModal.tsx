import React, { useRef, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface SelfieCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export const SelfieCaptureModal: React.FC<SelfieCaptureModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      const startCamera = async () => {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          alert("Could not access camera. Please check your browser permissions.");
          onClose();
        }
      };
      startCamera();
    } else {
      // Stop the camera stream when the modal is closed
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
          onCapture(file);
          onClose();
        }
      }, 'image/jpeg');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle>Live Selfie Capture</DialogTitle>
          <DialogDescription>Position your face within the frame and capture.</DialogDescription>
        </DialogHeader>
        <div className="relative w-full aspect-square bg-slate-800 rounded-lg overflow-hidden mt-4">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        </div>
        <canvas ref={canvasRef} className="hidden" />
        <Button onClick={handleCapture} className="w-full mt-4 bg-green-500 hover:bg-green-600 text-slate-900 font-bold">
          <Camera className="mr-2 h-5 w-5" /> Capture
        </Button>
      </DialogContent>
    </Dialog>
  );
};