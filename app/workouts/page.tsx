'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

  if (loading) {
    return (
      <main style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#f0f7ff' 
      }}>
        <div style={{ color: '#2563eb', fontSize: '1.25rem' }}>Loading workouts...</div>
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
        backgroundColor: '#f0f7ff' 
      }}>
        <div style={{ color: '#dc2626', fontSize: '1.25rem' }}>{error}</div>
      </main>
    );
  }

  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f0f7ff', 
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
            color: '#2563eb' 
          }}>
            Your Workouts
          </h1>
          <Link 
            href="/workout-logger" 
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#2563eb', 
              color: 'white', 
              borderRadius: '0.375rem', 
              fontWeight: '500',
              textDecoration: 'none'
            }}
          >
            Add New Workout
          </Link>
        </div>

        {workouts.length === 0 ? (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '2rem', 
            borderRadius: '0.5rem', 
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            textAlign: 'center' 
          }}>
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#374151', 
              marginBottom: '1rem' 
            }}>
              You haven&apos;t logged any workouts yet.
            </p>
            <Link 
              href="/workout-logger" 
              style={{ 
                display: 'inline-block',
                padding: '0.5rem 1rem', 
                backgroundColor: '#2563eb', 
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
                  backgroundColor: 'white', 
                  padding: '1.5rem', 
                  borderRadius: '0.5rem', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
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
                    color: '#1e40af' 
                  }}>
                    {workout.type} - {formatDate(workout.date)}
                  </h2>
                </div>

                {workout.notes && (
                  <div style={{ 
                    marginBottom: '1rem', 
                    padding: '0.75rem', 
                    backgroundColor: '#f0f7ff', 
                    borderRadius: '0.375rem',
                    border: '1px solid #bfdbfe'
                  }}>
                    <p style={{ color: '#374151' }}>{workout.notes}</p>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {workout.exercises.map((exercise) => (
                    <div 
                      key={exercise.id} 
                      style={{ 
                        backgroundColor: '#f0f7ff', 
                        padding: '1rem', 
                        borderRadius: '0.375rem',
                        border: '1px solid #bfdbfe'
                      }}
                    >
                      <h3 style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: '500', 
                        color: '#1e40af', 
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
                              backgroundColor: 'white', 
                              padding: '0.5rem', 
                              borderRadius: '0.375rem',
                              border: '1px solid #e5e7eb'
                            }}
                          >
                            <div>
                              <span style={{ color: '#374151' }}>
                                {set.sets} sets × {set.reps} reps @ {set.weight} lbs
                              </span>
                              {set.notes && (
                                <span style={{ color: '#2563eb', marginLeft: '0.5rem' }}>
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