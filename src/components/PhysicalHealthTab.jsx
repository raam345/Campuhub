import React, { useState, useEffect } from 'react';
import ExerciseLibrary from './ExerciseLibrary';
import AISetup from './AISetup';
import AIPlans from './AIPlans';
import FitnessTracker from './FitnessTracker';
import physicalHealth from '../assets/physical-health.jpg';

const PhysicalHealthTab = ({ currentUser }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [showAISetup, setShowAISetup] = useState(false);
  const [showAIPlans, setShowAIPlans] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.email) {
      const allProfiles = JSON.parse(localStorage.getItem('fitnessProfiles') || '{}');
      const userSpecificProfile = allProfiles[currentUser.email];

      if (userSpecificProfile) {
        setUserProfile(userSpecificProfile);
        setShowAIPlans(true);
        setShowAISetup(false);
      } else {
        // Fallback to global if not found (for legacy support)
        const globalProfile = localStorage.getItem('fitnessProfile');
        if (globalProfile) {
          setUserProfile(JSON.parse(globalProfile));
          setShowAIPlans(true);
          setShowAISetup(false);
        } else {
          // No profile found for current user or globally
          setUserProfile(null);
          setShowAISetup(true);
          setShowAIPlans(false);
        }
      }
    } else {
      // If no current user, clear profile and show setup
      setUserProfile(null);
      setShowAISetup(true);
      setShowAIPlans(false);
    }
  }, [currentUser]);

  const handleProfileCreated = (profile) => {
    setUserProfile(profile);
    setShowAISetup(false);
    setShowAIPlans(true);
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Card - glass panel with image */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-white/6 border border-white/8 shadow-[0_30px_80px_rgba(15,23,42,0.6)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Elite Performance Tracking</h2>
              <p className="mt-4 text-slate-200/80 max-w-xl">"Your body is your most powerful instrument. Tune it to perfection."</p>
            </div>
            <div className="p-6 lg:p-8">
              <div className="rounded-xl overflow-hidden bg-black/40 border border-white/6">
                <img src={physicalHealth} alt="Elite Performance" className="w-full h-56 sm:h-72 object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-12">
        {showAISetup && !userProfile && (
          <AISetup onProfileCreated={handleProfileCreated} currentUser={currentUser} />
        )}

        {showAIPlans && userProfile && (
          <>
            <AIPlans userProfile={userProfile} />

            {/* Exercise Coaching Library */}
            <div className="mt-12">
              <ExerciseLibrary />
            </div>

            <div className="mt-12">
              <FitnessTracker currentUser={currentUser} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PhysicalHealthTab;