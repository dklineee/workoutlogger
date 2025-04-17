'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTheme } from './context/ThemeContext';

export default function Home() {
  const { status } = useSession();
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/workout-logger');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <main style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: `rgb(var(--background-rgb))` 
      }}>
        <div style={{ color: `rgb(var(--primary))`, fontSize: '1.25rem' }}>Loading...</div>
      </main>
    );
  }

  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: `rgb(var(--background-rgb))`,
      padding: '1rem'
    }}>
      <div style={{ 
        maxWidth: '28rem', 
        width: '100%', 
        backgroundColor: `rgb(var(--card-bg))`, 
        borderRadius: '0.75rem', 
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        border: `1px solid rgb(var(--card-border))`
      }}>
        <div style={{ 
          backgroundColor: `rgb(var(--primary))`, 
          padding: '2rem', 
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: 'white',
            marginBottom: '0.5rem'
          }}>
            Fitness Tracker
          </h1>
          <p style={{ 
            color: `rgb(var(--primary-light))`, 
            fontSize: '1rem'
          }}>
            Track your workouts and monitor your progress
          </p>
        </div>
        
        <div style={{ padding: '2rem' }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            color: `rgb(var(--primary))`, 
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            Sign in to continue
          </h2>
          
          <button
            onClick={() => signIn('google', { callbackUrl: '/workout-logger' })}
            style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.75rem', 
              padding: '0.75rem 1rem', 
              backgroundColor: theme === 'dark' ? 'rgb(45, 55, 72)' : 'white', 
              color: theme === 'dark' ? 'white' : '#374151', 
              borderRadius: '0.5rem', 
              border: `1px solid rgb(var(--card-border))`,
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgb(55, 65, 81)' : '#f9fafb';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgb(45, 55, 72)' : 'white';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg style={{ width: '1.5rem', height: '1.5rem' }} viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>
          
          <div style={{ 
            marginTop: '2rem', 
            textAlign: 'center', 
            color: `rgb(var(--text-secondary))`,
            fontSize: '0.875rem'
          }}>
            <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </main>
  );
}
