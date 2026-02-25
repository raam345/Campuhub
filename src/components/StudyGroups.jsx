import React, { useState, useEffect } from 'react';

const StudyGroups = ({ currentUser }) => {
    const [groups, setGroups] = useState([]);
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [formData, setFormData] = useState({
        groupName: '',
        subject: '',
        description: '',
        meetingTime: '',
        maxMembers: 5
    });
    const [showForm, setShowForm] = useState(false);

    // Load groups from localStorage
    useEffect(() => {
        const savedGroups = JSON.parse(localStorage.getItem('studyGroups') || '[]');
        setGroups(savedGroups);

        if (currentUser) {
            const userEmail = currentUser.email;
            const savedJoined = JSON.parse(localStorage.getItem(`joinedGroups_${userEmail}`) || '[]');
            setJoinedGroups(savedJoined);
        }
    }, [currentUser]);

    const handleCreateGroup = (e) => {
        e.preventDefault();
        if (!formData.groupName || !formData.subject) {
            alert('Please fill in required fields');
            return;
        }

        const newGroup = {
            id: Date.now(),
            ...formData,
            createdBy: currentUser?.name || 'Anonymous',
            createdByEmail: currentUser?.email,
            members: [currentUser?.email],
            memberCount: 1,
            createdAt: new Date().toISOString(),
            posts: []
        };

        const updatedGroups = [...groups, newGroup];
        localStorage.setItem('studyGroups', JSON.stringify(updatedGroups));
        setGroups(updatedGroups);

        const updatedJoined = [...joinedGroups, newGroup.id];
        localStorage.setItem(`joinedGroups_${currentUser.email}`, JSON.stringify(updatedJoined));
        setJoinedGroups(updatedJoined);

        setFormData({ groupName: '', subject: '', description: '', meetingTime: '', maxMembers: 5 });
        setShowForm(false);
    };

    const handleJoinGroup = (groupId) => {
        if (joinedGroups.includes(groupId)) return;

        const updatedGroups = groups.map(g =>
            g.id === groupId
                ? { ...g, members: [...g.members, currentUser.email], memberCount: g.memberCount + 1 }
                : g
        );
        localStorage.setItem('studyGroups', JSON.stringify(updatedGroups));
        setGroups(updatedGroups);

        const updatedJoined = [...joinedGroups, groupId];
        localStorage.setItem(`joinedGroups_${currentUser.email}`, JSON.stringify(updatedJoined));
        setJoinedGroups(updatedJoined);
    };

    const handleLeaveGroup = (groupId) => {
        const updatedGroups = groups.map(g =>
            g.id === groupId && g.members.includes(currentUser.email)
                ? { ...g, members: g.members.filter(m => m !== currentUser.email), memberCount: g.memberCount - 1 }
                : g
        );
        localStorage.setItem('studyGroups', JSON.stringify(updatedGroups));
        setGroups(updatedGroups);

        const updatedJoined = joinedGroups.filter(id => id !== groupId);
        localStorage.setItem(`joinedGroups_${currentUser.email}`, JSON.stringify(updatedJoined));
        setJoinedGroups(updatedJoined);
    };

    const myGroups = groups.filter(g => joinedGroups.includes(g.id));
    const availableGroups = groups.filter(g => !joinedGroups.includes(g.id) && g.memberCount < g.maxMembers);

    const getSubjectColor = (subject) => {
        const colors = {
            'mathematics': 'bg-blue-100 text-blue-700',
            'science': 'bg-green-100 text-green-700',
            'computer science': 'bg-purple-100 text-purple-700',
            'english': 'bg-red-100 text-red-700',
            'history': 'bg-yellow-100 text-yellow-700',
            'economics': 'bg-indigo-100 text-indigo-700',
            'psychology': 'bg-pink-100 text-pink-700',
            'biology': 'bg-teal-100 text-teal-700'
        };
        return colors[subject.toLowerCase()] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="space-y-8">
            {/* Create Group Button */}
            {!showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-md"
                >
                    ➕ Create New Study Group
                </button>
            )}

            {/* Create Group Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">📝 Create Study Group</h3>
                    <form onSubmit={handleCreateGroup} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Group Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Calculus Study Circle"
                                    value={formData.groupName}
                                    onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Mathematics"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Meeting Time</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Monday 6 PM"
                                    value={formData.meetingTime}
                                    onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Members</label>
                                <input
                                    type="number"
                                    min="2"
                                    max="20"
                                    value={formData.maxMembers}
                                    onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea
                                    placeholder="Describe the group's focus and goals..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                                ></textarea>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                Create Group
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* My Study Groups */}
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">👥 My Study Groups ({myGroups.length})</h3>
                {myGroups.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">You haven't joined any study groups yet. Create or join one!</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {myGroups.map(group => (
                            <div key={group.id} className="border-2 border-indigo-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900">{group.groupName}</h4>
                                        <p className="text-gray-600 text-sm">Created by: {group.createdBy}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSubjectColor(group.subject)}`}>
                                        {group.subject}
                                    </span>
                                </div>
                                <p className="text-gray-700 mb-4">{group.description}</p>
                                <div className="space-y-2 mb-4 text-sm text-gray-600">
                                    <p>📅 {group.meetingTime}</p>
                                    <p>👥 Members: {group.memberCount}/{group.maxMembers}</p>
                                </div>
                                <button
                                    onClick={() => handleLeaveGroup(group.id)}
                                    className="w-full px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors font-semibold"
                                >
                                    Leave Group
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Available Groups to Join */}
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">🔍 Available Study Groups</h3>
                {availableGroups.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No available study groups. Create one to get started!</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {availableGroups.map(group => (
                            <div key={group.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900">{group.groupName}</h4>
                                        <p className="text-gray-600 text-sm">By: {group.createdBy}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSubjectColor(group.subject)}`}>
                                        {group.subject}
                                    </span>
                                </div>
                                <p className="text-gray-700 mb-4">{group.description}</p>
                                <div className="space-y-2 mb-4 text-sm text-gray-600">
                                    <p>📅 {group.meetingTime}</p>
                                    <p>👥 Members: {group.memberCount}/{group.maxMembers}</p>
                                </div>
                                <button
                                    onClick={() => handleJoinGroup(group.id)}
                                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors font-semibold"
                                >
                                    Join Group
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Study Collaboration Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">💡 Study Group Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">✓ Be Punctual</h4>
                        <p className="text-gray-700 text-sm">Respect everyone's time by arriving on time for meetings.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">✓ Come Prepared</h4>
                        <p className="text-gray-700 text-sm">Review material beforehand and bring relevant notes or materials.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">✓ Participate Actively</h4>
                        <p className="text-gray-700 text-sm">Engage in discussions and help others understand concepts.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">✓ Stay Focused</h4>
                        <p className="text-gray-700 text-sm">Minimize distractions and keep discussions relevant to studying.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudyGroups;
