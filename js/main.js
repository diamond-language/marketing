(function () {
  'use strict';

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var toggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Tabs, scoped per .tabs[data-group] so the code-sample tabs and
  // the install-platform tabs don't fight over a shared .tab-btn/.tab-panel
  // selector. ----
  function activateTab(group, target) {
    group.querySelectorAll(':scope > .tabs-nav > .tab-btn').forEach(function (b) {
      var isTarget = b.getAttribute('data-tab') === target;
      b.classList.toggle('active', isTarget);
      b.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });
    group.querySelectorAll(':scope > .tab-panel').forEach(function (panel) {
      panel.classList.toggle('active', panel.getAttribute('data-panel') === target);
    });
  }

  var tabGroups = document.querySelectorAll('.tabs[data-group]');
  tabGroups.forEach(function (group) {
    group.querySelectorAll(':scope > .tabs-nav > .tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activateTab(group, btn.getAttribute('data-tab'));
      });
    });
  });

  // ---- Auto-select the visitor's platform tab in the install section.
  // Best-effort only: a generic "Linux" user agent can't reveal the
  // distro, so that case falls back to Ubuntu/Debian rather than
  // guessing further. Windows/unknown platforms keep whatever tab is
  // marked active in the markup. ----
  function detectPlatformTab() {
    var ua = (navigator.userAgent || '').toLowerCase();
    var plat = (navigator.platform || '').toLowerCase();

    if (ua.indexOf('freebsd') !== -1 || plat.indexOf('freebsd') !== -1) return 'freebsd';
    if (ua.indexOf('mac') !== -1 || plat.indexOf('mac') !== -1) return 'macos';
    if (ua.indexOf('android') !== -1) return null;
    if (ua.indexOf('linux') !== -1 || plat.indexOf('linux') !== -1) return 'ubuntu';
    return null;
  }

  var installGroup = document.querySelector('.tabs[data-group="install"]');
  if (installGroup) {
    var detected = detectPlatformTab();
    if (detected && installGroup.querySelector('.tab-btn[data-tab="' + detected + '"]')) {
      activateTab(installGroup, detected);
    }
  }

  // ---- Copy-to-clipboard for terminal blocks. Only real command/comment
  // lines live in the DOM (prompts are a CSS ::before, never real text),
  // so textContent alone is always safe to paste straight into a shell. ----
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = btn.getAttribute('data-copy-target');
      var terminal = document.getElementById(targetId);
      if (!terminal) return;

      var lines = Array.prototype.map.call(
        terminal.querySelectorAll('.line'),
        function (line) { return line.textContent; }
      );
      var text = lines.join('\n');

      var done = function () {
        var label = btn.querySelector('.copy-label');
        var prevText = label ? label.textContent : '';
        if (label) label.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(function () {
          if (label) label.textContent = prevText || 'Copy';
          btn.classList.remove('copied');
        }, 1600);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {
          fallbackCopy(text);
          done();
        });
      } else {
        fallbackCopy(text);
        done();
      }
    });
  });

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* no-op */ }
    document.body.removeChild(ta);
  }
})();
