import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get the first user from the database
    const user = await prisma.user.findFirst();
    
    if (!user) {
      return NextResponse.json(
        { error: 'No user found. Please create a user first.' },
        { status: 400 }
      );
    }

    // Find the workout to ensure it belongs to the user
    const workout = await prisma.workout.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!workout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    if (workout.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this workout' },
        { status: 403 }
      );
    }

    // Delete the workout (cascade will handle exercises and sets)
    await prisma.workout.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting workout:', error);
    return NextResponse.json(
      { error: 'Failed to delete workout', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 