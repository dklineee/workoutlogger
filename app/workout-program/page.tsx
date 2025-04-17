'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

// Common exercises list
const COMMON_EXERCISES = [
  // Chest
  'Bench Press', 'Incline Bench Press', 'Decline Bench Press', 'Dumbbell Press', 
  'Incline Dumbbell Press', 'Push-Ups', 'Chest Flyes', 'Cable Flyes',
  // Back
  'Pull-Ups', 'Lat Pulldowns', 'Barbell Rows', 'Dumbbell Rows', 
  'Deadlifts', 'Face Pulls', 'Cable Rows', 'T-Bar Rows',
  // Shoulders
  'Overhead Press', 'Lateral Raises', 'Front Raises', 'Face Pulls', 
  'Shrugs', 'Upright Rows', 'Arnold Press', 'Reverse Flyes',
  // Arms
  'Bicep Curls', 'Hammer Curls', 'Tricep Extensions', 'Skull Crushers', 
  'Preacher Curls', 'Concentration Curls', 'Rope Pushdowns', 'Diamond Push-Ups',
  // Legs
  'Squats', 'Leg Press', 'Romanian Deadlifts', 'Lunges', 
  'Leg Extensions', 'Leg Curls', 'Calf Raises', 'Hip Thrusts',
  // Core
  'Planks', 'Crunches', 'Russian Twists', 'Leg Raises', 
  'Ab Wheel Rollouts', 'Cable Woodchops', 'Bicycle Crunches', 'Hanging Leg Raises',
  // Custom option
  'Custom Exercise'
];

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  notes?: string;
  weights?: number[];
}

interface WorkoutDay {
  id: string;
  name: string;
  exercises: Exercise[];
}

interface Week {
  id: string;
  weekNumber: number;
  days: WorkoutDay[];
}

interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  weeks: Week[];
  createdAt: string;
}

export default function WorkoutProgramPage() {
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { theme } = useTheme();
  
  // Form states
  const [programName, setProgramName] = useState('');
  const [programDescription, setProgramDescription] = useState('');
  const [programWeeks, setProgramWeeks] = useState(4);
  const [showForm, setShowForm] = useState(false);
  const [currentDay, setCurrentDay] = useState<WorkoutDay>({
    id: crypto.randomUUID(),
    name: '',
    exercises: []
  });
  const [days, setDays] = useState<WorkoutDay[]>([]);
  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    id: crypto.randomUUID(),
    name: '',
    sets: 3,
    reps: 10,
    notes: '',
    weights: []
  });
  const [isCustomExercise, setIsCustomExercise] = useState(false);
  
  // Pagination state
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  
  // Weight input state
  const [weightInputs, setWeightInputs] = useState<Record<string, number[]>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll use localStorage to persist programs
    const savedPrograms = localStorage.getItem('workoutPrograms');
    if (savedPrograms) {
      setPrograms(JSON.parse(savedPrograms));
    }
    setLoading(false);
  }, []);

  const handleAddExercise = () => {
    if (!currentExercise.name) {
      setMessage('Exercise name is required');
      return;
    }
    
    setCurrentDay({
      ...currentDay,
      exercises: [...currentDay.exercises, { ...currentExercise, id: crypto.randomUUID() }]
    });
    
    setCurrentExercise({
      id: crypto.randomUUID(),
      name: '',
      sets: 3,
      reps: 10,
      notes: '',
      weights: []
    });
    
    setMessage('');
  };

  const handleAddDay = () => {
    if (!currentDay.name) {
      setMessage('Day name is required');
      return;
    }
    
    if (currentDay.exercises.length === 0) {
      setMessage('Add at least one exercise to the day');
      return;
    }
    
    setDays([...days, { ...currentDay, id: crypto.randomUUID() }]);
    
    setCurrentDay({
      id: crypto.randomUUID(),
      name: '',
      exercises: []
    });
    
    setMessage('');
  };

  const handleSaveProgram = () => {
    if (!programName) {
      setMessage('Program name is required');
      return;
    }
    
    if (days.length === 0) {
      setMessage('Add at least one day to the program');
      return;
    }
    
    // Create weeks based on the number of weeks selected
    const weeks: Week[] = [];
    for (let i = 1; i <= programWeeks; i++) {
      weeks.push({
        id: crypto.randomUUID(),
        weekNumber: i,
        days: days.map(day => ({
          ...day,
          id: crypto.randomUUID(),
          exercises: day.exercises.map(exercise => ({
            ...exercise,
            id: crypto.randomUUID()
          }))
        }))
      });
    }
    
    const newProgram: WorkoutProgram = {
      id: crypto.randomUUID(),
      name: programName,
      description: programDescription,
      weeks: weeks,
      createdAt: new Date().toISOString()
    };
    
    const updatedPrograms = [...programs, newProgram];
    setPrograms(updatedPrograms);
    localStorage.setItem('workoutPrograms', JSON.stringify(updatedPrograms));
    
    // Reset form
    setProgramName('');
    setProgramDescription('');
    setProgramWeeks(4);
    setDays([]);
    setShowForm(false);
    setMessage('Program saved successfully!');
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleDeleteProgram = (id: string) => {
    if (!confirm('Are you sure you want to delete this program? This action cannot be undone.')) {
      return;
    }
    
    const updatedPrograms = programs.filter(program => program.id !== id);
    setPrograms(updatedPrograms);
    localStorage.setItem('workoutPrograms', JSON.stringify(updatedPrograms));
    setMessage('Program deleted successfully');
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleExerciseNameChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const value = e.target.value;
    if (value === 'Custom Exercise') {
      setIsCustomExercise(true);
      setCurrentExercise({
        ...currentExercise,
        name: ''
      });
    } else {
      setIsCustomExercise(false);
      setCurrentExercise({
        ...currentExercise,
        name: value
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleProgramSelect = (programId: string) => {
    setSelectedProgram(programId);
    setCurrentWeek(1); // Reset to first week when selecting a new program
    
    // Initialize weight inputs for the selected program
    const program = programs.find(p => p.id === programId);
    if (program) {
      const initialWeightInputs: Record<string, number[]> = {};
      
      program.weeks.forEach(week => {
        week.days.forEach(day => {
          day.exercises.forEach(exercise => {
            // Initialize with existing weights or empty arrays
            initialWeightInputs[exercise.id] = exercise.weights || Array(exercise.sets).fill(0);
          });
        });
      });
      
      setWeightInputs(initialWeightInputs);
    }
  };

  const handlePrevWeek = () => {
    if (currentWeek > 1) {
      setCurrentWeek(currentWeek - 1);
    }
  };

  const handleNextWeek = (totalWeeks: number) => {
    if (currentWeek < totalWeeks) {
      setCurrentWeek(currentWeek + 1);
    }
  };

  const handleWeightChange = (exerciseId: string, setIndex: number, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value);
    
    setWeightInputs(prev => {
      const newWeights = [...(prev[exerciseId] || [])];
      newWeights[setIndex] = numValue;
      return { ...prev, [exerciseId]: newWeights };
    });
    
    setHasUnsavedChanges(true);
  };

  const handleSaveWeights = () => {
    if (!selectedProgram) return;
    
    const updatedPrograms = programs.map(program => {
      if (program.id === selectedProgram) {
        const updatedWeeks = program.weeks.map(week => {
          if (week.weekNumber === currentWeek) {
            const updatedDays = week.days.map(day => {
              const updatedExercises = day.exercises.map(exercise => {
                if (weightInputs[exercise.id]) {
                  return {
                    ...exercise,
                    weights: [...weightInputs[exercise.id]]
                  };
                }
                return exercise;
              });
              return { ...day, exercises: updatedExercises };
            });
            return { ...week, days: updatedDays };
          }
          return week;
        });
        return { ...program, weeks: updatedWeeks };
      }
      return program;
    });
    
    setPrograms(updatedPrograms);
    localStorage.setItem('workoutPrograms', JSON.stringify(updatedPrograms));
    setHasUnsavedChanges(false);
    setMessage('Weights saved successfully!');
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage('');
    }, 3000);
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
        <div style={{ color: `rgb(var(--primary))`, fontSize: '1.25rem' }}>Loading workout programs...</div>
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
            Workout Programs
          </h1>
          <button 
            onClick={() => setShowForm(!showForm)}
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
            {showForm ? 'Cancel' : 'Create New Program'}
          </button>
        </div>

        {message && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: '0.375rem', 
            marginBottom: '1.5rem',
            ...(message.includes('Failed') || message.includes('required') || message.includes('Add at least')
              ? { backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' } 
              : { backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' })
          }}>
            {message}
          </div>
        )}

        {showForm && (
          <div style={{ 
            backgroundColor: `rgb(var(--card-bg))`, 
            padding: '1.5rem', 
            borderRadius: '0.5rem', 
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            border: `1px solid rgb(var(--card-border))`,
            marginBottom: '2rem'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: `rgb(var(--primary))`,
              marginBottom: '1.5rem'
            }}>
              Create New Workout Program
            </h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label 
                htmlFor="programName" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: `rgb(var(--text-primary))`
                }}
              >
                Program Name
              </label>
              <input
                id="programName"
                type="text"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  borderRadius: '0.375rem',
                  border: `1px solid rgb(var(--card-border))`,
                  backgroundColor: `rgb(var(--background-rgb))`,
                  color: `rgb(var(--text-primary))`
                }}
                placeholder="e.g., 12-Week Strength Program"
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label 
                htmlFor="programDescription" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: `rgb(var(--text-primary))`
                }}
              >
                Description
              </label>
              <textarea
                id="programDescription"
                value={programDescription}
                onChange={(e) => setProgramDescription(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  borderRadius: '0.375rem',
                  border: `1px solid rgb(var(--card-border))`,
                  backgroundColor: `rgb(var(--background-rgb))`,
                  color: `rgb(var(--text-primary))`,
                  minHeight: '100px',
                  resize: 'vertical'
                }}
                placeholder="Describe your workout program..."
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label 
                htmlFor="programWeeks" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: `rgb(var(--text-primary))`
                }}
              >
                Program Length: {programWeeks} {programWeeks === 1 ? 'week' : 'weeks'}
              </label>
              <input
                id="programWeeks"
                type="range"
                min="4"
                max="12"
                value={programWeeks}
                onChange={(e) => setProgramWeeks(parseInt(e.target.value))}
                style={{ 
                  width: '100%', 
                  height: '0.5rem',
                  borderRadius: '0.25rem',
                  backgroundColor: `rgb(var(--primary-light))`,
                  outline: 'none',
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  opacity: 0.7,
                  transition: 'opacity 0.2s',
                  cursor: 'pointer'
                }}
              />
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginTop: '0.25rem',
                fontSize: '0.75rem',
                color: `rgb(var(--text-secondary))`
              }}>
                <span>4 weeks</span>
                <span>8 weeks</span>
                <span>12 weeks</span>
              </div>
            </div>
            
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: `rgb(var(--primary))`,
              marginBottom: '1rem'
            }}>
              Workout Days
            </h3>
            
            {days.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ 
                  fontSize: '1rem', 
                  fontWeight: '500', 
                  color: `rgb(var(--text-primary))`,
                  marginBottom: '0.5rem'
                }}>
                  Added Days:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {days.map((day) => (
                    <div 
                      key={day.id}
                      style={{ 
                        padding: '0.75rem', 
                        backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : '#f0f7ff', 
                        borderRadius: '0.375rem',
                        border: `1px solid rgb(var(--primary-light))`
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{ fontWeight: '500', color: `rgb(var(--primary))` }}>
                          {day.name}
                        </span>
                        <button
                          onClick={() => setDays(days.filter(d => d.id !== day.id))}
                          style={{ 
                            padding: '0.25rem',
                            backgroundColor: 'transparent',
                            color: '#dc2626',
                            borderRadius: '0.375rem',
                            border: '1px solid #dc2626',
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: `rgb(var(--text-primary))` }}>
                        {day.exercises.length} exercises
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div style={{ 
              backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : '#f0f7ff', 
              padding: '1rem', 
              borderRadius: '0.375rem',
              border: `1px solid rgb(var(--primary-light))`,
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ 
                fontSize: '1rem', 
                fontWeight: '500', 
                color: `rgb(var(--primary))`,
                marginBottom: '1rem'
              }}>
                Add a Workout Day
              </h4>
              
              <div style={{ marginBottom: '1rem' }}>
                <label 
                  htmlFor="dayName" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: `rgb(var(--text-primary))`
                  }}
                >
                  Day Name
                </label>
                <input
                  id="dayName"
                  type="text"
                  value={currentDay.name}
                  onChange={(e) => setCurrentDay({...currentDay, name: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem', 
                    borderRadius: '0.375rem',
                    border: `1px solid rgb(var(--card-border))`,
                    backgroundColor: `rgb(var(--background-rgb))`,
                    color: `rgb(var(--text-primary))`
                  }}
                  placeholder="e.g., Push Day, Pull Day, Leg Day"
                />
              </div>
              
              <h5 style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: `rgb(var(--text-primary))`,
                marginBottom: '0.5rem'
              }}>
                Exercises for this day:
              </h5>
              
              {currentDay.exercises.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {currentDay.exercises.map((exercise) => (
                      <div 
                        key={exercise.id}
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          padding: '0.5rem', 
                          backgroundColor: `rgb(var(--card-bg))`, 
                          borderRadius: '0.375rem',
                          border: `1px solid rgb(var(--card-border))`
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: '500', color: `rgb(var(--text-primary))` }}>
                            {exercise.name}
                          </span>
                          <span style={{ marginLeft: '0.5rem', color: `rgb(var(--text-secondary))` }}>
                            ({exercise.sets} sets × {exercise.reps} reps)
                          </span>
                        </div>
                        <button
                          onClick={() => setCurrentDay({
                            ...currentDay,
                            exercises: currentDay.exercises.filter(e => e.id !== exercise.id)
                          })}
                          style={{ 
                            padding: '0.25rem',
                            backgroundColor: 'transparent',
                            color: '#dc2626',
                            borderRadius: '0.375rem',
                            border: '1px solid #dc2626',
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div style={{ marginBottom: '1rem' }}>
                <label 
                  htmlFor="exerciseName" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: `rgb(var(--text-primary))`
                  }}
                >
                  Exercise Name
                </label>
                {isCustomExercise ? (
                  <input
                    id="exerciseName"
                    type="text"
                    value={currentExercise.name}
                    onChange={handleExerciseNameChange}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      borderRadius: '0.375rem',
                      border: `1px solid rgb(var(--card-border))`,
                      backgroundColor: `rgb(var(--background-rgb))`,
                      color: `rgb(var(--text-primary))`
                    }}
                    placeholder="Enter custom exercise name"
                  />
                ) : (
                  <select
                    id="exerciseName"
                    value={currentExercise.name || 'Custom Exercise'}
                    onChange={handleExerciseNameChange}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      borderRadius: '0.375rem',
                      border: `1px solid rgb(var(--card-border))`,
                      backgroundColor: `rgb(var(--background-rgb))`,
                      color: `rgb(var(--text-primary))`
                    }}
                  >
                    <option value="Custom Exercise">Custom Exercise</option>
                    {COMMON_EXERCISES.map((exercise) => (
                      <option key={exercise} value={exercise}>
                        {exercise}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <label 
                    htmlFor="sets" 
                    style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: `rgb(var(--text-primary))`
                    }}
                  >
                    Sets
                  </label>
                  <input
                    id="sets"
                    type="number"
                    min="1"
                    value={currentExercise.sets}
                    onChange={(e) => setCurrentExercise({...currentExercise, sets: parseInt(e.target.value) || 0})}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      borderRadius: '0.375rem',
                      border: `1px solid rgb(var(--card-border))`,
                      backgroundColor: `rgb(var(--background-rgb))`,
                      color: `rgb(var(--text-primary))`
                    }}
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="reps" 
                    style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: `rgb(var(--text-primary))`
                    }}
                  >
                    Reps
                  </label>
                  <input
                    id="reps"
                    type="number"
                    min="1"
                    value={currentExercise.reps}
                    onChange={(e) => setCurrentExercise({...currentExercise, reps: parseInt(e.target.value) || 0})}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      borderRadius: '0.375rem',
                      border: `1px solid rgb(var(--card-border))`,
                      backgroundColor: `rgb(var(--background-rgb))`,
                      color: `rgb(var(--text-primary))`
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label 
                  htmlFor="exerciseNotes" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: `rgb(var(--text-primary))`
                  }}
                >
                  Notes (optional)
                </label>
                <input
                  id="exerciseNotes"
                  type="text"
                  value={currentExercise.notes}
                  onChange={(e) => setCurrentExercise({...currentExercise, notes: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem', 
                    borderRadius: '0.375rem',
                    border: `1px solid rgb(var(--card-border))`,
                    backgroundColor: `rgb(var(--background-rgb))`,
                    color: `rgb(var(--text-primary))`
                  }}
                  placeholder="e.g., Rest 90 seconds between sets"
                />
              </div>
              
              <button 
                onClick={handleAddExercise}
                style={{ 
                  padding: '0.5rem 1rem', 
                  backgroundColor: `rgb(var(--primary))`, 
                  color: 'white', 
                  borderRadius: '0.375rem', 
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  marginRight: '0.5rem'
                }}
              >
                Add Exercise
              </button>
              
              <button 
                onClick={handleAddDay}
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
                Add Day
              </button>
            </div>
            
            <button 
              onClick={handleSaveProgram}
              style={{ 
                padding: '0.75rem 1.5rem', 
                backgroundColor: `rgb(var(--primary))`, 
                color: 'white', 
                borderRadius: '0.375rem', 
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Save Program
            </button>
          </div>
        )}

        {programs.length === 0 ? (
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
              You haven&apos;t created any workout programs yet.
            </p>
            <button 
              onClick={() => setShowForm(true)}
              style={{ 
                display: 'inline-block',
                padding: '0.5rem 1rem', 
                backgroundColor: `rgb(var(--primary))`, 
                color: 'white', 
                borderRadius: '0.375rem', 
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Create Your First Program
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {programs.map((program) => (
              <div 
                key={program.id} 
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
                    {program.name}
                  </h2>
                  <button
                    onClick={() => handleDeleteProgram(program.id)}
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
                    aria-label="Delete program"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '1.25rem', height: '1.25rem' }} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <p style={{ 
                  color: `rgb(var(--text-primary))`, 
                  marginBottom: '1rem' 
                }}>
                  {program.description || 'No description provided.'}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1rem',
                  fontSize: '0.875rem',
                  color: `rgb(var(--text-secondary))`
                }}>
                  <span>Created: {formatDate(program.createdAt)}</span>
                  <span>{program.weeks.length} weeks • {program.weeks[0].days.length} workout days</span>
                </div>
                
                {selectedProgram === program.id ? (
                  <div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '1rem',
                      padding: '0.5rem',
                      backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : '#f0f7ff',
                      borderRadius: '0.375rem',
                      border: `1px solid rgb(var(--primary-light))`
                    }}>
                      <button
                        onClick={handlePrevWeek}
                        disabled={currentWeek === 1}
                        style={{ 
                          padding: '0.5rem',
                          backgroundColor: currentWeek === 1 ? 'transparent' : `rgb(var(--primary))`,
                          color: currentWeek === 1 ? `rgb(var(--text-secondary))` : 'white',
                          borderRadius: '0.375rem',
                          border: currentWeek === 1 ? `1px solid rgb(var(--card-border))` : 'none',
                          cursor: currentWeek === 1 ? 'default' : 'pointer',
                          opacity: currentWeek === 1 ? 0.5 : 1
                        }}
                      >
                        Previous Week
                      </button>
                      
                      <span style={{ 
                        fontWeight: '500',
                        color: `rgb(var(--primary))`
                      }}>
                        Week {currentWeek} of {program.weeks.length}
                      </span>
                      
                      <button
                        onClick={() => handleNextWeek(program.weeks.length)}
                        disabled={currentWeek === program.weeks.length}
                        style={{ 
                          padding: '0.5rem',
                          backgroundColor: currentWeek === program.weeks.length ? 'transparent' : `rgb(var(--primary))`,
                          color: currentWeek === program.weeks.length ? `rgb(var(--text-secondary))` : 'white',
                          borderRadius: '0.375rem',
                          border: currentWeek === program.weeks.length ? `1px solid rgb(var(--card-border))` : 'none',
                          cursor: currentWeek === program.weeks.length ? 'default' : 'pointer',
                          opacity: currentWeek === program.weeks.length ? 0.5 : 1
                        }}
                      >
                        Next Week
                      </button>
                    </div>
                    
                    <div style={{ 
                      backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : '#f0f7ff', 
                      padding: '1rem', 
                      borderRadius: '0.375rem',
                      border: `1px solid rgb(var(--primary-light))`
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem'
                      }}>
                        <h3 style={{ 
                          fontSize: '1.25rem', 
                          fontWeight: '500', 
                          color: `rgb(var(--primary))`
                        }}>
                          Week {currentWeek}
                        </h3>
                        
                        <button
                          onClick={handleSaveWeights}
                          disabled={!hasUnsavedChanges}
                          style={{ 
                            padding: '0.5rem 1rem',
                            backgroundColor: hasUnsavedChanges ? `rgb(var(--primary))` : 'transparent',
                            color: hasUnsavedChanges ? 'white' : `rgb(var(--text-secondary))`,
                            borderRadius: '0.375rem',
                            border: hasUnsavedChanges ? 'none' : `1px solid rgb(var(--card-border))`,
                            cursor: hasUnsavedChanges ? 'pointer' : 'default',
                            opacity: hasUnsavedChanges ? 1 : 0.5
                          }}
                        >
                          Save Weights
                        </button>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {program.weeks[currentWeek - 1].days.map((day) => (
                          <div 
                            key={day.id} 
                            style={{ 
                              backgroundColor: `rgb(var(--card-bg))`, 
                              padding: '0.75rem', 
                              borderRadius: '0.375rem',
                              border: `1px solid rgb(var(--card-border))`
                            }}
                          >
                            <h4 style={{ 
                              fontSize: '1rem', 
                              fontWeight: '500', 
                              color: `rgb(var(--primary))`, 
                              marginBottom: '0.5rem' 
                            }}>
                              {day.name}
                            </h4>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              {day.exercises.map((exercise) => (
                                <div 
                                  key={exercise.id} 
                                  style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    padding: '0.5rem', 
                                    backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.05)' : '#f8fafc', 
                                    borderRadius: '0.375rem',
                                    border: `1px solid rgb(var(--card-border))`
                                  }}
                                >
                                  <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    marginBottom: '0.5rem'
                                  }}>
                                    <span style={{ fontWeight: '500', color: `rgb(var(--text-primary))` }}>
                                      {exercise.name}
                                    </span>
                                    <span style={{ color: `rgb(var(--text-secondary))` }}>
                                      {exercise.sets} sets × {exercise.reps} reps
                                    </span>
                                  </div>
                                  
                                  <div style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    gap: '0.5rem',
                                    marginTop: '0.5rem'
                                  }}>
                                    {Array.from({ length: exercise.sets }).map((_, index) => (
                                      <div 
                                        key={index}
                                        style={{ 
                                          display: 'flex', 
                                          gap: '0.5rem',
                                          alignItems: 'center'
                                        }}
                                      >
                                        <span style={{ 
                                          fontSize: '0.875rem', 
                                          color: `rgb(var(--text-secondary))`,
                                          minWidth: '3rem'
                                        }}>
                                          Set {index + 1}:
                                        </span>
                                        <input
                                          type="number"
                                          placeholder="Weight"
                                          value={weightInputs[exercise.id]?.[index] || ''}
                                          onChange={(e) => handleWeightChange(exercise.id, index, e.target.value)}
                                          style={{ 
                                            width: '5rem', 
                                            padding: '0.25rem 0.5rem', 
                                            borderRadius: '0.25rem',
                                            border: `1px solid rgb(var(--card-border))`,
                                            backgroundColor: `rgb(var(--background-rgb))`,
                                            color: `rgb(var(--text-primary))`,
                                            fontSize: '0.875rem'
                                          }}
                                        />
                                        <span style={{ 
                                          fontSize: '0.875rem', 
                                          color: `rgb(var(--text-secondary))`,
                                          marginLeft: '0.5rem'
                                        }}>
                                          lbs
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                  
                                  {exercise.notes && (
                                    <div style={{ 
                                      fontSize: '0.875rem', 
                                      color: `rgb(var(--text-secondary))`,
                                      marginTop: '0.5rem',
                                      fontStyle: 'italic'
                                    }}>
                                      Note: {exercise.notes}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                      onClick={() => handleProgramSelect(program.id)}
                      style={{ 
                        padding: '0.75rem 1rem', 
                        backgroundColor: `rgb(var(--primary))`, 
                        color: 'white', 
                        borderRadius: '0.375rem', 
                        fontWeight: '500',
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'center'
                      }}
                    >
                      View Program
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 