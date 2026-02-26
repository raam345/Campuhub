import React, { useState, useEffect } from 'react';

const AdminDiscrepancyDashboard = () => {
    const [allDiscrepancies, setAllDiscrepancies] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedDiscrepancy, setSelectedDiscrepancy] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
        // Load all discrepancies
        const discrepancies = JSON.parse(localStorage.getItem('wellnessDiscrepancies') || '[]');
        // Sort by newest first
        setAllDiscrepancies(discrepancies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }, []);

    const issueTypes = {
        payment_not_received: '💳 Payment Not Received',
        duplicate_charge: '📌 Duplicate Charge',
        wrong_amount: '🔢 Wrong Amount Charged',
        subscription_issue: '⏰ Subscription Not Activated',
        other: '❓ Other Issue'
    };

    const statusColors = {
        open: 'bg-red-100 text-red-800 border-red-400',
        in_progress: 'bg-yellow-100 text-yellow-800 border-yellow-400',
        resolved: 'bg-green-100 text-green-800 border-green-400'
    };

    const filteredDiscrepancies = filterStatus === 'all'
        ? allDiscrepancies
        : allDiscrepancies.filter(d => d.status === filterStatus);

    const handleStatusChange = (discrepancyId, newStatus) => {
        const updatedDiscrepancies = allDiscrepancies.map(d =>
            d.id === discrepancyId ? { ...d, status: newStatus } : d
        );
        setAllDiscrepancies(updatedDiscrepancies);
        localStorage.setItem('wellnessDiscrepancies', JSON.stringify(updatedDiscrepancies));

        if (selectedDiscrepancy?.id === discrepancyId) {
            setSelectedDiscrepancy({ ...selectedDiscrepancy, status: newStatus });
        }
    };

    const handleAddResponse = (discrepancyId) => {
        if (!responseMessage.trim()) {
            alert('Please enter a response message');
            return;
        }

        const updatedDiscrepancies = allDiscrepancies.map(d => {
            if (d.id === discrepancyId) {
                const newResponse = {
                    date: new Date().toISOString(),
                    message: responseMessage,
                    respondedBy: 'Admin'
                };
                return {
                    ...d,
                    response: [...(d.response || []), newResponse]
                };
            }
            return d;
        });

        setAllDiscrepancies(updatedDiscrepancies);
        localStorage.setItem('wellnessDiscrepancies', JSON.stringify(updatedDiscrepancies));

        const updated = updatedDiscrepancies.find(d => d.id === discrepancyId);
        setSelectedDiscrepancy(updated);
        setResponseMessage('');
        alert('✅ Response sent to user!');
    };

    const getStatusBadgeColor = (status) => {
        return statusColors[status] || 'bg-gray-100 text-gray-800';
    };

    const statusStats = {
        open: allDiscrepancies.filter(d => d.status === 'open').length,
        in_progress: allDiscrepancies.filter(d => d.status === 'in_progress').length,
        resolved: allDiscrepancies.filter(d => d.status === 'resolved').length,
        total: allDiscrepancies.length
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
                <h2 className="text-3xl font-bold mb-2">🔧 Admin Discrepancy Dashboard</h2>
                <p className="text-purple-100">Manage user payment discrepancies and complaints</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
                    <p className="text-gray-600 text-sm uppercase font-semibold">Open Issues</p>
                    <p className="text-3xl font-bold text-red-600">{statusStats.open}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
                    <p className="text-gray-600 text-sm uppercase font-semibold">In Progress</p>
                    <p className="text-3xl font-bold text-yellow-600">{statusStats.in_progress}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
                    <p className="text-gray-600 text-sm uppercase font-semibold">Resolved</p>
                    <p className="text-3xl font-bold text-green-600">{statusStats.resolved}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
                    <p className="text-gray-600 text-sm uppercase font-semibold">Total</p>
                    <p className="text-3xl font-bold text-blue-600">{statusStats.total}</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
                {['all', 'open', 'in_progress', 'resolved'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${filterStatus === status
                            ? 'bg-purple-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:border-purple-400'
                            }`}
                    >
                        {status === 'all' && `All (${statusStats.total})`}
                        {status === 'open' && `Open (${statusStats.open})`}
                        {status === 'in_progress' && `In Progress (${statusStats.in_progress})`}
                        {status === 'resolved' && `Resolved (${statusStats.resolved})`}
                    </button>
                ))}
            </div>

            {/* Discrepancies List */}
            {filteredDiscrepancies.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Discrepancies</h3>
                    <p className="text-gray-600">All payment discrepancies have been resolved!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Discrepancies List */}
                    <div className="lg:col-span-1 space-y-3">
                        <h3 className="text-lg font-bold text-gray-800">Discrepancies ({filteredDiscrepancies.length})</h3>
                        <div className="space-y-2 max-h-[600px] overflow-y-auto">
                            {filteredDiscrepancies.map(disc => (
                                <div
                                    key={disc.id}
                                    onClick={() => setSelectedDiscrepancy(disc)}
                                    className={`p-3 rounded-lg cursor-pointer transition border-l-4 ${selectedDiscrepancy?.id === disc.id
                                        ? 'bg-purple-50 border-purple-500 shadow-md'
                                        : 'bg-white border-gray-300 hover:shadow-md'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${getStatusBadgeColor(disc.status)}`}>
                                            {disc.status.toUpperCase()}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(disc.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="font-semibold text-gray-800 text-sm">{disc.userName}</p>
                                    <p className="text-xs text-gray-600">{issueTypes[disc.issueType]}</p>
                                    <p className="text-xs text-gray-500 mt-1">{disc.description.substring(0, 50)}...</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Details & Response Panel */}
                    <div className="lg:col-span-2">
                        {selectedDiscrepancy ? (
                            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-600">
                                {/* Header */}
                                <div className="mb-6 pb-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-2xl font-bold text-gray-800">Discrepancy Details</h3>
                                        <span className={`text-sm font-bold px-3 py-1 rounded ${getStatusBadgeColor(selectedDiscrepancy.status)}`}>
                                            {selectedDiscrepancy.status.toUpperCase()}
                                        </span>
                                    </div>

                                    {/* User Info */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">
                                            <span className="font-semibold">User:</span> {selectedDiscrepancy.userName}
                                        </p>
                                        <p className="text-sm text-gray-600 mb-1">
                                            <span className="font-semibold">Email:</span> {selectedDiscrepancy.userEmail}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Reported:</span> {new Date(selectedDiscrepancy.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Issue Details */}
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 uppercase mb-2">Issue Type</p>
                                        <p className="text-lg text-gray-800">{issueTypes[selectedDiscrepancy.issueType]}</p>
                                    </div>

                                    {selectedDiscrepancy.amount && (
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700 uppercase mb-2">Amount</p>
                                            <p className="text-lg text-red-600 font-bold">₹{selectedDiscrepancy.amount}</p>
                                        </div>
                                    )}

                                    {selectedDiscrepancy.paymentId && (
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700 uppercase mb-2">Payment ID</p>
                                            <p className="text-sm font-mono text-gray-800 break-all">{selectedDiscrepancy.paymentId}</p>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 uppercase mb-2">Description</p>
                                        <p className="text-gray-800 bg-gray-50 p-3 rounded">{selectedDiscrepancy.description}</p>
                                    </div>
                                </div>

                                {/* Status Change */}
                                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-sm font-semibold text-gray-700 mb-3">Change Status</p>
                                    <div className="flex gap-2">
                                        {['open', 'in_progress', 'resolved'].map(status => (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusChange(selectedDiscrepancy.id, status)}
                                                className={`px-3 py-1 rounded text-sm font-semibold transition ${selectedDiscrepancy.status === status
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-white border border-gray-300 hover:border-purple-400'
                                                    }`}
                                            >
                                                {status === 'open' && '🔴 Open'}
                                                {status === 'in_progress' && '🟡 In Progress'}
                                                {status === 'resolved' && '🟢 Resolved'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Communication History */}
                                <div className="mb-6">
                                    <p className="text-sm font-semibold text-gray-700 uppercase mb-3">Communication</p>
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto bg-gray-50 p-3 rounded-lg">
                                        {selectedDiscrepancy.response && selectedDiscrepancy.response.length > 0 ? (
                                            selectedDiscrepancy.response.map((resp, idx) => (
                                                <div key={idx} className="bg-white p-3 rounded border-l-4 border-green-500">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-semibold text-green-700">Admin Response</span>
                                                        <span className="text-xs text-gray-500">{new Date(resp.date).toLocaleString()}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-800">{resp.message}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500 text-center py-4">No responses yet</p>
                                        )}
                                    </div>
                                </div>

                                {/* Add Response */}
                                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                    <p className="text-sm font-semibold text-gray-700 uppercase mb-3">Send Response to User</p>
                                    <textarea
                                        value={responseMessage}
                                        onChange={(e) => setResponseMessage(e.target.value)}
                                        placeholder="Type your response message here..."
                                        rows="3"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 mb-3"
                                    />
                                    <button
                                        onClick={() => handleAddResponse(selectedDiscrepancy.id)}
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg transition"
                                    >
                                        📤 Send Response & Notify User
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                <div className="text-6xl mb-4">👆</div>
                                <p className="text-gray-600">Select a discrepancy from the list to view details and respond</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDiscrepancyDashboard;
