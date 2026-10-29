/**
 * Shared clearance & provenance state for SURAKSHA Control Tower
 * Persists across role switching so if Dealing Officer or Director marks a node RED,
 * Competent Authority accurately sees it as RED and cannot execute NOC until cleared!
 */

export interface ClearanceState {
  pgrcCleared: boolean;
  vigilanceCleared: boolean;
  grantsCleared: boolean;
  termServed: boolean;
  courtInjunctionClear: boolean;
  sanctionIssued: boolean;
}

const DEFAULT_CLEARANCE_STATE: ClearanceState = {
  pgrcCleared: true,
  vigilanceCleared: true,
  grantsCleared: true,
  termServed: true,
  courtInjunctionClear: true,
  sanctionIssued: false,
};

const STORAGE_KEY_CLEARANCE = 'suraksha_clearance_state';
const STORAGE_KEY_WAIVER = 'suraksha_discrepancy_waiver';

export function getSharedClearances(): ClearanceState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_CLEARANCE);
    if (!raw) return { ...DEFAULT_CLEARANCE_STATE };
    return { ...DEFAULT_CLEARANCE_STATE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_CLEARANCE_STATE };
  }
}

export function saveSharedClearances(state: ClearanceState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY_CLEARANCE, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('suraksha_clearance_changed', { detail: state }));
  } catch {}
}

export function getSharedWaiver(): boolean {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_WAIVER);
    return raw === 'true';
  } catch {
    return false;
  }
}

export function saveSharedWaiver(waived: boolean): void {
  try {
    sessionStorage.setItem(STORAGE_KEY_WAIVER, waived ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent('suraksha_waiver_changed', { detail: waived }));
  } catch {}
}
