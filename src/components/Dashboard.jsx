import React, { useState, useEffect } from 'react';
import PhysicalHealthTab from './PhysicalHealthTab';
import MentalHealthTab from './MentalHealthTab';
import AcademicsTab from './AcademicsTab';
import ResourcesTab from './ResourcesTab';
import PremiumTab from './PremiumTab';
import PaymentHistory from './PaymentHistory';
import DiscrepancyCentre from './DiscrepancyCentre';
import SubscriptionStatus from './SubscriptionStatus';

import RazorpayHandler from './RazorpayHandler';
import {
  isSubscriptionActive,
  getDaysUntilExpiry,
  formatExpiryDate,
  createPaymentLog,
  updateUserPremiumStatus,
  deactivatePremium
} from '../services/subscriptionService';

const Dashboard = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('physical');
  const [isPremium, setIsPremium] = useState(currentUser?.isPremium || false);
  const [premiumStatus, setPremiumStatus] = useState(null);

  // Check for membership expiry and update status
  useEffect(() => {
    if (currentUser?.isPremium && currentUser?.premiumExpiryDate) {
      const isActive = isSubscriptionActive(currentUser.premiumExpiryDate);
      const daysRemaining = getDaysUntilExpiry(currentUser.premiumExpiryDate);

      if (!isActive && daysRemaining <= 0 && isPremium) {
        // SUBSCRIPTION EXPIRED - BLOCK PREMIUM FEATURES
        handleSubscriptionExpired();
      } else if (isActive) {
        // Active subscription
        setPremiumStatus({
          isActive: true,
          daysRemaining,
          expiryDate: formatExpiryDate(currentUser.premiumExpiryDate),
          planName: currentUser.premiumPlanName || 'Premium',
          showWarning: daysRemaining <= 7 && daysRemaining > 0
        });
        setIsPremium(true);
      }
    } else {
      setIsPremium(false);
      setPremiumStatus(null);
    }
  }, [currentUser, isPremium]);

  // Periodic check every 60 seconds to ensure subscription status is accurate
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentUser?.isPremium && currentUser?.premiumExpiryDate) {
        const isActive = isSubscriptionActive(currentUser.premiumExpiryDate);
        const daysRemaining = getDaysUntilExpiry(currentUser.premiumExpiryDate);

        // If subscription has expired, immediately block
        if (!isActive && daysRemaining <= 0) {
          handleSubscriptionExpired();
        } else if (isActive) {
          // Update status if still active
          setPremiumStatus({
            isActive: true,
            daysRemaining,
            expiryDate: formatExpiryDate(currentUser.premiumExpiryDate),
            planName: currentUser.premiumPlanName || 'Premium',
            showWarning: daysRemaining <= 7 && daysRemaining > 0
          });
        }
      }
    }, 60000); // Check every 60 seconds

    return () => clearInterval(intervalId);
  }, [currentUser]);

  const handleSubscriptionExpired = () => {
    // Deactivate premium for current session
    const updatedUser = deactivatePremium(currentUser);
    localStorage.setItem('currentWellnessUser', JSON.stringify(updatedUser));

    // Update main database
    const allUsers = JSON.parse(localStorage.getItem('wellnessUsers') || '[]');
    const updatedAllUsers = allUsers.map(u =>
      u.email === currentUser.email ? deactivatePremium(u) : u
    );
    localStorage.setItem('wellnessUsers', JSON.stringify(updatedAllUsers));

    setIsPremium(false);
    setPremiumStatus({
      isActive: false,
      daysRemaining: 0,
      expiryDate: formatExpiryDate(currentUser.premiumExpiryDate)
    });

    alert(
      `⏰ Your Premium Membership has Expired!\n\n` +
      `Your subscription ended on ${formatExpiryDate(currentUser.premiumExpiryDate)}.\n\n` +
      `Renew now to continue accessing:\n` +
      `• AI Personal Trainer 🤖\n` +
      `• Advanced Health Analytics 📊\n` +
      `• Personalized Study Plans 📚\n\n` +
      `Like Netflix, you need an active subscription to enjoy premium features!`
    );

    window.dispatchEvent(new Event('wellnessDataUpdated'));
  };

  const handlePaymentSuccess = (paymentId, planId, amount) => {
    // Create payment log with subscription details
    const paymentLog = createPaymentLog(paymentId, currentUser.email, currentUser.name, planId, amount);

    // Update current user with premium status
    const updatedUser = updateUserPremiumStatus(currentUser, paymentLog);
    localStorage.setItem('currentWellnessUser', JSON.stringify(updatedUser));

    // Update main database (wellnessUsers)
    const allUsers = JSON.parse(localStorage.getItem('wellnessUsers') || '[]');
    const updatedAllUsers = allUsers.map(u =>
      u.email === currentUser.email ? updateUserPremiumStatus(u, paymentLog) : u
    );
    localStorage.setItem('wellnessUsers', JSON.stringify(updatedAllUsers));

    // Log Payment
    const payments = JSON.parse(localStorage.getItem('wellnessPayments') || '[]');
    localStorage.setItem('wellnessPayments', JSON.stringify([paymentLog, ...payments]));

    // Update UI State
    setIsPremium(true);
    setPremiumStatus({
      isActive: true,
      daysRemaining: paymentLog.durationDays,
      expiryDate: formatExpiryDate(paymentLog.expiryDate),
      planName: paymentLog.planName
    });

    // Notify System
    window.dispatchEvent(new Event('wellnessDataUpdated'));

    // Success Message
    alert(
      `🎉 Payment Successful!\n\n` +
      `Thank you for upgrading to Premium! 💎\n\n` +
      `Plan: ${paymentLog.planName}\n` +
      `Amount: ₹${amount}\n` +
      `Duration: ${paymentLog.durationDays} days\n` +
      `Expires: ${formatExpiryDate(paymentLog.expiryDate)}\n\n` +
      `You now have access to:\n` +
      `• AI Personal Trainer 🤖\n` +
      `• Advanced Health Analytics 📊\n` +
      `• Personalized Study Plans 📚\n\n` +
      `Payment ID: ${paymentId}`
    );

    // Reload to display updated premium status
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const tabs = [
    { id: 'physical', label: 'Physical Health', icon: '💪' },
    { id: 'mental', label: 'Mental Health', icon: '🧠' },
    { id: 'academics', label: 'Academics', icon: '📚' },
    { id: 'resources', label: 'Resources', icon: '🏥' },
    { id: 'premium', label: '👑 Premium Features', icon: '💎' },
    { id: 'payments', label: 'Payment History', icon: '💳' },
    { id: 'discrepancy', label: 'Discrepancy Centre', icon: '⚠️' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'physical':
        return <PhysicalHealthTab currentUser={currentUser} />;
      case 'mental':
        return <MentalHealthTab />;
      case 'academics':
        return <AcademicsTab currentUser={currentUser} />;
      case 'resources':
        return <ResourcesTab />;
      case 'premium':
        return isPremium && premiumStatus?.isActive ? (
          <PremiumTab currentUser={currentUser} />
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-indigo-100">
            <div className="text-6xl mb-4">💎</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isPremium ? 'Premium Subscription Expired' : 'Premium Access Required'}
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {isPremium
                ? 'Your premium membership has expired. Renew now to restore access to premium features.'
                : 'Unlock the AI Personal Trainer and advanced Health Analytics by upgrading your membership.'}
            </p>
            <div className="w-fit mx-auto">
              <RazorpayHandler onPaymentSuccess={handlePaymentSuccess} />
            </div>
          </div>
        );
      case 'payments':
        return <PaymentHistory currentUser={currentUser} />;
      case 'discrepancy':
        return <DiscrepancyCentre currentUser={currentUser} />;
      default:
        return <PhysicalHealthTab />;
    }
  };

  return (
    <div className="fade-in bg-transparent min-h-screen">
      {/* Hero Section — glass card, no solid hero image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="rounded-2xl backdrop-blur-xl bg-white/6 border border-white/8 shadow-[0_30px_60px_rgba(15,23,42,0.6)] p-6 md:p-10 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white">Welcome to Your Wellness Journey</h1>
          <p className="mt-3 text-slate-200/80 text-lg">Your complete guide to physical and mental health on campus</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

        {/* Subscription Status */}
        <div className="mb-8">
          <SubscriptionStatus isPremium={isPremium} premiumStatus={premiumStatus} />
        </div>

        {/* Premium Status Banner - Expiring Soon Warning */}
        {isPremium && premiumStatus?.isActive && premiumStatus?.showWarning && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 md:p-8 text-white mb-12 flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                ⏰ Premium Expiring Soon!
              </h3>
              <p className="text-sm opacity-90">
                Your subscription expires in {premiumStatus.daysRemaining} day(s) on {premiumStatus.expiryDate}
              </p>
            </div>
            <div className="w-full md:w-auto min-w-[250px] mt-4 md:mt-0">
              <RazorpayHandler onPaymentSuccess={handlePaymentSuccess} />
            </div>
          </div>
        )}

        {/* Premium Not Active Banner */}
        {!isPremium && (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 md:p-8 text-white mb-12 flex flex-col md:flex-row items-center justify-between transform transition hover:scale-[1.01]">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                💎 Unlock Premium Access
              </h3>
              <p className="text-indigo-100 text-lg max-w-xl">
                Get AI Personal Trainer, advanced health analytics, and much more!
              </p>
            </div>
            <div className="w-full md:w-auto min-w-[250px]">
              <RazorpayHandler onPaymentSuccess={handlePaymentSuccess} />
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="backdrop-blur-xl bg-white/8 border border-white/10 rounded-xl p-6 text-center hover:bg-white/14 transition-all duration-200 transform hover:-translate-y-1 shadow-lg">
            <div className="text-3xl mb-2">💪</div>
            <h3 className="text-lg font-semibold text-white">Physical Health</h3>
            <p className="text-slate-300/80">Fitness & Nutrition</p>
          </div>
          <div className="backdrop-blur-xl bg-white/8 border border-white/10 rounded-xl p-6 text-center hover:bg-white/14 transition-all duration-200 transform hover:-translate-y-1 shadow-lg">
            <div className="text-3xl mb-2">🧠</div>
            <h3 className="text-lg font-semibold text-white">Mental Health</h3>
            <p className="text-slate-300/80">Mindfulness & Support</p>
          </div>
          <div className="backdrop-blur-xl bg-white/8 border border-white/10 rounded-xl p-6 text-center hover:bg-white/14 transition-all duration-200 transform hover:-translate-y-1 shadow-lg">
            <div className="text-3xl mb-2">📚</div>
            <h3 className="text-lg font-semibold text-white">Academics</h3>
            <p className="text-slate-300/80">Study & Grades</p>
          </div>
          <div className="backdrop-blur-xl bg-white/8 border border-white/10 rounded-xl p-6 text-center hover:bg-white/14 transition-all duration-200 transform hover:-translate-y-1 shadow-lg">
            <div className="text-3xl mb-2">🏥</div>
            <h3 className="text-lg font-semibold text-white">Health Services</h3>
            <p className="text-slate-300/80">Campus Resources</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="backdrop-blur-xl bg-white/8 border border-white/10 rounded-xl p-1 flex flex-wrap justify-center shadow-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                  ? 'bg-purple-500/80 text-white shadow-md backdrop-blur-sm'
                  : 'text-slate-200/80 hover:text-white hover:bg-white/10'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content - Full Width */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard;
