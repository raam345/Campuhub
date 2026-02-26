import React, { useState, useEffect } from 'react';

const DiscrepancyCentre = ({ currentUser }) => {
    const [discrepancies, setDiscrepancies] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        paymentId: '',
        issueType: 'payment_not_received',
        amount: '',
        description: '',
        attachments: ''
    });

    useEffect(() => {
        // Load user's discrepancies
        const allDiscrepancies = JSON.parse(localStorage.getItem('wellnessDiscrepancies') || '[]');
        const userDiscrepancies = allDiscrepancies.filter(d => d.userEmail === currentUser.email);
        setDiscrepancies(userDiscrepancies);
    }, [currentUser.email]);

    const issueTypes = {
        payment_not_received: '💳 Payment Not Received',
        duplicate_charge: '📌 Duplicate Charge',
        wrong_amount: '🔢 Wrong Amount Charged',
        subscription_issue: '⏰ Subscription Not Activated',
        other: '❓ Other Issue'
    };

    const statusColors = {
        open: 'bg-red-100 text-red-800',
        in_progress: 'bg-yellow-100 text-yellow-800',
        resolved: 'bg-green-100 text-green-800'
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newDiscrepancy = {
            id: `disc_${Date.now()}`,
            userEmail: currentUser.email,
            userName: currentUser.name,
            ...formData,
            status: 'open',
            createdAt: new Date().toISOString(),
            response: [],
            priority: 'high'
        };

        const allDiscrepancies = JSON.parse(localStorage.getItem('wellnessDiscrepancies') || '[]');
        allDiscrepancies.unshift(newDiscrepancy);
        localStorage.setItem('wellnessDiscrepancies', JSON.stringify(allDiscrepancies));

        setDiscrepancies([newDiscrepancy, ...discrepancies]);
        setFormData({
            paymentId: '',
            issueType: 'payment_not_received',
            amount: '',
            description: '',
            attachments: ''
        });
        setShowForm(false);

        alert('✅ Discrepancy reported successfully!\n\nAdmin will review and respond within 24-48 hours.\n\nYour Discrepancy ID: ' + newDiscrepancy.id);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
                <h2 className="text-3xl font-bold mb-2">⚠️ Discrepancy Centre</h2>
                <p className="text-orange-100">Report payment issues and communicate with admin support</p>
            </div>

            {/* New Discrepancy Button */}
            <div className="flex justify-end">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2"
                >
                    <span>+</span> Report New Issue
                </button>
            </div>

            {/* Report Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">📝 Report Payment Discrepancy</h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Issue Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Issue Type *</label>
                            <select
                                required
                                value={formData.issueType}
                                onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                            >
                                {Object.entries(issueTypes).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Payment ID */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment ID (Optional)</label>
                            <input
                                type="text"
                                placeholder="pay_XXXXX"
                                value={formData.paymentId}
                                onChange={(e) => setFormData({ ...formData, paymentId: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                            />
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₹)</label>
                            <input
                                type="number"
                                placeholder="Amount in rupees"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">describe the Issue *</label>
                            <textarea
                                required
                                placeholder="Please provide detailed information about the discrepancy..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="4"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                            />
                        </div>

                        {/* Additional Details */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Details</label>
                            <textarea
                                placeholder="Any other information (optional)"
                                value={formData.attachments}
                                onChange={(e) => setFormData({ ...formData, attachments: e.target.value })}
                                rows="2"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                            />
                        </div>

                        {/* Contact Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm text-blue-800">
                                <span className="font-semibold">📞 Admin Contact:</span>
                            </p>
                            <p className="text-sm text-blue-700 mt-1">
                                Email: <span className="font-mono">admin@campus.edu</span><br />
                                Phone: <span className="font-mono">+91-XXXX-XXXX-XX</span>
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg transition"
                            >
                                Submit Discrepancy Report
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 rounded-lg transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Discrepancies List */}
            {discrepancies.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Discrepancies</h3>
                    <p className="text-gray-600">You haven't reported any payment discrepancies.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {discrepancies.map((disc) => (
                        <div key={disc.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition border-l-4 border-orange-500">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                {/* Issue Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">
                                            {disc.issueType === 'payment_not_received' && '💳'}
                                            {disc.issueType === 'duplicate_charge' && '📌'}
                                            {disc.issueType === 'wrong_amount' && '🔢'}
                                            {disc.issueType === 'subscription_issue' && '⏰'}
                                            {disc.issueType === 'other' && '❓'}
                                        </span>
                                        <div>
                                            <p className="font-bold text-gray-800">{issueTypes[disc.issueType]}</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(disc.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700 ml-11">{disc.description.substring(0, 100)}...</p>
                                </div>

                                {/* Status & ID */}
                                <div className="text-right">
                                    <span className={`inline-block ${statusColors[disc.status]} text-xs font-bold px-3 py-1 rounded-full mb-2`}>
                                        {disc.status.toUpperCase()}
                                    </span>
                                    <p className="text-xs text-gray-500 font-mono">{disc.id}</p>
                                </div>
                            </div>

                            {/* Details Row */}
                            <div className="mt-3 pt-3 border-t border-gray-200">
                                {disc.amount && (
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold">Amount:</span> ₹{disc.amount}
                                    </p>
                                )}
                                {disc.paymentId && (
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold">Payment ID:</span> {disc.paymentId}
                                    </p>
                                )}
                            </div>

                            {/* Admin Response */}
                            {disc.response && disc.response.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-200 bg-gray-50 p-3 rounded">
                                    <p className="text-sm font-semibold text-gray-800 mb-2">📬 Admin Response:</p>
                                    {disc.response.map((resp, idx) => (
                                        <p key={idx} className="text-sm text-gray-700 mb-1">
                                            <span className="font-mono text-xs text-gray-500">{new Date(resp.date).toLocaleDateString()}</span>
                                            <br />
                                            {resp.message}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Support Info */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-orange-200">
                <h3 className="text-lg font-bold text-gray-800 mb-3">📞 Need Help?</h3>
                <div className="space-y-2 text-sm text-gray-700">
                    <p><span className="font-semibold">Email:</span> support@campus.edu</p>
                    <p><span className="font-semibold">Phone:</span> +91-XXXX-XXXX-XX</p>
                    <p><span className="font-semibold">Hours:</span> Monday - Friday, 9 AM - 6 PM</p>
                    <p className="text-xs text-gray-600 mt-3">
                        ⏱️ Most discrepancies are resolved within 24-48 hours. We appreciate your patience!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DiscrepancyCentre;
