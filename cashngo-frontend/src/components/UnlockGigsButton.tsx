import React, { useState, useEffect } from 'react';
import type { UserProfile, Quiz } from '../types';
import { fetchUserProfile, generateQuiz } from '../services/api'; // Import generateQuiz
import UnlockGigsButton from '../components/UnlockGigsButton';
import QuizModal from '../components/QuizModal'; // Import the new modal

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for our new quiz flow
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizData, setQuizData] = useState<Quiz | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await fetchUserProfile();
      setProfile(data);
      setIsLoading(false);
    };
    loadProfile();
  }, []);

  const handleUnlockClick = async () => {
    setIsQuizLoading(true);
    const quiz = await generateQuiz();
    setQuizData(quiz);
    setIsQuizModalOpen(true);
    setIsQuizLoading(false);
  };
  
  const handleQuizSubmit = (answers: number[]) => {
    console.log("Quiz submitted with answers:", answers);
    // TODO: Send answers to backend, get result, update profile with new badge
    alert("Quiz submitted! Next step: show success and unlock gigs.");
    setIsQuizModalOpen(false);
    setQuizData(null);
  };

  if (isLoading || !profile) return <div className="text-center p-8">Loading profile...</div>;

  return (
    <>
      <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
            <p className="text-gray-600">{profile.major}</p>
            <div className="mt-4 text-4xl font-bold text-green-600">
              ${profile.current_balance.toFixed(2)}
              <span className="text-lg font-medium text-gray-500"> Current Balance</span>
            </div>
          </div>

          {/* Skill-Synth Trigger */}
          <UnlockGigsButton 
            onUnlock={handleUnlockClick}
            isLoading={isQuizLoading}
          />

          {/* Badges Section (same as before) */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">My Badges</h2>
            {/* ... badge rendering logic remains the same ... */}
          </div>
        </div>
      </div>
      
      {/* Conditionally render the Quiz Modal */}
      {isQuizModalOpen && quizData && (
        <QuizModal 
          quiz={quizData} 
          onClose={() => setIsQuizModalOpen(false)}
          onSubmit={handleQuizSubmit}
        />
      )}
    </>
  );
};

export default ProfilePage;