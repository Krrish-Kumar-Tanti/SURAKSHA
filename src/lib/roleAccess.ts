export type AppScreen = 'home' | 'portfolio' | 'wizard' | 'provenance' | 'policy' | 'release' | 'audit' | 'admin';
export type CockpitTab = 'portfolio' | 'provenance' | 'calculator' | 'graph';

const roleScreens: Record<string, readonly AppScreen[]> = {
  INSTITUTION_USER: ['home', 'portfolio', 'wizard', 'provenance', 'policy', 'release'],
  DEALING_OFFICER: ['home', 'portfolio', 'provenance', 'policy', 'release', 'audit'],
  DIRECTOR_RB: ['home', 'portfolio', 'provenance', 'policy', 'release', 'audit'],
  COMPETENT_AUTHORITY: ['home', 'portfolio', 'provenance', 'policy', 'release', 'audit'],
  ACCOUNTS: ['home', 'release', 'audit'],
  AUDITOR: ['home', 'portfolio', 'provenance', 'policy', 'release', 'audit'],
  ADMIN: ['admin', 'home', 'portfolio', 'audit'],
};

const defaultScreens: Record<string, AppScreen> = {
  INSTITUTION_USER: 'portfolio',
  DEALING_OFFICER: 'portfolio',
  DIRECTOR_RB: 'portfolio',
  COMPETENT_AUTHORITY: 'release',
  ACCOUNTS: 'release',
  AUDITOR: 'audit',
  ADMIN: 'admin',
};

const cockpitTabs: Record<string, readonly CockpitTab[]> = {
  INSTITUTION_USER: ['portfolio', 'provenance', 'calculator', 'graph'],
  DEALING_OFFICER: ['portfolio', 'provenance', 'calculator', 'graph'],
  DIRECTOR_RB: ['portfolio', 'provenance', 'calculator', 'graph'],
  COMPETENT_AUTHORITY: ['portfolio', 'provenance', 'calculator', 'graph'],
  ACCOUNTS: ['graph'],
  AUDITOR: ['portfolio', 'provenance', 'calculator', 'graph'],
  ADMIN: [],
};

export function isScreenAllowed(role: string, screen: string): screen is AppScreen {
  return roleScreens[role]?.includes(screen as AppScreen) ?? false;
}

export function getDefaultScreen(role: string): AppScreen {
  return defaultScreens[role] ?? 'home';
}

export function getCockpitTabs(role: string): readonly CockpitTab[] {
  return cockpitTabs[role] ?? [];
}

export function canResolveDiscrepancies(role: string): boolean {
  return role === 'DIRECTOR_RB';
}

export function canSetReleaseClearances(role: string): boolean {
  return role === 'DEALING_OFFICER' || role === 'DIRECTOR_RB';
}

export function canIssueReleaseSanction(role: string): boolean {
  return role === 'COMPETENT_AUTHORITY';
}
