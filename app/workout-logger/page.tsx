'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface WorkoutSet {
  id: string;
  exerciseName: string;
  reps: number;
  weight: number;
  notes?: string;
}

export default function WorkoutLogger() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [workoutDate, setWorkoutDate] = useState('');
  const [workoutType, setWorkoutType] = useState('');
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [currentSet, setCurrentSet] = useState({ 
    exerciseName: '', 
    reps: '', 
    weight: '', 
    notes: '' 
  });
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <main style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#f0f7ff' 
      }}>
        <div style={{ color: '#2563eb', fontSize: '1.25rem' }}>Loading...</div>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  const handleAddSet = () => {
    if (currentSet.exerciseName && currentSet.reps && currentSet.weight) {
      const newSet = { 
        id: Date.now().toString(),
        exerciseName: currentSet.exerciseName,
        reps: parseInt(currentSet.reps),
        weight: parseInt(currentSet.weight),
        notes: currentSet.notes || undefined
      };
      setSets([...sets, newSet]);
      setCurrentSet({ exerciseName: '', reps: '', weight: '', notes: '' });
    }
  };

  const handleDeleteSet = (id: string) => {
    setSets(sets.filter(set => set.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workoutDate || !workoutType || sets.length === 0) {
      setSaveMessage('Please fill in the workout date, type, and add at least one exercise set.');
      return;
    }
    
    setIsSaving(true);
    setSaveMessage('Saving workout...');
    
    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: workoutDate,
          type: workoutType,
          notes: workoutNotes,
          exercises: sets,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to save workout');
      }
      
      console.log('Workout saved:', data);
      
      // Reset form
      setWorkoutDate('');
      setWorkoutType('');
      setSets([]);
      setWorkoutNotes('');
      setSaveMessage('Workout saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error saving workout:', error);
      setSaveMessage(error instanceof Error ? error.message : 'Failed to save workout. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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
          backgroundColor: 'white', 
          borderRadius: '0.5rem', 
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
          overflow: 'hidden' 
        }}>
          <div style={{ 
            backgroundColor: '#2563eb', 
            padding: '1rem 1.5rem' 
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <h1 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: 'white' 
              }}>
                Workout Log
              </h1>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link 
                  href="/workouts" 
                  style={{ 
                    padding: '0.5rem 1rem', 
                    backgroundColor: 'white', 
                    color: '#2563eb', 
                    borderRadius: '0.375rem', 
                    fontWeight: '500',
                    textDecoration: 'none'
                  }}
                >
                  View Workouts
                </Link>
                <Link 
                  href="/" 
                  style={{ 
                    padding: '0.5rem 1rem', 
                    backgroundColor: '#3b82f6', 
                    color: 'white', 
                    borderRadius: '0.375rem', 
                    fontWeight: '500',
                    textDecoration: 'none'
                  }}
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '1.5rem' 
            }}>
              <div>
                <label 
                  htmlFor="workoutDate" 
                  style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    marginBottom: '0.5rem', 
                    color: '#374151' 
                  }}
                >
                  Date
                </label>
                <input
                  type="date"
                  id="workoutDate"
                  value={workoutDate}
                  onChange={(e) => setWorkoutDate(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem',
                    backgroundColor: 'white'
                  }}
                  required
                />
              </div>
              
              <div>
                <label 
                  htmlFor="workoutType" 
                  style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    marginBottom: '0.5rem', 
                    color: '#374151' 
                  }}
                >
                  Workout Type
                </label>
                <input
                  type="text"
                  id="workoutType"
                  value={workoutType}
                  onChange={(e) => setWorkoutType(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem',
                    backgroundColor: 'white'
                  }}
                  placeholder="e.g., Push Day, Pull Day, Leg Day"
                  required
                />
              </div>
            </div>

            <div style={{ 
              backgroundColor: '#f0f7ff', 
              padding: '1.5rem', 
              borderRadius: '0.5rem', 
              border: '1px solid #bfdbfe' 
            }}>
              <h2 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: '#1e40af', 
                marginBottom: '1rem' 
              }}>
                Exercise Sets
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label 
                    htmlFor="exerciseName" 
                    style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      marginBottom: '0.5rem', 
                      color: '#374151' 
                    }}
                  >
                    Exercise Name
                  </label>
                  <input
                    type="text"
                    id="exerciseName"
                    value={currentSet.exerciseName}
                    onChange={(e) => setCurrentSet({ ...currentSet, exerciseName: e.target.value })}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '0.375rem',
                      backgroundColor: 'white'
                    }}
                    placeholder="e.g., Bench Press, Squats, Deadlifts"
                  />
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '1rem' 
                }}>
                  <div>
                    <label 
                      htmlFor="reps" 
                      style={{ 
                        display: 'block', 
                        fontSize: '0.875rem', 
                        fontWeight: '500', 
                        marginBottom: '0.5rem', 
                        color: '#374151' 
                      }}
                    >
                      Reps
                    </label>
                    <input
                      type="number"
                      id="reps"
                      value={currentSet.reps}
                      onChange={(e) => setCurrentSet({ ...currentSet, reps: e.target.value })}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        border: '1px solid #d1d5db', 
                        borderRadius: '0.375rem',
                        backgroundColor: 'white'
                      }}
                      min="1"
                      placeholder="Reps"
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="weight" 
                      style={{ 
                        display: 'block', 
                        fontSize: '0.875rem', 
                        fontWeight: '500', 
                        marginBottom: '0.5rem', 
                        color: '#374151' 
                      }}
                    >
                      Weight (lbs)
                    </label>
                    <input
                      type="number"
                      id="weight"
                      value={currentSet.weight}
                      onChange={(e) => setCurrentSet({ ...currentSet, weight: e.target.value })}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        border: '1px solid #d1d5db', 
                        borderRadius: '0.375rem',
                        backgroundColor: 'white'
                      }}
                      min="0"
                      placeholder="Weight"
                    />
                  </div>
                </div>

                <div>
                  <label 
                    htmlFor="setNotes" 
                    style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      marginBottom: '0.5rem', 
                      color: '#374151' 
                    }}
                  >
                    Set Notes (optional)
                  </label>
                  <input
                    type="text"
                    id="setNotes"
                    value={currentSet.notes}
                    onChange={(e) => setCurrentSet({ ...currentSet, notes: e.target.value })}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '0.375rem',
                      backgroundColor: 'white'
                    }}
                    placeholder="e.g., felt heavy, form was good"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddSet}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    backgroundColor: '#2563eb', 
                    color: 'white', 
                    borderRadius: '0.375rem', 
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Add Exercise Set
                </button>
              </div>
            </div>

            {sets.length > 0 && (
              <div style={{ 
                backgroundColor: 'white', 
                padding: '1.5rem', 
                borderRadius: '0.5rem', 
                border: '1px solid #e5e7eb' 
              }}>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '500', 
                  color: '#111827', 
                  marginBottom: '1rem' 
                }}>
                  Current Exercise Sets:
                </h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {sets.map((set) => (
                    <li 
                      key={set.id} 
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        backgroundColor: '#f0f7ff', 
                        padding: '1rem', 
                        borderRadius: '0.375rem', 
                        border: '1px solid #bfdbfe' 
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between' 
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ 
                            fontWeight: '500', 
                            color: '#1e40af' 
                          }}>
                            {set.exerciseName}:
                          </span>
                          <span style={{ color: '#374151' }}>
                            {set.reps} reps @ {set.weight} lbs
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteSet(set.id)}
                          style={{ 
                            color: '#dc2626', 
                            cursor: 'pointer' 
                          }}
                          aria-label="Delete set"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '1.25rem', height: '1.25rem' }} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      {set.notes && (
                        <div style={{ 
                          fontSize: '0.875rem', 
                          color: '#4b5563', 
                          marginTop: '0.5rem' 
                        }}>
                          Note: {set.notes}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <label 
                htmlFor="workoutNotes" 
                style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  marginBottom: '0.5rem', 
                  color: '#374151' 
                }}
              >
                Workout Notes
              </label>
              <textarea
                id="workoutNotes"
                value={workoutNotes}
                onChange={(e) => setWorkoutNotes(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '0.375rem',
                  backgroundColor: 'white',
                  minHeight: '6rem'
                }}
                rows={3}
                placeholder="Add any general notes about your workout (e.g., energy level, overall performance)"
              />
            </div>

            {saveMessage && (
              <div style={{ 
                padding: '1rem', 
                borderRadius: '0.375rem', 
                ...(saveMessage.includes('Failed') 
                  ? { backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' } 
                  : { backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' })
              }}>
                {saveMessage}
              </div>
            )}

            <button
              type="submit"
              style={{ 
                width: '100%', 
                padding: '0.75rem 1rem', 
                backgroundColor: '#2563eb', 
                color: 'white', 
                borderRadius: '0.375rem', 
                fontWeight: '500',
                cursor: 'pointer',
                opacity: isSaving ? 0.5 : 1,
                pointerEvents: isSaving ? 'none' : 'auto'
              }}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Workout'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
} 