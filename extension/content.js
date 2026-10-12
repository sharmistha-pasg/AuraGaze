/**
 * AuraGaze Content Script (Manifest V3)
 * Runs in all frames at document_start.
 */
(function () {
  'use strict';

  var STYLE_ID = 'aura-style';
  var TINT_ID = 'aura-tint';
  var DIM_ID = 'aura-dim';
  var HINT_ID = 'aura-reveal-hint';
  var READER_STYLE_ID = 'aura-reader-style';

  var currentProfile = null;
  var isEnabled = true;
  var isReaderActive = false;
  var originalBodyNode = null;
  var revealTimers = new WeakMap();
  var videoObserver = null;

  var Aura = typeof globalThis.AuraProfile !== 'undefined' ? globalThis.AuraProfile : null;

  function safeProfile(p) {
    if (Aura && typeof Aura.validateProfile === 'function') {
      return Aura.validateProfile(p);
    }
    return p;
  }

  // --- 1. Overlay & Style Injection ---
  function applyStyles() {
    try {
      if (!isEnabled || !currentProfile) {
        removeStyles();
        return;
      }

      var hour = new Date().getHours();
      var resolved = Aura ? Aura.resolvePalette(currentProfile, hour) : { name: 'sage', tokens: { accent: '#3F6445', bg: '#EAF0E6' } };
      var accent = resolved.tokens.accent;

      var styleEl = document.getElementById(STYLE_ID);
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = STYLE_ID;
        (document.head || document.documentElement).appendChild(styleEl);
      }

      var rules = [];

      // Motion kill rule
      rules.push(
        '*, *::before, *::after {',
        '  animation: none !important;',
        '  transition: none !important;',
        '  scroll-behavior: auto !important;',
        '}',
        'marquee {',
        '  display: none !important;',
        '}'
      );

      // Video freeze styles
      rules.push(
        '.aura-frozen {',
        '  filter: grayscale(1) brightness(0.85) !important;',
        '}',
        '.aura-frozen.aura-pending-reveal {',
        '  outline: 3px dashed ' + accent + ' !important;',
        '  outline-offset: 2px !important;',
        '}'
      );

      // Overlay styles (top frame only)
      if (window === window.top) {
        if (currentProfile.warmTint) {
          rules.push(
            '#' + TINT_ID + ' {',
            '  position: fixed;',
            '  inset: 0;',
            '  pointer-events: none;',
            '  z-index: 2147483647;',
            '  background-color: rgba(255, 170, 60, 0.12);',
            '  mix-blend-mode: multiply;',
            '}'
          );
        }
        if (currentProfile.dimPercent > 0) {
          var alpha = (currentProfile.dimPercent / 100).toFixed(2);
          rules.push(
            '#' + DIM_ID + ' {',
            '  position: fixed;',
            '  inset: 0;',
            '  pointer-events: none;',
            '  z-index: 2147483647;',
            '  background-color: rgba(0, 0, 0, ' + alpha + ');',
            '}'
          );
        }
      }

      // Hide distractions (conservative selector list)
      if (currentProfile.hideDistractions) {
        var selectors = [
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
        rules.push(selectors.join(',\n') + ' { display: none !important; }');
      }

      styleEl.textContent = rules.join('\n');

      // Manage Tint & Dim DOM Elements (top frame only)
      if (window === window.top) {
        updateOverlayElements();
      }
    } catch (e) {
      // Never throw
    }
  }

  function updateOverlayElements() {
    try {
      // Warm tint element
      var tintEl = document.getElementById(TINT_ID);
      if (isEnabled && currentProfile && currentProfile.warmTint) {
        if (!tintEl && document.documentElement) {
          tintEl = document.createElement('div');
          tintEl.id = TINT_ID;
          document.documentElement.appendChild(tintEl);
        }
      } else if (tintEl) {
        tintEl.remove();
      }

      // Dim element
      var dimEl = document.getElementById(DIM_ID);
      if (isEnabled && currentProfile && currentProfile.dimPercent > 0) {
        if (!dimEl && document.documentElement) {
          dimEl = document.createElement('div');
          dimEl.id = DIM_ID;
          document.documentElement.appendChild(dimEl);
        }
      } else if (dimEl) {
        dimEl.remove();
      }
    } catch (e) {}
  }

  function removeStyles() {
    try {
      var styleEl = document.getElementById(STYLE_ID);
      if (styleEl) styleEl.remove();

      var tintEl = document.getElementById(TINT_ID);
      if (tintEl) tintEl.remove();

      var dimEl = document.getElementById(DIM_ID);
      if (dimEl) dimEl.remove();

      removeRevealHint();
      unfreezeAllVideos();
    } catch (e) {}
  }

  // --- 2. Video Freeze & Hover/Focus Reveal ---
  function showRevealHint(x, y) {
    try {
      var hint = document.getElementById(HINT_ID);
      if (!hint) {
        hint = document.createElement('div');
        hint.id = HINT_ID;
        hint.style.cssText =
          'position: fixed; z-index: 2147483647; background: #26352A; color: #E2EBDD; ' +
          'padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; ' +
          'pointer-events: none; border: 1px solid #A9BFA9; font-family: sans-serif;';
        hint.textContent = 'Keep hovering to reveal';
        document.body ? document.body.appendChild(hint) : document.documentElement.appendChild(hint);
      }
      hint.style.left = Math.min(x + 12, window.innerWidth - 160) + 'px';
      hint.style.top = Math.min(y + 12, window.innerHeight - 30) + 'px';
    } catch (e) {}
  }

  function removeRevealHint() {
    var hint = document.getElementById(HINT_ID);
    if (hint) hint.remove();
  }

  function freezeVideo(video) {
    try {
      if (!video || video.dataset.auraRevealed === '1') return;

      video.pause();
      video.autoplay = false;
      video.removeAttribute('autoplay');
      video.muted = true;
      video.classList.add('aura-frozen');
      video.dataset.auraFrozen = '1';

      if (!video.hasAttribute('tabindex')) {
        video.setAttribute('tabindex', '0');
      }

      var delaySec = currentProfile ? (currentProfile.revealDelayMs / 1000).toFixed(1) : '2.0';
      video.setAttribute(
        'aria-label',
        'Video paused for sensory safety. Hold hover or focus for ' + delaySec + ' seconds to reveal.'
      );

      // Capture-phase play blocker
      if (!video._auraPlayHooked) {
        video._auraPlayHooked = true;
        video.addEventListener(
          'play',
          function () {
            if (video.dataset.auraFrozen === '1' && video.dataset.auraRevealed !== '1') {
              video.pause();
            }
          },
          true
        );
      }

      // Pointer & Focus listeners
      if (!video._auraListenersHooked) {
        video._auraListenersHooked = true;

        var startRevealTimer = function (e) {
          if (!isEnabled || !currentProfile || !currentProfile.videoFreeze) return;
          if (video.dataset.auraRevealed === '1') return;

          video.classList.add('aura-pending-reveal');
          if (e && e.clientX) {
            showRevealHint(e.clientX, e.clientY);
          }

          var timer = setTimeout(function () {
            video.classList.remove('aura-frozen');
            video.classList.remove('aura-pending-reveal');
            video.dataset.auraRevealed = '1';
            video.removeAttribute('aria-label');
            removeRevealHint();
            video.pause(); // Left paused as required
          }, currentProfile.revealDelayMs || 2000);

          revealTimers.set(video, timer);
        };

        var cancelRevealTimer = function () {
          var timer = revealTimers.get(video);
          if (timer) {
            clearTimeout(timer);
            revealTimers.delete(video);
          }
          video.classList.remove('aura-pending-reveal');
          removeRevealHint();
        };

        video.addEventListener('pointerenter', startRevealTimer);
        video.addEventListener('pointermove', function (e) {
          if (video.classList.contains('aura-pending-reveal')) {
            showRevealHint(e.clientX, e.clientY);
          }
        });
        video.addEventListener('pointerleave', cancelRevealTimer);
        video.addEventListener('focus', startRevealTimer);
        video.addEventListener('blur', cancelRevealTimer);
      }
    } catch (e) {}
  }

  function freezeAllVideos() {
    try {
      if (!isEnabled || !currentProfile || !currentProfile.videoFreeze) return;
      var videos = document.querySelectorAll('video');
      for (var i = 0; i < videos.length; i++) {
        freezeVideo(videos[i]);
      }
    } catch (e) {}
  }

  function unfreezeAllVideos() {
    try {
      var videos = document.querySelectorAll('video');
      for (var i = 0; i < videos.length; i++) {
        var v = videos[i];
        v.classList.remove('aura-frozen', 'aura-pending-reveal');
        delete v.dataset.auraFrozen;
        delete v.dataset.auraRevealed;
      }
    } catch (e) {}
  }

  function setupVideoObserver() {
    if (videoObserver) return;
    try {
      videoObserver = new MutationObserver(function (mutations) {
        if (!isEnabled || !currentProfile || !currentProfile.videoFreeze) return;
        for (var i = 0; i < mutations.length; i++) {
          var added = mutations[i].addedNodes;
          for (var j = 0; j < added.length; j++) {
            var node = added[j];
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.tagName === 'VIDEO') {
                freezeVideo(node);
              } else if (node.querySelectorAll) {
                var innerVideos = node.querySelectorAll('video');
                for (var k = 0; k < innerVideos.length; k++) {
                  freezeVideo(innerVideos[k]);
                }
              }
            }
          }
        }
      });
      videoObserver.observe(document.documentElement || document, {
        childList: true,
        subtree: true,
      });
    } catch (e) {}
  }

  // --- 3. In-Extension Reader View (Top Frame Only) ---
  function toggleReaderView() {
    if (window !== window.top) return;

    if (isReaderActive) {
      // Restore original page
      if (originalBodyNode) {
        document.body.replaceWith(originalBodyNode);
        originalBodyNode = null;
      }
      var rStyle = document.getElementById(READER_STYLE_ID);
      if (rStyle) rStyle.remove();
      document.body.style.backgroundColor = '';
      isReaderActive = false;
      return;
    }

    // Activate reader view
    try {
      if (typeof globalThis.Readability === 'undefined') {
        alert('AuraGaze Readability is not available.');
        return;
      }

      var clone = document.cloneNode(true);
      var reader = new globalThis.Readability(clone);
      var article = reader.parse();

      if (!article || !article.content || article.textContent.trim().length < 150) {
        showTemporaryNotice('No article found on this page.');
        return;
      }

      // Sanitize article HTML using DOMParser
      var parser = new DOMParser();
      var doc = parser.parseFromString(article.content, 'text/html');

      // Strip unwanted tags
      var forbidden = doc.querySelectorAll('script, style, iframe, object, embed, form');
      forbidden.forEach(function (el) { el.remove(); });

      // Strip on* and style attributes
      var allEls = doc.querySelectorAll('*');
      allEls.forEach(function (el) {
        el.removeAttribute('style');
        var attrs = Array.from(el.attributes);
        attrs.forEach(function (attr) {
          if (attr.name.startsWith('on')) {
            el.removeAttribute(attr.name);
          }
        });
      });

      // Neutralize videos and audio
      var medias = doc.querySelectorAll('video, audio');
      medias.forEach(function (el) {
        var placeholder = doc.createElement('div');
        placeholder.style.cssText =
          'padding: 12px; margin: 16px 0; border: 1px dashed var(--ag-border); ' +
          'background: var(--ag-surface); text-align: center; font-size: 13px; font-weight: bold;';
        placeholder.textContent = 'Video removed for sensory safety.';
        el.replaceWith(placeholder);
      });

      // Save original body
      originalBodyNode = document.body.cloneNode(true);

      // Inject Reader CSS
      var hour = new Date().getHours();
      var readerCss = Aura ? Aura.buildReaderCss(currentProfile, hour, '.aura-reader') : '';
      var rStyle = document.getElementById(READER_STYLE_ID);
      if (!rStyle) {
        rStyle = document.createElement('style');
        rStyle.id = READER_STYLE_ID;
        (document.head || document.documentElement).appendChild(rStyle);
      }
      rStyle.textContent = readerCss;

      var resolved = Aura ? Aura.resolvePalette(currentProfile, hour) : { tokens: { bg: '#EAF0E6' } };
      document.body.style.backgroundColor = resolved.tokens.bg;

      // Construct clean reader DOM
      var container = document.createElement('div');
      container.className = 'aura-reader';

      var topBar = document.createElement('div');
      topBar.style.cssText = 'display: flex; justify-content: flex-end; margin-bottom: 24px;';
      var backBtn = document.createElement('button');
      backBtn.textContent = 'Show original page';
      backBtn.style.cssText =
        'padding: 8px 16px; border: 1px solid var(--ag-border); background: var(--ag-surface); ' +
        'color: var(--ag-text); font-weight: bold; border-radius: 6px; cursor: pointer;';
      backBtn.onclick = toggleReaderView;
      topBar.appendChild(backBtn);
      container.appendChild(topBar);

      var titleEl = document.createElement('h1');
      titleEl.textContent = article.title;
      container.appendChild(titleEl);

      if (article.byline) {
        var bylineEl = document.createElement('div');
        bylineEl.textContent = article.byline;
        bylineEl.style.cssText = 'opacity: 0.85; margin-bottom: 20px; font-size: 0.9em;';
        container.appendChild(bylineEl);
      }

      var contentEl = document.createElement('div');
      contentEl.innerHTML = doc.body.innerHTML;
      container.appendChild(contentEl);

      document.body.innerHTML = '';
      document.body.appendChild(container);

      isReaderActive = true;
    } catch (e) {
      showTemporaryNotice('Error rendering reader mode.');
    }
  }

  function showTemporaryNotice(text) {
    try {
      var notice = document.createElement('div');
      notice.style.cssText =
        'position: fixed; top: 16px; right: 16px; z-index: 2147483647; background: #26352A; ' +
        'color: #ffffff; padding: 10px 16px; border-radius: 8px; font-family: sans-serif; ' +
        'font-size: 13px; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.3);';
      notice.textContent = text;
      document.body.appendChild(notice);
      setTimeout(function () { notice.remove(); }, 3500);
    } catch (e) {}
  }

  // --- 4. Listeners & Initialization ---
  function init() {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.get(['aura.profile', 'aura.enabled'], function (items) {
          isEnabled = items['aura.enabled'] !== false;
          currentProfile = safeProfile(items['aura.profile']);
          applyStyles();
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', freezeAllVideos);
          } else {
            freezeAllVideos();
          }
          setupVideoObserver();
        });

        chrome.storage.onChanged.addListener(function (changes, area) {
          if (area === 'sync') {
            if (changes['aura.enabled']) {
              isEnabled = changes['aura.enabled'].newValue !== false;
            }
            if (changes['aura.profile']) {
              currentProfile = safeProfile(changes['aura.profile'].newValue);
            }
            applyStyles();
            if (isEnabled && currentProfile && currentProfile.videoFreeze) {
              freezeAllVideos();
            } else {
              unfreezeAllVideos();
            }
          }
        });
      }

      // Message listener for popup actions
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
        chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
          if (msg && msg.type === 'aura-reader-toggle') {
            toggleReaderView();
            sendResponse({ ok: true });
          }
        });
      }

      // Re-evaluate on tab visibility change
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden && isEnabled) {
          applyStyles();
        }
      });
    } catch (e) {}
  }

  init();
})();
