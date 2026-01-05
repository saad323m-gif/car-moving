// roles.js

export const ROLE_DEVELOPER = "developer";
export const ROLE_ADMIN = "admin";
export const ROLE_SUPERVISOR = "supervisor";
export const ROLE_MEMBER = "member";

export const ROLE_LABELS = {
  [ROLE_DEVELOPER]: "مطور النظام",
  [ROLE_ADMIN]: "مدير",
  [ROLE_SUPERVISOR]: "مشرف",
  [ROLE_MEMBER]: "عضو"
};

export const ROLE_CLASS = {
  [ROLE_DEVELOPER]: "role-dev",
  [ROLE_ADMIN]: "role-admin",
  [ROLE_SUPERVISOR]: "role-supervisor",
  [ROLE_MEMBER]: "role-member"
};

// ترتيب القوة
export function canManageUsers(role) {
  return [ROLE_DEVELOPER, ROLE_ADMIN].includes(role);
}

export function canManageFleet(role) {
  return [ROLE_DEVELOPER, ROLE_ADMIN, ROLE_SUPERVISOR].includes(role);
}

export function canSeeStats(role) {
  return [ROLE_DEVELOPER, ROLE_ADMIN, ROLE_SUPERVISOR].includes(role);
}

export function canSeeAllMovements(role) {
  return [ROLE_DEVELOPER, ROLE_ADMIN, ROLE_SUPERVISOR].includes(role);
}

export function canSeeAllCustody(role) {
  return [ROLE_DEVELOPER, ROLE_ADMIN, ROLE_SUPERVISOR].includes(role);
}

export function canAddMovementForOthers(role) {
  return [ROLE_DEVELOPER, ROLE_ADMIN, ROLE_SUPERVISOR].includes(role);
}
