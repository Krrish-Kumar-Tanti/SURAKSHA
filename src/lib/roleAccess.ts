export type AppScreen = 'home' | 'portfolio' | 'wizard' | 'provenance' | 'policy' | 'release' | 'audit' | 'admin';
export type CockpitTab = 'portfolio' | 'provenance' | 'calculator' | 'graph';

const roleScreens: Record<string, readonly AppScreen[]> = {
  INSTITUTION_USER: ['home', 'portfolio', 'wizard', 'provenance', 'policy', 'release'],
  DEALING_OFFICER: ['home', 'portfolio', 'provenance', 'policy', 'release'],
  DIRECTOR_RB: ['home', 'portfolio', 'provenance', 'release'],
  COMPETENT_AUTHORITY: ['home', 'portfolio', 'release', 'audit'],
  ACCOUNTS: ['home', 'release'],
  AUDITOR: ['home', 'portfolio', 'provenance', 'audit'],
  ADMIN: ['admin'],
};

const defaultScreens: Record<string, AppScreen> = {
  INSTITUTION_USER: 'wizard',
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
  DIRECTOR_RB: ['portfolio', 'provenance', 'graph'],
  COMPETENT_AUTHORITY: ['portfolio', 'graph'],
  ACCOUNTS: [],
  AUDITOR: ['portfolio', 'provenance'],
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
