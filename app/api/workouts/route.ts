import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, type, notes, exercises } = body;

    // Get the first user from the database
    const user = await prisma.user.findFirst();
    
    if (!user) {
      return NextResponse.json(
        { error: 'No user found. Please create a user first.' },
        { status: 400 }
      );
    }

    // Create the workout with nested exercises and sets
    const workout = await prisma.workout.create({
      data: {
        date: new Date(date),
        type,
        notes,
        userId: user.id,
        exercises: {
          create: exercises.map((exercise: any) => ({
            name: exercise.exerciseName,
            sets: {
              create: [{
                reps: exercise.reps,
                weight: exercise.weight,
                notes: exercise.notes
              }]
            }
          }))
        }
      },
      include: {
        exercises: {
          include: {
            sets: true
          }
        }
      }
    });

    return NextResponse.json(workout);
  } catch (error) {
    console.error('Error saving workout:', error);
    return NextResponse.json(
      { error: 'Failed to save workout', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get the first user from the database
    const user = await prisma.user.findFirst();
    
    if (!user) {
      return NextResponse.json(
        { error: 'No user found. Please create a user first.' },
        { status: 400 }
      );
    }

    const workouts = await prisma.workout.findMany({
      where: {
        userId: user.id
      },
      include: {
        exercises: {
          include: {
            sets: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workouts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 