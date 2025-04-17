'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

export default function Navigation() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  if (!session) {
    return null;
  }

  return (
    <nav style={{
      backgroundColor: `rgb(var(--primary))`,
      padding: '1rem 1.5rem',
      marginBottom: '2rem'
    }}>
      <div style={{
        maxWidth: '48rem',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link
            href="/workout-logger"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'white',
              color: `rgb(var(--primary))`,
              borderRadius: '0.375rem',
              fontWeight: '500',
              textDecoration: 'none'
            }}
          >
            Log Workout
          </Link>
          <Link
            href="/workouts"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'white',
              color: `rgb(var(--primary))`,
              borderRadius: '0.375rem',
              fontWeight: '500',
              textDecoration: 'none'
            }}
          >
            View Workouts
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={toggleTheme}
            style={{
              padding: '0.5rem',
              backgroundColor: 'transparent',
              color: 'white',
              borderRadius: '0.375rem',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: `rgb(var(--primary))`,
              color: 'white',
              borderRadius: '0.375rem',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
} 