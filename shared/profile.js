(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AuraProfile = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var PALETTES = {
    sage: {
      bg: '#EAF0E6',
      surface: '#F3F7F0',
      text: '#26352A',
      accent: '#3F6445',
      border: '#A9BFA9',
    },
    amber: {
      bg: '#F6E7CF',
      surface: '#FBF1E0',
      text: '#3A2E1C',
      accent: '#8A5A14',
      border: '#D9BF94',
    },
    forest: {
      bg: '#1E2B23',
      surface: '#26362C',
      text: '#E2EBDD',
      accent: '#8FB996',
      border: '#3E5646',
    },
  };

  var PRESETS = {
    gentle: {
      version: 1,
      name: 'Gentle',
      palette: 'sage',
      font: 'atkinson',
      fontScale: 1.1,
      letterSpacing: 0.03,
      lineHeight: 1.7,
      maxWidthCh: 65,
      dimPercent: 0,
      warmTint: false,
      hideDistractions: true,
      videoFreeze: true,
      revealDelayMs: 2000,
      steadyBorder: true,
    },
    lowLight: {
      version: 1,
      name: 'Low Light',
      palette: 'forest',
      font: 'atkinson',
      fontScale: 1.1,
      letterSpacing: 0.03,
      lineHeight: 1.7,
      maxWidthCh: 65,
      dimPercent: 10,
      warmTint: false,
      hideDistractions: true,
      videoFreeze: true,
      revealDelayMs: 2000,
      steadyBorder: true,
    },
    maxCalm: {
      version: 1,
      name: 'Max Calm',
      palette: 'amber',
      font: 'atkinson',
      fontScale: 1.3,
      letterSpacing: 0.06,
      lineHeight: 1.9,
      maxWidthCh: 60,
      dimPercent: 5,
      warmTint: true,
      hideDistractions: true,
      videoFreeze: true,
      revealDelayMs: 2500,
      steadyBorder: true,
    },
  };

  function defaultProfile() {
    return Object.assign({}, PRESETS.gentle, { name: 'My profile' });
  }

  function clamp(val, min, max, fallback) {
    var num = typeof val === 'number' && !isNaN(val) ? val : fallback;
    return Math.min(Math.max(num, min), max);
  }

  function validateProfile(input) {
    var def = defaultProfile();
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      return def;
    }

    var validPalettes = ['auto', 'sage', 'amber', 'forest'];
    var validFonts = ['atkinson', 'lexend', 'system'];

    var name = typeof input.name === 'string' && input.name.trim() ? input.name.trim() : def.name;
    var palette = typeof input.palette === 'string' && validPalettes.indexOf(input.palette) !== -1 ? input.palette : def.palette;
    var font = typeof input.font === 'string' && validFonts.indexOf(input.font) !== -1 ? input.font : def.font;

    var fontScale = clamp(Number(input.fontScale), 1.0, 1.6, def.fontScale);
    fontScale = Math.round(fontScale * 100) / 100;

    var letterSpacing = clamp(Number(input.letterSpacing), 0, 0.12, def.letterSpacing);
    letterSpacing = Math.round(letterSpacing * 100) / 100;

    var lineHeight = clamp(Number(input.lineHeight), 1.5, 2.2, def.lineHeight);
    lineHeight = Math.round(lineHeight * 100) / 100;

    var maxWidthCh = clamp(Number(input.maxWidthCh), 50, 80, def.maxWidthCh);
    maxWidthCh = Math.round(maxWidthCh);

    var dimPercent = clamp(Number(input.dimPercent), 0, 30, def.dimPercent);
    dimPercent = Math.round(dimPercent);

    var revealDelayMs = clamp(Number(input.revealDelayMs), 1000, 4000, def.revealDelayMs);
    revealDelayMs = Math.round(revealDelayMs);

    var warmTint = typeof input.warmTint !== 'undefined' ? Boolean(input.warmTint) : def.warmTint;
    var hideDistractions = typeof input.hideDistractions !== 'undefined' ? Boolean(input.hideDistractions) : def.hideDistractions;
    var videoFreeze = typeof input.videoFreeze !== 'undefined' ? Boolean(input.videoFreeze) : def.videoFreeze;
    var steadyBorder = typeof input.steadyBorder !== 'undefined' ? Boolean(input.steadyBorder) : def.steadyBorder;

    return {
      version: 1,
      name: name,
      palette: palette,
      font: font,
      fontScale: fontScale,
      letterSpacing: letterSpacing,
      lineHeight: lineHeight,
      maxWidthCh: maxWidthCh,
      dimPercent: dimPercent,
      warmTint: warmTint,
      hideDistractions: hideDistractions,
      videoFreeze: videoFreeze,
      revealDelayMs: revealDelayMs,
      steadyBorder: steadyBorder,
    };
  }

  function resolvePalette(profile, hour) {
    var p = (profile && profile.palette) || 'sage';
    var name;
    if (p === 'auto') {
      var h = typeof hour === 'number' ? hour : new Date().getHours();
      if (h >= 6 && h <= 16) {
        name = 'sage';
      } else if (h >= 17 && h <= 20) {
        name = 'amber';
      } else {
        name = 'forest';
      }
    } else if (PALETTES[p]) {
      name = p;
    } else {
      name = 'sage';
    }
    return {
      name: name,
      tokens: PALETTES[name],
    };
  }

  var fontStack = {
    atkinson: "var(--font-atkinson, 'Atkinson Hyperlegible'), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    lexend: "var(--font-lexend, 'Lexend'), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    system: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  };

  function buildReaderCss(profile, hour, scopeSelector) {
    var p = validateProfile(profile);
    var scope = scopeSelector || '.aura-reader';
    var resolved = resolvePalette(p, hour);
    var tokens = resolved.tokens;
    var font = fontStack[p.font] || fontStack.atkinson;

    var borderRule = p.steadyBorder
      ? '  border: 2px solid var(--ag-border);\n  border-radius: 12px;\n  padding: 2rem;'
      : '  padding: 1rem;';

    var dimRule = '';
    if (p.dimPercent > 0) {
      var dimAlpha = (p.dimPercent / 100).toFixed(2);
      dimRule = [
        '',
        scope + '::before {',
        '  content: "";',
        '  position: absolute;',
        '  inset: 0;',
        '  background-color: rgba(0, 0, 0, ' + dimAlpha + ');',
        '  pointer-events: none;',
        '  border-radius: inherit;',
        '  z-index: 1;',
        '}',
      ].join('\n');
    }

    var lines = [
      scope + ' {',
      '  --ag-bg: ' + tokens.bg + ';',
      '  --ag-surface: ' + tokens.surface + ';',
      '  --ag-text: ' + tokens.text + ';',
      '  --ag-accent: ' + tokens.accent + ';',
      '  --ag-border: ' + tokens.border + ';',
      '  position: relative;',
      '  background-color: var(--ag-bg);',
      '  color: var(--ag-text);',
      '  font-family: ' + font + ';',
      '  font-size: ' + p.fontScale + 'rem;',
      '  letter-spacing: ' + p.letterSpacing + 'em;',
      '  line-height: ' + p.lineHeight + ';',
      '  max-width: ' + p.maxWidthCh + 'ch;',
      '  margin-left: auto;',
      '  margin-right: auto;',
      borderRule,
      '}',
      '',
      scope + ' * {',
      '  animation: none !important;',
      '  transition: none !important;',
      '}',
      '',
      scope + ' h1, ' + scope + ' h2, ' + scope + ' h3, ' + scope + ' h4, ' + scope + ' h5, ' + scope + ' h6 {',
      '  color: var(--ag-text);',
      '  font-family: ' + font + ';',
      '  font-weight: 700;',
      '  line-height: 1.3;',
      '  margin-top: 1.5em;',
      '  margin-bottom: 0.5em;',
      '}',
      '',
      scope + ' a {',
      '  color: var(--ag-accent);',
      '  text-decoration: underline;',
      '}',
      '',
      scope + ' img {',
      '  max-width: 100%;',
      '  height: auto;',
      '  border-radius: 8px;',
      '}',
      '',
      scope + ' blockquote {',
      '  border-left: 4px solid var(--ag-border);',
      '  padding-left: 1rem;',
      '  margin: 1.5rem 0;',
      '  color: var(--ag-text);',
      '  background: var(--ag-surface);',
      '  border-radius: 0 8px 8px 0;',
      '}',
      '',
      scope + ' code, ' + scope + ' pre {',
      '  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;',
      '  background: var(--ag-surface);',
      '  color: var(--ag-text);',
      '  border-radius: 4px;',
      '}',
    ];

    if (dimRule) {
      lines.push(dimRule);
    }

    return lines.join('\n');
  }

  function buildOverlayCss(profile, hour) {
    var p = validateProfile(profile);
    var css = [];

    if (p.warmTint) {
      css.push(
        '#aura-tint {',
        '  position: fixed;',
        '  inset: 0;',
        '  pointer-events: none;',
        '  z-index: 2147483647;',
        '  background-color: rgba(255, 170, 60, 0.12);',
        '  mix-blend-mode: multiply;',
        '}'
      );
    }

    if (p.dimPercent > 0) {
      var alpha = (p.dimPercent / 100).toFixed(2);
      css.push(
        '#aura-dim {',
        '  position: fixed;',
        '  inset: 0;',
        '  pointer-events: none;',
        '  z-index: 2147483647;',
        '  background-color: rgba(0, 0, 0, ' + alpha + ');',
        '}'
      );
    }

    return css.join('\n');
  }

  function parseHex(hex) {
    if (typeof hex !== 'string') return [0, 0, 0];
    var clean = hex.replace('#', '').trim();
    if (clean.length === 3) {
      clean = clean.split('').map(function (c) { return c + c; }).join('');
    }
    var num = parseInt(clean, 16);
    if (isNaN(num)) return [0, 0, 0];
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  function relativeLuminance(hex) {
    var rgb = parseHex(hex);
    var lum = rgb.map(function (c) {
      var s = c / 255;
      return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
  }

  function contrastRatio(hexA, hexB) {
    var l1 = relativeLuminance(hexA);
    var l2 = relativeLuminance(hexB);
    var lighter = Math.max(l1, l2);
    var darker = Math.min(l1, l2);
    var ratio = (lighter + 0.05) / (darker + 0.05);
    return Math.round(ratio * 100) / 100;
  }

  function toBase64(str) {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(str, 'utf8').toString('base64');
    } else if (typeof btoa === 'function') {
      return btoa(unescape(encodeURIComponent(str)));
    }
    throw new Error('No base64 encoder available');
  }

  function fromBase64(b64) {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(b64, 'base64').toString('utf8');
    } else if (typeof atob === 'function') {
      return decodeURIComponent(escape(atob(b64)));
    }
    throw new Error('No base64 decoder available');
  }

  function encodeProfile(profile) {
    var validated = validateProfile(profile);
    var json = JSON.stringify(validated);
    var base64 = toBase64(json);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function decodeProfile(str) {
    if (typeof str !== 'string' || !str.trim()) {
      return null;
    }
    try {
      var b64 = str.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4 !== 0) {
        b64 += '=';
      }
      if (!/^[A-Za-z0-9+/=]+$/.test(b64)) {
        return null;
      }
      var json = fromBase64(b64);
      var parsed = JSON.parse(json);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return null;
      }
      return validateProfile(parsed);
    } catch (e) {
      return null;
    }
  }

  return {
    PALETTES: PALETTES,
    PRESETS: PRESETS,
    defaultProfile: defaultProfile,
    validateProfile: validateProfile,
    resolvePalette: resolvePalette,
    buildReaderCss: buildReaderCss,
    buildOverlayCss: buildOverlayCss,
    contrastRatio: contrastRatio,
    encodeProfile: encodeProfile,
    decodeProfile: decodeProfile,
  };
});
