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
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
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
      b.tabIndex = isTarget ? 0 : -1;
    });
    group.querySelectorAll(':scope > .tab-panel').forEach(function (panel) {
      var active = panel.getAttribute('data-panel') === target;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });
  }

  var tabGroups = document.querySelectorAll('.tabs[data-group]');
  tabGroups.forEach(function (group) {
    var buttons = Array.from(group.querySelectorAll(':scope > .tabs-nav > .tab-btn'));
    buttons.forEach(function (btn, index) {
      var name = btn.getAttribute('data-tab');
      var panel = group.querySelector(':scope > .tab-panel[data-panel="' + name + '"]');
      if (panel) {
        var id = group.getAttribute('data-group') + '-' + name;
        btn.id = 'tab-' + id;
        panel.id = 'panel-' + id;
        btn.setAttribute('aria-controls', panel.id);
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', btn.id);
      }
      btn.addEventListener('click', function () {
        activateTab(group, btn.getAttribute('data-tab'));
      });
      btn.addEventListener('keydown', function (event) {
        var next;
        if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
        else if (event.key === 'ArrowLeft') next = (index + buttons.length - 1) % buttons.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = buttons.length - 1;
        else return;
        event.preventDefault();
        activateTab(group, buttons[next].getAttribute('data-tab'));
        buttons[next].focus();
      });
    });
    var selected = buttons.find(function (btn) { return btn.classList.contains('active'); });
    if (selected) activateTab(group, selected.getAttribute('data-tab'));
  });

  // ---- Auto-select the visitor's platform tab in the install section.
  // Browsers report Linux without the distribution (Fedora's Firefox
  // sends "X11; Linux x86_64"), so a Linux visitor is told apart by a
  // distro token when the user agent has one, and otherwise by fonts:
  // Ubuntu installs its "Ubuntu" / "Ubuntu Sans" families by default and
  // Fedora does not. Without either signal, Linux gets Fedora. ----
  function fontInstalled(family) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext && canvas.getContext('2d');
    if (!ctx) return false;
    var sample = 'mmmmmmmmmmlli1WQ@#';
    return ['monospace', 'serif', 'sans-serif'].some(function (fallback) {
      ctx.font = '72px ' + fallback;
      var base = ctx.measureText(sample).width;
      ctx.font = '72px "' + family + '", ' + fallback;
      return ctx.measureText(sample).width !== base;
    });
  }

  function detectPlatformTab() {
    var ua = (navigator.userAgent || '').toLowerCase();
    var plat = (navigator.platform || '').toLowerCase();

    if (ua.indexOf('freebsd') !== -1 || plat.indexOf('freebsd') !== -1) return 'freebsd';
    if (ua.indexOf('mac') !== -1 || plat.indexOf('mac') !== -1) return 'macos';
    if (ua.indexOf('android') !== -1) return null;
    if (ua.indexOf('linux') === -1 && plat.indexOf('linux') === -1) return null;
    if (ua.indexOf('fedora') !== -1) return 'fedora';
    if (ua.indexOf('ubuntu') !== -1) return 'ubuntu';
    if (ua.indexOf('alpine') !== -1) return 'alpine';
    if (fontInstalled('Ubuntu') || fontInstalled('Ubuntu Sans')) return 'ubuntu';
    return 'fedora';
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

      var done = function (success) {
        var label = btn.querySelector('.copy-label');
        var prevText = label ? label.textContent : '';
        if (label) label.textContent = success ? 'Copied!' : 'Copy failed';
        btn.classList.toggle('copied', success);
        setTimeout(function () {
          if (label) label.textContent = prevText || 'Copy';
          btn.classList.remove('copied');
        }, 1600);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () {
          done(fallbackCopy(text));
        });
      } else {
        done(fallbackCopy(text));
      }
    });
  });

  function fallbackCopy(text) {
    var previousFocus = document.activeElement;
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var copied = false;
    try { copied = document.execCommand('copy'); } catch (e) { /* report failure */ }
    finally {
      document.body.removeChild(ta);
      if (previousFocus && previousFocus.focus) previousFocus.focus();
    }
    return copied;
  }

  // ---- The REPL needs ES modules and a fetched .wasm, which browsers refuse on file:// URLs. ----
  if (location.protocol === 'file:') {
    var replStatus = document.querySelector('[data-repl-status]');
    if (replStatus) {
      replStatus.textContent = 'The REPL needs a web server: browsers block WebAssembly on file:// pages. ' +
        'Run "python3 -m http.server" in this folder and open http://localhost:8000.';
    }
  }
})();
