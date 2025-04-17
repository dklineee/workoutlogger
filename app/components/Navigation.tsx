'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

export default function Navigation() {
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();

  if (status === 'loading') {
    return null;
  }

  if (!session) {
    return null;
  }

  return (
    <nav style={{ 
      backgroundColor: `rgb(var(--card-bg))`, 
      padding: '1rem', 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      borderBottom: `1px solid rgb(var(--card-border))`
    }}>
      <div style={{ 
        maxWidth: '48rem', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link 
            href="/workout-logger" 
            style={{ 
              color: `rgb(var(--text-primary))`, 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Log Workout
          </Link>
          <Link 
            href="/workouts" 
            style={{ 
              color: `rgb(var(--text-primary))`, 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            View Workouts
          </Link>
          <Link 
            href="/workout-program" 
            style={{ 
              color: `rgb(var(--text-primary))`, 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Workout Programs
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={toggleTheme}
            style={{ 
              padding: '0.5rem',
              backgroundColor: 'transparent',
              color: `rgb(var(--text-primary))`,
              borderRadius: '0.375rem',
              border: `1px solid rgb(var(--card-border))`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '1.25rem', height: '1.25rem' }} viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '1.25rem', height: '1.25rem' }} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: 'transparent', 
              color: '#dc2626', 
              borderRadius: '0.375rem', 
              fontWeight: '500',
              border: '1px solid #dc2626',
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