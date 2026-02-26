import React from 'react';
import { Link } from 'react-router-dom';
import heroAthlete from '../assets/hero-athlete.png';
import physicalHealth from '../assets/physical-health.jpg';
import campusWellness from '../assets/campus-wellness.png';

const LandingPage = () => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden px-6 sm:px-10 lg:px-20 py-10">
            {/* Subtle overlay so text is always readable on top of interactive background */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/10 mix-blend-multiply" />

            <div className="relative z-10 mx-auto max-w-6xl grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-center">
                {/* Left: Hero copy */}
                <div className="space-y-8 text-white animate-fade-in-up">
                    <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold tracking-[0.25em] uppercase backdrop-blur-sm border border-white/15">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Student Wellness Platform
                    </p>

                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-cyan-200">
                            Your Complete
                        </span>
                        <span className="mt-1 block">Campus Wellness Hub</span>
                    </h1>

                    <p className="max-w-xl text-base sm:text-lg text-slate-200/90 leading-relaxed">
                        Track fitness, protect your mental health and unlock AI-powered, personalized plans designed for the modern student.
                    </p>

                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/register"
                            className="group relative inline-flex items-center justify-center px-8 py-3 text-base sm:text-lg font-semibold text-slate-950 rounded-full bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300 shadow-[0_18px_45px_rgba(15,23,42,0.6)] transition-all duration-200 hover:scale-105 hover:shadow-[0_22px_55px_rgba(15,23,42,0.8)]"
                        >
                            Get Started Free
                            <svg className="ml-2 h-5 w-5 -mr-1 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>

                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center px-8 py-3 text-base sm:text-lg font-medium text-white rounded-full border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:scale-105 transition-all duration-200"
                        >
                            Explore Dashboard
                        </Link>
                    </div>

                    <div className="mt-8 grid gap-4 text-xs sm:text-sm text-slate-200/90 sm:grid-cols-3 max-w-lg">
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md flex items-center gap-3">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/90 text-slate-950 text-sm font-semibold">PH</span>
                            <div>
                                <p className="font-semibold">Physical Health</p>
                                <p className="text-slate-200/70">Workouts, recovery & routines</p>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md flex items-center gap-3">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-fuchsia-400/90 text-slate-950 text-sm font-semibold">MH</span>
                            <div>
                                <p className="font-semibold">Mental Health</p>
                                <p className="text-slate-200/70">Mood tracking & AI support</p>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md flex items-center gap-3">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-400/90 text-slate-950 text-sm font-semibold">AC</span>
                            <div>
                                <p className="font-semibold">Academics</p>
                                <p className="text-slate-200/70">Study plans & focus tools</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Athlete visual card */}
                <div className="relative h-[340px] sm:h-[420px] lg:h-[460px] animate-fade-in-up [animation-delay:80ms]">
                    <div className="absolute -inset-0.5 rounded-[2.5rem] bg-gradient-to-br from-indigo-400/70 via-fuchsia-400/60 to-emerald-300/70 opacity-80 blur-xl" />
                    <div className="relative h-full overflow-hidden rounded-[2.3rem] bg-black/60 border border-white/10 backdrop-blur-xl shadow-[0_30px_120px_rgba(15,23,42,0.9)]">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                        <img
                            className="relative h-full w-full object-cover object-center"
                            src={heroAthlete}
                            alt="Athlete training"
                        />

                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex flex-col gap-3 text-slate-50">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold tracking-[0.22em] uppercase text-slate-200/80">Campus Wellness Score</p>
                                    <p className="mt-1 text-2xl font-bold">Ready To Level Up</p>
                                </div>
                                <div className="inline-flex flex-col items-end text-right">
                                    <span className="text-[0.7rem] uppercase tracking-[0.24em] text-slate-200/70">AI Coach</span>
                                    <span className="mt-1 rounded-full bg-emerald-400/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow-lg">Online</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 text-[0.65rem] font-medium text-slate-100/90">
                                <span className="rounded-full bg-white/10 px-2.5 py-1 border border-white/15">Smart workout plans</span>
                                <span className="rounded-full bg-white/10 px-2.5 py-1 border border-white/15">Stress & mood insights</span>
                                <span className="rounded-full bg-white/10 px-2.5 py-1 border border-white/15">Study focus modes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
