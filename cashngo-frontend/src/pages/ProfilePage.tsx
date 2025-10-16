/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Type Imports ---
import type { UserProfile, Quiz } from '../types';

// --- API Service Imports ---
import { fetchUserProfile, generateQuiz, submitQuiz } from '../services/api';

// --- Component Imports ---
import UnlockGigsButton from '../components/UnlockGigsButton';
import QuizModal from '../components/QuizModal';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  // --- State Management ---
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State specifically for the Skill-Synth quiz flow
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizData, setQuizData] = useState<Quiz | null>(null);

  /**
   * Fetches the user's profile from the API and updates the state.
   * Using useCallback to memoize the function so it can be used in useEffect dependencies
   * without causing infinite loops.
   */
  const loadProfile = useCallback(async () => {
    try {
      const data = await fetchUserProfile();
      setProfile(data);
    } catch (error) {
      console.error("Failed to load profile", error);
      // Optional: handle error, e.g., show an error message
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data fetch when the component mounts
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  /**
   * Handles the click event from the "Unlock High-Value Gigs" button.
   * It fetches a new quiz and opens the modal.
   */
  const handleUnlockClick = async () => {
    setIsQuizLoading(true);
    const quiz = await generateQuiz();
    setQuizData(quiz);
    setIsQuizModalOpen(true);
    setIsQuizLoading(false);
  };
  
  /**
   * Handles the submission of the quiz from the QuizModal component.
   * This is the final step in the "winning feature" loop.
   */
  const handleQuizSubmit = async (answers: number[]) => {
    if (!quizData) return;

    // 1. Submit the answers to the backend
    const result = await submitQuiz(quizData.quiz_id, answers);

    // 2. Close the quiz modal
    setIsQuizModalOpen(false);
    setQuizData(null);

    // 3. Handle the result
    if (result.success && result.new_badge) {
      // 4. Show immediate, satisfying feedback
      alert(`Congratulations! You've earned the "${result.new_badge.name}" badge and unlocked new gigs!`);
      
      // 5. CRITICAL: Re-fetch the user's profile to show the new badge instantly
      await loadProfile();

      // 6. Navigate to the gig feed so the user can see the unlocked gigs
      navigate('/dashboard');
    } else {
      alert("Good try! You didn't pass this time. Feel free to try another quiz later.");
    }
  };

  // --- Render Logic ---

  if (isLoading || !profile) {
    return <div className="text-center p-8">Loading profile...</div>;
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          
          {/* --- Profile Header Card --- */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-gray-600">{profile.major}</p>
              </div>
              <div className="text-center flex-shrink-0 ml-4">
                <div className="text-2xl font-bold text-yellow-500" title={`Skill Level ${(profile as any).skill_level} out of 5`}>
                  {'★'.repeat((profile as any).skill_level || 0).padEnd(5, '☆')}
                </div>
                <p className="text-xs font-semibold text-gray-600">Verified Skill Level</p>
              </div>
            </div>
            <div className="text-4xl font-bold text-green-600">
              ${profile.current_balance.toFixed(2)}
              <span className="text-lg font-medium text-gray-500"> Current Balance</span>
            </div>
          </div>

          {/* --- Skill-Synth Trigger Card --- */}
          <div className="mb-6">
            <UnlockGigsButton 
              onClick={handleUnlockClick} 
              isLoading={isQuizLoading}
            />
          </div>

          {/* --- Badges Section Card --- */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">My Badges</h2>
            {profile.badges && profile.badges.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {profile.badges.map(badge => (
                  <div key={badge.id} className="text-center">
                    <div className="bg-gray-200 p-3 rounded-full w-20 h-20 flex items-center justify-center">
                      <span className="text-3xl" title={badge.name}>🏆</span>
                    </div>
                    <p className="text-sm mt-2 text-gray-700 w-20 truncate">{badge.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No badges yet. Unlock some gigs to earn your first one!</p>
            )}
          </div>

        </div>
      </div>
      
      {/* --- Quiz Modal --- */}
      {/* This is rendered outside the main layout div to overlay the whole screen */}
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