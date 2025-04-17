'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

interface Set {
  id: string;
  sets: number;
  reps: number;
  weight: number;
  notes?: string;
}

interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

interface Workout {
  id: string;
  date: string;
  type: string;
  notes?: string;
  exercises: Exercise[];
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch('/api/workouts');
        if (!response.ok) {
          throw new Error('Failed to fetch workouts');
        }
        const data = await response.json();
        setWorkouts(data);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError('Failed to load workouts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    if (!confirm('Are you sure you want to delete this workout? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/workouts/${workoutId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete workout');
      }

      // Remove the deleted workout from the state
      setWorkouts(workouts.filter(workout => workout.id !== workoutId));
      setDeleteMessage('Workout deleted successfully');
      
      // Clear the success message after 3 seconds
      setTimeout(() => {
        setDeleteMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error deleting workout:', err);
      setDeleteMessage(err instanceof Error ? err.message : 'Failed to delete workout');
      
      // Clear the error message after 3 seconds
      setTimeout(() => {
        setDeleteMessage('');
      }, 3000);
    }
  };

  if (loading) {
    return (
      <main style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: `rgb(var(--background-rgb))` 
      }}>
        <div style={{ color: `rgb(var(--primary))`, fontSize: '1.25rem' }}>Loading workouts...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: `rgb(var(--background-rgb))` 
      }}>
        <div style={{ color: '#dc2626', fontSize: '1.25rem' }}>{error}</div>
      </main>
    );
  }

  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundColor: `rgb(var(--background-rgb))`, 
      padding: '2rem 1rem' 
    }}>
      <div style={{ 
        maxWidth: '48rem', 
        margin: '0 auto' 
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem' 
        }}>
          <h1 style={{ 
            fontSize: '2.25rem', 
            fontWeight: 'bold', 
            color: `rgb(var(--primary))` 
          }}>
            Your Workouts
          </h1>
          <Link 
            href="/workout-logger" 
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: `rgb(var(--primary))`, 
              color: 'white', 
              borderRadius: '0.375rem', 
              fontWeight: '500',
              textDecoration: 'none'
            }}
          >
            Add New Workout
          </Link>
        </div>

        {deleteMessage && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: '0.375rem', 
            marginBottom: '1.5rem',
            ...(deleteMessage.includes('Failed') 
              ? { backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' } 
              : { backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' })
          }}>
            {deleteMessage}
          </div>
        )}

        {workouts.length === 0 ? (
          <div style={{ 
            backgroundColor: `rgb(var(--card-bg))`, 
            padding: '2rem', 
            borderRadius: '0.5rem', 
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            border: `1px solid rgb(var(--card-border))`
          }}>
            <p style={{ 
              fontSize: '1.25rem', 
              color: `rgb(var(--text-primary))`, 
              marginBottom: '1rem' 
            }}>
              You haven&apos;t logged any workouts yet.
            </p>
            <Link 
              href="/workout-logger" 
              style={{ 
                display: 'inline-block',
                padding: '0.5rem 1rem', 
                backgroundColor: `rgb(var(--primary))`, 
                color: 'white', 
                borderRadius: '0.375rem', 
                fontWeight: '500',
                textDecoration: 'none'
              }}
            >
              Log Your First Workout
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {workouts.map((workout) => (
              <div 
                key={workout.id} 
                style={{ 
                  backgroundColor: `rgb(var(--card-bg))`, 
                  padding: '1.5rem', 
                  borderRadius: '0.5rem', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  border: `1px solid rgb(var(--card-border))`
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '1rem' 
                }}>
                  <h2 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '600', 
                    color: `rgb(var(--primary))` 
                  }}>
                    {workout.type} - {formatDate(workout.date)}
                  </h2>
                  <button
                    onClick={() => handleDeleteWorkout(workout.id)}
                    style={{ 
                      padding: '0.5rem',
                      backgroundColor: 'transparent',
                      color: '#dc2626',
                      borderRadius: '0.375rem',
                      border: '1px solid #dc2626',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    aria-label="Delete workout"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '1.25rem', height: '1.25rem' }} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {workout.notes && (
                  <div style={{ 
                    marginBottom: '1rem', 
                    padding: '0.75rem', 
                    backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : '#f0f7ff', 
                    borderRadius: '0.375rem',
                    border: `1px solid rgb(var(--primary-light))`
                  }}>
                    <p style={{ color: `rgb(var(--text-primary))` }}>{workout.notes}</p>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {workout.exercises.map((exercise) => (
                    <div 
                      key={exercise.id} 
                      style={{ 
                        backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : '#f0f7ff', 
                        padding: '1rem', 
                        borderRadius: '0.375rem',
                        border: `1px solid rgb(var(--primary-light))`
                      }}
                    >
                      <h3 style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: '500', 
                        color: `rgb(var(--primary))`, 
                        marginBottom: '0.5rem' 
                      }}>
                        {exercise.name}
                      </h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {exercise.sets.map((set) => (
                          <div 
                            key={set.id} 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between', 
                              backgroundColor: `rgb(var(--card-bg))`, 
                              padding: '0.5rem', 
                              borderRadius: '0.375rem',
                              border: `1px solid rgb(var(--card-border))`
                            }}
                          >
                            <div>
                              <span style={{ color: `rgb(var(--text-primary))` }}>
                                {set.sets} sets × {set.reps} reps @ {set.weight} lbs
                              </span>
                              {set.notes && (
                                <span style={{ color: `rgb(var(--primary))`, marginLeft: '0.5rem' }}>
                                  ({set.notes})
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 