import React, { useState } from 'react';
import { generateAcademicResponse } from '../services/gemini';

const AIStudyPlanGenerator = ({ onPlanGenerated, currentUser }) => {
    const [formData, setFormData] = useState({
        subject: 'Mathematics',
        topic: '',
        examDate: '',
        hoursPerWeek: 10,
        difficulty: 'moderate'
    });
    const [generatedPlan, setGeneratedPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGeneratePlan = async (e) => {
        e.preventDefault();
        if (!formData.topic || !formData.examDate) {
            setError('Please fill in Topic and Exam Date');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const daysUntilExam = Math.ceil(
                (new Date(formData.examDate) - new Date()) / (1000 * 60 * 60 * 24)
            );

            const prompt = `Create a detailed ${daysUntilExam}-day study plan for:
Subject: ${formData.subject}
Topic: ${formData.topic}
Available Hours per Week: ${formData.hoursPerWeek}
Difficulty Level: ${formData.difficulty}

Generate a structured study plan with:
1. Main subtopics to cover
2. Daily/weekly breakdown
3. Hour allocation for each subtopic
4. Key learning milestones
5. Revision schedule

Format as a clear, actionable plan that can be followed step by step. Include estimated hours for each section.`;

            const result = await generateAcademicResponse(prompt, formData.subject.toLowerCase());

            const plan = {
                subject: formData.subject,
                topic: formData.topic,
                examDate: formData.examDate,
                daysUntilExam: daysUntilExam,
                generatedPlan: result.text,
                createdAt: new Date().toISOString()
            };

            setGeneratedPlan(plan);
        } catch (err) {
            setError('Failed to generate study plan. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const parsePlanToTasks = (planText) => {
        // Extract structured topics from the plan
        const lines = planText.split('\n');
        const tasks = [];
        let currentSubtopic = '';
        let hours = 1.5;

        lines.forEach(line => {
            line = line.trim();
            // Look for topic headers (usually numbered or with symbols)
            if (line.match(/^[\d\.\-\*•]\s*[A-Z]/)) {
                // Extract topic name
                currentSubtopic = line.replace(/^[\d\.\-\*•\s]*/, '').split(':')[0].trim();

                // Try to extract hours if mentioned
                const hourMatch = line.match(/(\d+(?:\.\d+)?)\s*hours?/i);
                if (hourMatch) {
                    hours = parseFloat(hourMatch[1]);
                }

                if (currentSubtopic && !currentSubtopic.includes('Week') && !currentSubtopic.includes('Day')) {
                    tasks.push({
                        subject: formData.subject,
                        topic: currentSubtopic,
                        subtopics: `Main focus: ${currentSubtopic}`,
                        dueDate: formData.examDate,
                        priority: 'high',
                        estimatedHours: hours,
                        type: 'study',
                        startDate: new Date().toISOString().split('T')[0]
                    });
                }
            }
        });

        return tasks.length > 0 ? tasks : generateDefaultTasks();
    };

    const generateDefaultTasks = () => {
        // Fallback: generate basic tasks
        const daysUntilExam = Math.ceil(
            (new Date(formData.examDate) - new Date()) / (1000 * 60 * 60 * 24)
        );
        const hoursPerDay = (formData.hoursPerWeek / 7).toFixed(1);

        return [
            {
                subject: formData.subject,
                topic: `${formData.topic} - Foundation`,
                subtopics: 'Core concepts, definitions, basic principles',
                dueDate: formData.examDate,
                priority: 'high',
                estimatedHours: parseFloat(hoursPerDay) * Math.ceil(daysUntilExam / 3),
                type: 'study',
                startDate: new Date().toISOString().split('T')[0]
            },
            {
                subject: formData.subject,
                topic: `${formData.topic} - Practice`,
                subtopics: 'Problems, examples, applications, exercises',
                dueDate: formData.examDate,
                priority: 'high',
                estimatedHours: parseFloat(hoursPerDay) * Math.ceil(daysUntilExam / 2.5),
                type: 'study',
                startDate: new Date().toISOString().split('T')[0]
            },
            {
                subject: formData.subject,
                topic: `${formData.topic} - Revision`,
                subtopics: 'Review, consolidation, mock tests, final prep',
                dueDate: formData.examDate,
                priority: 'high',
                estimatedHours: parseFloat(hoursPerDay) * Math.ceil(daysUntilExam / 4),
                type: 'study',
                startDate: new Date().toISOString().split('T')[0]
            }
        ];
    };

    const handleImportPlan = () => {
        const tasks = parsePlanToTasks(generatedPlan.generatedPlan);
        onPlanGenerated(tasks);
    };

    return (
        <div className="space-y-6">
            {/* AI Plan Generator Form */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">🤖</span>
                    <h3 className="text-3xl font-bold">AI Study Plan Generator</h3>
                </div>
                <p className="text-purple-100 mb-6">
                    Let AI create a personalized study plan based on your topic, deadline, and available hours
                </p>

                <form onSubmit={handleGeneratePlan} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Subject</label>
                            <select
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/60"
                            >
                                <option value="Mathematics" className="text-gray-900">🔢 Mathematics</option>
                                <option value="Physics" className="text-gray-900">⚛️ Physics</option>
                                <option value="Chemistry" className="text-gray-900">🧪 Chemistry</option>
                                <option value="Biology" className="text-gray-900">🧬 Biology</option>
                                <option value="English" className="text-gray-900">📝 English</option>
                                <option value="History" className="text-gray-900">📜 History</option>
                                <option value="Economics" className="text-gray-900">💰 Economics</option>
                                <option value="Computer Science" className="text-gray-900">💻 Computer Science</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Topic to Study</label>
                            <input
                                type="text"
                                placeholder="e.g., Calculus, Quantum Mechanics, French Revolution"
                                value={formData.topic}
                                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/60"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Exam/Test Date</label>
                            <input
                                type="date"
                                value={formData.examDate}
                                onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:border-white/60"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Hours per Week</label>
                            <input
                                type="number"
                                min="5"
                                max="50"
                                step="5"
                                value={formData.hoursPerWeek}
                                onChange={(e) => setFormData({ ...formData, hoursPerWeek: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/60"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold mb-2">Difficulty Level</label>
                            <div className="flex gap-3">
                                {['easy', 'moderate', 'hard'].map(level => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, difficulty: level })}
                                        className={`px-6 py-2 rounded-lg font-semibold transition-all ${formData.difficulty === level
                                                ? 'bg-white text-purple-600 shadow-lg'
                                                : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                                            }`}
                                    >
                                        {level === 'easy' && '😊 Easy'}
                                        {level === 'moderate' && '😐 Moderate'}
                                        {level === 'hard' && '😤 Hard'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? '⏳ Generating Plan...' : '✨ Generate AI Study Plan'}
                    </button>
                </form>
            </div>

            {/* Generated Plan Display */}
            {generatedPlan && (
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            📋 Your Personalized Study Plan
                        </h3>
                        <p className="text-gray-600">
                            <strong>{generatedPlan.topic}</strong> in <strong>{generatedPlan.subject}</strong>
                            {' '} • <strong>{generatedPlan.daysUntilExam}</strong> days until exam
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200 max-h-96 overflow-y-auto">
                        <div className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                            {generatedPlan.generatedPlan}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleImportPlan}
                            className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors"
                        >
                            ✅ Import to My Study Planner
                        </button>
                        <button
                            onClick={() => setGeneratedPlan(null)}
                            className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors"
                        >
                            ✕ Discard
                        </button>
                    </div>
                </div>
            )}

            {/* Info Card */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h4 className="font-bold text-gray-900 mb-3">💡 How AI Study Planning Works</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                    <li>✓ AI analyzes your topic and available time</li>
                    <li>✓ Creates a customized learning path with subtopics</li>
                    <li>✓ Allocates time based on difficulty and topic complexity</li>
                    <li>✓ Suggests revision schedules and milestones</li>
                    <li>✓ Plans can be imported directly to your Study Planner</li>
                </ul>
            </div>
        </div>
    );
};

export default AIStudyPlanGenerator;
