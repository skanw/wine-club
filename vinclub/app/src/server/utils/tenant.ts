import { type User } from 'wasp/entities';
import type { Prisma } from '@prisma/client';
import { HttpError } from 'wasp/server';

/**
 * Extract caveId from authenticated user
 * @param user - Authenticated user object
 * @returns caveId string or null if user has no cave
 */
export function getUserCaveId(user: User | null | undefined): string | null {
  if (!user) {
    return null;
  }
  return user.caveId || null;
}

/**
 * Ensure user has access to a resource belonging to a specific cave
 * Throws error if user doesn't have access
 * @param user - Authenticated user object
 * @param resourceCaveId - Cave ID of the resource being accessed
 * @throws Error if user doesn't have access
 */
export function ensureCaveAccess(
  user: User | null | undefined,
  resourceCaveId: string | null | undefined
): void {
  if (!user) {
    throw new HttpError(401, 'Seuls les utilisateurs authentifiés peuvent effectuer cette opération');
  }

  const userCaveId = getUserCaveId(user);
  
  if (!userCaveId) {
    throw new HttpError(403, 'L\'utilisateur doit appartenir à une cave');
  }

  if (!resourceCaveId) {
    throw new HttpError(403, 'La ressource doit appartenir à une cave');
  }

  if (userCaveId !== resourceCaveId) {
    throw new HttpError(403, 'Accès refusé : vous n\'avez pas accès à cette ressource');
  }
}

/**
 * Check if user has required role for an operation
 * @param user - Authenticated user object
 * @param requiredRoles - Array of roles that can perform the operation
 * @returns true if user has required role
 */
export function hasRequiredRole(
  user: User | null | undefined,
  requiredRoles: string[]
): boolean {
  if (!user) {
    return false;
  }

  return requiredRoles.includes(user.role);
}

/**
 * Ensure user has required role for an operation
 * Throws error if user doesn't have required role
 * @param user - Authenticated user object
 * @param requiredRoles - Array of roles that can perform the operation
 * @throws Error if user doesn't have required role
 */
export function ensureRequiredRole(
  user: User | null | undefined,
  requiredRoles: string[]
): void {
  if (!hasRequiredRole(user, requiredRoles)) {
    throw new HttpError(
      403,
      `Accès refusé : rôle requis ${requiredRoles.join(', ')}`
    );
  }
}

/**
 * Require authenticated user with a cave
 * This helper reduces code duplication by combining common authorization checks
 * @param context - Wasp operation context (any context with user property)
 * @returns The caveId of the authenticated user
 * @throws HttpError if user is not authenticated or has no cave
 */
export function requireAuthenticatedCave(context: { user?: User | null | undefined }): string {
  if (!context.user) {
    throw new HttpError(401, 'Seuls les utilisateurs authentifiés peuvent effectuer cette opération');
  }
  
  const caveId = getUserCaveId(context.user);
  if (!caveId) {
    throw new HttpError(403, 'L\'utilisateur doit appartenir à une cave');
  }
  
  return caveId;
}

