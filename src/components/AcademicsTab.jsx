import React, { useState } from 'react';
import StudyPlanner from './StudyPlanner';
import AcademicResources from './AcademicResources';
import AcademicPerformance from './AcademicPerformance';
import StudyGroups from './StudyGroups';
import AcademicsMaterialChatbot from './AcademicsMaterialChatbot';
import AIStudyPlanGenerator from './AIStudyPlanGenerator';

const AcademicsTab = ({ currentUser }) => {
    const [activeTab, setActiveTab] = useState('planner');
    const [refreshKey, setRefreshKey] = useState(0);

    const tabs = [
        { id: 'planner', label: '📅 Study Planner', icon: '📅' },
        { id: 'ai-planner', label: '✨ AI Study Planner', icon: '✨' },
        { id: 'resources', label: '📚 Study Resources', icon: '📚' },
        { id: 'performance', label: '📊 Academic Performance', icon: '📊' },
        { id: 'groups', label: '👥 Study Groups', icon: '👥' },
        { id: 'chatbot', label: '🤖 AI Assistant', icon: '🤖' }
    ];

    const handlePlanGenerated = (tasks) => {
        // Add generated tasks to localStorage
        const userEmail = currentUser?.email;
        if (!userEmail || !tasks || tasks.length === 0) return;

        const savedTasks = JSON.parse(localStorage.getItem(`studySchedule_${userEmail}`) || '[]');
        const updatedTasks = [...savedTasks, ...tasks];
        localStorage.setItem(`studySchedule_${userEmail}`, JSON.stringify(updatedTasks));

        // Refresh StudyPlanner and switch to it
        setRefreshKey(prev => prev + 1);
        setActiveTab('planner');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative w-full h-[50vh] overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600">
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
                    <div className="max-w-7xl mx-auto w-full">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Academic Excellence Hub</h2>
                        <p className="text-blue-100 text-xl max-w-2xl">
                            "Success is not final, failure is not fatal. It is the courage to continue that counts."
                        </p>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-wrap gap-3 mb-8 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${activeTab === tab.id
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="space-y-8">
                    {activeTab === 'planner' && <StudyPlanner key={refreshKey} currentUser={currentUser} />}
                    {activeTab === 'ai-planner' && (
                        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">✨ AI Study Plan Generator</h3>
                            <p className="text-gray-600 mb-6">
                                Let AI create a personalized study plan for you! Just tell it what you want to study, the deadline, and how much time you have available.
                            </p>
                            <AIStudyPlanGenerator currentUser={currentUser} onPlanGenerated={handlePlanGenerated} />
                        </div>
                    )}
                    {activeTab === 'resources' && <AcademicResources />}
                    {activeTab === 'performance' && <AcademicPerformance currentUser={currentUser} />}
                    {activeTab === 'groups' && <StudyGroups currentUser={currentUser} />}
                    {activeTab === 'chatbot' && (
                        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">🤖 AI Study Material Assistant</h3>
                            <p className="text-gray-600 mb-6">
                                Get instant explanations, summaries, practice questions, and study tips powered by AI. Select a subject and ask your questions below!
                            </p>
                            <AcademicsMaterialChatbot />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AcademicsTab;
