import React from 'react';

const SubscriptionStatus = ({ isPremium, premiumStatus }) => {
    if (!isPremium || !premiumStatus) {
        return (
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-4 border border-gray-300">
                <p className="text-gray-700 text-sm">
                    📌 <span className="font-semibold">No Active Subscription</span> - Upgrade to unlock premium features!
                </p>
            </div>
        );
    }

    if (!premiumStatus.isActive) {
        return (
            <div className="bg-gradient-to-r from-red-100 to-red-200 rounded-lg p-4 border border-red-400">
                <p className="text-red-800 text-sm">
                    ❌ <span className="font-semibold">Subscription Expired!</span> - Your premium membership ended on {premiumStatus.expiryDate}. Renew to restore access.
                </p>
            </div>
        );
    }

    const daysRemaining = premiumStatus.daysRemaining;
    const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;

    return (
        <div className={`rounded-lg p-4 border ${isExpiringSoon
                ? 'bg-gradient-to-r from-orange-100 to-orange-200 border-orange-400'
                : 'bg-gradient-to-r from-green-100 to-green-200 border-green-400'
            }`}>
            <p className={`text-sm ${isExpiringSoon ? 'text-orange-800' : 'text-green-800'}`}>
                {isExpiringSoon ? '⏰' : '✅'} <span className="font-semibold">Premium Active</span> - {premiumStatus.planName} | Expires: {premiumStatus.expiryDate} ({daysRemaining} days)
            </p>
            {isExpiringSoon && (
                <p className="text-xs text-orange-700 mt-2">
                    🔔 Your subscription is expiring soon. Renew now to avoid losing premium access!
                </p>
            )}
        </div>
    );
};

export default SubscriptionStatus;
