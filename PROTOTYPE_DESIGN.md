# Campus Wellness Hub - Prototype Design Document

## 1. Application Overview

The Campus Wellness Hub is a comprehensive wellness platform designed for students with integrated physical health, mental health, and premium AI features.

**Key Features:**
- User Authentication (Login/Register)
- Physical Health Tracking
- Mental Health Support
- AI-Powered Fitness Plans
- Psychology Articles & Resources
- Premium Membership System
- Admin Dashboard

---

## 2. Application Architecture & User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    CAMPUS WELLNESS HUB                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            LANDING PAGE          ADMIN LOGIN
                    │                   │
                    ▼                   ▼
            ┌───────────────┐   ┌──────────────────┐
            │  USER LOGIN   │   │  ADMIN DASHBOARD │
            │  / REGISTER   │   │  (Admin Portal)  │
            └───────┬───────┘   └──────────────────┘
                    │
                    ▼
            ┌───────────────┐
            │ USER DASHBOARD │
            │  (Main Hub)   │
            └───┬───┬───┬───┬───┘
                │   │   │   │
        ┌───────┘   │   │   └────────┐
        ▼           ▼   ▼           ▼
    PHYSICAL    MENTAL  ACADEMICS  RESOURCES
    HEALTH      HEALTH  &STUDY     & PREMIUM
```

---

## 3. Screen Layout & Navigation Map

### 3.1 Landing Page (/)
**Purpose:** Welcome screen for unauthenticated users

**Elements:**
- Header with "Campus Wellness Hub" branding
- Hero section with wellness imagery
- Call-to-action buttons: "Login" & "Sign Up"
- Feature highlights (Physical Health, Mental Health, AI Features)
- Footer with information

**Navigation:**
- → Login Form
- → Register Form

---

### 3.2 Authentication Layer

#### 3.2.1 Login Form (/login)
**Purpose:** User authentication

**Fields:**
- Email input
- Password input
- Login button
- Sign up link

**Validation:**
- Email format check
- Password verification against stored users
- Error messaging for failed attempts

**Navigation:**
- ✓ Success → Dashboard
- → Register Form
- → Landing Page

---

#### 3.2.2 Register Form (/register)
**Purpose:** New user account creation

**Fields:**
- Full Name input
- Email input
- Password input (with strength indicator)
- Confirm Password input
- Register button
- Login link

**Validation:**
- Email uniqueness check
- Password strength requirements
- Password match verification

**Navigation:**
- ✓ Success → Dashboard
- → Login Form

---

#### 3.2.3 Admin Login (/admin-login)
**Purpose:** Administrator authentication

**Fields:**
- Email input (expects: admin@campus.edu)
- Password input
- Login button

**Navigation:**
- ✓ Success → Admin Dashboard
- → Landing Page

---

### 3.3 User Dashboard (/dashboard)
**Purpose:** Main hub for authenticated users

**Header Structure:**
- Wellness Hub Logo
- User greeting (Hello, [Username])
- Toggle buttons: Physical | Mental | Academics | Resources | Premium
- User profile menu with Logout

**Active Tab Content:**

#### 3.3.1 Physical Health Tab
**Components:**
- Fitness Tracker
  - Daily/Weekly/Monthly statistics
  - Calories consumed/burned
  - Steps tracked
  - Exercise history
  - Data visualization charts

- Exercise Library
  - Searchable exercise database
  - Exercise tutorials
  - Difficulty levels
  - Muscle group filters
  - Video demonstrations

- AI Plans (Premium Feature)
  - AI-generated personalized workout plans
  - Difficulty customization
  - Duration selection
  - Custom exercise recommendations
  - Progress tracking

**Navigation:**
- Sub-tabs for different physical health features

---

#### 3.3.2 Mental Health Tab
**Components:**
- Mood Tracker
  - Daily mood logging (😢 😔 😐 🙂 😄)
  - Mood history visualization
  - Trend analysis
  - Emotional insights
  - Journal entries

- Mental Health Chatbot (AI-Powered)
  - Conversational mental health support
  - Wellness tips
  - Crisis resource information
  - Guided meditation suggestions
  - Anonymous chat sessions

- Psychology Articles
  - Educational content on mental wellness
  - Article categories
  - Reading time indicators
  - Bookmarking functionality
  - Searchable content

**Navigation:**
- Switch between chatbot, mood tracker, and articles

---

#### 3.3.3 Resources Tab
**Components:**
- Wellness Resources
  - Helpline numbers
  - Counseling services
  - Meditation/Yoga guides
  - Nutritional information
  - Sleep health tips
  - Stress management resources

- External Links
  - Campus health services
  - Mental health hotlines
  - Medical appointments
  - Insurance information

**Navigation:**
- Resource categories with expandable sections

---

#### 3.3.4 Academics Tab
**Components:**
- Study Planner
  - Create and manage study schedules
  - Assignment tracking
  - Exam countdown timer
  - Task prioritization
  - Deadline reminders

- Study Resources
  - Subject-wise course materials
  - Note-taking templates
  - Reference materials
  - Study tips & techniques
  - Time management guides

- Academic Performance
  - GPA tracker
  - Grade analysis
  - Performance trends
  - Subject-wise progress
  - Goal setting & tracking

- Study Groups & Collaboration
  - Find study partners
  - Group project management
  - Share notes and resources
  - Schedule group sessions
  - Discussion forums

**Navigation:**
- Switch between study planner, resources, performance, and collaboration

---

#### 3.3.5 Premium Tab
**Components:**
- Premium Status Display
  - Current subscription status
  - Expiry date
  - Days remaining
  - Renewal date

- Premium Features Showcase
  - AI Personal Trainer (Unlimited plans)
  - Health Analytics
  - Advanced mood tracking
  - Priority chatbot support
  - Exclusive content

- Payment Integration (Razorpay)
  - Payment gateway
  - Secure checkout
  - Multiple payment methods
  - Order confirmation
  - Subscription activation

**Premium Pricing:**
- Monthly/Annual plans
- Automatic notifications for renewal
- Expiry handling with downgrade mechanism

---

### 3.4 Admin Dashboard (/admin)
**Purpose:** Administrative management portal

**Features:**
- User Management
  - View all registered users
  - Account statistics
  - User activity tracking

- Content Management
  - Manage psychology articles
  - Manage exercises in library
  - Manage wellness resources

- Analytics & Reporting
  - Platform usage statistics
  - Premium subscription revenue
  - User engagement metrics
  - Health trend data

- Premium Verification
  - Premium user list
  - Subscription status
  - Revenue tracking

**Navigation:**
- Admin menu with different management sections
- Logout button

---

## 4. Detailed Functional Workflows

### 4.1 New User Onboarding Flow

```
┌──────────────┐
│ Landing Page │
└──────┬───────┘
       │ Click "Sign Up"
       ▼
┌──────────────────┐
│ Registration     │──── Validation ────┐
│ Form            │                     │
└──────┬───────────┘                    │
       │ Success                        │ Error
       ▼                                │
┌──────────────────┐                    │
│ Account Created  │                    │
│ Auto-Login       │                    │
└──────┬───────────┘                    │
       │                                │Error Message
       ▼                                │
┌──────────────────┐                    │
│ Dashboard        │◄───────────────────┘
│ (Physical tab)   │
└──────────────────┘
```

**Steps:**
1. User completes registration form
2. System validates input (email format, password strength, uniqueness)
3. User account created in localStorage
4. User auto-logged in and redirected to dashboard
5. Physical Health tab displayed as default

---

### 4.2 User Login Flow

```
┌──────────────┐
│ Landing Page │
└──────┬───────┘
       │ Click "Login"
       ▼
┌──────────────────┐
│ Login Form       │
└──────┬───────────┘
       │ Enter credentials
       ▼
┌──────────────────┐     ┌─────────────┐
│ Verify against   │────▶│ Invalid?    │
│ stored users     │     └──┬──────────┘
└──────┬───────────┘        │
       │ Valid              │ Error message
       ▼                    │
┌──────────────────┐        │
│ Store in session │        │
│ & localStorage   │        │
└──────┬───────────┘        │
       │                    │
       ▼                    ▼
┌──────────────────┐ ┌──────────────┐
│ Redirect to      │ │ Stay on      │
│ Dashboard        │ │ Login page   │
└──────────────────┘ └──────────────┘
```

---

### 4.3 Dashboard Navigation Flow

```
                    ┌──────────────────┐
                    │ User Dashboard   │
                    │ (Authenticated)  │
                    └────────┬─────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
    ┌─────────────┐  ┌──────────────┐  ┌──────────────┐
    │ PHYSICAL    │  │ MENTAL       │  │ RESOURCES    │
    │ HEALTH      │  │ HEALTH       │  │ & PREMIUM    │
    └─────┬───────┘  └──────┬───────┘  └──────┬───────┘
          │                 │                  │
    ┌─────┴────────┐  ┌─────┴────────┐  ┌─────┴────────┐
    │              │  │              │  │              │
    ▼              ▼  ▼              ▼  ▼              ▼
  Fitness      Exercise  Mood     Mental  Wellness  Premium
  Tracker      Library   Tracker  Chatbot Resources  Features
              (AI Plans)        Articles
```

**Navigation Rules:**
- Users can switch between tabs via header buttons
- Sub-features within tabs are accessible
- Logout available from any screen
- Back navigation preserved

---

### 4.4 Premium Membership Workflow

```
┌─────────────────────────┐
│ Premium Tab             │
│ (View Premium Benefits) │
└────────────┬────────────┘
             │ Click "Upgrade"
             ▼
┌──────────────────────────┐
│ Premium Payment Page     │
│ (Razorpay Integration)   │
└────────────┬─────────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
   Success       Cancelled
      │             │
      ▼             ▼
┌──────────────┐ ┌─────────────┐
│ Payment      │ │ Return to   │
│ Processed    │ │ Premium Tab │
│              │ └─────────────┘
│ Store Details│
│ in User      │
│ Profile      │
│ Set expiry   │
│ date (30d)   │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ Unlock Premium       │
│ Features:            │
│ • AI Personal        │
│   Trainer            │
│ • Health Analytics   │
│ • Advanced Mood      │
│   Tracking           │
└──────────────────────┘
```

**Premium Benefits:**
✓ Unlimited personalized AI workout plans
✓ Advanced health analytics
✓ Priority mental health support
✓ Exclusive content access
✓ 30-day subscription (auto-renewal capable)

---

### 4.5 Physical Health Tracking Flow

```
┌─────────────────────────┐
│ Physical Health Tab     │
│ (Fitness Tracker)       │
└────────────┬────────────┘
             │
    ┌────────┼────────┐
    │        │        │
    ▼        ▼        ▼
┌──────┐ ┌─────┐ ┌───────────┐
│Log   │ │View │ │View AI    │
│Daily │ │Chat │ │Plans      │
│Stats │ │     │ │(Premium)  │
└──┬───┘ └─────┘ └─────┬─────┘
   │                   │
   └─────────┬─────────┘
             │
             ▼
┌─────────────────────────┐
│ Display:                │
│ • Daily calories        │
│ • Steps walked          │
│ • Exercise history      │
│ • Progress charts       │
│ • Personal bests        │
└─────────────────────────┘
```

---

### 4.6 Mental Health Workflow

```
┌─────────────────────────┐
│ Mental Health Tab       │
└────────────┬────────────┘
             │
    ┌────────┼────────────┐
    │        │            │
    ▼        ▼            ▼
┌──────────┐ ┌──────────┐ ┌───────────────┐
│Mood      │ │Chatbot   │ │Psychology     │
│Tracker   │ │Support   │ │Articles       │
└──┬───────┘ └──┬───────┘ └────┬──────────┘
   │            │               │
   ▼            ▼               ▼
┌──────────┐ ┌───────────┐ ┌────────────┐
│ • Log    │ │ • Chat    │ │ • Browse   │
│   mood   │ │   with AI │ │   articles │
│ • View   │ │ • Get tips│ │ • Read     │
│   trends │ │ • Crisis  │ │   content  │
│ • Jour-  │ │   support │ │ • Bookmark │
│   nal    │ └───────────┘ └────────────┘
└──────────┘
```

---

### 4.7 Admin Operations Flow

```
┌────────────────────────┐
│ Admin Login            │
│ (admin@campus.edu)    │
└─────────────┬──────────┘
              │ Successful auth
              ▼
┌─────────────────────────────┐
│ Admin Dashboard             │ User Menu: Logout
└───┬───────────────────────┬─┘
    │                       │
    ▼                       ▼
┌──────────────────┐ ┌──────────────────┐
│ User Management  │ │ Content           │
│ • View all users │ │ Management        │
│ • User stats     │ │ • Articles        │
│ • Track activity │ │ • Exercises       │
│                  │ │ • Resources       │
└──────────────────┘ └────┬─────────────┘
                           │
                           ▼
                    ┌──────────────────┐
                    │ Analytics        │
                    │ • Revenue        │
                    │ • User metrics   │
                    │ • Engagement     │
                    └──────────────────┘
```

---

## 5. Navigation Bar Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                     │
│  🏥 Wellness Hub      │ Hello, [User]!    │ Profile ▼  │ Logout  │
│                                                                     │
│  When Authenticated:                                               │
│  [Physical] [Mental] [Resources] [Premium]                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Data Flow & State Management

```
LOCAL STORAGE
├── currentWellnessUser
│   ├── email
│   ├── password (hashed)
│   ├── name
│   ├── isPremium
│   └── premiumExpiryDate
│
├── wellnessUsers (Array)
│   └── [User objects]
│
├── fitnessData
│   ├── dailyStats
│   └── exerciseHistory
│
├── moodEntries
│   ├── date
│   ├── mood
│   └── notes
│
└── isPremium (boolean flag)

REACT STATE
├── currentUser (object)
├── showLogin (boolean)
├── showRegister (boolean)
├── showDashboard (boolean)
└── activeTab (physical|mental|resources|premium)
```

---

## 7. Key User Journeys

### Journey 1: New User → Premium Subscriber
```
1. Visit Landing Page
2. Click "Sign Up"
3. Complete Registration
4. Auto-directed to Dashboard (Physical Health)
5. Explore features (Fitness, Mental Health, Resources)
6. Click Premium tab
7. View benefits
8. Click "Upgrade"
9. Complete Razorpay payment
10. Access AI features
```

### Journey 2: Existing User → Mental Health Support
```
1. Login with credentials
2. Redirected to Dashboard
3. Click "Mental Health" tab
4. Choose: Mood Tracker OR Chatbot OR Articles
5. Log mood / Chat with AI / Read content
6. View mental health insights
7. Access wellness resources
```

### Journey 3: Premium User → AI Fitness Plan
```
1. Login (Premium user)
2. Go to Dashboard → Physical Health
3. Click "AI Plans" 
4. Select difficulty level
5. Choose workout duration
6. Get AI-generated custom plan
7. Start workout
8. Log performance
9. Track progress over time
```

### Journey 4: Admin Operations
```
1. Navigate to /admin-login
2. Enter admin credentials
3. Access Admin Dashboard
4. View user statistics
5. Manage content
6. Monitor premium revenue
7. Analyze platform metrics
8. Logout
```

---

## 8. UI/UX Specifications

### Color Scheme
```
Primary:    Blue (#3B82F6)
Secondary:  Purple (#A855F7)
Accent:     Green (#10B981) - Health/Success
Warning:    Orange (#F97316) - Premium alerts
Background: Blue gradient (50) → Purple gradient
Text:       Dark gray (#1F2937) on light backgrounds
```

### Typography
- **Headers:** Large, bold, modern
- **Body:** Clear, readable, 16px minimum
- **Buttons:** Medium weight, clearly clickable

### Components
- Tab navigation (underline indicator)
- Cards for content blocks
- Charts & graphs (Recharts integration)
- Modal dialogs for confirmations
- Toast notifications for feedback
- Forms with validation messages

### Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop layout
- Touch-friendly buttons (48px minimum)

---

## 9. Error Handling & Edge Cases

### Authentication Errors
- ✗ Email not found → "No account with this email"
- ✗ Wrong password → "Incorrect password"
- ✗ Email exists → "Email already registered"

### Premium Membership
- Expiry check on dashboard load
- Auto-downgrade on expiry
- Renewal reminders (7 days before)
- Payment failure handling

### Data Validation
- Email format validation
- Password strength requirements
- Input sanitization
- Required field checks

### Network Errors
- Graceful fallback messages
- Retry mechanisms
- Offline mode considerations

---

## 10. Feature Roadmap

### Current Version (v1.0)
✓ User Authentication
✓ Physical Health Tracking
✓ Mental Health Features
✓ AI Chatbot Integration
✓ Premium System (Razorpay)
✓ Admin Dashboard

### Future Enhancements (v2.0)
- Social sharing features
- Wearable device integration (Fitbit, Apple Watch)
- Video workout tutorials
- Community challenges
- Nutritionist consultations (Premium)
- Advanced AI personalization
- Push notifications
- Mobile app version

---

## 11. Technical Architecture

```
┌─────────────────────────────────────────┐
│        React + Vite Frontend            │
├─────────────────────────────────────────┤
│ Components:                             │
│ • React Router (routing)                │
│ • React Hooks (state management)        │
│ • Recharts (data visualization)         │
│ • Tailwind CSS (styling)                │
├─────────────────────────────────────────┤
│ Services:                               │
│ • Gemini AI (chatbot, plans)            │
│ • Razorpay (payments)                   │
├─────────────────────────────────────────┤
│ Storage:                                │
│ • localStorage (user data, prefs)       │
├─────────────────────────────────────────┤
│ Browser APIs:                           │
│ • Session management                    │
│ • Form validation                       │
└─────────────────────────────────────────┘
```

---

## 12. Summary

**Campus Wellness Hub** provides a comprehensive wellness solution with:

✅ **Intuitive Navigation** - Tab-based dashboard with clear flows
✅ **Multi-Feature Support** - Physical health, mental health, resources
✅ **AI Integration** - Personalized fitness plans & chatbot support
✅ **Monetization** - Premium membership with Razorpay integration
✅ **Admin Control** - Content and user management
✅ **Good UX** - Responsive design, clear workflows, proper validation

The application follows a modern SPA (Single Page Application) architecture with client-side routing, localStorage persistence, and integration with AI and payment services.
