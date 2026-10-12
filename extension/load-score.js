/**
 * AuraGaze Sensory Load Score (Manifest V3)
 * Computes sensory load based strictly on page structure and elements.
 * Privacy-first: no behavioral telemetry, runs entirely in-memory within the tab.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AuraLoad = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var HIDE_SELECTORS = [
    '[id^="ad-"]',
    '[class^="ad-"]',
    '[class*=" ad-"]',
    '[class*="advert" i]',
    '[id*="advert" i]',
    '[class*="ad-slot" i]',
    '[class*="ad-banner" i]',
    'ins.adsbygoogle',
    'iframe[src*="doubleclick"]',
    'iframe[src*="googlesyndication"]',
    '#newsletter-popup',
    '[class*="newsletter-popup" i]',
    '[class*="subscribe-modal" i]',
    '.ticker',
  ];

  var OVERLAY_SELECTORS = [
    '[role="dialog"]',
    '[aria-modal="true"]',
    '#newsletter-popup',
    '[class*="newsletter-popup" i]',
    '[class*="subscribe-modal" i]',
  ];

  function measure(doc, win) {
    try {
      if (!doc) {
        return { score: 0, details: {} };
      }
      win = win || (doc.defaultView || (typeof window !== 'undefined' ? window : {}));

      // 1. Infinite CSS Animations (2 pts each, cap 10)
      var animCount = 0;
      try {
        if (typeof doc.getAnimations === 'function') {
          var anims = doc.getAnimations();
          if (anims && anims.length) {
            for (var i = 0; i < anims.length; i++) {
              var a = anims[i];
              if (a && a.effect && typeof a.effect.getTiming === 'function') {
                var timing = a.effect.getTiming();
                if (timing && timing.iterations === Infinity) {
                  animCount++;
                }
              }
            }
          }
        }
      } catch (e) {}

      // 2. Playing or Autoplay Videos (4 pts each, cap 8)
      var videoCount = 0;
      try {
        var videos = doc.querySelectorAll('video');
        for (var v = 0; v < videos.length; v++) {
          var vid = videos[v];
          if (vid && (!vid.paused || vid.hasAttribute('autoplay') || vid.autoplay)) {
            videoCount++;
          }
        }
      } catch (e) {}

      // 3. Elements matching Hide-List selectors (1 pt each, cap 10)
      var hideCount = 0;
      try {
        var hideElements = doc.querySelectorAll(HIDE_SELECTORS.join(','));
        hideCount = hideElements ? hideElements.length : 0;
      } catch (e) {}

      // 4. Overlays / Dialogs > 25% viewport area (5 pts each, cap 10)
      // Limit check to at most 50 elements to avoid excessive getComputedStyle calls
      var overlayCount = 0;
      try {
        var candidates = doc.querySelectorAll(OVERLAY_SELECTORS.join(','));
        var limit = Math.min(candidates ? candidates.length : 0, 50);
        var vpArea = (win.innerWidth || 1024) * (win.innerHeight || 768);

        for (var o = 0; o < limit; o++) {
          var el = candidates[o];
          if (el && typeof el.getBoundingClientRect === 'function') {
            var rect = el.getBoundingClientRect();
            var area = rect.width * rect.height;
            if (area > 0.25 * vpArea) {
              var display = 'block';
              if (typeof win.getComputedStyle === 'function') {
                var cs = win.getComputedStyle(el);
                if (cs && cs.display) display = cs.display;
              }
              if (display !== 'none') {
                overlayCount++;
              }
            }
          }
        }
      } catch (e) {}

      // 5. Marquee Elements (3 pts each, cap 6)
      var marqueeCount = 0;
      try {
        var marquees = doc.querySelectorAll('marquee');
        marqueeCount = marquees ? marquees.length : 0;
      } catch (e) {}

      // 6. Ad Iframes with DoubleClick or GoogleSyndication (1 pt each, cap 5)
      var adIframeCount = 0;
      try {
        var adIframes = doc.querySelectorAll('iframe[src*="doubleclick"], iframe[src*="googlesyndication"]');
        adIframeCount = adIframes ? adIframes.length : 0;
      } catch (e) {}

      // Calculate capped points
      var animPoints = Math.min(10, animCount * 2);
      var videoPoints = Math.min(8, videoCount * 4);
      var hidePoints = Math.min(10, hideCount * 1);
      var overlayPoints = Math.min(10, overlayCount * 5);
      var marqueePoints = Math.min(6, marqueeCount * 3);
      var adIframePoints = Math.min(5, adIframeCount * 1);

      var totalScore = animPoints + videoPoints + hidePoints + overlayPoints + marqueePoints + adIframePoints;

      // Update data attribute on root HTML element for easy DevTools inspection
      try {
        if (doc.documentElement) {
          if (doc.documentElement.dataset) {
            doc.documentElement.dataset.auraLoadScore = String(totalScore);
          } else {
            doc.documentElement.setAttribute('data-aura-load-score', String(totalScore));
          }
        }
      } catch (e) {}

      return {
        score: totalScore,
        details: {
          animations: animCount,
          videos: videoCount,
          hideList: hideCount,
          overlays: overlayCount,
          marquees: marqueeCount,
          adIframes: adIframeCount,
          animPoints: animPoints,
          videoPoints: videoPoints,
          hidePoints: hidePoints,
          overlayPoints: overlayPoints,
          marqueePoints: marqueePoints,
          adIframePoints: adIframePoints,
        },
      };
    } catch (err) {
      return { score: 0, details: {} };
    }
  }

  return {
    HIDE_SELECTORS: HIDE_SELECTORS,
    OVERLAY_SELECTORS: OVERLAY_SELECTORS,
    measure: measure,
  };
});
