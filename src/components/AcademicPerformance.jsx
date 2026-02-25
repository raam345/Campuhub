import React, { useState, useEffect } from 'react';

const AcademicPerformance = ({ currentUser }) => {
    const [grades, setGrades] = useState([]);
    const [gradeScale, setGradeScale] = useState('4-point'); // 4-point or 10-point
    const [formData, setFormData] = useState({
        courseName: '',
        credits: 4,
        grade: 'A',
        semester: 'Spring 2025'
    });
    const [editingId, setEditingId] = useState(null);

    // Load grades from localStorage
    useEffect(() => {
        if (currentUser) {
            const userEmail = currentUser.email;
            const savedGrades = JSON.parse(localStorage.getItem(`academicGrades_${userEmail}`) || '[]');
            const savedScale = localStorage.getItem(`gradeScale_${userEmail}`) || '4-point';
            setGrades(savedGrades);
            setGradeScale(savedScale);
        }
    }, [currentUser]);

    // Save grades to localStorage
    const saveGrades = (updatedGrades) => {
        if (currentUser) {
            localStorage.setItem(`academicGrades_${currentUser.email}`, JSON.stringify(updatedGrades));
            localStorage.setItem(`gradeScale_${currentUser.email}`, gradeScale);
            setGrades(updatedGrades);
        }
    };

    // Grade point mappings for 4-point scale
    const gradePoints4 = {
        'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0
    };

    // Grade point mappings for 10-point scale
    const gradePoints10 = {
        'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'D': 4, 'F': 0
    };

    const gradePoints = gradeScale === '4-point' ? gradePoints4 : gradePoints10;

    const handleAddGrade = (e) => {
        e.preventDefault();
        if (!formData.courseName || !formData.grade) {
            alert('Please fill in all required fields');
            return;
        }

        const newGrade = {
            id: editingId || Date.now(),
            ...formData,
            createdAt: editingId ? grades.find(g => g.id === editingId)?.createdAt : new Date().toISOString()
        };

        const updatedGrades = editingId
            ? grades.map(g => g.id === editingId ? newGrade : g)
            : [...grades, newGrade];

        saveGrades(updatedGrades);
        setFormData({ courseName: '', credits: 4, grade: gradeScale === '4-point' ? 'A' : 'A+', semester: 'Spring 2025' });
        setEditingId(null);
    };

    const handleEditGrade = (grade) => {
        setFormData({
            courseName: grade.courseName,
            credits: grade.credits,
            grade: grade.grade,
            semester: grade.semester
        });
        setEditingId(grade.id);
    };

    const handleDeleteGrade = (id) => {
        saveGrades(grades.filter(g => g.id !== id));
    };

    const handleScaleChange = (newScale) => {
        setGradeScale(newScale);
        if (currentUser) {
            localStorage.setItem(`gradeScale_${currentUser.email}`, newScale);
        }
        // Reset form with appropriate default grade
        setFormData({ courseName: '', credits: 4, grade: newScale === '4-point' ? 'A' : 'A+', semester: 'Spring 2025' });
    };

    // Calculate GPA/CGPA
    const calculateGPA = () => {
        if (grades.length === 0) return 0;
        const totalPoints = grades.reduce((sum, g) => sum + (gradePoints[g.grade] * g.credits), 0);
        const totalCredits = grades.reduce((sum, g) => sum + g.credits, 0);
        const gpa = totalPoints / totalCredits;
        return gradeScale === '10-point' ? gpa.toFixed(2) : gpa.toFixed(2);
    };

    // Get grade distribution
    const getGradeDistribution = () => {
        const distribution = {};
        grades.forEach(g => {
            distribution[g.grade] = (distribution[g.grade] || 0) + 1;
        });
        return distribution;
    };

    // Get average grade letter
    const getAverageGradeLetter = () => {
        const gpa = parseFloat(calculateGPA());
        if (gradeScale === '4-point') {
            if (gpa >= 3.7) return 'A';
            if (gpa >= 3.3) return 'A-/B+';
            if (gpa >= 3.0) return 'B';
            if (gpa >= 2.7) return 'B-/C+';
            if (gpa >= 2.0) return 'C';
            if (gpa >= 1.7) return 'C-/D';
            return 'D/F';
        } else {
            if (gpa >= 9) return 'A+/A';
            if (gpa >= 8) return 'B+';
            if (gpa >= 7) return 'B';
            if (gpa >= 6) return 'C+';
            if (gpa >= 5) return 'C';
            return 'D/F';
        }
    };

    const currentGPA = calculateGPA();
    const gradeDistribution = getGradeDistribution();

    return (
        <div className="space-y-8">
            {/* Grade Scale Selector */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Select Grading Scale</h3>
                <div className="flex gap-4">
                    <button
                        onClick={() => handleScaleChange('4-point')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${gradeScale === '4-point'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-indigo-400'
                            }`}
                    >
                        🇺🇸 4-Point GPA (US)
                    </button>
                    <button
                        onClick={() => handleScaleChange('10-point')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${gradeScale === '10-point'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-indigo-400'
                            }`}
                    >
                        🇮🇳 10-Point CGPA (India)
                    </button>
                </div>
            </div>

            {/* GPA/CGPA Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md p-8 text-white">
                    <h3 className="text-lg font-semibold mb-2 opacity-90">
                        Current {gradeScale === '4-point' ? 'GPA' : 'CGPA'}
                    </h3>
                    <p className="text-5xl font-bold mb-2">{currentGPA}</p>
                    <p className="text-indigo-100">Average: {getAverageGradeLetter()}</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-8 text-white">
                    <h3 className="text-lg font-semibold mb-2 opacity-90">Courses Taken</h3>
                    <p className="text-5xl font-bold mb-2">{grades.length}</p>
                    <p className="text-green-100">Total Credits: {grades.reduce((sum, g) => sum + g.credits, 0)}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-8 text-white">
                    <h3 className="text-lg font-semibold mb-2 opacity-90">
                        Target {gradeScale === '4-point' ? 'GPA' : 'CGPA'}
                    </h3>
                    <input
                        type="number"
                        placeholder={gradeScale === '4-point' ? '4.0' : '10'}
                        min="0"
                        max={gradeScale === '4-point' ? '4' : '10'}
                        step="0.1"
                        className="w-full px-3 py-2 rounded-lg bg-blue-400 bg-opacity-50 text-white placeholder-blue-100 border border-blue-300 focus:outline-none"
                    />
                    <p className="text-blue-100 text-sm mt-2">Set your academic goal</p>
                </div>
            </div>

            {/* Grade Distribution Chart */}
            {grades.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">📊 Grade Distribution</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-wrap gap-4">
                            {Object.entries(gradeDistribution).map(([grade, count]) => (
                                <div key={grade} className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-2 mx-auto">
                                        <span className="font-bold text-indigo-600">{grade}</span>
                                    </div>
                                    <p className="text-gray-600"><span className="font-semibold">{count}</span> course{count !== 1 ? 's' : ''}</p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                            <h4 className="font-bold text-gray-900 mb-4">Performance Summary</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Excellent (A/A-)</span>
                                    <span className="font-bold text-green-600">{Object.entries(gradeDistribution).filter(([g]) => ['A', 'A-'].includes(g)).reduce((sum, [g, c]) => sum + c, 0)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Good (B+/B/B-)</span>
                                    <span className="font-bold text-blue-600">{Object.entries(gradeDistribution).filter(([g]) => ['B+', 'B', 'B-'].includes(g)).reduce((sum, [g, c]) => sum + c, 0)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Satisfactory (C+/C)</span>
                                    <span className="font-bold text-yellow-600">{Object.entries(gradeDistribution).filter(([g]) => ['C+', 'C'].includes(g)).reduce((sum, [g, c]) => sum + c, 0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Grade Form */}
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    {editingId ? '✏️ Edit Course' : '➕ Add Course Grade'}
                </h3>
                <form onSubmit={handleAddGrade} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Course Name</label>
                            <input
                                type="text"
                                placeholder="e.g., Data Structures"
                                value={formData.courseName}
                                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Credits</label>
                            <input
                                type="number"
                                min="1"
                                max="6"
                                value={formData.credits}
                                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {gradeScale === '4-point' ? 'Grade (4-Point)' : 'Grade (10-Point)'}
                            </label>
                            <select
                                value={formData.grade}
                                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            >
                                {gradeScale === '4-point' ? (
                                    Object.keys(gradePoints4).map(grade => (
                                        <option key={grade} value={grade}>{grade} ({gradePoints4[grade]})</option>
                                    ))
                                ) : (
                                    Object.keys(gradePoints10).map(grade => (
                                        <option key={grade} value={grade}>{grade} ({gradePoints10[grade]})</option>
                                    ))
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Semester</label>
                            <input
                                type="text"
                                placeholder="e.g., Spring 2025"
                                value={formData.semester}
                                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div className="md:col-span-2 flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                {editingId ? 'Update Course' : 'Add Course'}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null);
                                        setFormData({ courseName: '', credits: 4, grade: gradeScale === '4-point' ? 'A' : 'A+', semester: 'Spring 2025' });
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

            {/* Courses List */}
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">📚 Your Courses ({grades.length})</h3>
                {grades.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No courses added yet. Start by adding your course grades!</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-300">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Course Name</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Grade</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Credits</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Points</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Semester</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grades.map(grade => (
                                    <tr key={grade.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-4 px-4 font-semibold text-gray-900">{grade.courseName}</td>
                                        <td className="py-4 px-4">
                                            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-semibold">
                                                {grade.grade}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-gray-700">{grade.credits}</td>
                                        <td className="py-4 px-4 text-gray-700 font-semibold">
                                            {gradeScale === '4-point' ? gradePoints4[grade.grade] : gradePoints10[grade.grade]}
                                        </td>
                                        <td className="py-4 px-4 text-gray-700">{grade.semester}</td>
                                        <td className="py-4 px-4 flex gap-2">
                                            <button
                                                onClick={() => handleEditGrade(grade)}
                                                className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteGrade(grade.id)}
                                                className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AcademicPerformance;
