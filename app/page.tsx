'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/workout-program');
    }
  }, [status, session, router]);

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
      backgroundColor: `rgb(var(--background-rgb))` 
    }}>
      <div style={{ 
        maxWidth: '24rem', 
        width: '100%', 
        padding: '2rem',
        backgroundColor: `rgb(var(--card-bg))`,
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: `1px solid rgb(var(--card-border))`
      }}>
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: '600',
          color: `rgb(var(--text-primary))`,
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          Welcome to Fitness App
        </h1>

        <button
          onClick={() => signIn('google', { callbackUrl: '/workout-program' })}
          style={{ 
            width: '100%',
            padding: '0.75rem',
            backgroundColor: `rgb(var(--primary))`,
            color: 'white',
            borderRadius: '0.375rem',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          Sign in with Google
        </button>
      </div>
    </main>
  );
}
