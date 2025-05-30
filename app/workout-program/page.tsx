'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  notes: string;
  weights: number[];
  completed?: boolean;
  completedDate?: string;
}

interface WorkoutDay {
  id: string;
  name: string;
  exercises: Exercise[];
}

interface Week {
  id: string;
  days: WorkoutDay[];
}

interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  weeks: Week[];
  currentWeek: number;
}

export default function WorkoutProgramPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme } = useTheme();
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
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
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [completedDates, setCompletedDates] = useState<Record<string, string>>({});

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (status === 'authenticated') {
      const savedPrograms = localStorage.getItem('workoutPrograms');
      if (savedPrograms) {
        setPrograms(JSON.parse(savedPrograms));
      }
      setLoading(false);
    }
  }, [status, router]);

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
    if (!programName.trim()) {
      setMessage('Please enter a program name');
      return;
    }

    const days: WorkoutDay[] = [];
    for (let i = 0; i < programWeeks; i++) {
      days.push({
        id: crypto.randomUUID(),
        name: `Day ${i + 1}`,
        exercises: []
      });
    }

    const weeks: Week[] = [];
    for (let i = 0; i < programWeeks; i++) {
      weeks.push({
        id: crypto.randomUUID(),
        days: days.map(day => ({
          ...day,
          id: crypto.randomUUID()
        }))
      });
    }

    const newProgram: WorkoutProgram = {
      id: crypto.randomUUID(),
      name: programName,
      description: programDescription,
      weeks: weeks,
      currentWeek: 1
    };

    setPrograms([...programs, newProgram]);
    setProgramName('');
    setProgramDescription('');
    setProgramWeeks(4);
    setDays([]);
    setShowForm(false);
    setMessage('Program created successfully!');
  };

  const handleDeleteProgram = (id: string) => {
    if (!confirm('Are you sure you want to delete this program? This action cannot be undone.')) {
      return;
    }
    
    const updatedPrograms = programs.filter(program => program.id !== id);
    setPrograms(updatedPrograms);
    localStorage.setItem('workoutPrograms', JSON.stringify(updatedPrograms));
    setMessage('Program deleted successfully');
    
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
    setCurrentWeek(1);
    
    const program = programs.find(p => p.id === programId);
    if (program) {
      const initialWeightInputs: Record<string, number[]> = {};
      
      program.weeks.forEach(week => {
        week.days.forEach(day => {
          day.exercises.forEach(exercise => {
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
    
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleExerciseComplete = async (exerciseId: string) => {
    const now = new Date().toISOString();
    setCompletedExercises(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
    setCompletedDates(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId] ? now : ''
    }));
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
        <div style={{ color: `rgb(var(--primary))`, fontSize: '1.25rem' }}>Loading...</div>
      </main>
    );
  }

  return (
    <main style={{ 
      minHeight: '100vh', 
      padding: '2rem',
      backgroundColor: `rgb(var(--background-rgb))`
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '600',
            color: `rgb(var(--text-primary))`
          }}>
            Workout Programs
          </h1>
          
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ 
              padding: '0.75rem 1.5rem', 
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
            backgroundColor: `rgb(var(--success-light))`, 
            color: `rgb(var(--success))`,
            borderRadius: '0.375rem',
            marginBottom: '1rem'
          }}>
            {message}
          </div>
        )}

        {showForm ? (
          <div style={{ 
            backgroundColor: `rgb(var(--card-bg))`, 
            padding: '2rem', 
            borderRadius: '0.5rem',
            border: `1px solid rgb(var(--card-border))`
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '500',
              color: `rgb(var(--text-primary))`,
              marginBottom: '1.5rem'
            }}>
              Create New Program
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
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
                    padding: '0.75rem', 
                    borderRadius: '0.375rem',
                    border: `1px solid rgb(var(--card-border))`,
                    backgroundColor: `rgb(var(--background-rgb))`,
                    color: `rgb(var(--text-primary))`
                  }}
                  placeholder="e.g., Upper Body Strength"
                />
              </div>

              <div>
                <label 
                  htmlFor="programDescription" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: `rgb(var(--text-primary))`
                  }}
                >
                  Description (optional)
                </label>
                <textarea
                  id="programDescription"
                  value={programDescription}
                  onChange={(e) => setProgramDescription(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    borderRadius: '0.375rem',
                    border: `1px solid rgb(var(--card-border))`,
                    backgroundColor: `rgb(var(--background-rgb))`,
                    color: `rgb(var(--text-primary))`,
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                  placeholder="Describe your program..."
                />
              </div>

              <div>
                <label 
                  htmlFor="programWeeks" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: `rgb(var(--text-primary))`
                  }}
                >
                  Number of Weeks
                </label>
                <input
                  id="programWeeks"
                  type="number"
                  min="1"
                  max="52"
                  value={programWeeks}
                  onChange={(e) => setProgramWeeks(parseInt(e.target.value))}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    borderRadius: '0.375rem',
                    border: `1px solid rgb(var(--card-border))`,
                    backgroundColor: `rgb(var(--background-rgb))`,
                    color: `rgb(var(--text-primary))`
                  }}
                />
              </div>

              <div style={{ 
                backgroundColor: `rgb(var(--card-bg))`, 
                padding: '1.5rem', 
                borderRadius: '0.5rem',
                border: `1px solid rgb(var(--card-border))`
              }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '500',
                  color: `rgb(var(--text-primary))`,
                  marginBottom: '1rem'
                }}>
                  Add Workout Days
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {days.map((day, index) => (
                    <div 
                      key={day.id}
                      style={{ 
                        backgroundColor: `rgb(var(--background-rgb))`, 
                        padding: '1rem', 
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
                        <h4 style={{ 
                          fontSize: '1rem', 
                          fontWeight: '500',
                          color: `rgb(var(--text-primary))`
                        }}>
                          {day.name}
                        </h4>
                        <button
                          onClick={() => setDays(days.filter((_, i) => i !== index))}
                          style={{ 
                            padding: '0.25rem',
                            backgroundColor: 'transparent',
                            color: '#dc2626',
                            borderRadius: '0.375rem',
                            border: '1px solid #dc2626',
                            cursor: 'pointer'
                          }}
                        >
                          Remove Day
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {day.exercises.map((exercise) => (
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
                  ))}

                  <div style={{ 
                    backgroundColor: `rgb(var(--background-rgb))`, 
                    padding: '1rem', 
                    borderRadius: '0.375rem',
                    border: `1px solid rgb(var(--card-border))`
                  }}>
                    <h4 style={{ 
                      fontSize: '1rem', 
                      fontWeight: '500',
                      color: `rgb(var(--text-primary))`,
                      marginBottom: '1rem'
                    }}>
                      Add New Day
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
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
                          onChange={(e) => setCurrentDay({ ...currentDay, name: e.target.value })}
                          style={{ 
                            width: '100%', 
                            padding: '0.75rem', 
                            borderRadius: '0.375rem',
                            border: `1px solid rgb(var(--card-border))`,
                            backgroundColor: `rgb(var(--card-bg))`,
                            color: `rgb(var(--text-primary))`
                          }}
                          placeholder="e.g., Push Day"
                        />
                      </div>

                      <div>
                        <label 
                          htmlFor="exerciseName" 
                          style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem',
                            fontWeight: '500',
                            color: `rgb(var(--text-primary))`
                          }}
                        >
                          Exercise
                        </label>
                        {isCustomExercise ? (
                          <input
                            id="exerciseName"
                            type="text"
                            value={currentExercise.name}
                            onChange={(e) => setCurrentExercise({...currentExercise, name: e.target.value})}
                            style={{ 
                              width: '100%', 
                              padding: '0.75rem', 
                              borderRadius: '0.375rem',
                              border: `1px solid rgb(var(--card-border))`,
                              backgroundColor: `rgb(var(--card-bg))`,
                              color: `rgb(var(--text-primary))`
                            }}
                            placeholder="Enter exercise name"
                          />
                        ) : (
                          <select
                            id="exerciseName"
                            value={currentExercise.name}
                            onChange={handleExerciseNameChange}
                            style={{ 
                              width: '100%', 
                              padding: '0.75rem', 
                              borderRadius: '0.375rem',
                              border: `1px solid rgb(var(--card-border))`,
                              backgroundColor: `rgb(var(--card-bg))`,
                              color: `rgb(var(--text-primary))`
                            }}
                          >
                            <option value="">Select an exercise</option>
                            <option value="Custom Exercise">Custom Exercise</option>
                            {/* Add more exercise options here */}
                          </select>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
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
                            onChange={(e) => setCurrentExercise({...currentExercise, sets: parseInt(e.target.value)})}
                            style={{ 
                              width: '100%', 
                              padding: '0.75rem', 
                              borderRadius: '0.375rem',
                              border: `1px solid rgb(var(--card-border))`,
                              backgroundColor: `rgb(var(--card-bg))`,
                              color: `rgb(var(--text-primary))`
                            }}
                          />
                        </div>

                        <div style={{ flex: 1 }}>
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
                            onChange={(e) => setCurrentExercise({...currentExercise, reps: parseInt(e.target.value)})}
                            style={{ 
                              width: '100%', 
                              padding: '0.75rem', 
                              borderRadius: '0.375rem',
                              border: `1px solid rgb(var(--card-border))`,
                              backgroundColor: `rgb(var(--card-bg))`,
                              color: `rgb(var(--text-primary))`
                            }}
                          />
                        </div>
                      </div>

                      <div>
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
                            padding: '0.75rem', 
                            borderRadius: '0.375rem',
                            border: `1px solid rgb(var(--card-border))`,
                            backgroundColor: `rgb(var(--card-bg))`,
                            color: `rgb(var(--text-primary))`
                          }}
                          placeholder="e.g., Rest 90 seconds between sets"
                        />
                      </div>

                      <button 
                        onClick={handleAddExercise}
                        style={{ 
                          padding: '0.75rem', 
                          backgroundColor: `rgb(var(--primary))`, 
                          color: 'white', 
                          borderRadius: '0.375rem', 
                          fontWeight: '500',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Add Exercise
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={handleAddDay}
                    style={{ 
                      padding: '0.75rem', 
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
              </div>

              <button 
                onClick={handleSaveProgram}
                style={{ 
                  padding: '0.75rem', 
                  backgroundColor: `rgb(var(--primary))`, 
                  color: 'white', 
                  borderRadius: '0.375rem', 
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Save Program
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {programs.map((program) => (
              <div key={program.id} className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{program.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{program.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleProgramSelect(program.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteProgram(program.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {selectedProgram === program.id ? (
                  <div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '1rem'
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

                                  <button
                                    onClick={() => handleExerciseComplete(exercise.id)}
                                    style={{
                                      padding: '0.25rem 0.5rem',
                                      backgroundColor: completedExercises[exercise.id] 
                                        ? `rgb(var(--success))` 
                                        : `rgb(var(--primary))`,
                                      color: 'white',
                                      borderRadius: '0.25rem',
                                      border: 'none',
                                      cursor: 'pointer',
                                      marginTop: '0.5rem'
                                    }}
                                  >
                                    {completedExercises[exercise.id] ? 'Completed' : 'Complete'}
                                  </button>

                                  {completedExercises[exercise.id] && completedDates[exercise.id] && (
                                    <div style={{ 
                                      fontSize: '0.875rem',
                                      color: `rgb(var(--text-secondary))`,
                                      marginTop: '0.5rem'
                                    }}>
                                      Completed on {new Date(completedDates[exercise.id]).toLocaleDateString()}
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