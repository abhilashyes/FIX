import type {
  HierarchyConfig,
  HierarchyRole,
  LocalityId,
  ResponsibleChain,
  RoleId,
} from '@/types';

/** A role's jurisdiction covers a locality if it lists it, or covers everything (empty list). */
function covers(role: HierarchyRole, localityId: LocalityId): boolean {
  return role.jurisdiction.localityIds.length === 0
    ? true
    : role.jurisdiction.localityIds.includes(localityId);
}

/**
 * Build the ordered chain (most-local → apex CM) for one set of roles, filtered to the
 * roles whose jurisdiction covers the locality. Starts at the deepest covering role and
 * walks up via parentRoleId.
 */
function buildChain(roles: HierarchyRole[], localityId: LocalityId): HierarchyRole[] {
  const byId = new Map<RoleId, HierarchyRole>(roles.map((r) => [r.id, r]));
  const covering = roles.filter((r) => covers(r, localityId));
  if (covering.length === 0) return [];

  // Deepest (highest level) covering role is the local entry point.
  let current: HierarchyRole | undefined = covering.reduce((a, b) =>
    b.level > a.level ? b : a,
  );

  const chain: HierarchyRole[] = [];
  const seen = new Set<RoleId>();
  while (current && !seen.has(current.id)) {
    chain.push(current);
    seen.add(current.id);
    current = current.parentRoleId ? byId.get(current.parentRoleId) : undefined;
  }
  return chain;
}

/**
 * Resolve the responsible office-holders for a locality across both chains, plus a merged
 * escalation ladder (local → apex, interleaving administrative and elected by level).
 */
export function resolveResponsibleChain(
  hierarchy: HierarchyConfig,
  localityId: LocalityId,
): ResponsibleChain {
  const administrative = buildChain(hierarchy.administrativeRoles, localityId);
  const elected = buildChain(hierarchy.electedRoles, localityId);

  // Escalation ladder: order by descending level (most local first), CM last.
  const escalationLadder = [...administrative, ...elected]
    .filter((r, i, arr) => arr.findIndex((x) => x.id === r.id) === i)
    .sort((a, b) => b.level - a.level);

  return { administrative, elected, escalationLadder };
}
