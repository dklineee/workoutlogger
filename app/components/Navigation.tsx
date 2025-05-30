'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';

export default function Navigation() {
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  // Don't render navigation on auth pages
  if (pathname === '/' || pathname === '/register' || pathname === '/auth/error') {
    return null;
  }

  if (status === 'loading') {
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
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          <div style={{ color: `rgb(var(--text-secondary))` }}>Loading...</div>
        </div>
      </nav>
    );
  }

  if (!session) {
    return null;
  }

  const isActive = (path: string) => pathname === path;

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

          {/* <Link 
            href="/workouts" 
            style={{ 
              color: isActive('/workouts') 
                ? `rgb(var(--primary))` 
                : `rgb(var(--text-primary))`, 
              textDecoration: 'none',
              fontWeight: '500',
              borderBottom: isActive('/workouts') 
                ? `2px solid rgb(var(--primary))` 
                : '2px solid transparent',
              paddingBottom: '0.25rem',
              transition: 'all 0.2s'
            }}
          >
            View Workouts
          </Link> */}
          <Link 
            href="/workout-program" 
            style={{ 
              color: isActive('/workout-program') 
                ? `rgb(var(--primary))` 
                : `rgb(var(--text-primary))`, 
              textDecoration: 'none',
              fontWeight: '500',
              borderBottom: isActive('/workout-program') 
                ? `2px solid rgb(var(--primary))` 
                : '2px solid transparent',
              paddingBottom: '0.25rem',
              transition: 'all 0.2s'
            }}
          >
            Workout Programs
          </Link>
          <Link 
            href="/progress" 
            style={{ 
              color: isActive('/progress') 
                ? `rgb(var(--primary))` 
                : `rgb(var(--text-primary))`, 
              textDecoration: 'none',
              fontWeight: '500',
              borderBottom: isActive('/progress') 
                ? `2px solid rgb(var(--primary))` 
                : '2px solid transparent',
              paddingBottom: '0.25rem',
              transition: 'all 0.2s'
            }}
          >
            Progress
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ 
            color: `rgb(var(--text-secondary))`, 
            fontSize: '0.875rem',
            display: 'none',
            '@media (min-width: 640px)': {
              display: 'block'
            }
          }}>
            {session.user?.email}
          </span>
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
              justifyContent: 'center',
              transition: 'all 0.2s'
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
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}