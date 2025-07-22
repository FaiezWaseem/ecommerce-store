import { NextRequest } from 'next/server';
import { verifyToken, AuthUser } from './auth';

export function getAuthUser(request: NextRequest): AuthUser | null {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return null;
  }
  
  return verifyToken(token);
}

export function requireAuth(request: NextRequest): AuthUser {
  const user = getAuthUser(request);
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

export function requireRole(request: NextRequest, allowedRoles: string[]): AuthUser {
  const user = requireAuth(request);
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Insufficient permissions');
  }
  
  return user;
}