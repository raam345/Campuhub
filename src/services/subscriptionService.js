// Subscription Plans and Management
export const SUBSCRIPTION_PLANS = {
    one_month: {
        id: 'one_month',
        name: '1 Month',
        price: 149,
        duration: 30,
        durationLabel: '1 month'
    },
    three_months: {
        id: 'three_months',
        name: '3 Months',
        price: 399,
        duration: 90,
        durationLabel: '3 months',
        discount: true,
        discountPercent: 10
    },
    six_months: {
        id: 'six_months',
        name: '6 Months',
        price: 699,
        duration: 180,
        durationLabel: '6 months',
        discount: true,
        discountPercent: 20
    },
    one_year: {
        id: 'one_year',
        name: '1 Year',
        price: 1299,
        duration: 365,
        durationLabel: '1 year',
        discount: true,
        discountPercent: 30
    }
};

export const calculateExpiryDate = (days) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    return expiryDate;
};

export const isSubscriptionActive = (expiryDateString) => {
    if (!expiryDateString) return false;
    const expiryDate = new Date(expiryDateString);
    const today = new Date();
    return expiryDate > today;
};

export const getDaysUntilExpiry = (expiryDateString) => {
    if (!expiryDateString) return -1;
    const expiryDate = new Date(expiryDateString);
    const today = new Date();
    const daysUntil = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    return daysUntil;
};

export const formatExpiryDate = (expiryDateString) => {
    if (!expiryDateString) return 'N/A';
    const expiryDate = new Date(expiryDateString);
    return expiryDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const createPaymentLog = (paymentId, userEmail, userName, planId, amount) => {
    const plan = SUBSCRIPTION_PLANS[planId];
    const expiryDate = calculateExpiryDate(plan.duration);

    return {
        id: paymentId || `pay_${Date.now()}`,
        userEmail,
        userName,
        amount,
        planId,
        planName: plan.name,
        durationDays: plan.duration,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        activatedDate: new Date().toISOString(),
        expiryDate: expiryDate.toISOString(),
        status: 'Success'
    };
};

export const updateUserPremiumStatus = (currentUser, paymentLog) => {
    return {
        ...currentUser,
        isPremium: true,
        premiumExpiryDate: paymentLog.expiryDate,
        premiumActivatedDate: paymentLog.activatedDate,
        premiumPlanId: paymentLog.planId,
        premiumPlanName: paymentLog.planName
    };
};

export const deactivatePremium = (user) => {
    const updatedUser = { ...user };
    delete updatedUser.isPremium;
    delete updatedUser.premiumExpiryDate;
    delete updatedUser.premiumActivatedDate;
    delete updatedUser.premiumPlanId;
    delete updatedUser.premiumPlanName;
    return updatedUser;
};
