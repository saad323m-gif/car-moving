// roles.js
// ===============================
// تعريف الصلاحيات الأساسية للنظام
// ===============================

// أسماء الأدوار
export const ROLE_DEVELOPER = "developer";   // مطور النظام
export const ROLE_ADMIN = "admin";           // مدير
export const ROLE_SUPERVISOR = "supervisor"; // مشرف
export const ROLE_MEMBER = "member";         // عضو

// أسماء العرض
export const ROLE_LABELS = {
  [ROLE_DEVELOPER]: "مطور النظام",
  [ROLE_ADMIN]: "مدير",
  [ROLE_SUPERVISOR]: "مشرف",
  [ROLE_MEMBER]: "عضو"
};

// ألوان الشارات (CSS classes)
export const ROLE_CLASS = {
  [ROLE_DEVELOPER]: "role-dev",
  [ROLE_ADMIN]: "role-admin",
  [ROLE_SUPERVISOR]: "role-supervisor",
  [ROLE_MEMBER]: "role-member"
};

// ===============================
// صلاحيات النظام
// ===============================

// من يستطيع إدارة الأعضاء
export function canManageUsers(role) {
  return role === ROLE_DEVELOPER || role === ROLE_ADMIN;
}

// من يستطيع رؤية كل الحركات
export function canSeeAllMovements(role) {
  return (
    role === ROLE_DEVELOPER ||
    role === ROLE_ADMIN ||
    role === ROLE_SUPERVISOR
  );
}

// من يستطيع إضافة حركة لغيره
export function canAddMovementForOthers(role) {
  return (
    role === ROLE_DEVELOPER ||
    role === ROLE_ADMIN ||
    role === ROLE_SUPERVISOR
  );
}

// من يستطيع رؤية كل العهد
export function canSeeAllCustody(role) {
  return (
    role === ROLE_DEVELOPER ||
    role === ROLE_ADMIN ||
    role === ROLE_SUPERVISOR
  );
}

// من يستطيع إدارة الأسطول
export function canManageFleet(role) {
  return (
    role === ROLE_DEVELOPER ||
    role === ROLE_ADMIN ||
    role === ROLE_SUPERVISOR
  );
}

// من يستطيع رؤية الإحصائيات
export function canSeeStats(role) {
  return (
    role === ROLE_DEVELOPER ||
    role === ROLE_ADMIN ||
    role === ROLE_SUPERVISOR
  );
}
