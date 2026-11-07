// Role helpers for public.users.
//
// A user can hold several roles at once (public.users.roles text[]). The
// legacy single `role` column mirrors roles[1] via the
// users_sync_role_from_roles trigger. Read roles through these helpers so an
// empty `roles` array (a row written only through the legacy `role` column)
// falls back to `role` instead of silently meaning "no role".

export type AppRole = "student" | "company";

export type UserRoleRow = {
  role?: string | null;
  roles?: string[] | null;
} | null | undefined;

const isAppRole = (value: unknown): value is AppRole =>
  value === "student" || value === "company";

export function rolesOf(row: UserRoleRow): AppRole[] {
  const fromArray = Array.isArray(row?.roles) ? row.roles : [];
  const list = fromArray.length > 0 ? fromArray : row?.role ? [row.role] : [];
  return list.filter(isAppRole);
}

export function hasRole(row: UserRoleRow, role: AppRole): boolean {
  return rolesOf(row).includes(role);
}
