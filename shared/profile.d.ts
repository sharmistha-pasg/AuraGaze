export type PaletteName = 'auto' | 'sage' | 'amber' | 'forest';
export type ConcretePaletteName = 'sage' | 'amber' | 'forest';
export type FontChoice = 'atkinson' | 'lexend' | 'system';

export interface PaletteTokens {
  bg: string;
  surface: string;
  text: string;
  accent: string;
  border: string;
}

export interface SensoryProfile {
  version: number;
  name: string;
  palette: PaletteName;
  font: FontChoice;
  fontScale: number;
  letterSpacing: number;
  lineHeight: number;
  maxWidthCh: number;
  dimPercent: number;
  warmTint: boolean;
  hideDistractions: boolean;
  videoFreeze: boolean;
  revealDelayMs: number;
  steadyBorder: boolean;
}

export interface ResolvedPalette {
  name: ConcretePaletteName;
  tokens: PaletteTokens;
}

export declare const PALETTES: Record<ConcretePaletteName, PaletteTokens>;
export declare const PRESETS: Record<'gentle' | 'lowLight' | 'maxCalm', SensoryProfile>;

export declare function defaultProfile(): SensoryProfile;
export declare function validateProfile(input: unknown): SensoryProfile;
export declare function resolvePalette(profile?: Partial<SensoryProfile> | null, hour?: number): ResolvedPalette;
export declare function buildReaderCss(profile?: Partial<SensoryProfile> | null, hour?: number, scopeSelector?: string): string;
export declare function buildOverlayCss(profile?: Partial<SensoryProfile> | null, hour?: number): string;
export declare function contrastRatio(hexA: string, hexB: string): number;
export declare function encodeProfile(profile?: Partial<SensoryProfile> | null): string;
export declare function decodeProfile(str?: string | null): SensoryProfile | null;

export interface AuraProfileModule {
  PALETTES: typeof PALETTES;
  PRESETS: typeof PRESETS;
  defaultProfile: typeof defaultProfile;
  validateProfile: typeof validateProfile;
  resolvePalette: typeof resolvePalette;
  buildReaderCss: typeof buildReaderCss;
  buildOverlayCss: typeof buildOverlayCss;
  contrastRatio: typeof contrastRatio;
  encodeProfile: typeof encodeProfile;
  decodeProfile: typeof decodeProfile;
}

declare const AuraProfile: AuraProfileModule;
export default AuraProfile;
