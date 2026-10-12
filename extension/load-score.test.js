const test = require('node:test');
const assert = require('node:assert');
const AuraLoad = require('./load-score.js');

test('AuraLoad.measure returns score 0 on null/empty doc without throwing', () => {
  const result = AuraLoad.measure(null, null);
  assert.strictEqual(result.score, 0);
  assert.deepStrictEqual(result.details, {});
});

test('AuraLoad.measure correctly counts and caps sensory signals', () => {
  const fakeDoc = {
    documentElement: { dataset: {} },
    getAnimations: () => [
      { effect: { getTiming: () => ({ iterations: Infinity }) } },
      { effect: { getTiming: () => ({ iterations: Infinity }) } },
      { effect: { getTiming: () => ({ iterations: Infinity }) } },
      { effect: { getTiming: () => ({ iterations: Infinity }) } },
      { effect: { getTiming: () => ({ iterations: Infinity }) } },
      { effect: { getTiming: () => ({ iterations: Infinity }) } }, // 6 infinite animations -> cap is 10
    ],
    querySelectorAll: (sel) => {
      if (sel.includes('id^="ad-"')) {
        return new Array(15).fill({}); // 15 hide items -> cap 10
      }
      if (sel.includes('video')) {
        return [{ paused: false }, { autoplay: true }, { paused: false }]; // 3 videos -> 3 * 4 = 12, cap 8
      }
      if (sel.includes('marquee')) {
        return [{}, {}]; // 2 marquees -> 2 * 3 = 6
      }
      if (sel.includes('doubleclick')) {
        return [{}, {}]; // 2 ad iframes -> 2
      }
      if (sel.includes('dialog')) {
        return [
          {
            getBoundingClientRect: () => ({ width: 500, height: 500 }), // area 250,000 > 0.25 * 500,000
          },
        ];
      }
      return [];
    },
  };

  const fakeWin = {
    innerWidth: 1000,
    innerHeight: 500,
    getComputedStyle: () => ({ display: 'block' }),
  };

  const res = AuraLoad.measure(fakeDoc, fakeWin);

  assert.strictEqual(res.details.animPoints, 10);
  assert.strictEqual(res.details.videoPoints, 8);
  assert.strictEqual(res.details.hidePoints, 10);
  assert.strictEqual(res.details.overlayPoints, 5);
  assert.strictEqual(res.details.marqueePoints, 6);
  assert.strictEqual(res.details.adIframePoints, 2);

  // Total: 10 + 8 + 10 + 5 + 6 + 2 = 41
  assert.strictEqual(res.score, 41);
  assert.strictEqual(fakeDoc.documentElement.dataset.auraLoadScore, '41');
});
