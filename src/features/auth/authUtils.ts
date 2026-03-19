import { User } from '../../types';

export function getUserRoleName(user: User | null | undefined) {
  return user?.role?.name?.toUpperCase() || '';
}

export function getDefaultRouteForUser(user: User | null | undefined) {
  const roleName = getUserRoleName(user);

  if (roleName === 'ADMIN') {
    return '/admin/dashboard';
  }

  if (roleName === 'CASHIER') {
    return '/cashier';
  }

  return '/login';
}
