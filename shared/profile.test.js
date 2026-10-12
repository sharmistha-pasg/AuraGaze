const test = require('node:test');
const assert = require('node:assert');
const AuraProfile = require('./profile.js');

const {
  PALETTES,
  PRESETS,
  defaultProfile,
  validateProfile,
  resolvePalette,
  buildReaderCss,
  buildOverlayCss,
  contrastRatio,
  encodeProfile,
  decodeProfile,
} = AuraProfile;

test('1. validateProfile clamps out-of-range values and drops unknown keys', () => {
  const input = {
    unknownKey: 'should be removed',
    anotherJunk: 12345,
    fontScale: 999, // max 1.6
    letterSpacing: -5, // min 0
    lineHeight: 0.2, // min 1.5
    maxWidthCh: 200, // max 80
    dimPercent: 50, // max 30
    revealDelayMs: 9999, // max 4000
    palette: 'invalid-palette',
    font: 'unknown-font',
  };

  const validated = validateProfile(input);

  assert.strictEqual(validated.unknownKey, undefined);
  assert.strictEqual(validated.anotherJunk, undefined);
  assert.strictEqual(validated.fontScale, 1.6);
  assert.strictEqual(validated.letterSpacing, 0);
  assert.strictEqual(validated.lineHeight, 1.5);
  assert.strictEqual(validated.maxWidthCh, 80);
  assert.strictEqual(validated.dimPercent, 30);
  assert.strictEqual(validated.revealDelayMs, 4000);
  assert.strictEqual(validated.palette, 'sage');
  assert.strictEqual(validated.font, 'atkinson');
});

test('2. validateProfile(null), validateProfile("x"), validateProfile(42) all return a full valid profile', () => {
  const fromNull = validateProfile(null);
  const fromString = validateProfile('x');
  const fromNum = validateProfile(42);
  const def = defaultProfile();

  assert.deepStrictEqual(fromNull, def);
  assert.deepStrictEqual(fromString, def);
  assert.deepStrictEqual(fromNum, def);
});

test('3. resolvePalette with palette "auto" returns sage at hour 6 and 16, amber at 17 and 20, forest at 21 and 5', () => {
  const autoProf = { palette: 'auto' };

  assert.strictEqual(resolvePalette(autoProf, 6).name, 'sage');
  assert.strictEqual(resolvePalette(autoProf, 16).name, 'sage');
  assert.strictEqual(resolvePalette(autoProf, 17).name, 'amber');
  assert.strictEqual(resolvePalette(autoProf, 20).name, 'amber');
  assert.strictEqual(resolvePalette(autoProf, 21).name, 'forest');
  assert.strictEqual(resolvePalette(autoProf, 5).name, 'forest');
});

test('4. encodeProfile then decodeProfile round-trips, and decodeProfile("not base64 !!") returns null', () => {
  const original = defaultProfile();
  original.name = 'Test User';
  original.dimPercent = 15;
  original.warmTint = true;

  const encoded = encodeProfile(original);
  assert.strictEqual(typeof encoded, 'string');
  assert.ok(encoded.length > 0);

  const decoded = decodeProfile(encoded);
  assert.deepStrictEqual(decoded, original);

  assert.strictEqual(decodeProfile('not base64 !!'), null);
  assert.strictEqual(decodeProfile(''), null);
  assert.strictEqual(decodeProfile(null), null);
});

test('5. For each palette: contrastRatio(text, bg) >= 4.5, contrastRatio(accent, bg) >= 4.5, contrastRatio(text, surface) >= 4.5', () => {
  for (const [name, p] of Object.entries(PALETTES)) {
    const textBg = contrastRatio(p.text, p.bg);
    const accentBg = contrastRatio(p.accent, p.bg);
    const textSurface = contrastRatio(p.text, p.surface);

    assert.ok(
      textBg >= 4.5,
      `Palette ${name} text/bg contrast ${textBg} should be >= 4.5`
    );
    assert.ok(
      accentBg >= 4.5,
      `Palette ${name} accent/bg contrast ${accentBg} should be >= 4.5`
    );
    assert.ok(
      textSurface >= 4.5,
      `Palette ${name} text/surface contrast ${textSurface} should be >= 4.5`
    );
  }
});

test('6. buildReaderCss output never contains the word "animation" without "none" and never contains "@keyframes"', () => {
  const profile = defaultProfile();
  const css = buildReaderCss(profile, 12, '.reader-container');

  assert.ok(!css.includes('@keyframes'), 'CSS must not contain @keyframes');

  const animationMatches = css.match(/animation[^;}]*/g) || [];
  for (const match of animationMatches) {
    assert.ok(
      match.includes('none'),
      `Every animation declaration must specify none, found: ${match}`
    );
  }
});

test('7. buildOverlayCss emits aura-tint only when warmTint is true, and aura-dim only when dimPercent > 0', () => {
  const profNoTintNoDim = { warmTint: false, dimPercent: 0 };
  const cssNone = buildOverlayCss(profNoTintNoDim);
  assert.ok(!cssNone.includes('#aura-tint'));
  assert.ok(!cssNone.includes('#aura-dim'));

  const profTintOnly = { warmTint: true, dimPercent: 0 };
  const cssTint = buildOverlayCss(profTintOnly);
  assert.ok(cssTint.includes('#aura-tint'));
  assert.ok(!cssTint.includes('#aura-dim'));

  const profDimOnly = { warmTint: false, dimPercent: 15 };
  const cssDim = buildOverlayCss(profDimOnly);
  assert.ok(!cssDim.includes('#aura-tint'));
  assert.ok(cssDim.includes('#aura-dim'));

  const profBoth = { warmTint: true, dimPercent: 20 };
  const cssBoth = buildOverlayCss(profBoth);
  assert.ok(cssBoth.includes('#aura-tint'));
  assert.ok(cssBoth.includes('#aura-dim'));
});
