import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/middleware';
import { getUserById } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Get fresh user data from database
    const user = await getUserById(authUser.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}