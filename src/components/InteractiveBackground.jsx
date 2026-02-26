import React, { useEffect, useMemo, useRef } from 'react';
import './InteractiveBackground.css';

const themeTokens = {
    landing: {
        primary: '#6e34ff',
        secondary: '#ff6db3',
        accent: 'rgba(117, 84, 255, 0.45)'
    },
    auth: {
        primary: '#2563eb',
        secondary: '#9333ea',
        accent: 'rgba(37, 99, 235, 0.35)'
    },
    dashboard: {
        primary: '#14b8a6',
        secondary: '#0ea5e9',
        accent: 'rgba(14, 165, 233, 0.35)'
    },
    premium: {
        primary: '#f59e0b',
        secondary: '#ec4899',
        accent: 'rgba(249, 115, 22, 0.35)'
    },
    admin: {
        primary: '#111827',
        secondary: '#312e81',
        accent: 'rgba(244, 63, 94, 0.25)'
    }
};

const InteractiveBackground = ({ theme = 'landing' }) => {
    const bgRef = useRef(null);
    const tokens = useMemo(() => themeTokens[theme] || themeTokens.landing, [theme]);

    useEffect(() => {
        const node = bgRef.current;
        if (!node) {
            return;
        }

        node.style.setProperty('--bg-primary', tokens.primary);
        node.style.setProperty('--bg-secondary', tokens.secondary);
        node.style.setProperty('--bg-accent', tokens.accent);
    }, [tokens]);

    useEffect(() => {
        const handlePointerMove = (event) => {
            if (!bgRef.current) {
                return;
            }
            const x = (event.clientX / window.innerWidth) * 100;
            const y = (event.clientY / window.innerHeight) * 100;
            bgRef.current.style.setProperty('--pointer-x', `${x}%`);
            bgRef.current.style.setProperty('--pointer-y', `${y}%`);
        };

        window.addEventListener('pointermove', handlePointerMove);
        return () => window.removeEventListener('pointermove', handlePointerMove);
    }, []);

    return (
        <div className="interactive-bg" ref={bgRef} data-theme={theme} aria-hidden="true">
            <div className="interactive-bg__gradient" />
            <div className="interactive-bg__glow" />
            <div className="interactive-bg__grid" />
            <div className="interactive-bg__orb orb-one" />
            <div className="interactive-bg__orb orb-two" />
            <div className="interactive-bg__orb orb-three" />
        </div>
    );
};

export default InteractiveBackground;
