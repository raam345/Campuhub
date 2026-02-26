import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';

import AdminDashboard from './components/AdminDashboard';

import AdminLoginForm from './components/AdminLoginForm';
import InteractiveBackground from './components/InteractiveBackground';

const resolveTheme = (path, currentUser) => {
  if (path.startsWith('/admin')) {
    return 'admin';
  }

  if (path.startsWith('/dashboard')) {
    return currentUser?.plan === 'premium' ? 'premium' : 'dashboard';
  }

  if (path.startsWith('/login') || path.startsWith('/register')) {
    return 'auth';
  }

  return 'landing';
};

function AppShell() {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentWellnessUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setShowDashboard(true);
      setShowLogin(false);
      setShowRegister(false);
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setShowDashboard(true);
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentWellnessUser');
    setShowLogin(true);
    setShowDashboard(false);
    setShowRegister(false);
  };

  const handleShowLogin = () => { };
  const handleShowRegister = () => { };

  const theme = resolveTheme(location.pathname, currentUser);

  return (
    <div className="app-shell">
      <InteractiveBackground theme={theme} />
      <div className="app-content">
        {/* Hide Navigation for Admin Dashboard and Admin Login */}
        {currentUser?.email !== 'admin@campus.edu' && location.pathname !== '/admin-login' && (
          <Navigation
            currentUser={currentUser}
            onLogout={handleLogout}
            onShowLogin={() => { }}
            onShowRegister={() => { }}
          />
        )}
        <div className="w-full">
          <Routes>
            <Route path="/" element={!currentUser ? <LandingPage /> : <Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<LoginForm onLogin={handleLogin} onShowRegister={() => { }} />} />
            <Route path="/admin-login" element={<AdminLoginForm onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterForm onShowLogin={() => { }} />} />
            <Route
              path="/dashboard"
              element={
                currentUser ? (
                  currentUser.email === 'admin@campus.edu' ?
                    <Navigate to="/admin" replace /> :
                    <Dashboard currentUser={currentUser} />
                ) : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/admin"
              element={
                currentUser?.email === 'admin@campus.edu' ?
                  <AdminDashboard onLogout={handleLogout} /> :
                  <Navigate to="/admin-login" replace />
              }
            />
            <Route path="*" element={<div>Not Found. <Link to="/" className="btn btn-primary">Go Home</Link></div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
