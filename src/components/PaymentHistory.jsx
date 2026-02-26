import React, { useState, useEffect } from 'react';

const PaymentHistory = ({ currentUser }) => {
    const [payments, setPayments] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        // Load payment history from localStorage
        const allPayments = JSON.parse(localStorage.getItem('wellnessPayments') || '[]');
        const userPayments = allPayments.filter(p => p.userEmail === currentUser.email);
        setPayments(userPayments);
    }, [currentUser.email]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                <h2 className="text-3xl font-bold mb-2">💳 Payment History</h2>
                <p className="text-green-100">View all your subscription payments and transactions</p>
            </div>

            {/* Payment List */}
            {payments.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <div className="text-6xl mb-4">📭</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Payments Yet</h3>
                    <p className="text-gray-600">You haven't made any subscription payments yet.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {payments.map((payment, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition border-l-4 border-green-500"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                {/* Payment Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">💎</span>
                                        <div>
                                            <p className="font-bold text-gray-800">{payment.planName} Plan</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(payment.timestamp).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 ml-11">
                                        {payment.durationDays} days • ID: {payment.id}
                                    </p>
                                </div>

                                {/* Amount & Status */}
                                <div className="text-right md:text-center">
                                    <p className="text-2xl font-bold text-green-600">₹{payment.amount}</p>
                                    <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                                        ✓ {payment.status}
                                    </span>
                                </div>

                                {/* Expiry Info */}
                                <div className="md:text-right">
                                    <p className="text-sm font-semibold text-gray-700">Expires</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(payment.expiryDate).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* View Details Button */}
                                <button
                                    onClick={() => setSelectedPayment(selectedPayment?.id === payment.id ? null : payment)}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                                >
                                    {selectedPayment?.id === payment.id ? 'Hide' : 'Details'}
                                </button>
                            </div>

                            {/* Expanded Details */}
                            {selectedPayment?.id === payment.id && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-600 uppercase">Plan</p>
                                            <p className="font-semibold text-gray-800">{payment.planName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 uppercase">Amount Paid</p>
                                            <p className="font-semibold text-gray-800">₹{payment.amount}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 uppercase">Duration</p>
                                            <p className="font-semibold text-gray-800">{payment.durationDays} days</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 uppercase">Payment Status</p>
                                            <p className="font-semibold text-green-600">✓ {payment.status}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 uppercase">Activated</p>
                                            <p className="font-semibold text-gray-800">
                                                {new Date(payment.activatedDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 uppercase">Expires</p>
                                            <p className="font-semibold text-gray-800">
                                                {new Date(payment.expiryDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <p className="text-xs text-gray-600 uppercase">Payment ID</p>
                                            <p className="font-mono text-sm text-gray-800 break-all">{payment.id}</p>
                                        </div>
                                    </div>

                                    {/* Discrepancy Alert */}
                                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            ⚠️ <span className="font-semibold">Found an issue with this payment?</span>
                                        </p>
                                        <p className="text-xs text-blue-700 mt-1">
                                            Use the Discrepancy Centre to report and resolve payment issues.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Summary Stats */}
            {payments.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <p className="text-gray-600 text-sm uppercase mb-2">Total Spent</p>
                            <p className="text-3xl font-bold text-green-600">
                                ₹{payments.reduce((sum, p) => sum + p.amount, 0)}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-600 text-sm uppercase mb-2">Total Payments</p>
                            <p className="text-3xl font-bold text-blue-600">{payments.length}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-600 text-sm uppercase mb-2">Last Payment</p>
                            <p className="text-lg font-bold text-purple-600">
                                {new Date(payments[0]?.timestamp).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentHistory;
