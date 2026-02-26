import React, { useState } from 'react';
import PsychologyArticles from './PsychologyArticles';
import MentalHealthChatbot from './MentalHealthChatbot';
import MoodTracker from './MoodTracker';
import campusWellness from '../assets/campus-wellness.png';

const MentalHealthTab = () => {
  const [currentFilter, setCurrentFilter] = useState('all');

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="rounded-2xl overflow-hidden backdrop-blur-xl bg-white/6 border border-white/8 shadow-[0_30px_60px_rgba(8,15,63,0.6)] p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Mental Resilience & Support</h2>
              <p className="mt-2 text-slate-200/80">"Peace comes from within. Do not seek it without."</p>
            </div>
            <div className="w-56 md:w-80 rounded-lg overflow-hidden bg-black/30 border border-white/6">
              <img src={campusWellness} alt="Peaceful Campus" className="w-full h-40 object-cover" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">

        {/* AI Psychology Assistant Header */}
        <div className="backdrop-blur-xl bg-white/8 border border-white/10 rounded-xl p-6 shadow-lg">
          <div className="flex items-center mb-6">
            <div className="bg-indigo-400/20 p-3 rounded-full mr-4">
              <span className="text-2xl">🧠</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">AI Psychology Assistant</h3>
              <p className="text-slate-300/80">Personalized articles based on your needs</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'anxiety', label: 'Anxiety' },
              { id: 'depression', label: 'Depression' },
              { id: 'stress', label: 'Stress' },
              { id: 'relationships', label: 'Relationships' },
              { id: 'self_esteem', label: 'Self-Esteem' },
              { id: 'academic', label: 'Academic Pressure' },
              { id: 'sleep', label: 'Sleep Issues' },
              { id: 'all', label: 'View All' }
            ].map(category => (
              <button
                key={category.id}
                onClick={() => setCurrentFilter(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${currentFilter === category.id
                  ? 'bg-indigo-500/80 text-white shadow-md transform scale-105 backdrop-blur-sm'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Display */}
        <PsychologyArticles currentFilter={currentFilter} />

        {/* AI Mental Health Chatbot */}
        <MentalHealthChatbot />

        {/* Additional Mental Health Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Counseling Services */}
          <div className="backdrop-blur-xl bg-white/8 border border-white/10 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              🗣️ Counseling Services
            </h3>
            <div className="space-y-4">
              <div className="border-l-4 border-purple-400 pl-4">
                <h4 className="font-semibold text-white">Individual Counseling</h4>
                <p className="text-slate-300/80">One-on-one sessions with licensed counselors</p>
              </div>
              <div className="border-l-4 border-pink-400 pl-4">
                <h4 className="font-semibold text-white">Group Therapy</h4>
                <p className="text-slate-300/80">Support groups for various topics</p>
              </div>
              <button className="w-full bg-purple-500/70 hover:bg-purple-500/90 text-white py-2 px-4 rounded-md transition-colors backdrop-blur-sm border border-purple-400/30">
                Schedule Appointment
              </button>
            </div>
          </div>

          {/* Mindfulness Section */}
          <div className="backdrop-blur-xl bg-white/8 border border-white/10 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              🧘‍♀️ Mindfulness & Meditation
            </h3>
            <div className="space-y-4">
              <div className="border-l-4 border-teal-400 pl-4">
                <h4 className="font-semibold text-white">Daily Meditation</h4>
                <p className="text-slate-300/80">Guided sessions every morning at 8 AM</p>
              </div>
              <div className="border-l-4 border-indigo-400 pl-4">
                <h4 className="font-semibold text-white">Stress Management</h4>
                <p className="text-slate-300/80">Workshops on coping strategies</p>
              </div>
              <button className="w-full bg-teal-500/70 hover:bg-teal-500/90 text-white py-2 px-4 rounded-md transition-colors backdrop-blur-sm border border-teal-400/30">
                Start Meditation
              </button>
            </div>
          </div>
        </div>

        {/* Mood Tracker */}
        <MoodTracker />
      </div>
    </div >
  );
};

export default MentalHealthTab;