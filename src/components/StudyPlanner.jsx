import React, { useState, useEffect } from 'react';

const StudyPlanner = ({ currentUser }) => {
    const [tasks, setTasks] = useState([]);
    const [view, setView] = useState('timeline'); // timeline, schedule, weekly
    const [formData, setFormData] = useState({
        subject: '',
        topic: '',
        subtopics: '',
        dueDate: '',
        priority: 'medium',
        estimatedHours: 2,
        type: 'study'
    });
    const [editingId, setEditingId] = useState(null);

    // Load tasks from localStorage
    useEffect(() => {
        if (currentUser) {
            const userEmail = currentUser.email;
            const savedTasks = JSON.parse(localStorage.getItem(`studySchedule_${userEmail}`) || '[]');
            setTasks(savedTasks);
        }
    }, [currentUser]);

    // Save tasks to localStorage
    const saveTasks = (updatedTasks) => {
        if (currentUser) {
            localStorage.setItem(`studySchedule_${currentUser.email}`, JSON.stringify(updatedTasks));
            setTasks(updatedTasks);
        }
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!formData.subject || !formData.topic || !formData.dueDate) {
            alert('Please fill in Subject, Topic, and Due Date');
            return;
        }

        const newTask = {
            id: editingId || Date.now(),
            subject: formData.subject,
            topic: formData.topic,
            subtopics: formData.subtopics.split(',').map(s => ({ name: s.trim(), studied: false })),
            dueDate: formData.dueDate,
            startDate: formData.startDate || new Date().toISOString().split('T')[0],
            priority: formData.priority,
            estimatedHours: formData.estimatedHours,
            type: formData.type,
            completed: editingId ? tasks.find(t => t.id === editingId)?.completed : false,
            studiedHours: editingId ? tasks.find(t => t.id === editingId)?.studiedHours || 0 : 0,
            createdAt: editingId ? tasks.find(t => t.id === editingId)?.createdAt : new Date().toISOString()
        };

        const updatedTasks = editingId
            ? tasks.map(t => t.id === editingId ? newTask : t)
            : [...tasks, newTask];

        saveTasks(updatedTasks);
        resetForm();
        setEditingId(null);
    };

    const resetForm = () => {
        setFormData({
            subject: '',
            topic: '',
            subtopics: '',
            dueDate: '',
            priority: 'medium',
            estimatedHours: 2,
            type: 'study'
        });
    };

    const handleEditTask = (task) => {
        setFormData({
            subject: task.subject,
            topic: task.topic,
            subtopics: task.subtopics.map(s => s.name).join(', '),
            dueDate: task.dueDate,
            startDate: task.startDate,
            priority: task.priority,
            estimatedHours: task.estimatedHours,
            type: task.type
        });
        setEditingId(task.id);
    };

    const handleDeleteTask = (id) => {
        saveTasks(tasks.filter(t => t.id !== id));
    };

    const toggleSubtopic = (taskId, subtopicName) => {
        const updatedTasks = tasks.map(t =>
            t.id === taskId
                ? {
                    ...t,
                    subtopics: t.subtopics.map(s =>
                        s.name === subtopicName ? { ...s, studied: !s.studied } : s
                    )
                }
                : t
        );
        saveTasks(updatedTasks);
    };

    const toggleTaskCompletion = (id) => {
        const updatedTasks = tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        );
        saveTasks(updatedTasks);
    };

    const updateStudiedHours = (id, hours) => {
        const updatedTasks = tasks.map(t =>
            t.id === id ? { ...t, studiedHours: Math.min(hours, t.estimatedHours) } : t
        );
        saveTasks(updatedTasks);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-700';
            case 'medium': return 'bg-yellow-100 text-yellow-700';
            case 'low': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getSubjectColor = (subject) => {
        const colors = {
            'mathematics': 'bg-blue-100 text-blue-700',
            'physics': 'bg-purple-100 text-purple-700',
            'chemistry': 'bg-green-100 text-green-700',
            'biology': 'bg-pink-100 text-pink-700',
            'english': 'bg-red-100 text-red-700',
            'history': 'bg-yellow-100 text-yellow-700',
            'economics': 'bg-indigo-100 text-indigo-700',
            'computer science': 'bg-orange-100 text-orange-700'
        };
        return colors[subject.toLowerCase()] || 'bg-gray-100 text-gray-700';
    };

    const upcomingTasks = tasks
        .filter(t => !t.completed)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    const completedTasks = tasks.filter(t => t.completed);
    const totalEstimatedHours = tasks.reduce((sum, t) => sum + t.estimatedHours, 0);
    const totalStudiedHours = tasks.reduce((sum, t) => sum + t.studiedHours, 0);

    return (
        <div className="space-y-8">
            {/* Study Hours Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md p-6 text-white">
                    <h3 className="text-sm font-semibold opacity-90 mb-2">Total Study Hours Planned</h3>
                    <p className="text-4xl font-bold">{totalEstimatedHours}</p>
                    <p className="text-indigo-100 text-sm">Across all topics</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
                    <h3 className="text-sm font-semibold opacity-90 mb-2">Hours Studied</h3>
                    <p className="text-4xl font-bold">{totalStudiedHours}</p>
                    <p className="text-green-100 text-sm">{totalEstimatedHours > 0 ? ((totalStudiedHours / totalEstimatedHours) * 100).toFixed(0) : 0}% Complete</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
                    <h3 className="text-sm font-semibold opacity-90 mb-2">Active Topics</h3>
                    <p className="text-4xl font-bold">{upcomingTasks.length}</p>
                    <p className="text-blue-100 text-sm">Ready to study</p>
                </div>
            </div>

            {/* View Selector */}
            <div className="flex gap-2 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <button
                    onClick={() => setView('timeline')}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${view === 'timeline' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    📅 Timeline View
                </button>
                <button
                    onClick={() => setView('topics')}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${view === 'topics' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    📚 Topics View
                </button>
                <button
                    onClick={() => setView('subjects')}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${view === 'subjects' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    🎯 By Subject
                </button>
            </div>

            {/* Add Topic Form */}
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    {editingId ? '✏️ Edit Study Topic' : '➕ Add Study Topic'}
                </h3>
                <form onSubmit={handleAddTask} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                            <select
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            >
                                <option value="">Select Subject...</option>
                                <option value="Mathematics">🔢 Mathematics</option>
                                <option value="Physics">⚛️ Physics</option>
                                <option value="Chemistry">🧪 Chemistry</option>
                                <option value="Biology">🧬 Biology</option>
                                <option value="English">📝 English</option>
                                <option value="History">📜 History</option>
                                <option value="Economics">💰 Economics</option>
                                <option value="Computer Science">💻 Computer Science</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Main Topic</label>
                            <input
                                type="text"
                                placeholder="e.g., Calculus Fundamentals"
                                value={formData.topic}
                                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Subtopics (comma-separated)</label>
                            <input
                                type="text"
                                placeholder="e.g., Limits, Derivatives, Integration, Applications"
                                value={formData.subtopics}
                                onChange={(e) => setFormData({ ...formData, subtopics: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                            <input
                                type="date"
                                value={formData.startDate || ''}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                            <input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Estimated Hours</label>
                            <input
                                type="number"
                                min="0.5"
                                max="20"
                                step="0.5"
                                value={formData.estimatedHours}
                                onChange={(e) => setFormData({ ...formData, estimatedHours: parseFloat(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div className="md:col-span-2 flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                {editingId ? 'Update Topic' : 'Add Topic'}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null);
                                        resetForm();
                                    }}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            {/* Timeline View */}
            {view === 'timeline' && (
                <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">📅 Study Timeline</h3>
                    {upcomingTasks.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No topics scheduled. Create one to get started!</p>
                    ) : (
                        <div className="space-y-4">
                            {upcomingTasks.map(task => (
                                <div key={task.id} className={`border-l-4 p-4 rounded-lg ${getPriorityColor(task.priority)}`}>
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h4 className="text-lg font-bold">{task.topic}</h4>
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${getSubjectColor(task.subject)}`}>
                                                {task.subject}
                                            </span>
                                        </div>
                                        <span className="text-2xl">⏱️ {task.estimatedHours}h</span>
                                    </div>
                                    <div className="text-sm mb-3">
                                        📅 {new Date(task.dueDate).toLocaleDateString()} | {task.priority.toUpperCase()} Priority
                                    </div>
                                    <div className="mb-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-semibold">Progress</span>
                                            <span className="text-sm">{task.studiedHours}h / {task.estimatedHours}h</span>
                                        </div>
                                        <div className="w-full bg-gray-300 rounded-full h-2">
                                            <div
                                                className="bg-indigo-600 h-2 rounded-full transition-all"
                                                style={{ width: `${(task.studiedHours / task.estimatedHours) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditTask(task)}
                                            className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Topics View */}
            {view === 'topics' && (
                <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">📚 Topics with Subtopics</h3>
                    {upcomingTasks.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No topics added yet!</p>
                    ) : (
                        <div className="space-y-6">
                            {upcomingTasks.map(task => (
                                <div key={task.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-900">{task.topic}</h4>
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${getSubjectColor(task.subject)}`}>
                                                {task.subject}
                                            </span>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-indigo-600">{task.estimatedHours}h</div>
                                            <div className="text-xs text-gray-600">Est. Time</div>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <h5 className="font-semibold text-gray-900 mb-3">Subtopics:</h5>
                                        <div className="space-y-2">
                                            {task.subtopics.map((subtopic, idx) => (
                                                <label key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={subtopic.studied}
                                                        onChange={() => toggleSubtopic(task.id, subtopic.name)}
                                                        className="w-5 h-5 text-indigo-600 rounded"
                                                    />
                                                    <span className={subtopic.studied ? 'line-through text-gray-500' : 'text-gray-700'}>
                                                        {subtopic.name}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditTask(task)}
                                            className="px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 font-medium text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 font-medium text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* By Subject View */}
            {view === 'subjects' && (
                <div className="space-y-6">
                    {[...new Set(upcomingTasks.map(t => t.subject))].map(subject => (
                        <div key={subject} className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                            <h3 className={`text-2xl font-bold mb-6 ${getSubjectColor(subject)}`}>{subject}</h3>
                            <div className="space-y-4">
                                {upcomingTasks.filter(t => t.subject === subject).map(task => (
                                    <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h5 className="font-bold text-gray-900">{task.topic}</h5>
                                            <span className="text-sm font-semibold text-indigo-600">{task.estimatedHours}h</span>
                                        </div>
                                        <div className="text-sm text-gray-600 mb-3">
                                            Due: {new Date(task.dueDate).toLocaleDateString()}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditTask(task)}
                                                className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTask(task.id)}
                                                className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Completed Topics */}
            {completedTasks.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">✅ Completed Topics ({completedTasks.length})</h3>
                    <div className="space-y-3">
                        {completedTasks.map(task => (
                            <div key={task.id} className="flex items-center gap-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTaskCompletion(task.id)}
                                    className="w-5 h-5 text-green-600 rounded"
                                />
                                <div className="flex-1">
                                    <h4 className="text-gray-700 line-through font-semibold">{task.topic}</h4>
                                    <span className="text-sm text-gray-500">{task.subject}</span>
                                </div>
                                <span className="text-sm font-semibold text-green-600">{task.estimatedHours}h studied</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudyPlanner;
