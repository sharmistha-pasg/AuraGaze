(function () {
  'use strict';

  var Aura = typeof globalThis.AuraProfile !== 'undefined' ? globalThis.AuraProfile : null;
  var currentProfile = null;
  var currentMode = 'suggest'; // 'always' | 'suggest' | 'off'

  // DOM Elements
  var modeSelect = document.getElementById('mode-select');
  var activeTabScore = document.getElementById('active-tab-score');
  var forgetSitesBtn = document.getElementById('forget-sites-btn');
  var forgetSitesMsg = document.getElementById('forget-sites-msg');
  var readerBtn = document.getElementById('reader-toggle-btn');
  var readerMsg = document.getElementById('reader-msg');

  var btnGentle = document.getElementById('btn-gentle');
  var btnLowLight = document.getElementById('btn-lowlight');
  var btnMaxCalm = document.getElementById('btn-maxcalm');

  var paletteSelect = document.getElementById('palette-select');
  var fontScaleSlider = document.getElementById('font-scale-slider');
  var fontScaleVal = document.getElementById('font-scale-val');
  var dimSlider = document.getElementById('dim-slider');
  var dimVal = document.getElementById('dim-val');

  var chkTint = document.getElementById('chk-tint');
  var chkDistractions = document.getElementById('chk-distractions');
  var chkFreeze = document.getElementById('chk-freeze');

  var delaySlider = document.getElementById('delay-slider');
  var delayVal = document.getElementById('delay-val');

  var importInput = document.getElementById('import-input');
  var importBtn = document.getElementById('import-btn');
  var importMsg = document.getElementById('import-msg');

  function getValidatedProfile(p) {
    if (Aura && typeof Aura.validateProfile === 'function') {
      return Aura.validateProfile(p);
    }
    return p || {};
  }

  function queryTabScore() {
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          if (tabs && tabs[0] && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'aura-get-score' }, function (resp) {
              if (chrome.runtime.lastError || !resp || typeof resp.score === 'undefined') {
                if (activeTabScore) activeTabScore.textContent = 'Not measured yet';
              } else {
                if (activeTabScore) activeTabScore.textContent = String(resp.score);
              }
            });
          }
        });
      }
    } catch (e) {}
  }

  function updateUI() {
    if (!currentProfile) return;

    if (modeSelect) modeSelect.value = currentMode;

    paletteSelect.value = currentProfile.palette || 'auto';
    fontScaleSlider.value = currentProfile.fontScale || 1.1;
    fontScaleVal.textContent = Number(currentProfile.fontScale || 1.1).toFixed(2) + 'x';

    dimSlider.value = currentProfile.dimPercent || 0;
    dimVal.textContent = (currentProfile.dimPercent || 0) + '%';

    chkTint.checked = Boolean(currentProfile.warmTint);
    chkDistractions.checked = currentProfile.hideDistractions !== false;
    chkFreeze.checked = currentProfile.videoFreeze !== false;

    delaySlider.value = currentProfile.revealDelayMs || 2000;
    delayVal.textContent = ((currentProfile.revealDelayMs || 2000) / 1000).toFixed(1) + 's';
  }

  function saveSettings() {
    if (!currentProfile) return;
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set({
        'aura.mode': currentMode,
        'aura.enabled': currentMode !== 'off',
        'aura.profile': currentProfile,
      });
    }
  }

  function setProfile(p) {
    currentProfile = getValidatedProfile(p);
    updateUI();
    saveSettings();
  }

  // Preset Handlers
  btnGentle.addEventListener('click', function () {
    if (Aura && Aura.PRESETS) setProfile(Aura.PRESETS.gentle);
  });
  btnLowLight.addEventListener('click', function () {
    if (Aura && Aura.PRESETS) setProfile(Aura.PRESETS.lowLight);
  });
  btnMaxCalm.addEventListener('click', function () {
    if (Aura && Aura.PRESETS) setProfile(Aura.PRESETS.maxCalm);
  });

  // Mode select handler
  if (modeSelect) {
    modeSelect.addEventListener('change', function () {
      currentMode = modeSelect.value;
      saveSettings();
    });
  }

  // Forget site choices handler
  if (forgetSitesBtn) {
    forgetSitesBtn.addEventListener('click', function () {
      try {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          chrome.storage.local.set({
            'aura.sitesOn': [],
            'aura.sitesNever': [],
          }, function () {
            if (forgetSitesMsg) {
              forgetSitesMsg.style.color = 'var(--ag-accent)';
              forgetSitesMsg.textContent = 'Cleared site choices.';
              setTimeout(function () {
                if (forgetSitesMsg) forgetSitesMsg.textContent = '';
              }, 2500);
            }
          });
        }
      } catch (e) {}
    });
  }

  // Palette change
  paletteSelect.addEventListener('change', function () {
    if (!currentProfile) return;
    currentProfile.palette = paletteSelect.value;
    saveSettings();
  });

  // Font scale slider
  fontScaleSlider.addEventListener('input', function () {
    if (!currentProfile) return;
    var val = Number(fontScaleSlider.value);
    currentProfile.fontScale = val;
    fontScaleVal.textContent = val.toFixed(2) + 'x';
    saveSettings();
  });

  // Dim slider
  dimSlider.addEventListener('input', function () {
    if (!currentProfile) return;
    var val = Number(dimSlider.value);
    currentProfile.dimPercent = val;
    dimVal.textContent = val + '%';
    saveSettings();
  });

  // Checkboxes
  chkTint.addEventListener('change', function () {
    if (!currentProfile) return;
    currentProfile.warmTint = chkTint.checked;
    saveSettings();
  });

  chkDistractions.addEventListener('change', function () {
    if (!currentProfile) return;
    currentProfile.hideDistractions = chkDistractions.checked;
    saveSettings();
  });

  chkFreeze.addEventListener('change', function () {
    if (!currentProfile) return;
    currentProfile.videoFreeze = chkFreeze.checked;
    saveSettings();
  });

  // Delay slider
  delaySlider.addEventListener('input', function () {
    if (!currentProfile) return;
    var val = Number(delaySlider.value);
    currentProfile.revealDelayMs = val;
    delayVal.textContent = (val / 1000).toFixed(1) + 's';
    saveSettings();
  });

  // Reader toggle button
  readerBtn.addEventListener('click', function () {
    readerMsg.textContent = '';
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (!tabs || !tabs[0] || !tabs[0].id) {
          readerMsg.textContent = 'No active tab found.';
          return;
        }
        chrome.tabs.sendMessage(tabs[0].id, { type: 'aura-reader-toggle' }, function () {
          if (chrome.runtime.lastError) {
            readerMsg.textContent = 'Cannot run reader mode on this page.';
          } else {
            window.close();
          }
        });
      });
    }
  });

  // Import handler
  importBtn.addEventListener('click', function () {
    importMsg.textContent = '';
    var val = importInput.value.trim();
    if (!val) {
      importMsg.textContent = 'Please paste a profile link or code.';
      return;
    }

    var code = val;
    if (val.includes('?p=')) {
      var match = val.match(/[?&]p=([A-Za-z0-9_-]+)/);
      if (match && match[1]) code = match[1];
    }

    if (Aura && typeof Aura.decodeProfile === 'function') {
      var decoded = Aura.decodeProfile(code);
      if (decoded) {
        setProfile(decoded);
        importInput.value = '';
        importMsg.style.color = 'var(--ag-accent)';
        importMsg.textContent = 'Imported "' + decoded.name + '"!';
        return;
      }
    }

    // Try raw JSON
    try {
      var parsed = JSON.parse(val);
      if (parsed && typeof parsed === 'object') {
        setProfile(parsed);
        importInput.value = '';
        importMsg.style.color = 'var(--ag-accent)';
        importMsg.textContent = 'Imported profile!';
        return;
      }
    } catch (e) {}

    importMsg.style.color = '#8b0000';
    importMsg.textContent = 'Invalid profile code or link.';
  });

  // Initialize from storage
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(['aura.profile', 'aura.mode', 'aura.enabled'], function (items) {
      var mode = items['aura.mode'];
      if (!mode) {
        if (items['aura.enabled'] === true) mode = 'always';
        else if (items['aura.enabled'] === false) mode = 'off';
        else mode = 'suggest'; // new install default
      }
      currentMode = mode;
      var raw = items['aura.profile'];
      if (!raw && Aura && Aura.defaultProfile) {
        currentProfile = Aura.defaultProfile();
      } else {
        currentProfile = getValidatedProfile(raw);
      }
      updateUI();
      queryTabScore();
    });
  } else if (Aura && Aura.defaultProfile) {
    currentProfile = Aura.defaultProfile();
    updateUI();
  }
})();
