import React, { useState, useEffect, useCallback } from 'react';

// --- Type Imports ---
import type { Gig, UserProfile } from '../types';

// --- API Service Imports ---
import { fetchGigs, fetchUserProfile } from '../services/api';

// --- Component Imports ---
import GigCard from '../components/GigCard';

const GigFeedPage: React.FC = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetches both the user profile and the list of gigs.
   * We need the profile to know which gigs *should* be unlocked.
   * The backend will ultimately handle the is_locked logic, but this pattern
   * ensures our UI has all the data it needs to render correctly.
   */
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch both in parallel for speed
      const [gigsData, profileData] = await Promise.all([
        fetchGigs(),
        fetchUserProfile(),
      ]);

      setGigs(gigsData);
      setUserProfile(profileData);

    } catch (error) {
      console.error("Failed to load gig feed data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data when the component first mounts
  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- Render Logic ---

  if (isLoading) {
    return <div className="text-center p-8">Loading available gigs...</div>;
  }
  
  // Separate gigs into unlocked and locked for better UI presentation
  const unlockedGigs = gigs.filter(gig => !gig.is_locked);
  const lockedGigs = gigs.filter(gig => gig.is_locked);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 md:p-8">
        
        {/* --- Header --- */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1 text-gray-900">
            Welcome back, {userProfile?.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-600">Here are the gigs available for you right now.</p>
        </div>

        {/* --- Unlocked Gigs Section --- */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-green-600">Ready to Apply</h2>
          {unlockedGigs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unlockedGigs.map((gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">No available gigs right now. Check back soon!</p>
            </div>
          )}
        </div>

        {/* --- Locked Gigs Section --- */}
        {lockedGigs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Unlock More Opportunities</h2>
            <p className="text-gray-600 mb-6">Go to your profile to pass a quick AI quiz and unlock these higher-paying gigs.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lockedGigs.map((gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default GigFeedPage;