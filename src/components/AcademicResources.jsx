import React, { useState } from 'react';

const AcademicResources = () => {
    const [selectedCategory, setSelectedCategory] = useState('study-tips');

    const resources = {
        'study-tips': [
            {
                id: 1,
                title: 'The Pomodoro Technique',
                icon: '⏱️',
                content: 'Study for 25 minutes, then take a 5-minute break. After 4 cycles, take a 15-30 minute break. This technique improves focus and reduces burnout.',
                tips: ['Eliminates distractions', 'Prevents fatigue', 'Improves time management']
            },
            {
                id: 2,
                title: 'Active Recall',
                icon: '🧠',
                content: 'Test yourself on material instead of passively re-reading. This strengthens memory and identifies weak areas.',
                tips: ['Flashcards', 'Practice tests', 'Teach someone else']
            },
            {
                id: 3,
                title: 'Spaced Repetition',
                icon: '📈',
                content: 'Review material at increasing intervals to move information into long-term memory.',
                tips: ['Day 1: Review', 'Day 3: Review', 'Day 7: Review', 'Day 30: Review']
            },
            {
                id: 4,
                title: 'Mind Mapping',
                icon: '🗺️',
                content: 'Create visual representations of concepts and their relationships to understand complex topics.',
                tips: ['Organize information', 'See connections', 'Enhance creativity']
            }
        ],
        'note-taking': [
            {
                id: 5,
                title: 'Cornell Note-Taking Method',
                icon: '📓',
                content: 'Divide your page into notes, cues, and summary sections for better organization and review.',
                tips: ['Left column for cues', 'Right for notes', 'Bottom for summary']
            },
            {
                id: 6,
                title: 'Outline Method',
                icon: '📋',
                content: 'Organize notes hierarchically with main ideas and supporting details.',
                tips: ['Use indentation', 'Consistent formatting', 'Easy to review']
            },
            {
                id: 7,
                title: 'Charting Method',
                icon: '📊',
                content: 'Use columns and rows to organize information by categories.',
                tips: ['Great for comparisons', 'Easy to study', 'Visual organization']
            },
            {
                id: 8,
                title: 'Mapping Method',
                icon: '🧩',
                content: 'Create a visual diagram showing relationships between concepts.',
                tips: ['Shows connections', 'Non-linear thinking', 'Creative learning']
            }
        ],
        'time-management': [
            {
                id: 9,
                title: 'Weekly Planning',
                icon: '📅',
                content: 'Create a weekly schedule that balances classes, study, work, and personal time.',
                steps: ['List all commitments', 'Identify peak hours', 'Schedule deep work', 'Include breaks']
            },
            {
                id: 10,
                title: 'Priority Matrix',
                icon: '⚡',
                content: 'Categorize tasks by urgency and importance to focus on what matters most.',
                steps: ['Urgent & Important', 'Not Urgent & Important', 'Urgent & Not Important', 'Neither']
            },
            {
                id: 11,
                title: 'Time Blocking',
                icon: '⏰',
                content: 'Assign specific study topics to specific time slots throughout your week.',
                steps: ['Block out time', 'Assign subjects', 'Minimize multitasking', 'Stay consistent']
            },
            {
                id: 12,
                title: '2-1-1 Study Schedule',
                icon: '🔄',
                content: 'Review notes same day you take them, review after 1 day, then after 1 week.',
                steps: ['Day 0: Day of class', 'Day 1: Next day', 'Day 7: One week later']
            }
        ],
        'exam-prep': [
            {
                id: 13,
                title: 'Start Early',
                icon: '🚀',
                content: 'Begin studying at least 2 weeks before the exam to avoid last-minute cramming.',
                tips: ['Creates less stress', 'Better retention', 'Time for clarification']
            },
            {
                id: 14,
                title: 'Practice Testing',
                icon: '✍️',
                content: 'Take practice exams under timed conditions to simulate the real test.',
                tips: ['Identify weak areas', 'Build confidence', 'Learn time management']
            },
            {
                id: 15,
                title: 'Group Study Sessions',
                icon: '👥',
                content: 'Study with classmates to clarify concepts and quiz each other.',
                tips: ['Peer learning', 'Accountability', 'Different perspectives']
            },
            {
                id: 16,
                title: 'Review & Reflect',
                icon: '🔍',
                content: 'After exams, review what you got wrong to improve for future tests.',
                tips: ['Learn from mistakes', 'Improve strategies', 'Build expertise']
            }
        ]
    };

    const categories = [
        { id: 'study-tips', label: '💡 Study Tips', icon: '💡' },
        { id: 'note-taking', label: '📓 Note-Taking', icon: '📓' },
        { id: 'time-management', label: '⏰ Time Management', icon: '⏰' },
        { id: 'exam-prep', label: '📝 Exam Prep', icon: '📝' }
    ];

    return (
        <div className="space-y-8">
            {/* Category Selection */}
            <div className="flex flex-wrap gap-3 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedCategory === cat.id
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {cat.icon} {cat.label}
                    </button>
                ))}
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resources[selectedCategory]?.map(resource => (
                    <div
                        key={resource.id}
                        className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-start mb-4">
                            <span className="text-4xl mr-4">{resource.icon}</span>
                            <h3 className="text-xl font-bold text-gray-900">{resource.title}</h3>
                        </div>
                        <p className="text-gray-700 mb-4">{resource.content}</p>
                        <div className="space-y-2">
                            {(resource.tips || resource.steps)?.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                    <span className="text-indigo-600 font-bold mr-2">✓</span>
                                    <span className="text-gray-600">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Reference Tools */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-8 border border-indigo-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">📚 Quick Reference Tools</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-indigo-100">
                        <h4 className="font-semibold text-gray-900 mb-2">📖 Study Material Templates</h4>
                        <p className="text-gray-600 text-sm mb-3">Download templates for effective note-taking</p>
                        <button className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm">Download Now →</button>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-indigo-100">
                        <h4 className="font-semibold text-gray-900 mb-2">🎯 Exam Schedule Planner</h4>
                        <p className="text-gray-600 text-sm mb-3">Create a personalized exam preparation timeline</p>
                        <button className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm">Start Planning →</button>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-indigo-100">
                        <h4 className="font-semibold text-gray-900 mb-2">🧮 GPA Calculator</h4>
                        <p className="text-gray-600 text-sm mb-3">Calculate your current and projected GPA</p>
                        <button className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm">Calculate →</button>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-indigo-100">
                        <h4 className="font-semibold text-gray-900 mb-2">📊 Subject Progress Tracker</h4>
                        <p className="text-gray-600 text-sm mb-3">Track your progress in each course</p>
                        <button className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm">Start Tracking →</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AcademicResources;
