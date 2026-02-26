import React, { useState } from 'react';
import { SUBSCRIPTION_PLANS } from '../services/subscriptionService';

const RazorpayHandler = ({ onPaymentSuccess }) => {
    const [selectedPlan, setSelectedPlan] = useState('one_month');
    const [showPlans, setShowPlans] = useState(false);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        const res = await loadRazorpayScript();

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        const plan = SUBSCRIPTION_PLANS[selectedPlan];
        const amountInPaise = plan.price * 100;

        const options = {
            key: 'rzp_test_Rlgtu6wuzDDfu8', // YOUR TEST KEY ID
            amount: amountInPaise, // Amount is in currency subunits
            currency: 'INR',
            name: 'Campus Wellness Hub',
            description: `Premium Membership - ${plan.name}`,
            image: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png',
            handler: function (response) {
                console.log("Payment Successful!", response);
                if (onPaymentSuccess) {
                    onPaymentSuccess(response.razorpay_payment_id, selectedPlan, plan.price);
                }
            },
            prefill: {
                name: 'Student Name',
                email: 'student@campus.edu',
                contact: '9999999999'
            },
            notes: {
                address: 'Campus Wellness Hub Corporate Office',
                planId: selectedPlan,
                planDuration: plan.duration
            },
            theme: {
                color: '#0d9488'
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    const plan = SUBSCRIPTION_PLANS[selectedPlan];

    return (
        <div className="space-y-4">
            {!showPlans ? (
                <>
                    <button
                        onClick={() => setShowPlans(true)}
                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2"
                    >
                        <span>💎</span>
                        Choose Plan & Upgrade
                    </button>
                </>
            ) : (
                <>
                    {/* Plans Selection */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-700 mb-3">Select Subscription Plan:</label>
                        {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedPlan(key)}
                                className={`w-full p-3 rounded-lg border-2 transition text-left ${selectedPlan === key
                                        ? 'border-yellow-500 bg-yellow-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-gray-800">{plan.name}</p>
                                        <p className="text-xs text-gray-600">{plan.durationLabel}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-yellow-600">₹{plan.price}</p>
                                        {plan.discount && (
                                            <p className="text-xs text-green-600 font-semibold">Save {plan.discountPercent}%</p>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-700">
                            <span className="font-bold">Selected Plan:</span> {plan.name} - ₹{plan.price}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                            🗓️ Valid for {plan.durationLabel} from activation
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={handlePayment}
                            className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition hover:scale-105 hover:shadow-xl"
                        >
                            💰 Pay ₹{plan.price}
                        </button>
                        <button
                            onClick={() => setShowPlans(false)}
                            className="flex-1 bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-400"
                        >
                            Back
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default RazorpayHandler;
