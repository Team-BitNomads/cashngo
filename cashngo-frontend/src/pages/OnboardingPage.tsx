import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// A simple file upload component we will create next
import FileUpload from '../components/FileUpload';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);

  // This function will be called by the FileUpload component
  const handleUploadComplete = () => {
    setIsVerifying(true);

    // --- HACKATHON SIMULATION ---
    // In a real app, you would poll the user profile until the status is no longer 'pending'.
    // Here, we'll just simulate the AI verification time with a 5-second delay.
    setTimeout(() => {
      // After the "verification" is done, send the user to their dashboard.
      navigate('/dashboard');
    }, 5000); // 5 seconds
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome to CashnGo!</h1>
        <p className="text-gray-600 mb-8">Let's verify your skills to unlock the best gigs.</p>

        {isVerifying ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-green-600">Verifying Your Skills...</h2>
            <p className="text-gray-500">Our AI is analyzing your document. This may take a moment. You will be redirected shortly.</p>
            <div className="animate-pulse text-4xl">🤖</div>
          </div>
        ) : (
          <div>
            <p className="text-lg font-semibold mb-4">Upload a skill certificate, a video of your work, or your degree.</p>
            <FileUpload onUploadComplete={handleUploadComplete} />
            <button 
              onClick={() => navigate('/dashboard')} 
              className="mt-6 text-sm text-gray-500 hover:text-gray-700"
            >
              I'll do this later
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;